"use client";

import { useState } from "react";
import type { Earning, GuideResult, GuideTask, Profile } from "./types";

type AskInput = {
  task: GuideTask;
  profile: Profile;
  earnings?: Earning[];
  safetyGaps?: string[];
  documentText?: string;
  dispute?: string;
};

export function useGuide() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GuideResult | null>(null);

  async function ask(input: AskInput) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: input.task,
          language: input.profile.language,
          role: input.profile.role,
          state: input.profile.state,
          earnings: input.earnings ?? [],
          safetyGaps: input.safetyGaps ?? [],
          documentText: input.documentText ?? "",
          dispute: input.dispute ?? "",
        }),
      });
      const data = (await response.json()) as GuideResult & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }
      setResult(data);
      return data;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Request failed.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, result, ask };
}
