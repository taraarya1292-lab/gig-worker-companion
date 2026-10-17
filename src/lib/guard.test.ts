import { describe, expect, it } from "vitest";
import { knownChannels } from "./channels";
import { demoProblem } from "./demo";
import { parseGuideResult } from "./gemini";
import { maskSensitive } from "./mask";
import { localFacts, localLetter, readRupeeAmount, schemeIdsFor } from "./resolution";
import { SCHEMES } from "./schemes";
import { allowRequest, parseGuideInput } from "./validate";
import { demoEarnings } from "./demo";

const profile = {
  task: "resolve" as const,
  language: "en" as const,
  role: "delivery" as const,
  state: "Maharashtra" as const,
  earnings: demoEarnings(),
  safetyGaps: [],
  documentText: "",
};

describe("privacy and request checks", () => {
  it("hides PAN and long identity numbers", () => {
    const masked = maskSensitive("PAN ABCDE1234F and card 1234 5678 9012 and phone 9876543210");
    expect(masked).not.toContain("ABCDE1234F");
    expect(masked).not.toContain("1234 5678 9012");
    expect(masked).toContain("[PAN hidden]");
    expect(masked).toContain("[ID hidden]");
  });

  it("rejects a problem that is too short and masks numbers that are long enough", () => {
    expect(parseGuideInput({ ...profile, dispute: "too short" })).toBe("Describe what happened first.");

    const parsed = parseGuideInput({
      ...profile,
      dispute: "The app deducted ₹500. PAN ABCDE1234F was on the notice.",
    });
    expect(typeof parsed).not.toBe("string");
    if (typeof parsed === "string") return;
    expect(parsed.dispute).toContain("[PAN hidden]");
    expect(parsed.dispute).not.toContain("ABCDE1234F");
  });

  it("stops an address after 20 requests in a minute", () => {
    const ip = `guard-${Date.now()}`;
    for (let count = 0; count < 20; count += 1) {
      expect(allowRequest(ip)).toBe(true);
    }
    expect(allowRequest(ip)).toBe(false);
  });

  it("rejects an unreadable Gemini payload instead of inventing an answer", () => {
    expect(() => parseGuideResult("not json")).toThrow(/unreadable/i);
    expect(() => parseGuideResult('{"title":"","summary":""}')).toThrow(/empty/i);
  });

  it("reads a JSON answer that arrives with extra text around it", () => {
    const result = parseGuideResult('Note:\n{"title":"Deduction","summary":"₹500 was recorded.","points":["Ask why"],"nextStep":"Open app help"}');
    expect(result.summary).toContain("₹500");
    expect(result.nextStep).toBe("Open app help");
  });

  it("keeps only the fields the screen can show", () => {
    const result = parseGuideResult(JSON.stringify({
      title: "Deduction",
      summary: "₹500 was recorded.",
      points: ["Check the pay screen", 12, ""],
      nextStep: "Open app help",
      channels: ["eshram", "made-up"],
      letter: "Please explain the ₹500.",
    }));
    expect(result.points).toEqual(["Check the pay screen"]);
    expect(result.channels).toEqual(["eshram", "made-up"]);
    expect(result.facts).toEqual([]);
  });
});

describe("resolution facts", () => {
  it("reads the rupee amount and labels the local letter as unsent", () => {
    expect(readRupeeAmount(demoProblem("en"))).toBe(500);
    expect(readRupeeAmount("no figure here")).toBeNull();

    const letter = localLetter({
      role: "delivery",
      state: "Maharashtra",
      problem: demoProblem("en"),
      entries: demoEarnings(),
    });
    expect(letter).toMatch(/1,990/);
    expect(letter).toContain("not sent");
    expect(localFacts(demoEarnings()).some((fact) => fact.includes("₹500"))).toBe(true);
  });

  it("uses a closed set of scheme links", () => {
    expect(schemeIdsFor("daily-wage")).toContain("bocw");
    expect(schemeIdsFor("delivery")).not.toContain("bocw");
    const urls = SCHEMES.flatMap((scheme) => (scheme.url ? [scheme.url] : []));
    expect(urls).toEqual(["https://eshram.gov.in", "https://maandhan.in"]);
    expect(knownChannels(["not-a-channel"]).map((channel) => channel.id)).toEqual(["app-help", "labour", "eshram"]);
    expect(knownChannels(["labour"]).map((channel) => channel.id)).toEqual(["labour"]);
  });
});
