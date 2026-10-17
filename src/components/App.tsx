"use client";

import { useEffect, useRef, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DocumentView } from "@/components/DocumentView";
import { EarningsView } from "@/components/EarningsView";
import { GrievanceView } from "@/components/GrievanceView";
import { HomeView, type ViewName } from "@/components/HomeView";
import { MoreView } from "@/components/MoreView";
import { Onboarding } from "@/components/Onboarding";
import { RightsView } from "@/components/RightsView";
import { SafetyView } from "@/components/SafetyView";
import { t } from "@/lib/text";
import { isoPlusDays, todayISO } from "@/lib/storage";
import { useCompanion } from "@/lib/useCompanion";
import type { WorkCase } from "@/lib/types";

export function App() {
  const data = useCompanion();
  const [view, setView] = useState<ViewName>("home");
  const [serviceFocus, setServiceFocus] = useState(0);
  const history = useRef<ViewName[]>(["home"]);
  const profile = data.profile;

  function openView(next: ViewName) {
    if (view === next) return;
    history.current = [...history.current, next];
    setView(next);
  }

  function goHome() {
    history.current = ["home"];
    setView("home");
  }

  function goBack() {
    const trail = history.current;
    if (trail.length <= 1) {
      history.current = ["home"];
      setView("home");
      return;
    }
    const next = trail.slice(0, -1);
    history.current = next;
    setView(next[next.length - 1] ?? "home");
  }

  useEffect(() => {
    if (profile) {
      document.documentElement.lang = profile.language === "hi" ? "hi" : "en";
    }
  }, [profile]);

  function openDemo() {
    const language = profile?.language ?? "en";
    data.loadDemo(language);
    openView("grievance");
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
    openView("grievance");
  }

  if (!profile) {
    return (
      <Onboarding
        onSave={(next) => {
          history.current = ["home"];
          data.setProfile(next);
          setView("home");
        }}
        onDemo={(language) => {
          history.current = ["home", "grievance"];
          data.loadDemo(language);
          setView("grievance");
        }}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
      {view !== "home" && (
        <button type="button" onClick={goBack} className="sticky top-0 z-10 -mt-1 inline-flex h-11 items-center gap-1 self-start rounded-full bg-[#f7fbf8]/90 pr-3 text-base font-semibold text-[#16315c]">
          <BackIcon />
          {t(profile.language, "Back", "वापस")}
        </button>
      )}
      {view === "home" && (
        <HomeView
          profile={profile}
          serviceFocus={serviceFocus}
          onOpen={openView}
          onAsk={(problem) => {
            data.setDraft(problem);
            openView("grievance");
          }}
          onLanguage={(language) => data.setProfile({ ...profile, language })}
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
        <DocumentView profile={profile} onSave={data.setDocument} onUse={() => openView("grievance")} />
      )}
      {view === "more" && (
        <MoreView
          profile={profile}
          earnings={data.earnings}
          cases={data.cases}
          safetyDate={data.safetyDate}
          onOpen={openView}
          onDemo={openDemo}
          onChangeProfile={data.forgetProfile}
          onClear={() => {
            data.clear();
            goHome();
          }}
        />
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
      <p className="text-sm text-[#66788a]">
        {t(
          profile.language,
          "Guidance in simple language, not legal advice. Earnings and cases stay on this phone.",
          "आसान भाषा में मदद है, कानूनी सलाह नहीं। कमाई और केस इसी फोन पर रहते हैं।",
        )}
      </p>
    </main>
      <BottomNav
        language={profile.language}
        view={view}
        onHome={goHome}
        onSathi={() => openView("grievance")}
        onServices={() => {
          goHome();
          setServiceFocus((count) => count + 1);
        }}
        onMore={() => openView("more")}
      />
    </div>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 6 9 12l6 6" />
    </svg>
  );
}
