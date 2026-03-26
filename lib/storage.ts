import { ExposureLog } from "./types";

const KEYS = {
  logs: "sprout:logs",
  babyName: "sprout:babyName",
} as const;

export function loadLogs(): ExposureLog[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.logs) ?? "[]");
  } catch {
    return [];
  }
}

export function saveLogs(logs: ExposureLog[]): void {
  localStorage.setItem(KEYS.logs, JSON.stringify(logs));
}

export function loadBabyName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEYS.babyName) ?? "";
}

export function saveBabyName(name: string): void {
  localStorage.setItem(KEYS.babyName, name);
}
