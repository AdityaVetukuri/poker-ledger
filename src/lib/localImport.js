const LEGACY_KEY = "poker_sessions_v1";

// The old static app stored { id, location, monthKey, monthLabel, amount, notes }.
// Map that into new-schema rows (new fields left blank), guessing a mid-month
// date since only a month was recorded.
export function readLegacySessions() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && s.location && s.monthKey)
      .map((s) => ({
        played_on: `${s.monthKey}-15`,
        location: String(s.location).trim(),
        game_type: "cash",
        amount: Number(s.amount) || 0,
        notes_leak: s.notes || null,
        tags: [],
      }));
  } catch {
    return [];
  }
}

export function clearLegacySessions() {
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
}
