import { hourlyOf, netOf, totalsOf } from "./money";
import { rupees } from "./storage";
import type { Earning, Language, Role } from "./types";

export function recordLines(entries: Earning[]): string[] {
  return entries.map((entry) => {
    const hourly = hourlyOf(entry);
    const rate = hourly == null ? "hours not recorded" : `${rupees(hourly)} per hour`;
    return `${entry.date}: gross ${rupees(entry.amount)}, expenses ${rupees(entry.expense)}, deductions ${rupees(entry.deduction)}, net ${rupees(netOf(entry))}, ${entry.hours} hours (${rate}). ${entry.note || "No note."}`;
  });
}

export function localFacts(entries: Earning[]): string[] {
  if (entries.length === 0) return ["No earnings were shared for this problem."];
  const totals = totalsOf(entries);
  const facts = recordLines(entries);
  facts.push(
    `Recorded total: gross ${rupees(totals.gross)}, expenses ${rupees(totals.expense)}, deductions ${rupees(totals.deduction)}, net ${rupees(totals.net)}.`,
  );
  const latest = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (latest && latest.deduction > 0) {
    facts.push(`${latest.date} includes a recorded deduction of ${rupees(latest.deduction)}.`);
  }
  return facts;
}

export function localLetter(input: {
  role: Role;
  state: string;
  problem: string;
  entries: Earning[];
}): string {
  const totals = totalsOf(input.entries);
  const lines = [
    `I work as a ${input.role.replace("-", " ")} in ${input.state}.`,
    input.problem.trim(),
  ];
  if (input.entries.length > 0) {
    lines.push(
      `My own record for these days shows gross ${rupees(totals.gross)}, expenses ${rupees(totals.expense)}, deductions ${rupees(totals.deduction)}, and net ${rupees(totals.net)}.`,
    );
    lines.push("Please explain any deduction that I was not told about and return it if it was taken by mistake.");
  }
  lines.push("I am keeping this note for myself. This draft was built from my records, not sent to anyone.");
  return lines.join("\n\n");
}

export function readRupeeAmount(text: string): number | null {
  const match = text.match(/₹\s*(\d{1,6})/);
  if (!match) return null;
  return Number(match[1]);
}

export function schemeIdsFor(role: Role): string[] {
  if (role === "daily-wage") return ["eshram", "bocw", "pmsym", "ration"];
  return ["eshram", "platform-cover", "state-gig", "pmsym"];
}

export function evidenceStarters(language: Language): string[] {
  if (language === "hi") {
    return [
      "उस दिन की पे स्क्रीन या पे स्लिप",
      "कटौती वाला मैसेज, अगर मिला हो",
      "आपकी अपनी कमाई की एंट्री",
    ];
  }
  return [
    "Pay screen or slip for that day",
    "The message that mentioned the deduction, if you received one",
    "Your own earnings entry",
  ];
}
