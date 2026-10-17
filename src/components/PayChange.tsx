import { payChange } from "@/lib/resolution";
import { rupees } from "@/lib/storage";
import { t } from "@/lib/text";
import type { Earning, Language } from "@/lib/types";

export function PayChange({
  entries,
  language,
  className = "",
}: {
  entries: Earning[];
  language: Language;
  className?: string;
}) {
  const change = payChange(entries);
  if (!change) return null;
  const sample = entries.some((entry) => entry.id.startsWith("demo-"));

  return (
    <section className={`rounded-[28px] border border-[#f3d7b0] bg-[#fff8ef] p-4 ${className}`} aria-label={t(language, "Pay change from your records", "आपके रिकॉर्ड से कमाई का बदलाव")}>
      <p className="text-sm font-semibold uppercase tracking-wide text-[#6d3f12]">
        {t(language, "From your records", "आपके रिकॉर्ड से")}
        {sample ? ` · ${t(language, "Sample", "नमूना")}` : ""}
      </p>
      <p className="mt-1 text-lg font-semibold leading-7 text-[#12284d]">
        {t(
          language,
          `A ${rupees(change.deduction)} deduction dropped hourly pay from ${rupees(change.beforeHourly)} to ${rupees(change.afterHourly)}.`,
          `${rupees(change.deduction)} की कटौती से घंटे की कमाई ${rupees(change.beforeHourly)} से ${rupees(change.afterHourly)} हो गई।`,
        )}
      </p>
      <p className="mt-1 text-base leading-6 text-[#314356]">
        {t(
          language,
          `${change.beforeDate} had no deduction, at ${rupees(change.beforeHourly)} an hour. ${change.afterDate} is ${rupees(change.afterHourly)} an hour after this deduction.`,
          `${change.beforeDate} को कटौती नहीं थी, घंटे के ${rupees(change.beforeHourly)}। ${change.afterDate} को इस कटौती के बाद घंटे के ${rupees(change.afterHourly)}।`,
        )}
      </p>
      {sample && (
        <p className="mt-2 text-sm text-[#314356]">
          {t(language, "Sample numbers, not your real income.", "यह नमूना आँकड़े हैं, आपकी असली आय नहीं।")}
        </p>
      )}
    </section>
  );
}
