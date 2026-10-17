"use client";

import { useState } from "react";
import { AiPanel } from "@/components/AiPanel";
import { Icon } from "@/components/Icon";
import { checklistFor, labelFor } from "@/lib/checklists";
import { todayISO } from "@/lib/storage";
import { t } from "@/lib/text";
import type { Profile } from "@/lib/types";
import { useGuide } from "@/lib/useGuide";

export function SafetyView({
  profile,
  onDone,
  onSaveIncident,
}: {
  profile: Profile;
  onDone: () => void;
  onSaveIncident: (summary: string) => void;
}) {
  const language = profile.language;
  const items = checklistFor(profile.role);
  const [checked, setChecked] = useState<string[]>([]);
  const guide = useGuide();

  function toggle(id: string) {
    setChecked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function ask() {
    const gaps = items.filter((item) => !checked.includes(item.id)).map((item) => item.id);
    const result = await guide.ask({ task: "safety", profile, safetyGaps: gaps });
    if (result) onDone();
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border border-[#e8e2d6] bg-white p-4">
        <h2 className="flex items-center gap-2 text-2xl font-semibold"><Icon name="shield" />{t(language, "Today's safety check", "आज की सुरक्षा जाँच")}</h2>
        <p className="mt-1 text-base text-[#66716c]">{todayISO()}</p>
        <ul className="mt-3 grid gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <label className="flex min-h-12 items-center gap-3 text-lg">
                <input
                  type="checkbox"
                  checked={checked.includes(item.id)}
                  onChange={() => toggle(item.id)}
                  className="h-6 w-6"
                />
                {labelFor(item, language)}
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={guide.loading}
          onClick={ask}
          className="mt-4 min-h-12 w-full rounded-xl bg-[#3d5c52] text-lg font-semibold text-white disabled:opacity-50"
        >
          {t(language, "Get safety guidance", "सुरक्षा सलाह लो")}
        </button>
      </section>
      <AiPanel language={language} loading={guide.loading} error={guide.error} result={guide.result} />
      {guide.result && (
        <button type="button" onClick={() => onSaveIncident(guide.result?.summary ?? "")} className="min-h-12 rounded-xl border border-[#3d5c52] bg-white text-lg font-semibold">
          {t(language, "Save this incident note", "इस घटना का नोट सेव करें")}
        </button>
      )}
      <p className="text-base text-[#66716c]">
        {t(language, "Saving a note does not contact police or an ambulance.", "नोट सेव करने से पुलिस या एम्बुलेंस को सूचना नहीं जाती।")}
      </p>
    </div>
  );
}
