# CLAUDE.md — Sprout Allergy Tracker

This file tells Claude Code how to work in this codebase. Read it fully before making changes.

---

## Project Overview

**Sprout** is a Next.js progressive web app for parents tracking allergen introductions in infants. It is a single-user, client-side-only app — there is no backend, no auth, no database. All state lives in `localStorage`.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Inline styles (design system via CSS variables in `globals.css`)
- **Storage**: `localStorage` only — no server state, no cookies, no external APIs
- **Fonts**: Google Fonts — Lora (display), DM Sans (body), loaded via `next/font/google`
- **PWA**: `next-pwa` with a generated service worker

---

## Project Structure

```
/app
  layout.tsx          # Root layout — fonts, metadata, PWA manifest link
  page.tsx            # Shell — renders <AllergyTracker />
  globals.css         # CSS variables, resets, keyframe animations

/components
  AllergyTracker.tsx  # Root app component — owns all state
  AllergenCard.tsx    # Single allergen tile (tried/untried states)
  AllergenDetail.tsx  # Bottom-sheet: full history for one allergen
  LogForm.tsx         # Bottom-sheet: add a new exposure log
  Timeline.tsx        # Chronological feed of all logs
  Modal.tsx           # Bottom-sheet wrapper with backdrop
  ReactionBadge.tsx   # Colored pill for reaction severity

/lib
  storage.ts          # All localStorage read/write — import from here only
  constants.ts        # ALLERGENS, ALLERGEN_GROUPS, REACTIONS — source of truth
  types.ts            # Shared TypeScript types

/public
  manifest.json       # PWA manifest
  icons/              # App icons (192x192, 512x512)
```

---

## Storage Layer — Critical Rules

**All localStorage access must go through `/lib/storage.ts`.** Never call `localStorage` directly in components.

```ts
// lib/storage.ts
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
```

### SSR Safety

Next.js runs components on the server during build. Any `localStorage` call outside a `useEffect` or event handler will throw. Always guard with:

```ts
if (typeof window === "undefined") return fallback;
```

Or initialize state lazily:

```ts
const [logs, setLogs] = useState<ExposureLog[]>(() => loadLogs());
```

The lazy initializer only runs on the client, so this pattern is safe.

---

## Types

```ts
// lib/types.ts

export type ReactionLevel = "none" | "mild" | "moderate" | "severe";

export interface ExposureLog {
  id: string;           // Date.now().toString()
  allergenId: string;   // matches Allergen.id in constants.ts
  date: string;         // ISO date string YYYY-MM-DD
  reaction: ReactionLevel;
  notes: string;
  amount?: string;      // free text e.g. "1 tsp"
}

export interface Allergen {
  id: string;
  label: string;
  emoji: string;
  color: string;        // pastel hex — used as card background
  group: AllergenGroupId;
}

export type AllergenGroupId = "grains" | "nuts" | "animal" | "fruit";

export interface AllergenGroup {
  id: AllergenGroupId;
  label: string;
}
```

---

## Constants — Do Not Duplicate

`/lib/constants.ts` is the single source of truth for allergen and reaction data. When adding a new allergen:
1. Add it to the `ALLERGENS` array with a unique `id`, correct `group`, and a distinct pastel `color`.
2. Do not hardcode allergen data anywhere else.

The 23 tracked allergens are:

**Grains & Legumes**: wheat, soy, peanut, lentils, chickpeas, whitebeans  
**Tree Nuts**: almond, cashew, brazilnut, walnut, pinenut, pecan, pistachio, hazelnut, macadamia, sesame  
**Animal Proteins**: dairy, egg, fish, seafood  
**Fruits**: kiwi, peach, strawberry

---

## Component Conventions

- Components are **function components** with explicit TypeScript prop interfaces.
- No class components.
- State lives in `AllergyTracker.tsx` and is passed down as props. Child components do not own logs state.
- Modal state uses a discriminated union: `null | { type: "log"; allergenId?: string } | { type: "detail"; allergenId: string }`.
- Event handlers follow the pattern `onSave`, `onClose`, `onDelete` — always passed as props, never inferred.

---

## Styling Conventions

- Use inline styles for component-level styles. No CSS modules, no Tailwind.
- Global tokens (colors, radii, fonts) live in `globals.css` as CSS custom properties.
- Color palette:
  - Background: `#fdf8f3`
  - Surface: `#faf6f1`
  - Border: `#ede4d6`
  - Text primary: `#2d1f0e`
  - Text secondary: `#78624a`
  - Text muted: `#9b8b78`
  - Accent: `#c17f3e`
  - Accent gradient: `linear-gradient(135deg, #c17f3e, #e8a55a)`
- Reaction colors: none=`#4ade80`, mild=`#fbbf24`, moderate=`#fb923c`, severe=`#f87171`
- Border radius: cards `16px`, inputs `10px`, buttons `12px`, badges `99px`
- Never use `!important`.

---

## PWA Setup

- `next-pwa` wraps the Next.js config in `next.config.ts`.
- The service worker caches the shell and static assets; it does **not** cache `localStorage` (that's handled by the browser).
- `manifest.json` must declare `"display": "standalone"` and include 192px and 512px icons.
- The app must be fully functional offline after first load.

---

## What Claude Should Not Do

- Do not add a backend, database, or API routes.
- Do not introduce authentication.
- Do not use `useReducer` — `useState` + prop drilling is intentionally simple here.
- Do not install UI libraries (shadcn, MUI, Radix). Inline styles only.
- Do not change the font stack without updating both `layout.tsx` and `globals.css`.
- Do not call `localStorage` outside of `/lib/storage.ts`.
- Do not add `"use client"` to `layout.tsx` or `page.tsx` — keep them as server components.
