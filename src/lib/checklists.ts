import type { Language, Role } from "./types";

export type CheckItem = {
  id: string;
  en: string;
  hi: string;
};

export const CHECKLISTS: Record<Role, CheckItem[]> = {
  delivery: [
    { id: "helmet", en: "I wear a helmet on a two-wheeler", hi: "दोपहिया पर हेलमेट पहनता हूँ" },
    { id: "brakes", en: "I check brakes and lights before starting", hi: "शुरू करने से पहले ब्रेक और लाइट जाँचता हूँ" },
    { id: "phone", en: "My phone is charged", hi: "फोन चार्ज है" },
    { id: "otp", en: "I do not share OTP or passwords", hi: "मैं OTP या पासवर्ड किसी को नहीं देता" },
    { id: "night", en: "I avoid dark, empty roads at night", hi: "रात को अँधेरी खाली सड़क से बचता हूँ" },
    { id: "rest", en: "I stop if I am too tired", hi: "बहुत थकान हो तो रुक जाता हूँ" },
  ],
  driver: [
    { id: "licence", en: "Licence and RC are in the vehicle", hi: "लाइसेंस और RC गाड़ी में हैं" },
    { id: "belt", en: "Seat belt is worn", hi: "सीट बेल्ट लगा है" },
    { id: "sober", en: "I do not drive after drinking", hi: "शराब के बाद गाड़ी नहीं चलाता" },
    { id: "tyre", en: "I check fuel and tyres", hi: "तेल और टायर जाँचता हूँ" },
    { id: "share", en: "A family member can see late trips", hi: "देर की सवारी परिवार को पता रहती है" },
    { id: "refuse", en: "I can refuse a ride that feels unsafe", hi: "असुरक्षित सवारी मना कर सकता हूँ" },
  ],
  "daily-wage": [
    { id: "payer", en: "I know who will pay me today", hi: "पता है आज पैसे कौन देगा" },
    { id: "wage", en: "The wage was agreed before work", hi: "काम से पहले मज़दूरी तय हुई" },
    { id: "water", en: "I drink water and rest in the heat", hi: "गर्मी में पानी पीता हूँ और रुकता हूँ" },
    { id: "gear", en: "I use gloves or a helmet if the site needs them", hi: "ज़रूरत हो तो दस्ताने या हेलमेट पहनता हूँ" },
    { id: "height", en: "I do not work at height without a harness", hi: "हार्नेस के बिना ऊँचाई पर काम नहीं करता" },
    { id: "record", en: "I keep a record of days worked", hi: "काम के दिन लिखकर रखता हूँ" },
  ],
};

export function checklistFor(role: Role): CheckItem[] {
  return CHECKLISTS[role];
}

export function labelFor(item: CheckItem, language: Language): string {
  return language === "hi" ? item.hi : item.en;
}
