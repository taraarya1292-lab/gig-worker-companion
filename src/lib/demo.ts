import { isoDaysAgo } from "./storage";
import type { Earning, Language } from "./types";

export function demoEarnings(): Earning[] {
  const today = isoDaysAgo(0);
  const yesterday = isoDaysAgo(1);
  const before = isoDaysAgo(2);
  return [
    {
      id: "demo-today",
      date: today,
      amount: 900,
      expense: 70,
      deduction: 500,
      hours: 6,
      note: "Sample: app deducted 500",
    },
    {
      id: "demo-yesterday",
      date: yesterday,
      amount: 880,
      expense: 60,
      deduction: 0,
      hours: 5,
      note: "Sample: evening shift",
    },
    {
      id: "demo-before",
      date: before,
      amount: 920,
      expense: 80,
      deduction: 0,
      hours: 6,
      note: "Sample: day shift",
    },
  ];
}

export function demoProblem(language: Language): string {
  if (language === "hi") {
    return "ऐप ने आज की कमाई में से ₹500 काट लिए। मुझे ₹900 सकल मिलने थे, ईंधन अलग था। कटौती की वजह नहीं बताई गई।";
  }
  return "The app deducted ₹500 from today's pay. I expected gross ₹900, with fuel kept separate. I was not told why ₹500 was taken.";
}
