"use client";

import { useState } from "react";
import { roleLabel, t } from "@/lib/text";
import { LANGUAGES, ROLES, STATES, type Language, type Profile, type Role, type StateName } from "@/lib/types";

export function Onboarding({ onSave, onDemo }: { onSave: (profile: Profile) => void; onDemo: (language: Language) => void }) {
  const [language, setLanguage] = useState<Language>("en");
  const [role, setRole] = useState<Role | null>(null);
  const [state, setState] = useState<StateName>("Maharashtra");

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-6">
      <header>
        <img
          src="/sathi-logo.png"
          alt="Sathi AI. Your work. Your rights. Your support."
          width={826}
          height={849}
          className="mx-auto h-auto w-60"
        />
        <h1 className="mt-3 text-3xl font-semibold leading-tight">
          {t(language, "Protect your work. Know your worth.", "अपने काम की रक्षा करें। अपनी कीमत जानें।")}
        </h1>
        <p className="mt-2 text-lg leading-8">
          {t(
            language,
            "From a missing payment to a letter you can send yourself.",
            "छूटी हुई कमाई से लेकर एक पत्र तक, जिसे आप खुद भेज सकें।",
          )}
        </p>
      </header>

      <fieldset>
        <legend className="text-lg font-semibold">
          {t(language, "Language", "भाषा")}
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {LANGUAGES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={language === item}
              onClick={() => setLanguage(item)}
              className={choiceClass(language === item)}
            >
              {item === "en" ? "English" : "हिन्दी"}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold">
          {t(language, "What work do you do?", "आप कौन सा काम करते हैं?")}
        </legend>
        <div className="mt-2 grid gap-2">
          {ROLES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={role === item}
              onClick={() => setRole(item)}
              className={choiceClass(role === item)}
            >
              {roleLabel(item, language)}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block text-lg font-semibold" htmlFor="state">
        {t(language, "State", "राज्य")}
        <select
          id="state"
          value={state}
          onChange={(event) => setState(event.target.value as StateName)}
          className="mt-2 min-h-12 w-full rounded-xl border border-[#ddd6c8] bg-white px-3 text-lg"
        >
          {STATES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        disabled={!role}
        onClick={() => role && onSave({ role, state, language })}
        className="min-h-12 rounded-xl bg-[#3d7a64] px-4 text-lg font-semibold text-white disabled:opacity-50"
      >
        {t(language, "Continue", "आगे बढ़ें")}
      </button>
      <button type="button" onClick={() => onDemo(language)} className="min-h-12 rounded-xl border border-[#3d5c52] text-lg font-semibold">
        {t(language, "Try the sample pay story", "नमूना कमाई की कहानी देखें")}
      </button>
    </main>
  );
}

function choiceClass(active: boolean): string {
  return active
    ? "min-h-12 rounded-xl border-2 border-[#3d7a64] bg-[#e8f4ee] px-4 text-left text-lg font-semibold"
    : "min-h-12 rounded-xl border border-[#ddd6c8] bg-white px-4 text-left text-lg";
}
