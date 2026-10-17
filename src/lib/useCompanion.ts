"use client";

import { useSyncExternalStore } from "react";
import { demoEarnings, demoProblem } from "@/lib/demo";
import {
  clearLocalData,
  clearProfile,
  loadCases,
  loadDocument,
  loadDraft,
  loadEarnings,
  loadProfile,
  loadSafetyDate,
  saveCases,
  saveDocument,
  saveDraft,
  saveEarnings,
  saveProfile,
  saveSafetyDate,
} from "@/lib/storage";
import type { Earning, Language, Profile, SavedDocument, WorkCase } from "@/lib/types";

type Snapshot = {
  profile: Profile | null;
  earnings: Earning[];
  safetyDate: string | null;
  documentNote: SavedDocument | null;
  cases: WorkCase[];
  draft: string;
};

const serverSnapshot: Snapshot = {
  profile: null,
  earnings: [],
  safetyDate: null,
  documentNote: null,
  cases: [],
  draft: "",
};

let current: Snapshot = serverSnapshot;
let loaded = false;
const listeners = new Set<() => void>();

function readFromBrowser(): Snapshot {
  return {
    profile: loadProfile(),
    earnings: loadEarnings(),
    safetyDate: loadSafetyDate(),
    documentNote: loadDocument(),
    cases: loadCases(),
    draft: loadDraft(),
  };
}

function getSnapshot(): Snapshot {
  if (!loaded) {
    loaded = true;
    current = readFromBrowser();
  }
  return current;
}

function publish(next: Snapshot) {
  current = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCompanion() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);

  return {
    ...snapshot,
    setProfile(profile: Profile) {
      saveProfile(profile);
      publish({ ...current, profile });
    },
    forgetProfile() {
      clearProfile();
      publish({ ...current, profile: null });
    },
    addEarning(earning: Earning) {
      const earnings = [earning, ...current.earnings].slice(0, 60);
      saveEarnings(earnings);
      publish({ ...current, earnings });
    },
    replaceEarnings(earnings: Earning[]) {
      saveEarnings(earnings);
      publish({ ...current, earnings });
    },
    markSafety(date: string) {
      saveSafetyDate(date);
      publish({ ...current, safetyDate: date });
    },
    setDocument(documentNote: SavedDocument) {
      saveDocument(documentNote);
      publish({ ...current, documentNote });
    },
    setDraft(draft: string) {
      saveDraft(draft);
      publish({ ...current, draft });
    },
    addCase(workCase: WorkCase) {
      const cases = [workCase, ...current.cases].slice(0, 20);
      saveCases(cases);
      publish({ ...current, cases });
    },
    updateCase(workCase: WorkCase) {
      const cases = current.cases.map((item) => (item.id === workCase.id ? workCase : item));
      saveCases(cases);
      publish({ ...current, cases });
    },
    loadDemo(language: Language) {
      const profile: Profile = { role: "delivery", state: "Maharashtra", language };
      const earnings = demoEarnings();
      const draft = demoProblem(language);
      saveProfile(profile);
      saveEarnings(earnings);
      saveDraft(draft);
      publish({ ...current, profile, earnings, draft });
    },
    clear() {
      clearLocalData();
      publish({ ...serverSnapshot });
    },
  };
}
