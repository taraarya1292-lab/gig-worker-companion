"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Mascot } from "@/components/Mascot";
import { SpeakButton } from "@/components/SpeakButton";
import { t } from "@/lib/text";
import type { Language, Profile } from "@/lib/types";

export type ViewName = "home" | "earnings" | "safety" | "rights" | "documents" | "grievance" | "more";

export function HomeView({
  profile,
  serviceFocus,
  onOpen,
  onAsk,
  onLanguage,
}: {
  profile: Profile;
  serviceFocus: number;
  onOpen: (view: ViewName) => void;
  onAsk: (problem: string) => void;
  onLanguage: (language: Language) => void;
}) {
  const language = profile.language;
  const [problem, setProblem] = useState("");

  useEffect(() => {
    if (serviceFocus === 0) return;
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [serviceFocus]);

  function ask(text: string) {
    const next = text.trim();
    if (next.length < 3) return;
    onAsk(next);
  }

  const chips = [
    {
      icon: "chart" as const,
      label: t(language, "Why is my payment low?", "मेरी कमाई कम क्यों है?"),
      text: t(
        language,
        "My payment looks lower than I expected. Please explain the change from my saved earnings.",
        "मेरी कमाई उम्मीद से कम लग रही है। सेव की हुई कमाई से बदलाव समझाइए।",
      ),
      tone: "bg-[#eef6ff] text-[#2458b5]",
    },
    {
      icon: "file" as const,
      label: t(language, "Write a complaint", "शिकायत लिखें"),
      text: t(
        language,
        "I want to write a complaint about a problem at work.",
        "मैं काम की समस्या की शिकायत लिखना चाहता हूँ।",
      ),
      tone: "bg-[#eefaf2] text-[#1d8a49]",
    },
  ];

  const services: Array<{
    view: ViewName;
    title: string;
    detail: string;
    icon: "chart" | "file" | "shield" | "helmet";
    card: string;
    badge: string;
  }> = [
    {
      view: "earnings",
      icon: "chart",
      title: t(language, "Earnings Guide", "कमाई गाइड"),
      detail: t(language, "Understand payments, deductions and hourly pay.", "कमाई, कटौती और घंटे की कमाई समझें।"),
      card: "bg-[#e7f7ee]",
      badge: "bg-white text-[#1f9a57]",
    },
    {
      view: "grievance",
      icon: "file",
      title: t(language, "Report a Problem", "समस्या बताएँ"),
      detail: t(language, "Get help with payments, deductions and work issues.", "कमाई, कटौती और काम की समस्या में मदद।"),
      card: "bg-[#e8f1ff]",
      badge: "bg-white text-[#2d6bff]",
    },
    {
      view: "rights",
      icon: "shield",
      title: t(language, "Benefits & Rights", "लाभ और अधिकार"),
      detail: t(language, "See official scheme notes and what to confirm.", "आधिकारिक योजना नोट देखें और क्या पुष्टि करें।"),
      card: "bg-[#f3eeff]",
      badge: "bg-white text-[#7a4de0]",
    },
    {
      view: "safety",
      icon: "helmet",
      title: t(language, "Safety Support", "सुरक्षा सहायता"),
      detail: t(language, "Check risks and save a note if something happens.", "जोखिम जाँचें और घटना हो तो नोट सेव करें।"),
      card: "bg-[#fff4e6]",
      badge: "bg-white text-[#e0862d]",
    },
  ];

  return (
    <div className="grid gap-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/sathi-mark.png" alt="" width={48} height={54} className="h-12 w-11" />
          <div>
            <p className="text-xl font-semibold leading-none text-[#16315c]">
              Sathi <span className="text-[#2f9e57]">AI</span>
            </p>
            <p className="mt-1 text-[11px] leading-tight text-[#607086]">Your Work. Your Rights. Your Support.</p>
          </div>
        </div>
        <label className="inline-flex h-10 items-center gap-1 rounded-full border border-[#d7efe4] bg-white px-3 text-sm font-semibold text-[#1d6b4f]">
          <Globe />
          <span className="sr-only">{t(language, "Language", "भाषा")}</span>
          <select
            aria-label={t(language, "Language", "भाषा")}
            value={language}
            onChange={(event) => onLanguage(event.target.value as Language)}
            className="bg-transparent pr-1 text-sm font-semibold"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </label>
      </header>

      <section className="relative overflow-hidden pr-24">
        <h1 className="max-w-[16.5rem] text-[2rem] font-semibold leading-[1.15] text-[#12284d]">
          {language === "hi" ? (
            <>
              आज हम आपकी कैसे{" "}
              <span className="relative inline-block text-[#2d6bff]">
                मदद
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#f0a04b]" />
              </span>
              {" करें?"}
            </>
          ) : (
            <>
              How can we help you{" "}
              <span className="relative inline-block text-[#2d6bff]">
                today
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#f0a04b]" />
              </span>?
            </>
          )}
        </h1>
        <p className="mt-3 max-w-[16rem] text-base leading-6 text-[#5d6e80]">
          {t(language, "Get guidance, understand your rights, and find the right support.", "मदद लें, अपने अधिकार समझें, और सही सहायता खोजें।")}
        </p>
        <div className="pointer-events-none absolute -right-2 top-0">
          <Mascot />
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e3f3ea] bg-gradient-to-b from-white to-[#eef8f3] p-4 shadow-[0_12px_30px_rgba(40,110,80,0.06)]">
        <h2 className="text-2xl font-semibold text-[#16315c]">{t(language, "Ask Sathi AI", "साथी AI से पूछें")}</h2>
        <p className="text-base text-[#6a7c8c]">{t(language, "Your personal work-support assistant", "आपका काम-सहायता सहायक")}</p>
        <form
          className="mt-3 flex items-center gap-1 rounded-full border border-[#d9e4ec] bg-white px-3"
          onSubmit={(event) => {
            event.preventDefault();
            ask(problem);
          }}
        >
          <label className="sr-only" htmlFor="ask-problem">{t(language, "Describe your problem", "अपनी समस्या लिखें")}</label>
          <input
            id="ask-problem"
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            placeholder={t(language, "Describe your problem...", "अपनी समस्या लिखें...")}
            className="min-h-12 min-w-0 flex-1 bg-transparent text-base outline-none"
          />
          <SpeakButton compact language={language} onText={(spoken) => setProblem((current) => `${current} ${spoken}`.trim())} />
          <button type="submit" aria-label={t(language, "Send to Sathi AI", "साथी AI को भेजें")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#21a35a] text-white">
            <ArrowUp />
          </button>
        </form>
        <div className="pill-row mt-3">
          {chips.map((chip) => (
            <button key={chip.label} type="button" onClick={() => ask(chip.text)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${chip.tone}`}>
              <Icon name={chip.icon} className="h-4 w-4" />
              {chip.label}
            </button>
          ))}
          <button type="button" onClick={() => onOpen("rights")} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f4efff] px-3 py-2 text-sm font-semibold text-[#7a4de0]">
            <Icon name="shield" className="h-4 w-4" />
            {t(language, "Check my benefits", "मेरे लाभ देखें")}
          </button>
        </div>
      </section>

      <section id="services" className="scroll-mt-4">
        <h2 className="text-2xl font-semibold text-[#12284d]">{t(language, "Explore Services", "सेवाएँ देखें")}</h2>
        <p className="text-base text-[#66788a]">{t(language, "Choose a topic or ask Sathi AI directly.", "कोई विषय चुनें या सीधे साथी AI से पूछें।")}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {services.map((service) => (
            <button key={service.view} type="button" onClick={() => onOpen(service.view)} className={`min-h-36 rounded-3xl p-4 text-left ${service.card}`}>
              <span className="flex items-start justify-between gap-2">
                <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${service.badge}`}>
                  <Icon name={service.icon} />
                </span>
                <Chevron />
              </span>
              <span className="mt-3 block text-base font-semibold leading-5 text-[#16315c]">{service.title}</span>
              <span className="mt-1 block text-sm leading-5 text-[#5d6e80]">{service.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <button type="button" onClick={() => document.getElementById("ask-problem")?.focus()} className="flex items-center gap-3 rounded-3xl bg-[#eef6ff] px-4 py-4 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2d6bff]">
          <Icon name="path" />
        </span>
        <span>
          <span className="block font-semibold text-[#16315c]">{t(language, "Not sure where to start?", "कहाँ से शुरू करें?")}</span>
          <span className="block text-sm text-[#5d6e80]">{t(language, "Tell Sathi AI what happened. It will guide you step by step.", "साथी AI को बताएँ क्या हुआ। यह कदम दर कदम आगे बढ़ाएगा।")}</span>
        </span>
        <Chevron />
      </button>
    </div>
  );
}

function Globe() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 2.5 2.5 13 0 16M12 4c-2.5 2.5-2.5 13 0 16" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 18V6" />
      <path d="m7 11 5-5 5 5" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#8aa0b3]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
