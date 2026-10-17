"use client";

import { AiPanel } from "@/components/AiPanel";
import { Icon } from "@/components/Icon";
import { SCHEMES } from "@/lib/schemes";
import { t } from "@/lib/text";
import type { Profile } from "@/lib/types";
import { useGuide } from "@/lib/useGuide";

export function RightsView({ profile }: { profile: Profile }) {
  const language = profile.language;
  const guide = useGuide();

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border border-[#e8e2d6] bg-white p-4">
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <Icon name="scale" />
          {t(language, "Scheme facts", "योजनाओं की जानकारी")}
        </h2>
        <p className="mt-1 text-base text-[#66716c]">
          {t(
            language,
            "These notes are saved in the app. Gemini uses only this list.",
            "ये नोट ऐप में सेव हैं। Gemini सिर्फ इसी सूची का उपयोग करता है।",
          )}
        </p>
        <ul className="mt-3 grid gap-3">
          {SCHEMES.map((scheme) => (
            <li key={scheme.id} className="rounded-xl bg-[#f3efe6] p-3">
              <h3 className="text-lg font-semibold">{scheme.name}</h3>
              <p className="text-base">{scheme.what}</p>
              <p className="mt-1 text-base">{scheme.papers}</p>
              <p className="mt-1 text-base text-[#66716c]">
                {t(language, "Check: ", "जाँचें: ")}
                {scheme.url ? (
                  <a className="font-semibold text-[#3d7a64] underline" href={scheme.url} target="_blank" rel="noopener noreferrer">{scheme.url}</a>
                ) : (
                  scheme.check
                )}
              </p>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={guide.loading}
          onClick={() => guide.ask({ task: "rights", profile })}
          className="mt-4 min-h-12 w-full rounded-xl bg-[#3d5c52] text-lg font-semibold text-white disabled:opacity-50"
        >
          {t(language, "Explain what I should check", "बताओ मुझे क्या जाँचना चाहिए")}
        </button>
      </section>
      <AiPanel language={language} loading={guide.loading} error={guide.error} result={guide.result} />
    </div>
  );
}
