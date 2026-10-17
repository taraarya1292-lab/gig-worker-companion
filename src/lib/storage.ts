import type { Earning, Profile, SavedDocument } from "./types";

const PROFILE_KEY = "gwc-profile";
const EARNINGS_KEY = "gwc-earnings";
const SAFETY_KEY = "gwc-safety-date";
const DOCUMENT_KEY = "gwc-document";

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadProfile(): Profile | null {
  return readJson<Profile>(PROFILE_KEY);
}

export function saveProfile(profile: Profile) {
  writeJson(PROFILE_KEY, profile);
}

export function loadEarnings(): Earning[] {
  return readJson<Earning[]>(EARNINGS_KEY) ?? [];
}

export function saveEarnings(earnings: Earning[]) {
  writeJson(EARNINGS_KEY, earnings.slice(0, 60));
}

export function loadSafetyDate(): string | null {
  return localStorage.getItem(SAFETY_KEY);
}

export function saveSafetyDate(date: string) {
  localStorage.setItem(SAFETY_KEY, date);
}

export function loadDocument(): SavedDocument | null {
  return readJson<SavedDocument>(DOCUMENT_KEY);
}

export function saveDocument(document: SavedDocument) {
  writeJson(DOCUMENT_KEY, document);
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

export function clearLocalData() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(EARNINGS_KEY);
  localStorage.removeItem(SAFETY_KEY);
  localStorage.removeItem(DOCUMENT_KEY);
}

export function todayISO(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isoDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function rupees(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
