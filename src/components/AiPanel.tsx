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
      <p role="status" className="rounded-2xl bg-[#e7f3ee] px-4 py-3 text-lg">
        {t(language, "Asking Gemini…", "Gemini से पूछ रहे हैं…")}
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="rounded-2xl bg-[#fde8e8] px-4 py-3 text-lg text-[#8f2d2d]">
        {error}
      </p>
    );
  }

  if (!result) return null;

  return (
    <section aria-live="polite" className="rounded-2xl border border-[#d7e8df] bg-[#f3faf6] p-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#0f6b4c]">
        {t(language, "Live Gemini answer", "Gemini का जवाब")}
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
      <p className="mt-3 text-base text-[#5c564c]">
        {t(
          language,
          "Guidance in simple language, not legal advice.",
          "यह आसान भाषा में मदद है, कानूनी सलाह नहीं।",
        )}
      </p>
    </section>
  );
}
