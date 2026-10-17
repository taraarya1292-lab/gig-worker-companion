import type { Language } from "./types";

export type Channel = {
  id: string;
  en: string;
  hi: string;
  detailEn: string;
  detailHi: string;
  url?: string;
};

export const CHANNELS: Channel[] = [
  {
    id: "app-help",
    en: "Help section in your work app",
    hi: "अपने काम वाले ऐप का हेल्प सेक्शन",
    detailEn: "Open the app you work on and look for Help or Support. Sathi AI does not send the complaint.",
    detailHi: "जिस ऐप पर काम करते हैं उसमें Help या Support खोलें। साथी AI शिकायत नहीं भेजता।",
  },
  {
    id: "labour",
    en: "Your state labour department",
    hi: "आपके राज्य का श्रम विभाग",
    detailEn: "Search for the official labour department of your state. This app does not store a state office phone number.",
    detailHi: "अपने राज्य के आधिकारिक श्रम विभाग को खोजें। इस ऐप में दफ्तर का फोन नंबर सेव नहीं है।",
  },
  {
    id: "eshram",
    en: "e-Shram",
    hi: "ई-श्रम",
    detailEn: "Official registration site for many unorganised workers. Registration is not the same as getting the deducted money back.",
    detailHi: "कई असंगठित कामगारों के लिए आधिकारिक रजिस्ट्रेशन साइट। रजिस्ट्रेशन का मतलब कटी रकम वापस मिलना नहीं है।",
    url: "https://eshram.gov.in",
  },
];

export function channelLabel(channel: Channel, language: Language): string {
  return language === "hi" ? channel.hi : channel.en;
}

export function channelDetail(channel: Channel, language: Language): string {
  return language === "hi" ? channel.detailHi : channel.detailEn;
}

export function knownChannels(ids: string[]): Channel[] {
  const wanted = new Set(ids);
  const matched = CHANNELS.filter((channel) => wanted.has(channel.id));
  return matched.length > 0 ? matched : CHANNELS;
}
