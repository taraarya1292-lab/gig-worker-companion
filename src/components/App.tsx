"use client";

import { useEffect, useState } from "react";
import { DocumentView } from "@/components/DocumentView";
import { EarningsView } from "@/components/EarningsView";
import { GrievanceView } from "@/components/GrievanceView";
import { HomeView, type ViewName } from "@/components/HomeView";
import { Onboarding } from "@/components/Onboarding";
import { RightsView } from "@/components/RightsView";
import { SafetyView } from "@/components/SafetyView";
import { t } from "@/lib/text";
import { todayISO } from "@/lib/storage";
import { useCompanion } from "@/lib/useCompanion";

export function App() {
  const data = useCompanion();
  const [view, setView] = useState<ViewName>("home");
  const profile = data.profile;

  useEffect(() => {
    if (profile) {
      document.documentElement.lang = profile.language === "hi" ? "hi" : "en";
    }
  }, [profile]);

  if (!profile) {
    return <Onboarding onSave={data.setProfile} />;
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-4 px-4 py-5">
      {view !== "home" && (
        <button
          type="button"
          onClick={() => setView("home")}
          className="min-h-12 w-fit rounded-xl px-2 text-lg font-semibold text-[#0f6b4c]"
        >
          {t(profile.language, "← Home", "← होम")}
        </button>
      )}
      {view === "home" && (
        <header>
          <h1 className="text-3xl font-semibold leading-tight">
            {t(profile.language, "Gig Worker Companion", "गिग वर्कर साथी")}
          </h1>
        </header>
      )}
      {view === "home" && (
        <HomeView
          profile={profile}
          earnings={data.earnings}
          safetyDate={data.safetyDate}
          hasDocument={Boolean(data.documentNote)}
          onOpen={setView}
          onChangeProfile={data.forgetProfile}
          onClear={data.clear}
        />
      )}
      {view === "earnings" && (
        <EarningsView profile={profile} earnings={data.earnings} onAdd={data.addEarning} />
      )}
      {view === "safety" && (
        <SafetyView profile={profile} onDone={() => data.markSafety(todayISO())} />
      )}
      {view === "rights" && <RightsView profile={profile} />}
      {view === "documents" && <DocumentView profile={profile} onSave={data.setDocument} />}
      {view === "grievance" && (
        <GrievanceView
          profile={profile}
          earnings={data.earnings}
          documentNote={data.documentNote}
        />
      )}
      <p className="text-base text-[#5c564c]">
        {t(
          profile.language,
          "Guidance in simple language, not legal advice. Earnings stay on this phone.",
          "आसान भाषा में मदद है, कानूनी सलाह नहीं। कमाई इसी फोन पर रहती है।",
        )}
      </p>
    </div>
  );
}
