import { hourlyFromTotals, totalsOf } from "@/lib/money";
import { roleLabel, t } from "@/lib/text";
import { isoDaysAgo, rupees, todayISO } from "@/lib/storage";
import type { Earning, Profile, WorkCase } from "@/lib/types";
import type { ViewName } from "@/components/HomeView";

export function MoreView({
  profile,
  earnings,
  cases,
  safetyDate,
  onOpen,
  onDemo,
  onChangeProfile,
  onClear,
}: {
  profile: Profile;
  earnings: Earning[];
  cases: WorkCase[];
  safetyDate: string | null;
  onOpen: (view: ViewName) => void;
  onDemo: () => void;
  onChangeProfile: () => void;
  onClear: () => void;
}) {
  const language = profile.language;
  const today = todayISO();
  const todayTotals = totalsOf(earnings.filter((entry) => entry.date === today));
  const weekTotals = totalsOf(earnings.filter((entry) => entry.date >= isoDaysAgo(6)));
  const hourly = hourlyFromTotals(weekTotals.hours, weekTotals.net);
  const openCases = cases.filter((item) => item.status !== "done").length;

  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-semibold text-[#12284d]">{t(language, "More", "और")}</h1>
      <section className="rounded-[28px] border border-[#e3f3ea] bg-white p-5 shadow-[0_12px_30px_rgba(22,49,92,0.05)]">
        <p className="text-base text-[#314356]">{roleLabel(profile.role, language)} · {profile.state}</p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-[#0e6b3c]">{t(language, "Today's net", "आज की शुद्ध कमाई")}</p>
        <p className="text-4xl font-semibold text-[#12284d]">{rupees(todayTotals.net)}</p>
        <p className="mt-2 text-base text-[#4d5d6c]">
          {t(language, "Last 7 days", "पिछले 7 दिन")} {rupees(weekTotals.net)}
          {hourly == null ? "" : ` · ${rupees(hourly)}/${t(language, "hr", "घंटा")}`}
        </p>
        <p className="mt-1 text-base text-[#4d5d6c]">
          {openCases} {t(language, "open cases", "खुले केस")} · {safetyDate === today
            ? t(language, "safety check done", "सुरक्षा जाँच हो चुकी")
            : t(language, "safety check not done", "सुरक्षा जाँच बाकी")}
        </p>
      </section>
      <button type="button" onClick={() => onOpen("documents")} className="min-h-14 rounded-2xl border border-[#e3f3ea] bg-white px-4 text-left text-lg font-semibold shadow-[0_8px_20px_rgba(22,49,92,0.04)]">
        {t(language, "Document help", "दस्तावेज़ मदद")}
      </button>
      <button type="button" onClick={() => onOpen("earnings")} className="min-h-14 rounded-2xl border border-[#e3f3ea] bg-white px-4 text-left text-lg font-semibold shadow-[0_8px_20px_rgba(22,49,92,0.04)]">
        {t(language, "Earnings guide", "कमाई गाइड")}
      </button>
      <button type="button" onClick={onDemo} className="min-h-14 rounded-2xl border border-[#d5e4dc] bg-white px-4 text-left text-lg font-semibold">
        {t(language, "Load the sample ₹500 deduction story", "₹500 कटौती की नमूना कहानी खोलें")}
      </button>
      <p className="text-sm text-[#314356]">
        {t(language, "The sample replaces pay entries on this phone. It is not your real income.", "नमूना इस फोन की कमाई एंट्री बदल देता है। यह आपकी असली आय नहीं है।")}
      </p>
      <button type="button" onClick={onChangeProfile} className="min-h-12 rounded-xl border border-[#d5e4dc] bg-white text-lg font-semibold">
        {t(language, "Change role or language", "काम या भाषा बदलें")}
      </button>
      <button type="button" onClick={onClear} className="min-h-12 rounded-xl text-lg text-[#9a4a4a]">
        {t(language, "Clear data on this phone", "इस फोन का डेटा मिटाएँ")}
      </button>
    </div>
  );
}
