"use client";

import { Icon } from "@/components/Icon";
import { useSyncExternalStore } from "react";
import { t } from "@/lib/text";
import type { Language } from "@/lib/types";

type SpeechResultEvent = Event & {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRec = {
  lang: string;
  start: () => void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
};

export function SpeakButton({
  language,
  onText,
}: {
  language: Language;
  onText: (text: string) => void;
}) {
  const supported = useSyncExternalStore(
    () => () => undefined,
    () => {
      const speechWindow = window as Window & {
        SpeechRecognition?: new () => SpeechRec;
        webkitSpeechRecognition?: new () => SpeechRec;
      };
      return Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition);
    },
    () => false,
  );

  if (!supported) return null;

  function listen() {
    const speechWindow = window as Window & {
      SpeechRecognition?: new () => SpeechRec;
      webkitSpeechRecognition?: new () => SpeechRec;
    };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) onText(transcript);
    };
    recognition.onerror = () => undefined;
    recognition.start();
  }

  return (
    <button type="button" onClick={listen} className="mt-2 min-h-12 w-full rounded-xl border border-[#3d5c52] bg-white text-lg font-semibold">
      <span className="inline-flex items-center justify-center gap-2">
        <Icon name="mic" />
        {t(language, "Speak instead", "बोलकर लिखें")}
      </span>
    </button>
  );
}
