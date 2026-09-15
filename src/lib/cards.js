// Card notation: rank + suit, e.g. "Ah", "Td", "2c". Suits: s h d c.
export const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
export const SUITS = ["s", "h", "d", "c"];

export const SUIT_SYMBOL = { s: "♠", h: "♥", d: "♦", c: "♣" };
export const SUIT_COLOR = { s: "black", h: "red", d: "red", c: "black" };

export function fullDeck() {
  const deck = [];
  for (const r of RANKS) for (const s of SUITS) deck.push(r + s);
  return deck;
}

export function rankOf(card) {
  return card ? card[0] : "";
}
export function suitOf(card) {
  return card ? card[1] : "";
}

// Collects every card already in use across the hand (hero + any known
// villain hole cards, plus the board) so the card picker can grey them out.
export function usedCards({ seats = [], board = {} }) {
  const used = new Set();
  seats.forEach((s) => (s.cards || []).forEach((c) => c && used.add(c)));
  (board.flop || []).forEach((c) => c && used.add(c));
  if (board.turn) used.add(board.turn);
  if (board.river) used.add(board.river);
  return used;
}
