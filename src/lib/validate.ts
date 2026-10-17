import { checklistFor } from "./checklists";
import { clip, maskSensitive } from "./mask";
import {
  LANGUAGES,
  ROLES,
  STATES,
  type Earning,
  type GuideTask,
  type Language,
  type Role,
  type StateName,
} from "./types";

const TASKS: GuideTask[] = ["earnings", "safety", "rights", "document", "grievance"];

export type GuideInput = {
  task: GuideTask;
  language: Language;
  role: Role;
  state: StateName;
  earnings: Earning[];
  safetyGaps: string[];
  documentText: string;
  dispute: string;
};

export function parseGuideInput(body: unknown): GuideInput | string {
  if (!body || typeof body !== "object") return "Invalid request.";
  const raw = body as Record<string, unknown>;

  if (!TASKS.includes(raw.task as GuideTask)) return "Unknown task.";
  if (!LANGUAGES.includes(raw.language as Language)) return "Choose a language.";
  if (!ROLES.includes(raw.role as Role)) return "Choose a role.";
  if (typeof raw.state !== "string" || !STATES.includes(raw.state as StateName)) {
    return "Choose a state.";
  }

  const earnings = parseEarnings(raw.earnings);
  if (typeof earnings === "string") return earnings;

  const role = raw.role as Role;
  const safetyGaps = parseGaps(raw.safetyGaps, role);
  if (typeof safetyGaps === "string") return safetyGaps;

  const documentText = maskSensitive(clip(typeof raw.documentText === "string" ? raw.documentText : "", 2000));
  const dispute = maskSensitive(clip(typeof raw.dispute === "string" ? raw.dispute : "", 1000));

  const task = raw.task as GuideTask;
  if (task === "earnings" && earnings.length === 0) return "Add an earning first.";
  if (task === "document" && documentText.length < 10) return "Paste the notice first.";
  if (task === "grievance" && dispute.length < 10) return "Describe what happened first.";

  return {
    task,
    language: raw.language as Language,
    role,
    state: raw.state as StateName,
    earnings,
    safetyGaps,
    documentText,
    dispute,
  };
}

function parseEarnings(value: unknown): Earning[] | string {
  if (value == null) return [];
  if (!Array.isArray(value)) return "Earnings are not valid.";
  if (value.length > 30) return "Send fewer earnings.";

  const earnings: Earning[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return "Earnings are not valid.";
    const row = item as Record<string, unknown>;
    if (typeof row.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
      return "An earning date is not valid.";
    }
    if (typeof row.amount !== "number" || !Number.isFinite(row.amount) || row.amount < 0 || row.amount > 100000) {
      return "An earning amount is not valid.";
    }
    if (typeof row.hours !== "number" || !Number.isFinite(row.hours) || row.hours < 0 || row.hours > 24) {
      return "Hours must be from 0 to 24.";
    }
    earnings.push({
      id: typeof row.id === "string" ? row.id.slice(0, 40) : "",
      date: row.date,
      amount: Math.round(row.amount),
      hours: Math.round(row.hours * 10) / 10,
      note: maskSensitive(clip(typeof row.note === "string" ? row.note : "", 200)),
    });
  }
  return earnings;
}

function parseGaps(value: unknown, role: Role): string[] | string {
  if (value == null) return [];
  if (!Array.isArray(value)) return "Safety answers are not valid.";
  const allowed = new Set(checklistFor(role).map((item) => item.id));
  const gaps: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !allowed.has(item)) return "Safety answers are not valid.";
    if (!gaps.includes(item)) gaps.push(item);
  }
  return gaps;
}

const hits = new Map<string, { count: number; reset: number }>();

export function allowRequest(ip: string): boolean {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || now > current.reset) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (current.count >= 20) return false;
  current.count += 1;
  return true;
}
