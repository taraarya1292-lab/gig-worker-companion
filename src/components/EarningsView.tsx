"use client";

import { useState, type FormEvent } from "react";
import { AiPanel } from "@/components/AiPanel";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { PayChange } from "@/components/PayChange";
import { hourlyFromTotals, hourlyOf, netOf, totalsOf } from "@/lib/money";
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
  const [expense, setExpense] = useState("");
  const [deduction, setDeduction] = useState("");
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const guide = useGuide();
  const week = earnings.filter((entry) => entry.date >= isoDaysAgo(6));
  const totals = totalsOf(week);
  const weekHourly = hourlyFromTotals(totals.hours, totals.net);
  const peak = Math.max(...week.map((entry) => Math.max(netOf(entry), 1)), 1);

  function optionalMoney(value: string): number | null {
    if (value.trim() === "") return 0;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100000) return null;
    return Math.round(parsed);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    const parsedHours = hours === "" ? 0 : Number(hours);
    const parsedExpense = optionalMoney(expense);
    const parsedDeduction = optionalMoney(deduction);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > 100000) {
      setFormError(t(language, "Enter gross pay in rupees.", "सकल कमाई रुपयों में लिखें।"));
      return;
    }
    if (parsedExpense == null || parsedDeduction == null) {
      setFormError(t(language, "Expenses and deductions must be 0 or more.", "खर्च और कटौती 0 या उससे अधिक हो।"));
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
      expense: parsedExpense,
      deduction: parsedDeduction,
      hours: parsedHours,
      note: note.trim(),
    });
    setAmount("");
    setExpense("");
    setDeduction("");
    setHours("");
    setNote("");
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        badge="bg-[#e7f7ee] text-[#0e6b3c]"
        icon={<Icon name="chart" />}
        title={t(language, "Earnings Guide", "कमाई गाइड")}
        detail={t(language, "Understand payments, deductions and hourly pay.", "कमाई, कटौती और घंटे की कमाई समझें।")}
      />
      <form onSubmit={save} className="grid gap-3 rounded-[28px] border border-[#e3f3ea] bg-white p-4 shadow-[0_12px_30px_rgba(22,49,92,0.05)]">
        <h2 className="text-xl font-semibold text-[#12284d]">{t(language, "Add earning", "कमाई जोड़ें")}</h2>
        <label className="text-base font-semibold" htmlFor="earn-date">
          {t(language, "Date", "तारीख")}
          <input id="earn-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required className="mt-1 min-h-12 w-full rounded-xl border border-[#d9e4ec] bg-white px-3 text-lg" />
        </label>
        <label className="text-base font-semibold" htmlFor="earn-amount">
          {t(language, "Gross pay", "सकल कमाई")}
          <input id="earn-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required className="mt-1 min-h-12 w-full rounded-xl border border-[#d9e4ec] bg-white px-3 text-lg" />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-base font-semibold" htmlFor="earn-expense">
            {t(language, "Expenses", "खर्च")}
            <input id="earn-expense" inputMode="decimal" value={expense} onChange={(event) => setExpense(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-[#d9e4ec] bg-white px-3 text-lg" />
          </label>
          <label className="text-base font-semibold" htmlFor="earn-deduction">
            {t(language, "Deductions", "कटौती")}
            <input id="earn-deduction" inputMode="decimal" value={deduction} onChange={(event) => setDeduction(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-[#d9e4ec] bg-white px-3 text-lg" />
          </label>
        </div>
        <label className="text-base font-semibold" htmlFor="earn-hours">
          {t(language, "Hours worked", "काम के घंटे")}
          <input id="earn-hours" inputMode="decimal" value={hours} onChange={(event) => setHours(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-[#d9e4ec] bg-white px-3 text-lg" />
        </label>
        <label className="text-base font-semibold" htmlFor="earn-note">
          {t(language, "Note", "नोट")}
          <input id="earn-note" value={note} maxLength={200} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-[#d9e4ec] bg-white px-3 text-lg" />
        </label>
        {formError && <p role="alert" className="text-[#9a4a4a]">{formError}</p>}
        <button type="submit" className="min-h-12 rounded-full bg-[#0e6b3c] text-lg font-semibold text-white">
          {t(language, "Save on this phone", "इस फोन पर सेव करें")}
        </button>
      </form>

      <section className="rounded-[28px] border border-[#e3f3ea] bg-white p-4 shadow-[0_12px_30px_rgba(22,49,92,0.05)]">
        <h2 className="text-2xl font-semibold text-[#12284d]">{t(language, "Last 7 days", "पिछले 7 दिन")}</h2>
        <PayChange entries={week} language={language} className="mt-3" />
        {week.length === 0 ? (
          <p className="mt-2 text-lg">{t(language, "No earnings yet.", "अभी कोई कमाई नहीं।")}</p>
        ) : (
          <>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-base">
              <div><dt className="text-[#314356]">{t(language, "Gross", "सकल")}</dt><dd className="text-lg font-semibold">{rupees(totals.gross)}</dd></div>
              <div><dt className="text-[#314356]">{t(language, "Net", "शुद्ध")}</dt><dd className="text-lg font-semibold">{rupees(totals.net)}</dd></div>
              <div><dt className="text-[#314356]">{t(language, "Expenses", "खर्च")}</dt><dd className="text-lg font-semibold">{rupees(totals.expense)}</dd></div>
              <div><dt className="text-[#314356]">{t(language, "Deductions", "कटौती")}</dt><dd className="text-lg font-semibold">{rupees(totals.deduction)}</dd></div>
            </dl>
            <p className="mt-2 text-base">
              {weekHourly == null
                ? t(language, "Add hours to see effective hourly pay.", "घंटे जोड़ें तो घंटे की कमाई दिखेगी।")
                : `${t(language, "Effective hourly pay", "घंटे की प्रभावी कमाई")}: ${rupees(weekHourly)}`}
            </p>
            <ul className="mt-4 grid gap-3">
              {week.map((entry) => {
                const net = netOf(entry);
                const hourly = hourlyOf(entry);
                return (
                  <li key={entry.id}>
                    <div className="flex items-baseline justify-between gap-3 text-base">
                      <span>{entry.date}{entry.note ? ` · ${entry.note}` : ""}</span>
                      <span className="font-semibold">{rupees(net)}</span>
                    </div>
                    <div className="mt-1 h-3 overflow-hidden rounded-full bg-[#e7f7ee]" aria-hidden="true">
                      <div className="h-full rounded-full bg-[#21a35a]" style={{ width: `${Math.max(8, (Math.max(net, 0) / peak) * 100)}%` }} />
                    </div>
                    <p className="mt-1 text-sm text-[#314356]">
                      {t(language, "Gross", "सकल")} {rupees(entry.amount)} · {t(language, "Expenses", "खर्च")} {rupees(entry.expense)} · {t(language, "Deductions", "कटौती")} {rupees(entry.deduction)}
                      {hourly == null ? "" : ` · ${rupees(hourly)}/${t(language, "hr", "घंटा")}`}
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <button
          type="button"
          disabled={week.length === 0 || guide.loading}
          aria-busy={guide.loading}
          onClick={() => guide.ask({ task: "earnings", profile, earnings: week })}
          className="mt-4 min-h-12 w-full rounded-full bg-[#16315c] text-lg font-semibold text-white disabled:opacity-50"
        >
          {t(language, "Explain changes with Gemini", "Gemini से बदलाव समझाओ")}
        </button>
      </section>
      <AiPanel language={language} loading={guide.loading} error={guide.error} result={guide.result} />
    </div>
  );
}
