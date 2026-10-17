"use client";

import { AiPanel } from "@/components/AiPanel";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { SCHEMES } from "@/lib/schemes";
import { t } from "@/lib/text";
import type { Profile } from "@/lib/types";
import { useGuide } from "@/lib/useGuide";

export function RightsView({ profile }: { profile: Profile }) {
  const language = profile.language;
  const guide = useGuide();

  return (
    <div className="grid gap-4">
      <PageHeader
        badge="bg-[#f3eeff] text-[#7a4de0]"
        icon={<Icon name="shield" />}
        title={t(language, "Benefits & Rights", "लाभ और अधिकार")}
        detail={t(language, "See official scheme notes and what to confirm.", "आधिकारिक योजना नोट देखें और क्या पुष्टि करें।")}
      />
      <section className="rounded-[28px] border border-[#e6defa] bg-white p-4 shadow-[0_12px_30px_rgba(22,49,92,0.05)]">
        <h2 className="text-xl font-semibold text-[#12284d]">
          {t(language, "Scheme facts", "योजनाओं की जानकारी")}
        </h2>
        <p className="mt-1 text-base text-[#314356]">
          {t(
            language,
            "These notes are saved in the app. Gemini uses only this list.",
            "ये नोट ऐप में सेव हैं। Gemini सिर्फ इसी सूची का उपयोग करता है।",
          )}
        </p>
        <ul className="mt-3 grid gap-3">
          {SCHEMES.map((scheme) => (
            <li key={scheme.id} className="rounded-2xl bg-[#f7f4ff] p-3">
              <h3 className="text-lg font-semibold">{scheme.name}</h3>
              <p className="text-base">{scheme.what}</p>
              <p className="mt-1 text-base">{scheme.papers}</p>
              <p className="mt-1 text-base text-[#314356]">
                {t(language, "Check: ", "जाँचें: ")}
                {scheme.url ? (
                  <a className="font-semibold text-[#1d4ed8] underline" href={scheme.url} target="_blank" rel="noopener noreferrer">{scheme.url}<span className="sr-only">{t(language, ", opens in a new tab", ", नई टैब में खुलेगा")}</span></a>
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
          className="mt-4 min-h-12 w-full rounded-full bg-[#7a4de0] text-lg font-semibold text-white disabled:opacity-50"
        >
          {t(language, "Explain what I should check", "बताओ मुझे क्या जाँचना चाहिए")}
        </button>
      </section>
      <AiPanel language={language} loading={guide.loading} error={guide.error} result={guide.result} />
    </div>
  );
}
