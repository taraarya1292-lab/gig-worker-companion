import { Icon } from "@/components/Icon";
import type { GuideResult, Language } from "@/lib/types";
import { t } from "@/lib/text";

export function AiPanel({
  language,
  loading,
  error,
  result,
}: {
  language: Language;
  loading: boolean;
  error: string | null;
  result: GuideResult | null;
}) {
  if (loading) {
    return (
      <p role="status" className="rounded-2xl bg-[#e8f4ee] px-4 py-3 text-lg">
        <span className="inline-flex items-center gap-2">
          <Icon name="leaf" />
          {t(language, "Sathi is asking Gemini…", "साथी Gemini से पूछ रहा है…")}
        </span>
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="rounded-2xl bg-[#fdeeee] px-4 py-3 text-lg text-[#9a4a4a]">
        {error}
      </p>
    );
  }

  if (!result) return null;

  return (
    <section aria-live="polite" className="rounded-2xl border border-[#d5eadf] bg-[#f4faf6] p-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#3d7a64]">
        <span className="inline-flex items-center gap-2">
          <Icon name="leaf" />
          {t(language, "Live Gemini answer", "Gemini का जवाब")}
        </span>
      </p>
      <h2 className="mt-1 text-2xl font-semibold">{result.title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-lg leading-8">{result.summary}</p>
      {result.points.length > 0 && (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-lg">
          {result.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
      {result.nextStep && (
        <p className="mt-3 text-lg">
          <span className="font-semibold">{t(language, "Next: ", "अगला कदम: ")}</span>
          {result.nextStep}
        </p>
      )}
      <p className="mt-3 text-base text-[#314356]">
        {t(
          language,
          "Guidance in simple language, not legal advice.",
          "यह आसान भाषा में मदद है, कानूनी सलाह नहीं।",
        )}
      </p>
    </section>
  );
}
