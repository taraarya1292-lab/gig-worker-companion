"use client";

import { Icon } from "@/components/Icon";
import { hourlyFromTotals, totalsOf } from "@/lib/money";
import { roleLabel, t } from "@/lib/text";
import { isoDaysAgo, rupees, todayISO } from "@/lib/storage";
import type { Earning, Profile, WorkCase } from "@/lib/types";

export type ViewName = "home" | "earnings" | "safety" | "rights" | "documents" | "grievance";

export function HomeView({
  profile,
  earnings,
  cases,
  safetyDate,
  hasDocument,
  onOpen,
  onDemo,
  onChangeProfile,
  onClear,
}: {
  profile: Profile;
  earnings: Earning[];
  cases: WorkCase[];
  safetyDate: string | null;
  hasDocument: boolean;
  onOpen: (view: ViewName) => void;
  onDemo: () => void;
  onChangeProfile: () => void;
  onClear: () => void;
}) {
  const today = todayISO();
  const week = earnings.filter((entry) => entry.date >= isoDaysAgo(6));
  const todayEntries = earnings.filter((entry) => entry.date === today);
  const todayTotals = totalsOf(todayEntries);
  const weekTotals = totalsOf(week);
  const hourly = hourlyFromTotals(weekTotals.hours, weekTotals.net);
  const language = profile.language;
  const openCases = cases.filter((item) => item.status !== "done").length;

  const links: Array<{ view: ViewName; title: string; detail: string; icon: "wallet" | "shield" | "scale" | "file" }> = [
    {
      view: "earnings",
      icon: "wallet",
      title: t(language, "Earnings", "कमाई"),
      detail: t(language, "Gross, expenses, deductions, and hourly pay", "सकल, खर्च, कटौती और घंटे की कमाई"),
    },
    {
      view: "safety",
      icon: "shield",
      title: t(language, "Safety", "सुरक्षा"),
      detail: t(language, "Check risks and save an incident note", "जोखिम जाँचें और घटना का नोट सेव करें"),
    },
    {
      view: "rights",
      icon: "scale",
      title: t(language, "Rights and schemes", "अधिकार और योजनाएँ"),
      detail: t(language, "Official notes and what to confirm", "आधिकारिक नोट और क्या पुष्टि करें"),
    },
    {
      view: "documents",
      icon: "file",
      title: t(language, "Document help", "दस्तावेज़ मदद"),
      detail: t(language, "Explain a notice, then use it in a case", "नोटिस समझें, फिर केस में लगाएँ"),
    },
  ];

  return (
    <div className="grid gap-4">
      <section className="rounded-3xl border border-[#e8e2d6] bg-white p-5 shadow-[0_12px_32px_rgba(47,97,84,0.06)]">
        <p className="text-base text-[#66716c]">{roleLabel(profile.role, language)} · {profile.state}</p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-[#3d7a64]">{t(language, "Today's net", "आज की शुद्ध कमाई")}</p>
        <p className="text-4xl font-semibold tracking-tight text-[#2f6154]">{rupees(todayTotals.net)}</p>
        <p className="mt-2 text-base">
          {t(language, "Gross", "सकल")} {rupees(todayTotals.gross)} · {t(language, "Deductions", "कटौती")} {rupees(todayTotals.deduction)}
        </p>
        <p className="mt-1 text-base text-[#66716c]">
          {t(language, "Last 7 days net", "पिछले 7 दिन की शुद्ध कमाई")}: {rupees(weekTotals.net)}
          {hourly == null ? "" : ` · ${rupees(hourly)}/${t(language, "hr", "घंटा")}`}
        </p>
        <p className="mt-2 text-base text-[#66716c]">
          {openCases} {t(language, "open cases", "खुले केस")} · {safetyDate === today
            ? t(language, "safety check done", "सुरक्षा जाँच हो चुकी")
            : t(language, "safety check not done", "सुरक्षा जाँच बाकी")}
        </p>
      </section>

      <button type="button" onClick={() => onOpen("grievance")} className="min-h-20 rounded-3xl bg-[#3d7a64] px-5 py-4 text-left text-white shadow-[0_12px_28px_rgba(61,122,100,0.22)]">
        <span className="flex items-center gap-2 text-xl font-semibold">
          <Icon name="path" className="h-6 w-6" />
          {t(language, "Resolve a problem", "समस्या सुलझाएँ")}
        </span>
        <span className="mt-1 block text-base">
          {hasDocument
            ? t(language, "Uses your pay records and the last notice, if you allow it.", "आपकी अनुमति पर कमाई और आखिरी नोटिस का उपयोग।")
            : t(language, "From what happened to a letter and a follow-up.", "जो हुआ उससे पत्र और फॉलो अप तक।")}
        </span>
      </button>

      <nav className="grid gap-2" aria-label={t(language, "Features", "सुविधाएँ")}>
        {links.map((link) => (
          <button key={link.view} type="button" onClick={() => onOpen(link.view)} className="flex min-h-16 items-center gap-3 rounded-2xl border border-[#e8e2d6] bg-white px-4 py-3 text-left shadow-[0_8px_24px_rgba(47,97,84,0.04)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f4ee] text-[#3d7a64]">
              <Icon name={link.icon} />
            </span>
            <span>
              <span className="block text-lg font-semibold">{link.title}</span>
              <span className="block text-base text-[#66716c]">{link.detail}</span>
            </span>
          </button>
        ))}
      </nav>

      <button type="button" onClick={onDemo} className="min-h-12 rounded-xl border border-[#3d5c52] bg-white text-lg font-semibold">
        {t(language, "Load the sample ₹500 deduction story", "₹500 कटौती की नमूना कहानी खोलें")}
      </button>
      <p className="text-sm text-[#66716c]">
        {t(language, "The sample replaces pay entries on this phone. It is not your real income.", "नमूना इस फोन की कमाई एंट्री बदल देता है। यह आपकी असली आय नहीं है।")}
      </p>

      <div className="grid gap-2">
        <button type="button" onClick={onChangeProfile} className="min-h-12 rounded-xl border border-[#3d5c52] bg-white text-lg font-semibold">
          {t(language, "Change role or language", "काम या भाषा बदलें")}
        </button>
        <button type="button" onClick={onClear} className="min-h-12 rounded-xl text-lg text-[#9a4a4a]">
          {t(language, "Clear data on this phone", "इस फोन का डेटा मिटाएँ")}
        </button>
      </div>
    </div>
  );
}
