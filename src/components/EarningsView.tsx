"use client";

import { useState, type FormEvent } from "react";
import { AiPanel } from "@/components/AiPanel";
import { useGuide } from "@/lib/useGuide";
import { isoDaysAgo, rupees, todayISO } from "@/lib/storage";
import { t } from "@/lib/text";
import type { Earning, Profile } from "@/lib/types";

export function EarningsView({
  profile,
  earnings,
  onAdd,
}: {
  profile: Profile;
  earnings: Earning[];
  onAdd: (earning: Earning) => void;
}) {
  const language = profile.language;
  const [date, setDate] = useState(todayISO());
  const [amount, setAmount] = useState("");
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const guide = useGuide();
  const week = earnings.filter((entry) => entry.date >= isoDaysAgo(6));

  function save(event: FormEvent) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    const parsedHours = hours === "" ? 0 : Number(hours);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > 100000) {
      setFormError(t(language, "Enter an amount in rupees.", "रुपयों में राशि लिखें।"));
      return;
    }
    if (!Number.isFinite(parsedHours) || parsedHours < 0 || parsedHours > 24) {
      setFormError(t(language, "Hours must be from 0 to 24.", "घंटे 0 से 24 के बीच हों।"));
      return;
    }
    setFormError(null);
    onAdd({
      id: crypto.randomUUID(),
      date,
      amount: Math.round(parsedAmount),
      hours: parsedHours,
      note: note.trim(),
    });
    setAmount("");
    setHours("");
    setNote("");
  }

  return (
    <div className="grid gap-4">
      <form onSubmit={save} className="grid gap-3 rounded-2xl border border-[#e4ddd0] bg-white p-4">
        <h2 className="text-2xl font-semibold">{t(language, "Add earning", "कमाई जोड़ें")}</h2>
        <label className="text-base font-semibold" htmlFor="earn-date">
          {t(language, "Date", "तारीख")}
          <input id="earn-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required className="mt-1 min-h-12 w-full rounded-xl border border-[#cfc6b8] px-3 text-lg" />
        </label>
        <label className="text-base font-semibold" htmlFor="earn-amount">
          {t(language, "Amount in rupees", "रुपयों में राशि")}
          <input id="earn-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required className="mt-1 min-h-12 w-full rounded-xl border border-[#cfc6b8] px-3 text-lg" />
        </label>
        <label className="text-base font-semibold" htmlFor="earn-hours">
          {t(language, "Hours worked", "काम के घंटे")}
          <input id="earn-hours" inputMode="decimal" value={hours} onChange={(event) => setHours(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-[#cfc6b8] px-3 text-lg" />
        </label>
        <label className="text-base font-semibold" htmlFor="earn-note">
          {t(language, "Note", "नोट")}
          <input id="earn-note" value={note} maxLength={200} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-[#cfc6b8] px-3 text-lg" />
        </label>
        {formError && <p role="alert" className="text-[#8f2d2d]">{formError}</p>}
        <button type="submit" className="min-h-12 rounded-xl bg-[#0f6b4c] text-lg font-semibold text-white">
          {t(language, "Save on this phone", "इस फोन पर सेव करें")}
        </button>
      </form>

      <section className="rounded-2xl border border-[#e4ddd0] bg-white p-4">
        <h2 className="text-2xl font-semibold">{t(language, "Last 7 days", "पिछले 7 दिन")}</h2>
        {week.length === 0 ? (
          <p className="mt-2 text-lg">{t(language, "No earnings yet.", "अभी कोई कमाई नहीं।")}</p>
        ) : (
          <ul className="mt-2 grid gap-2">
            {week.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 text-lg">
                <span>
                  {entry.date}
                  {entry.note ? ` · ${entry.note}` : ""}
                </span>
                <span className="font-semibold">{rupees(entry.amount)}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          disabled={week.length === 0 || guide.loading}
          onClick={() => guide.ask({ task: "earnings", profile, earnings: week })}
          className="mt-4 min-h-12 w-full rounded-xl bg-[#1c1915] text-lg font-semibold text-white disabled:opacity-50"
        >
          {t(language, "Explain my week with Gemini", "Gemini से हफ्ता समझाओ")}
        </button>
      </section>
      <AiPanel language={language} loading={guide.loading} error={guide.error} result={guide.result} />
    </div>
  );
}
