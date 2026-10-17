import type { Language, Role } from "./types";

export function t(language: Language, en: string, hi: string): string {
  return language === "hi" ? hi : en;
}

export function roleLabel(role: Role, language: Language): string {
  if (role === "delivery") return t(language, "Delivery partner", "डिलीवरी पार्टनर");
  if (role === "driver") return t(language, "Driver", "ड्राइवर");
  return t(language, "Daily-wage worker", "दिहाड़ी मजदूर");
}
