import { Allergen, AllergenGroup, ReactionLevel } from "./types";

export const ALLERGENS: Allergen[] = [
  // Grains & Legumes
  { id: "wheat", label: "Wheat", emoji: "🌾", color: "#fef3c7", group: "grains" },
  { id: "soy", label: "Soy", emoji: "🫘", color: "#d1fae5", group: "grains" },
  { id: "peanut", label: "Peanut", emoji: "🥜", color: "#fde68a", group: "grains" },
  { id: "lentils", label: "Lentils", emoji: "🟤", color: "#fecaca", group: "grains" },
  { id: "chickpeas", label: "Chickpeas", emoji: "🫛", color: "#fed7aa", group: "grains" },
  { id: "whitebeans", label: "White Beans", emoji: "⬜", color: "#e0f2fe", group: "grains" },
  // Tree Nuts
  { id: "almond", label: "Almond", emoji: "🌰", color: "#fde68a", group: "nuts" },
  { id: "cashew", label: "Cashew", emoji: "🥔", color: "#fef3c7", group: "nuts" },
  { id: "brazilnut", label: "Brazil Nut", emoji: "🌰", color: "#d1fae5", group: "nuts" },
  { id: "walnut", label: "Walnut", emoji: "🪨", color: "#fee2e2", group: "nuts" },
  { id: "pinenut", label: "Pine Nut", emoji: "🌿", color: "#dcfce7", group: "nuts" },
  { id: "pecan", label: "Pecan", emoji: "🍂", color: "#fef9c3", group: "nuts" },
  { id: "pistachio", label: "Pistachio", emoji: "🟢", color: "#d1fae5", group: "nuts" },
  { id: "hazelnut", label: "Hazelnut", emoji: "🌰", color: "#fef3c7", group: "nuts" },
  { id: "macadamia", label: "Macadamia", emoji: "⚪", color: "#faf5ff", group: "nuts" },
  { id: "sesame", label: "Sesame", emoji: "🌱", color: "#ecfccb", group: "nuts" },
  // Animal Proteins
  { id: "dairy", label: "Dairy", emoji: "🥛", color: "#f0f9ff", group: "animal" },
  { id: "egg", label: "Egg", emoji: "🥚", color: "#fef9c3", group: "animal" },
  { id: "fish", label: "Fish", emoji: "🐟", color: "#e0f2fe", group: "animal" },
  { id: "seafood", label: "Seafood", emoji: "🦐", color: "#fce7f3", group: "animal" },
  // Fruits
  { id: "kiwi", label: "Kiwi", emoji: "🥝", color: "#d1fae5", group: "fruit" },
  { id: "peach", label: "Peach", emoji: "🍑", color: "#fed7aa", group: "fruit" },
  { id: "strawberry", label: "Strawberry", emoji: "🍓", color: "#fee2e2", group: "fruit" },
];

export const ALLERGEN_GROUPS: AllergenGroup[] = [
  { id: "grains", label: "Grains & Legumes" },
  { id: "nuts", label: "Tree Nuts" },
  { id: "animal", label: "Animal Proteins" },
  { id: "fruit", label: "Fruits" },
];

export const REACTIONS: { level: ReactionLevel; label: string; color: string }[] = [
  { level: "none", label: "None", color: "#4ade80" },
  { level: "mild", label: "Mild", color: "#fbbf24" },
  { level: "moderate", label: "Moderate", color: "#fb923c" },
  { level: "severe", label: "Severe", color: "#f87171" },
];
