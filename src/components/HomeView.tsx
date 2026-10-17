"use client";

import { roleLabel, t } from "@/lib/text";
import { isoDaysAgo, rupees, todayISO } from "@/lib/storage";
import type { Earning, Profile } from "@/lib/types";

export type ViewName = "home" | "earnings" | "safety" | "rights" | "documents" | "grievance";

export function HomeView({
  profile,
  earnings,
  safetyDate,
  hasDocument,
  onOpen,
  onChangeProfile,
  onClear,
}: {
  profile: Profile;
  earnings: Earning[];
  safetyDate: string | null;
  hasDocument: boolean;
  onOpen: (view: ViewName) => void;
  onChangeProfile: () => void;
  onClear: () => void;
}) {
  const today = todayISO();
  const weekStart = isoDaysAgo(6);
  const todayEarnings = earnings.filter((entry) => entry.date === today);
  const weekEarnings = earnings.filter((entry) => entry.date >= weekStart);
  const todayTotal = todayEarnings.reduce((sum, entry) => sum + entry.amount, 0);
  const weekTotal = weekEarnings.reduce((sum, entry) => sum + entry.amount, 0);
  const language = profile.language;

  const links: Array<{ view: ViewName; title: string; detail: string }> = [
    {
      view: "earnings",
      title: t(language, "Earnings", "कमाई"),
      detail: t(language, "Log pay and get a week summary", "कमाई लिखें और हफ्ते का सार सुनें"),
    },
    {
      view: "safety",
      title: t(language, "Safety", "सुरक्षा"),
      detail: t(language, "Check today's risks", "आज के जोखिम जाँचें"),
    },
    {
      view: "rights",
      title: t(language, "Rights and schemes", "अधिकार और योजनाएँ"),
      detail: t(language, "See what you can check", "देखें क्या जाँचना चाहिए"),
    },
    {
      view: "documents",
      title: t(language, "Document help", "दस्तावेज़ मदद"),
      detail: t(language, "Paste a notice in simple words", "नोटिस को आसान शब्दों में समझें"),
    },
    {
      view: "grievance",
      title: t(language, "Write a complaint", "शिकायत लिखें"),
      detail: hasDocument
        ? t(language, "Uses your earnings and last document", "आपकी कमाई और पिछले दस्तावेज़ का उपयोग")
        : t(language, "Uses the earnings you logged", "जो कमाई आपने लिखी उसका उपयोग"),
    },
  ];

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl bg-[#0f6b4c] p-4 text-white">
        <p className="text-base">{roleLabel(profile.role, language)} · {profile.state}</p>
        <p className="mt-2 text-sm uppercase tracking-wide">{t(language, "Today", "आज")}</p>
        <p className="text-3xl font-semibold">{rupees(todayTotal)}</p>
        <p className="mt-1 text-base">
          {t(language, "Last 7 days", "पिछले 7 दिन")}: {rupees(weekTotal)} · {weekEarnings.length}{" "}
          {t(language, "entries", "एंट्री")}
        </p>
        <p className="mt-2 text-base">
          {safetyDate === today
            ? t(language, "Safety check done today", "आज सुरक्षा जाँच हो चुकी है")
            : t(language, "Safety check not done today", "आज सुरक्षा जाँच बाकी है")}
        </p>
      </section>

      <nav className="grid gap-2" aria-label={t(language, "Features", "सुविधाएँ")}>
        {links.map((link) => (
          <button
            key={link.view}
            type="button"
            onClick={() => onOpen(link.view)}
            className="min-h-16 rounded-2xl border border-[#e4ddd0] bg-white px-4 py-3 text-left"
          >
            <span className="block text-lg font-semibold">{link.title}</span>
            <span className="block text-base text-[#5c564c]">{link.detail}</span>
          </button>
        ))}
      </nav>

      <div className="grid gap-2">
        <button type="button" onClick={onChangeProfile} className="min-h-12 rounded-xl border border-[#1c1915] bg-white text-lg font-semibold">
          {t(language, "Change role or language", "काम या भाषा बदलें")}
        </button>
        <button type="button" onClick={onClear} className="min-h-12 rounded-xl text-lg text-[#8f2d2d]">
          {t(language, "Clear data on this phone", "इस फोन का डेटा मिटाएँ")}
        </button>
      </div>
    </div>
  );
}
