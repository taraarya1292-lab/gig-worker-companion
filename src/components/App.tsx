"use client";

import { useEffect, useState } from "react";
import { DocumentView } from "@/components/DocumentView";
import { EarningsView } from "@/components/EarningsView";
import { GrievanceView } from "@/components/GrievanceView";
import { HomeView, type ViewName } from "@/components/HomeView";
import { Onboarding } from "@/components/Onboarding";
import { RightsView } from "@/components/RightsView";
import { SafetyView } from "@/components/SafetyView";
import { Icon } from "@/components/Icon";
import { t } from "@/lib/text";
import { isoPlusDays, todayISO } from "@/lib/storage";
import { useCompanion } from "@/lib/useCompanion";
import type { WorkCase } from "@/lib/types";

export function App() {
  const data = useCompanion();
  const [view, setView] = useState<ViewName>("home");
  const profile = data.profile;

  useEffect(() => {
    if (profile) {
      document.documentElement.lang = profile.language === "hi" ? "hi" : "en";
    }
  }, [profile]);

  function openDemo() {
    const language = profile?.language ?? "en";
    data.loadDemo(language);
    setView("grievance");
  }

  function saveIncident(summary: string) {
    const workCase: WorkCase = {
      id: crypto.randomUUID(),
      created: todayISO(),
      followUp: isoPlusDays(3),
      status: "open",
      problem: summary,
      facts: [],
      assumptions: [],
      plan: [],
      letter: "",
      evidence: [],
      notes: profile?.language === "hi"
        ? "सुरक्षा जाँच से सेव किया। किसी आपातकालीन सेवा को सूचना नहीं दी गई।"
        : "Saved from the safety check. No emergency service was contacted.",
      sample: false,
    };
    data.addCase(workCase);
    setView("grievance");
  }

  if (!profile) {
    return (
      <Onboarding
        onSave={(next) => {
          data.setProfile(next);
          setView("home");
        }}
        onDemo={(language) => {
          data.loadDemo(language);
          setView("grievance");
        }}
      />
    );
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-4 px-4 py-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-lg font-semibold text-[#043158]">
            <img src="/sathi-mark.png" alt="" width={40} height={45} className="h-10 w-9" />
            Sathi AI
          </p>
          {view === "home" && (
            <h1 className="text-3xl font-semibold leading-tight">
              {t(profile.language, "Protect your work. Know your worth.", "अपने काम की रक्षा करें। अपनी कीमत जानें।")}
            </h1>
          )}
        </div>
        {view !== "home" && (
          <button type="button" onClick={() => setView("home")} className="inline-flex min-h-12 items-center gap-2 rounded-xl px-2 text-lg font-semibold text-[#3d7a64]">
            <Icon name="home" />
            {t(profile.language, "Home", "होम")}
          </button>
        )}
      </header>
      {view === "home" && (
        <HomeView
          profile={profile}
          earnings={data.earnings}
          cases={data.cases}
          safetyDate={data.safetyDate}
          hasDocument={Boolean(data.documentNote)}
          onOpen={setView}
          onDemo={openDemo}
          onChangeProfile={data.forgetProfile}
          onClear={() => {
            data.clear();
            setView("home");
          }}
        />
      )}
      {view === "earnings" && (
        <EarningsView profile={profile} earnings={data.earnings} onAdd={data.addEarning} />
      )}
      {view === "safety" && (
        <SafetyView profile={profile} onDone={() => data.markSafety(todayISO())} onSaveIncident={saveIncident} />
      )}
      {view === "rights" && <RightsView profile={profile} />}
      {view === "documents" && (
        <DocumentView profile={profile} onSave={data.setDocument} onUse={() => setView("grievance")} />
      )}
      {view === "grievance" && (
        <GrievanceView
          profile={profile}
          earnings={data.earnings}
          documentNote={data.documentNote}
          cases={data.cases}
          draft={data.draft}
          onSaveCase={data.addCase}
          onUpdateCase={data.updateCase}
          onClearDraft={() => data.setDraft("")}
        />
      )}
      <p className="text-base text-[#66716c]">
        {t(
          profile.language,
          "Guidance in simple language, not legal advice. Earnings and cases stay on this phone.",
          "आसान भाषा में मदद है, कानूनी सलाह नहीं। कमाई और केस इसी फोन पर रहते हैं।",
        )}
      </p>
    </main>
  );
}
