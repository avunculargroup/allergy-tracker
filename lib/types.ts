export type ReactionLevel = "none" | "mild" | "moderate" | "severe";

export interface ExposureLog {
  id: string;
  allergenId: string;
  date: string;
  reaction: ReactionLevel;
  notes: string;
  amount?: string;
}

export interface Allergen {
  id: string;
  label: string;
  emoji: string;
  color: string;
  group: AllergenGroupId;
}

export type AllergenGroupId = "grains" | "nuts" | "animal" | "fruit";

export interface AllergenGroup {
  id: AllergenGroupId;
  label: string;
}
