// Standard position names in action order (first-to-act preflop first),
// ending in BTN, SB, BB, for each table size from heads-up to 10-max.
const POSITION_SETS = {
  2: ["BTN/SB", "BB"],
  3: ["BTN", "SB", "BB"],
  4: ["CO", "BTN", "SB", "BB"],
  5: ["HJ", "CO", "BTN", "SB", "BB"],
  6: ["UTG", "HJ", "CO", "BTN", "SB", "BB"],
  7: ["UTG", "UTG+1", "HJ", "CO", "BTN", "SB", "BB"],
  8: ["UTG", "UTG+1", "MP", "HJ", "CO", "BTN", "SB", "BB"],
  9: ["UTG", "UTG+1", "UTG+2", "MP", "HJ", "CO", "BTN", "SB", "BB"],
  10: ["UTG", "UTG+1", "UTG+2", "MP1", "MP2", "HJ", "CO", "BTN", "SB", "BB"],
};

export function positionsForTableSize(tableSize) {
  return POSITION_SETS[tableSize] || POSITION_SETS[9];
}

// Builds a default seat list for a table size, seat 1 = hero at the given
// position (defaults to BTN, the most common hero-position default).
export function defaultSeats(tableSize, heroPosition, startingStackBb) {
  const positions = positionsForTableSize(tableSize);
  const heroIdx = Math.max(positions.indexOf(heroPosition), 0);
  return positions.map((pos, i) => ({
    seat: i + 1,
    position: pos,
    stack: startingStackBb ?? 100,
    is_hero: i === heroIdx,
    cards: null,
  }));
}

export function seatLabel(seat) {
  return `Seat ${seat.seat} – ${seat.position}${seat.is_hero ? " (You)" : ""}`;
}

// Lays seats out around an oval table (percentages within a wrapping box),
// rotated so the hero always sits at the bottom-center — the natural "your
// seat" view for a hand replayer.
export function seatLayout(seats) {
  const total = seats.length || 1;
  const heroIndex = Math.max(seats.findIndex((s) => s.is_hero), 0);
  const baseAngle = (i) => -90 + (360 / total) * i;
  const offset = 90 - baseAngle(heroIndex);
  return seats.map((seat, i) => {
    const angleDeg = baseAngle(i) + offset;
    const rad = (angleDeg * Math.PI) / 180;
    const xPct = 50 + 42 * Math.cos(rad);
    const yPct = 50 + 40 * Math.sin(rad);
    return { ...seat, xPct, yPct };
  });
}
