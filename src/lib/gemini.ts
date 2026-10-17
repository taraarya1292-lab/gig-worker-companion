import type { GuideResult } from "./types";

const MODELS = ["gemini-flash-latest", "gemini-2.0-flash"];

let workingModel: string | null = null;

type GeminiPart = { text?: string };
type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

export async function askGemini(system: string, user: string): Promise<GuideResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is missing on the server.");
  }

  const models = workingModel ? [workingModel] : MODELS;
  let response: Response | null = null;

  for (const model of models) {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                summary: { type: "STRING" },
                points: { type: "ARRAY", items: { type: "STRING" } },
                nextStep: { type: "STRING" },
              },
              required: ["title", "summary", "points", "nextStep"],
            },
          },
        }),
        signal: AbortSignal.timeout(25000),
      },
    );

    if (response.status === 404) continue;
    if (response.ok) workingModel = model;
    break;
  }

  if (!response || response.status === 404) {
    throw new Error("Gemini model was not found.");
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw new Error("Gemini rejected the API key or the request.");
    }
    if (response.status === 429) {
      throw new Error("Gemini is busy. Wait a moment and try again.");
    }
    throw new Error("Gemini did not respond. Try again.");
  }

  const data = (await response.json()) as GeminiResponse;
  if (data.promptFeedback?.blockReason) {
    throw new Error("Gemini could not answer this message.");
  }

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  return parseGuideResult(text);
}

function parseGuideResult(text: string): GuideResult {
  const cleaned = text.replace(/```json|```/g, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned an unreadable answer. Try again.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini returned an unreadable answer. Try again.");
  }

  const record = parsed as Record<string, unknown>;
  const title = clipText(record.title, 140);
  const summary = clipText(record.summary, 2000);
  const nextStep = clipText(record.nextStep, 300);
  const points = Array.isArray(record.points)
    ? record.points.filter((point) => typeof point === "string").map((point) => clipText(point, 300)).slice(0, 6)
    : [];

  if (!title || !summary) {
    throw new Error("Gemini returned an empty answer. Try again.");
  }

  return { title, summary, points, nextStep };
}

function clipText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}
