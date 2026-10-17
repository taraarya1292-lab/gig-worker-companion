"use client";

import { useState } from "react";
import { roleLabel, t } from "@/lib/text";
import { LANGUAGES, ROLES, STATES, type Language, type Profile, type Role, type StateName } from "@/lib/types";

export function Onboarding({ onSave }: { onSave: (profile: Profile) => void }) {
  const [language, setLanguage] = useState<Language>("en");
  const [role, setRole] = useState<Role | null>(null);
  const [state, setState] = useState<StateName>("Maharashtra");

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-5 px-4 py-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0f6b4c]">
          {t(language, "Warm-up", "वार्म-अप")}
        </p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight">
          {t(language, "Gig Worker Companion", "गिग वर्कर साथी")}
        </h1>
        <p className="mt-2 text-lg leading-8">
          {t(
            language,
            "Earnings, safety, rights, documents, and complaints in simple words.",
            "कमाई, सुरक्षा, अधिकार, दस्तावेज़ और शिकायत — आसान शब्दों में।",
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
          className="mt-2 min-h-12 w-full rounded-xl border border-[#cfc6b8] bg-white px-3 text-lg"
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
        className="min-h-12 rounded-xl bg-[#0f6b4c] px-4 text-lg font-semibold text-white disabled:opacity-50"
      >
        {t(language, "Continue", "आगे बढ़ें")}
      </button>
    </main>
  );
}

function choiceClass(active: boolean): string {
  return active
    ? "min-h-12 rounded-xl border-2 border-[#0f6b4c] bg-[#e7f3ee] px-4 text-left text-lg font-semibold"
    : "min-h-12 rounded-xl border border-[#cfc6b8] bg-white px-4 text-left text-lg";
}
