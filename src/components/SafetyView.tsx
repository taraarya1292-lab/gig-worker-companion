"use client";

import { useState } from "react";
import { AiPanel } from "@/components/AiPanel";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        badge="bg-[#fff4e6] text-[#e0862d]"
        icon={<Icon name="helmet" />}
        title={t(language, "Safety Support", "सुरक्षा सहायता")}
        detail={t(language, "Check risks and save a note if something happens.", "जोखिम जाँचें और घटना हो तो नोट सेव करें।")}
      />
      <section className="rounded-[28px] border border-[#ffe8cc] bg-white p-4 shadow-[0_12px_30px_rgba(22,49,92,0.05)]">
        <h2 className="text-xl font-semibold text-[#12284d]">{t(language, "Today's safety check", "आज की सुरक्षा जाँच")}</h2>
        <p className="mt-1 text-base text-[#5d6e80]">{todayISO()}</p>
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
          className="mt-4 min-h-12 w-full rounded-full bg-[#e0862d] text-lg font-semibold text-white disabled:opacity-50"
        >
          {t(language, "Get safety guidance", "सुरक्षा सलाह लो")}
        </button>
      </section>
      <AiPanel language={language} loading={guide.loading} error={guide.error} result={guide.result} />
      {guide.result && (
        <button type="button" onClick={() => onSaveIncident(guide.result?.summary ?? "")} className="min-h-12 rounded-full border border-[#e0862d] bg-white text-lg font-semibold text-[#12284d]">
          {t(language, "Save this incident note", "इस घटना का नोट सेव करें")}
        </button>
      )}
      <p className="text-base text-[#5d6e80]">
        {t(language, "Saving a note does not contact police or an ambulance.", "नोट सेव करने से पुलिस या एम्बुलेंस को सूचना नहीं जाती।")}
      </p>
    </div>
  );
}
