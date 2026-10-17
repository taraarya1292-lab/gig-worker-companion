import type { Earning } from "./types";

export function asMoney(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

export function normalizeEarning(entry: Earning): Earning {
  return {
    ...entry,
    expense: asMoney(entry.expense),
    deduction: asMoney(entry.deduction),
  };
}

export function netOf(entry: Earning): number {
  return entry.amount - asMoney(entry.expense) - asMoney(entry.deduction);
}

export function hourlyOf(entry: Earning): number | null {
  if (!entry.hours) return null;
  return Math.round(netOf(entry) / entry.hours);
}

export function totalsOf(entries: Earning[]) {
  return entries.reduce(
    (sum, entry) => {
      sum.gross += entry.amount;
      sum.expense += asMoney(entry.expense);
      sum.deduction += asMoney(entry.deduction);
      sum.net += netOf(entry);
      sum.hours += entry.hours;
      return sum;
    },
    { gross: 0, expense: 0, deduction: 0, net: 0, hours: 0 },
  );
}

export function hourlyFromTotals(hours: number, net: number): number | null {
  if (!hours) return null;
  return Math.round(net / hours);
}
