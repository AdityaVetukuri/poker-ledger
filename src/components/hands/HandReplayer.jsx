import { useState } from "react";
import PokerTable from "./PokerTable";
import { STREETS, potByStreet, activeSeatsAtStreet, actionsForStreet, describeAction } from "../../lib/handEngine";

const STREET_LABELS = { preflop: "Preflop", flop: "Flop", turn: "Turn", river: "River" };

export default function HandReplayer({ hand }) {
  const [street, setStreet] = useState("preflop");
  const pots = potByStreet(hand.small_blind, hand.big_blind, hand.actions || []);
  const seats = hand.seats || [];
  const board = hand.board || {};

  const activeAtStreet = activeSeatsAtStreet(seats, hand.actions || [], street);
  const activeSeatNums = new Set(activeAtStreet.map((s) => s.seat));
  const foldedSeats = new Set(seats.filter((s) => !activeSeatNums.has(s.seat)).map((s) => s.seat));

  const availableStreets = STREETS.filter((s) => {
    if (s === "preflop") return true;
    if (s === "flop") return (board.flop || []).length === 3;
    if (s === "turn") return Boolean(board.turn);
    if (s === "river") return Boolean(board.river);
    return false;
  });

  return (
    <div className="pl-hand-replayer">
      <div className="pl-wizard-steps" style={{ marginBottom: 14 }}>
        {STREETS.map((s) => {
          const available = availableStreets.includes(s);
          return (
            <button
              type="button"
              key={s}
              className={`pl-street-tab ${street === s ? "active" : ""}`}
              disabled={!available}
              onClick={() => setStreet(s)}
            >
              {STREET_LABELS[s]}
            </button>
          );
        })}
      </div>

      <PokerTable seats={seats} board={board} pot={pots[street]} revealStreet={street} foldedSeats={foldedSeats} />

      <div className="pl-street-actions-list" style={{ marginTop: 14 }}>
        {actionsForStreet(hand.actions || [], street).length === 0 && (
          <p className="pl-panel-sub" style={{ margin: 0 }}>No actions logged for this street.</p>
        )}
        {actionsForStreet(hand.actions || [], street).map((a) => {
          const s = seats.find((x) => x.seat === a.seat);
          return (
            <div className="pl-street-action-row" key={a.order}>
              <span className="pl-street-action-seat">
                {s?.position || `Seat ${a.seat}`}
                {s?.is_hero ? " (You)" : ""}
              </span>
              <span className="pl-street-action-desc">{describeAction(a)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
