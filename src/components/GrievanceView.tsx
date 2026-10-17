"use client";

import { useState } from "react";
import { AiPanel } from "@/components/AiPanel";
import { SpeakButton } from "@/components/SpeakButton";
import { isoDaysAgo, rupees } from "@/lib/storage";
import { t } from "@/lib/text";
import type { Earning, Profile, SavedDocument } from "@/lib/types";
import { useGuide } from "@/lib/useGuide";

export function GrievanceView({
  profile,
  earnings,
  documentNote,
}: {
  profile: Profile;
  earnings: Earning[];
  documentNote: SavedDocument | null;
}) {
  const language = profile.language;
  const [dispute, setDispute] = useState("");
  const [copied, setCopied] = useState(false);
  const guide = useGuide();
  const recent = earnings.filter((entry) => entry.date >= isoDaysAgo(6));
  const total = recent.reduce((sum, entry) => sum + entry.amount, 0);

  async function draft() {
    setCopied(false);
    await guide.ask({
      task: "grievance",
      profile,
      earnings: recent,
      dispute,
      documentText: documentNote
        ? `${documentNote.excerpt}\n${documentNote.summary}`
        : "",
    });
  }

  async function copyLetter() {
    if (!guide.result) return;
    const letter = [guide.result.summary, "", guide.result.nextStep].filter(Boolean).join("\n");
    await navigator.clipboard.writeText(letter);
    setCopied(true);
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border border-[#e4ddd0] bg-white p-4">
        <h2 className="text-2xl font-semibold">
          {t(language, "Draft a complaint", "शिकायत का पत्र")}
        </h2>
        <p className="mt-2 text-lg">
          {t(language, "Uses last 7 days of earnings", "पिछले 7 दिन की कमाई का उपयोग")}: {rupees(total)} ({recent.length})
        </p>
        <p className="text-lg">
          {documentNote
            ? t(language, "Uses your last document explanation.", "पिछले दस्तावेज़ की व्याख्या का उपयोग।")
            : t(language, "No document yet. You can still draft from earnings.", "अभी दस्तावेज़ नहीं। कमाई से भी पत्र बन सकता है।")}
        </p>
        <label className="mt-3 block text-base font-semibold" htmlFor="dispute">
          {t(language, "What happened?", "क्या हुआ?")}
          <textarea
            id="dispute"
            value={dispute}
            maxLength={1000}
            onChange={(event) => setDispute(event.target.value)}
            rows={5}
            className="mt-1 w-full rounded-xl border border-[#cfc6b8] px-3 py-2 text-lg"
          />
        </label>
        <SpeakButton language={language} onText={(spoken) => setDispute((current) => `${current} ${spoken}`.trim())} />
        <button
          type="button"
          disabled={dispute.trim().length < 10 || guide.loading}
          onClick={draft}
          className="mt-3 min-h-12 w-full rounded-xl bg-[#1c1915] text-lg font-semibold text-white disabled:opacity-50"
        >
          {t(language, "Draft with Gemini", "Gemini से पत्र लिखो")}
        </button>
      </section>
      <AiPanel language={language} loading={guide.loading} error={guide.error} result={guide.result} />
      {guide.result && (
        <button type="button" onClick={copyLetter} className="min-h-12 rounded-xl border border-[#1c1915] bg-white text-lg font-semibold">
          {copied
            ? t(language, "Copied", "कॉपी हो गया")
            : t(language, "Copy letter", "पत्र कॉपी करें")}
        </button>
      )}
    </div>
  );
}
