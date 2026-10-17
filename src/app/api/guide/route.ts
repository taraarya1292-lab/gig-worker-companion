import { askGemini } from "@/lib/gemini";
import { systemPrompt, userPrompt } from "@/lib/prompt";
import { allowRequest, parseGuideInput } from "@/lib/validate";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowRequest(ip)) {
    return Response.json({ error: "Too many requests. Wait a minute." }, { status: 429 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Send JSON." }, { status: 415 });
  }

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return Response.json({ error: "Could not read the request." }, { status: 400 });
  }
  if (raw.length > 20_000) {
    return Response.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const input = parseGuideInput(body);
  if (typeof input === "string") {
    return Response.json({ error: input }, { status: 400 });
  }

  try {
    const result = await askGemini(
      systemPrompt(input.language),
      userPrompt(input),
    );
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini did not respond. Try again.";
    return Response.json({ error: message }, { status: 502 });
  }
}
