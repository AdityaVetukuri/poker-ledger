// Pure helpers for turning a hand's { seats, actions } into pot sizes and
// who's still in the hand at each point. Kept deliberately simple: every
// action's `amount` is "chips this action put into the pot" (so a raise's
// amount is the total the player puts in for that action, not an
// increment) — this is the least ambiguous convention to fill in by hand
// and is documented in the action-entry UI.

export const STREETS = ["preflop", "flop", "turn", "river"];
export const ACTION_TYPES = ["post", "fold", "check", "call", "bet", "raise", "allin"];

// Running pot after each street: { preflop, flop, turn, river } — pot size
// once all action on that street is complete (so `flop` here is the pot
// that carries into the turn, etc).
export function potByStreet(smallBlind, bigBlind, actions) {
  let pot = (Number(smallBlind) || 0) + (Number(bigBlind) || 0);
  const result = {};
  STREETS.forEach((street) => {
    const streetActions = actions
      .filter((a) => a.street === street)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    streetActions.forEach((a) => {
      if (a.amount) pot += Number(a.amount) || 0;
    });
    result[street] = pot;
  });
  return result;
}

// Seats still in the hand as of `street`. Preflop, everyone dealt a hand is
// in. For every later street, a seat only carries forward if it logged a
// non-fold action on the *immediately preceding* street — so a seat you
// never gave an action to (rather than one you explicitly folded) still
// correctly drops off, and the seat list narrows down on its own as you
// build out the hand instead of showing every seat on every street.
export function activeSeatsAtStreet(seats, actions, street) {
  const streetIdx = STREETS.indexOf(street);
  if (streetIdx <= 0) return seats;

  const prevActions = actionsForStreet(actions, STREETS[streetIdx - 1]);
  const foldedPrev = new Set(prevActions.filter((a) => a.action === "fold").map((a) => a.seat));
  const actedPrev = new Set(prevActions.map((a) => a.seat));

  return seats.filter((s) => actedPrev.has(s.seat) && !foldedPrev.has(s.seat));
}

export function actionsForStreet(actions, street) {
  return actions
    .filter((a) => a.street === street)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function nextOrder(actions, street) {
  const streetActions = actionsForStreet(actions, street);
  return streetActions.length ? Math.max(...streetActions.map((a) => a.order ?? 0)) + 1 : 1;
}

export function describeAction(a) {
  const verb = { post: "posts", fold: "folds", check: "checks", call: "calls", bet: "bets", raise: "raises to", allin: "all-in" }[a.action] || a.action;
  return a.amount ? `${verb} ${a.amount}` : verb;
}
