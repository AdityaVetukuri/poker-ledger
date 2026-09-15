// Fixed-but-extensible leak taxonomy. Users can also type a custom tag in
// the reflection wizard; anything not in this list still gets stored and
// shown in the analysis tab, just without a category grouping.
export const LEAK_TAG_CATEGORIES = [
  {
    category: "Preflop",
    tags: [
      "Played too loose preflop",
      "Played too tight preflop",
      "Ignored position",
      "Called a 3-bet too wide",
    ],
  },
  {
    category: "Postflop",
    tags: [
      "Missed value bets",
      "Over-bluffed",
      "Under-bluffed",
      "Bad bet sizing",
      "Called too wide",
      "Folded too much to aggression",
    ],
  },
  {
    category: "Mental game",
    tags: [
      "Tilted after a bad beat",
      "Played tired or distracted",
      "Stayed too long, should have quit",
    ],
  },
  {
    category: "Game selection",
    tags: ["Bad table or seat selection", "Stakes too high for bankroll"],
  },
];

export const ALL_LEAK_TAGS = LEAK_TAG_CATEGORIES.flatMap((c) => c.tags);

export function tagCategory(tag) {
  const found = LEAK_TAG_CATEGORIES.find((c) => c.tags.includes(tag));
  return found ? found.category : "Other";
}
