import { describe, expect, it } from "vitest";
import { knownChannels } from "./channels";
import { demoEarnings, demoProblem } from "./demo";
import { parseGuideResult } from "./gemini";
import { hourlyFromTotals, hourlyOf, netOf, totalsOf } from "./money";
import { systemPrompt, userPrompt } from "./prompt";
import { localFacts, localLetter, readRupeeAmount, schemeIdsFor } from "./resolution";
import { SCHEMES } from "./schemes";
import { maskSensitive } from "./mask";
import { allowRequest, parseGuideInput } from "./validate";
import type { Earning } from "./types";

const today: Earning = {
  id: "demo-today",
  date: "2026-10-17",
  amount: 900,
  expense: 70,
  deduction: 500,
  hours: 6,
  note: "Sample: app deducted 500",
};

describe("pay math", () => {
  it("keeps the sample ₹500 deduction in the net and hourly rate", () => {
    const entries = demoEarnings();
    const latest = entries.find((entry) => entry.id === "demo-today");
    expect(latest?.deduction).toBe(500);
    expect(netOf(latest ?? today)).toBe(330);
    expect(hourlyOf(latest ?? today)).toBe(55);

    const yesterday = entries.find((entry) => entry.id === "demo-yesterday");
    expect(netOf(yesterday ?? today)).toBe(820);
    expect(hourlyOf(yesterday ?? today)).toBe(164);

    const totals = totalsOf(entries);
    expect(totals.gross).toBe(2700);
    expect(totals.expense).toBe(210);
    expect(totals.deduction).toBe(500);
    expect(totals.net).toBe(1990);
    expect(hourlyFromTotals(totals.hours, totals.net)).toBe(117);
  });

  it("returns no hourly rate when hours are missing", () => {
    expect(hourlyOf({ ...today, hours: 0 })).toBeNull();
    expect(hourlyFromTotals(0, 330)).toBeNull();
  });
});

describe("privacy and request checks", () => {
  it("hides PAN and long identity numbers", () => {
    const masked = maskSensitive("PAN ABCDE1234F and id 1234 5678 9012");
    expect(masked).not.toContain("ABCDE1234F");
    expect(masked).not.toContain("1234 5678 9012");
    expect(masked).toContain("[PAN hidden]");
    expect(masked).toContain("[ID hidden]");
  });

  it("rejects a short problem and masks a PAN in the note", () => {
    const tooShort = parseGuideInput({
      task: "resolve",
      language: "en",
      role: "delivery",
      state: "Maharashtra",
      dispute: "too short",
    });
    expect(tooShort).toBe("Describe what happened first.");

    const parsed = parseGuideInput({
      task: "resolve",
      language: "en",
      role: "delivery",
      state: "Maharashtra",
      dispute: "The app deducted ₹500 from today's pay without telling me.",
      earnings: [{ ...today, note: "slip ABCDE1234F" }],
    });
    expect(typeof parsed).not.toBe("string");
    if (typeof parsed === "string") return;
    expect(parsed.earnings[0]?.note).toContain("[PAN hidden]");
    expect(parsed.dispute).toContain("₹500");
  });

  it("stops the 21st call from the same address", () => {
    const ip = `limit-${Date.now()}`;
    for (let count = 0; count < 20; count += 1) {
      expect(allowRequest(ip)).toBe(true);
    }
    expect(allowRequest(ip)).toBe(false);
  });
});

describe("resolution draft", () => {
  it("builds a letter from the sample records and does not claim it was sent", () => {
    const entries = demoEarnings();
    const letter = localLetter({
      role: "delivery",
      state: "Maharashtra",
      problem: demoProblem("en"),
      entries,
    });
    expect(letter).toContain("₹500");
    expect(letter).toContain("₹1,990");
    expect(letter.toLowerCase()).toContain("not sent");
    expect(readRupeeAmount(demoProblem("en"))).toBe(500);
    expect(readRupeeAmount(demoProblem("hi"))).toBe(500);
    expect(localFacts(entries).some((fact) => fact.includes("₹500"))).toBe(true);
  });

  it("keeps scheme links and complaint channels to the known set", () => {
    expect(schemeIdsFor("daily-wage")).toContain("bocw");
    expect(schemeIdsFor("delivery")).not.toContain("bocw");
    const urls = SCHEMES.flatMap((scheme) => (scheme.url ? [scheme.url] : []));
    expect(urls).toEqual(["https://eshram.gov.in", "https://maandhan.in"]);
    expect(knownChannels(["not-a-channel"]).map((channel) => channel.id)).toEqual([
      "app-help",
      "labour",
      "eshram",
    ]);
    expect(knownChannels(["labour"]).map((channel) => channel.id)).toEqual(["labour"]);
  });

  it("tells Gemini to separate facts and not claim a complaint was submitted", () => {
    const prompt = systemPrompt("en");
    expect(prompt).toContain("Do not say a complaint was submitted");
    expect(prompt).toContain("Do not ask for Aadhaar");
    const task = userPrompt({
      task: "resolve",
      role: "delivery",
      state: "Maharashtra",
      earnings: [today],
      safetyGaps: [],
      documentText: "",
      dispute: demoProblem("en"),
    });
    expect(task).toContain("net ₹330");
    expect(task).toContain("Do not say it was sent");
    expect(task).toContain("app-help, labour, eshram");
  });
});

describe("Gemini answers", () => {
  it("reads a structured answer and drops extra items", () => {
    const result = parseGuideResult(
      JSON.stringify({
        title: "Deduction",
        summary: "₹500 was recorded today.",
        points: ["Net is ₹330", 12, ""],
        nextStep: "Open Help in the work app.",
        facts: ["Gross ₹900"],
        assumptions: ["The app may have made a mistake."],
        plan: ["Ask for the reason"],
        letter: "Please explain the ₹500 deduction.",
        evidence: ["Pay screen"],
        channels: ["app-help"],
        missing: [],
      }),
    );
    expect(result.points).toEqual(["Net is ₹330"]);
    expect(result.channels).toEqual(["app-help"]);
    expect(result.letter).toContain("₹500");
  });

  it("refuses an empty model answer", () => {
    expect(() => parseGuideResult('{"title":"","summary":"","points":[],"nextStep":""}')).toThrow(
      /empty answer/,
    );
    expect(() => parseGuideResult("not json")).toThrow(/unreadable/);
  });
});
