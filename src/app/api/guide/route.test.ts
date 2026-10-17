import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { demoEarnings } from "@/lib/demo";

const originalKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalKey;
});

function request(body: unknown, ip = "route-test") {
  return new Request("http://localhost/api/guide", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

const valid = {
  task: "resolve",
  language: "en",
  role: "delivery",
  state: "Maharashtra",
  earnings: demoEarnings(),
  dispute: "The app deducted ₹500 today. PAN ABCDE1234F was on the slip.",
};

describe("POST /api/guide", () => {
  it("refuses a short problem before calling Gemini", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ ...valid, dispute: "too short" }, "short-problem"));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("says the key is missing and does not invent an answer", async () => {
    delete process.env.GEMINI_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request(valid, "missing-key"));
    const body = (await response.json()) as { error?: string };
    expect(response.status).toBe(502);
    expect(body.error).toMatch(/GEMINI_API_KEY is missing/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the problem to Gemini without the identity number or the API key", async () => {
    process.env.GEMINI_API_KEY = "test-key-not-real";
    let sent = "";
    let header = "";
    vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
      sent = String(init.body);
      header = new Headers(init.headers).get("x-goog-api-key") ?? "";
      return Response.json({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    title: "₹500 deduction",
                    summary: "Your record shows a ₹500 deduction.",
                    points: ["Ask the app why ₹500 was taken"],
                    nextStep: "Open the help section in your work app",
                    facts: ["A ₹500 deduction is in today's record"],
                    assumptions: [],
                    plan: ["Open app help"],
                    letter: "Please explain the ₹500 deduction.",
                    evidence: ["Pay screen"],
                    channels: ["app-help"],
                    missing: [],
                  }),
                },
              ],
            },
          },
        ],
      });
    });

    const response = await POST(request(valid, "masked-call"));
    const body = (await response.json()) as { summary?: string; letter?: string };
    expect(response.status).toBe(200);
    expect(header).toBe("test-key-not-real");
    expect(sent).toContain("[PAN hidden]");
    expect(sent).not.toContain("ABCDE1234F");
    expect(sent).not.toContain("test-key-not-real");
    expect(JSON.stringify(body)).not.toContain("test-key-not-real");
    expect(body.letter).toContain("₹500");
  });

  it("rejects a request that is not JSON", async () => {
    const response = await POST(new Request("http://localhost/api/guide", {
      method: "POST",
      headers: { "content-type": "text/plain", "x-forwarded-for": "not-json" },
      body: "hello",
    }));
    expect(response.status).toBe(415);
  });

  it("rejects a request that is too large before calling Gemini", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(new Request("http://localhost/api/guide", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "too-large" },
      body: `{"task":"resolve","note":"${"a".repeat(20_000)}"}`,
    }));
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 429 after the per-address limit", async () => {
    const ip = `limit-${Date.now()}`;
    for (let count = 0; count < 20; count += 1) {
      const response = await POST(request({ task: "nope" }, ip));
      expect(response.status).toBe(400);
    }
    const blocked = await POST(request(valid, ip));
    expect(blocked.status).toBe(429);
  });
});
