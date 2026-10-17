"use client";

import { useSyncExternalStore } from "react";
import {
  clearLocalData,
  clearProfile,
  loadDocument,
  loadEarnings,
  loadProfile,
  loadSafetyDate,
  saveDocument,
  saveEarnings,
  saveProfile,
  saveSafetyDate,
} from "@/lib/storage";
import type { Earning, Profile, SavedDocument } from "@/lib/types";

type Snapshot = {
  profile: Profile | null;
  earnings: Earning[];
  safetyDate: string | null;
  documentNote: SavedDocument | null;
};

const serverSnapshot: Snapshot = {
  profile: null,
  earnings: [],
  safetyDate: null,
  documentNote: null,
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
    markSafety(date: string) {
      saveSafetyDate(date);
      publish({ ...current, safetyDate: date });
    },
    setDocument(documentNote: SavedDocument) {
      saveDocument(documentNote);
      publish({ ...current, documentNote });
    },
    clear() {
      clearLocalData();
      publish({ ...serverSnapshot });
    },
  };
}
