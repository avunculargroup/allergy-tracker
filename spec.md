# Sprout — Product & Technical Specification

**Version**: 1.0  
**Status**: In development  
**Stack**: Next.js · TypeScript · localStorage · PWA

---

## 1. Purpose

Sprout helps parents of infants systematically introduce the 23 most common allergenic foods, log each exposure, and track any reactions — following pediatric guidelines for early allergen introduction.

The app is deliberately simple: no accounts, no cloud sync, no sharing. One device, one baby, one parent.

---

## 2. User

**Primary user**: A parent or caregiver of an infant (typically 4–12 months old) who has been advised by their pediatrician to introduce allergenic foods.

**Context of use**: Kitchen counter or couch. One hand may be occupied with the baby. Sessions are short (under 2 minutes). The parent may be anxious about reactions and needs the UI to be calm and reassuring.

**Key jobs to be done**:
1. Record that I just gave my baby a new food today.
2. Note whether there was any reaction and what it looked like.
3. See which foods we've already tried and which are still left.
4. Look back at our history before a pediatrician appointment.

---

## 3. Allergen Data Model

### 3.1 Tracked Allergens (23 total)

| Group | Allergens |
|---|---|
| Grains & Legumes | Wheat, Soy, Peanut, Lentils, Chickpeas, White Beans |
| Tree Nuts | Almond, Cashew, Brazil Nut, Walnut, Pine Nut, Pecan, Pistachio, Hazelnut, Macadamia, Sesame |
| Animal Proteins | Dairy, Egg, Fish, Seafood |
| Fruits | Kiwi, Peach, Strawberry |

### 3.2 Reaction Severity Scale

| Level | Description | Color |
|---|---|---|
| `none` | No reaction observed | Green |
| `mild` | Minor symptoms: redness, fussiness, soft stool | Amber |
| `moderate` | Hives, vomiting, swelling | Orange |
| `severe` | Anaphylaxis indicators — seek emergency care immediately | Red |

> **Note**: If a parent logs `severe`, the app should display a prominent emergency reminder to call 911 / seek immediate care.

---

## 4. Data Schema

### ExposureLog

```ts
interface ExposureLog {
  id: string;           // Date.now().toString() — unique, sortable
  allergenId: string;   // e.g. "peanut", "dairy"
  date: string;         // "YYYY-MM-DD"
  reaction: "none" | "mild" | "moderate" | "severe";
  notes: string;        // free text, may be empty
  amount?: string;      // optional free text e.g. "1 tsp", "2 tbsp"
}
```

### localStorage Keys

| Key | Type | Description |
|---|---|---|
| `sprout:logs` | `ExposureLog[]` | All exposure records |
| `sprout:babyName` | `string` | Baby's display name |

All keys are namespaced with `sprout:` to avoid collisions.

---

## 5. Features

### 5.1 Home — Allergen Grid

- Allergens displayed as cards, grouped by category.
- Each group shows a `X/N introduced` counter.
- **Untried card**: dashed border, muted background, "Not yet introduced" label.
- **Tried card**: pastel background, last exposure date, last reaction badge, exposure count. Warning icon (⚠️) if any reaction was non-none.
- Tapping a card opens the **Allergen Detail** sheet.
- Header stat row shows: allergens tried (X/23), total exposures, total reactions (turns red if > 0).

### 5.2 Allergen Detail Sheet

- Shows full log history for one allergen, newest first.
- Each log entry: date, amount (if set), reaction badge, notes.
- Delete button (×) per log entry.
- "Log new exposure" shortcut button pre-fills the allergen in the log form.

### 5.3 Log Exposure Form

- Fields: allergen (dropdown), date (date picker, defaults to today), amount (text, optional), reaction (4-button selector), notes (textarea).
- Validation: allergen and date are required. Save is blocked if missing.
- On save: appends log to state, persists to localStorage, closes sheet.
- If `reaction === "severe"`: after saving, show an inline emergency banner: *"Severe reactions require immediate medical attention. Call 911 or go to the nearest emergency room."*

### 5.4 Timeline Tab

- All logs sorted newest-first.
- Visual thread connecting entries.
- Each entry shows: allergen emoji + name, date, reaction badge, amount, notes.
- Empty state with a friendly prompt to log the first exposure.

### 5.5 Baby Name

- Displayed in the header. Defaults to "My Baby".
- Tap to edit inline. Persisted to `sprout:babyName` on change.

---

## 6. PWA Requirements

| Requirement | Detail |
|---|---|
| Installable | `manifest.json` with `display: standalone`, name, icons |
| Offline capable | Service worker caches app shell and static assets |
| Icons | 192×192 and 512×512 PNG in `/public/icons/` |
| Theme color | `#fdf8f3` (matches app background) |
| Viewport | `width=device-width, initial-scale=1` |
| iOS support | `apple-mobile-web-app-capable` meta tag in `layout.tsx` |

---

## 7. Storage Behavior

- All reads are guarded for SSR: `typeof window === "undefined"` check returns a safe fallback.
- All writes happen immediately on state change — no debounce needed for this data volume.
- Parse errors (corrupted JSON) silently return empty arrays — never crash the app.
- No migration strategy needed for v1. If the schema changes in v2, a migration function will be added to `storage.ts`.

---

## 8. Accessibility

- All interactive elements are `<button>` or native form controls — keyboard navigable by default.
- Color is never the only differentiator: reaction badges include text labels.
- Tap targets are minimum 44×44px.
- `aria-label` on icon-only buttons (e.g. delete ×).
- Modal traps focus and restores it on close.

---

## 9. Out of Scope (v1)

- Cloud sync or multi-device support
- User accounts or authentication
- Multiple babies / profiles
- Photo attachments to logs
- Push notifications / reminders
- Export to PDF or CSV
- Sharing logs with a pediatrician
- Symptom detail capture beyond the four reaction levels

---

## 10. Future Considerations (v2+)

- **Export**: Generate a printable PDF summary for pediatrician visits.
- **Reminders**: Push notification to re-introduce an allergen every 1–2 weeks (per LEAP study protocol).
- **Multiple profiles**: Track siblings.
- **Sync**: Optional iCloud/Google Drive backup via File System Access API.
- **Reaction detail**: Capture specific symptoms (hives, vomiting, swelling, etc.) as checkboxes within a log.
