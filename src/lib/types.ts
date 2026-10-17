export const ROLES = ["delivery", "driver", "daily-wage"] as const;
export const LANGUAGES = ["en", "hi"] as const;

export const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export type Role = (typeof ROLES)[number];
export type Language = (typeof LANGUAGES)[number];
export type StateName = (typeof STATES)[number];

export type Profile = {
  role: Role;
  state: StateName;
  language: Language;
};

export type Earning = {
  id: string;
  date: string;
  amount: number;
  hours: number;
  note: string;
};

export type SavedDocument = {
  excerpt: string;
  summary: string;
};

export type GuideResult = {
  title: string;
  summary: string;
  points: string[];
  nextStep: string;
};

export type GuideTask =
  | "earnings"
  | "safety"
  | "rights"
  | "document"
  | "grievance";
