"use client";

import { useState } from "react";
import { AiPanel } from "@/components/AiPanel";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { maskSensitive } from "@/lib/mask";
import { t } from "@/lib/text";
import type { Profile, SavedDocument } from "@/lib/types";
import { useGuide } from "@/lib/useGuide";
import { SpeakButton } from "@/components/SpeakButton";

export function DocumentView({
  profile,
  onSave,
  onUse,
}: {
  profile: Profile;
  onSave: (document: SavedDocument) => void;
  onUse: () => void;
}) {
  const language = profile.language;
  const [text, setText] = useState("");
  const guide = useGuide();

  async function explain() {
    const masked = maskSensitive(text.trim());
    const result = await guide.ask({
      task: "document",
      profile,
      documentText: masked,
    });
    if (result) {
      onSave({
        excerpt: masked.slice(0, 280),
        summary: result.summary,
      });
    }
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        badge="bg-[#e8f1ff] text-[#2d6bff]"
        icon={<Icon name="file" />}
        title={t(language, "Document help", "दस्तावेज़ मदद")}
        detail={t(language, "Paste a notice and get it in plain language.", "नोटिस चिपकाएँ और आसान भाषा में समझें।")}
      />
      <section className="rounded-[28px] border border-[#d9e6f8] bg-white p-4 shadow-[0_12px_30px_rgba(22,49,92,0.05)]">
        <h2 className="text-xl font-semibold text-[#12284d]">
          {t(language, "Explain a notice", "नोटिस समझाओ")}
        </h2>
        <p className="mt-1 text-base text-[#5d6e80]">
          {t(
            language,
            "Paste text only. Do not paste Aadhaar, PAN, or bank numbers.",
            "सिर्फ लिखी बात चिपकाएँ। आधार, पैन या बैंक नंबर न डालें।",
          )}
        </p>
        <label className="mt-3 block text-base font-semibold" htmlFor="notice">
          {t(language, "Notice or message", "नोटिस या संदेश")}
          <textarea
            id="notice"
            value={text}
            maxLength={2000}
            onChange={(event) => setText(event.target.value)}
            rows={6}
            className="mt-1 w-full rounded-2xl border border-[#d9e4ec] bg-white px-3 py-2 text-lg"
          />
        </label>
        <SpeakButton language={language} onText={(spoken) => setText((current) => `${current} ${spoken}`.trim())} />
        <button
          type="button"
          disabled={text.trim().length < 10 || guide.loading}
          onClick={explain}
          className="mt-3 min-h-12 w-full rounded-full bg-[#2d6bff] text-lg font-semibold text-white disabled:opacity-50"
        >
          {t(language, "Explain with Gemini", "Gemini से समझाओ")}
        </button>
      </section>
      <AiPanel language={language} loading={guide.loading} error={guide.error} result={guide.result} />
      {guide.result && (
        <button type="button" onClick={onUse} className="min-h-12 rounded-full border border-[#2d6bff] bg-white text-lg font-semibold text-[#12284d]">
          {t(language, "Use this note in a problem", "इस नोट को समस्या में लगाएँ")}
        </button>
      )}
    </div>
  );
}
