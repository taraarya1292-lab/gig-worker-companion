"use client";

import { useEffect, useRef, useState } from "react";
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
  const active = useRef<AbortController | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    return () => active.current?.abort();
  }, []);

  async function ask(input: AskInput) {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    const id = requestId.current + 1;
    requestId.current = id;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
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
      if (requestId.current !== id) return null;
      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }
      setResult(data);
      return data;
    } catch (caught) {
      if (requestId.current !== id || controller.signal.aborted) return null;
      const message = caught instanceof Error ? caught.message : "Request failed.";
      setError(message);
      return null;
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }

  return { loading, error, result, ask };
}
