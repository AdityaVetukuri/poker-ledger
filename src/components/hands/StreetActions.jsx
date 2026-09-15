import { useState } from "react";
import { ACTION_TYPES, actionsForStreet, nextOrder, describeAction } from "../../lib/handEngine";

const ACTION_LABELS = { post: "Post", fold: "Fold", check: "Check", call: "Call", bet: "Bet", raise: "Raise to", allin: "All-in" };

// One clearly-labeled row per player still active in the hand on this
// street, each with its own action/amount controls and a log of what
// they've already done this street (a seat can act more than once, e.g.
// check-raise, so "Log" appends rather than replacing).
export default function StreetActions({ street, seats, allActions, onChange, potBefore }) {
  const streetActions = actionsForStreet(allActions, street);

  function addAction(seatNum, action, amount) {
    const needsAmount = action !== "fold" && action !== "check";
    const entry = {
      street,
      seat: seatNum,
      action,
      amount: needsAmount ? Number(amount) || 0 : null,
      order: nextOrder(allActions, street),
    };
    onChange([...allActions, entry]);
  }

  function removeAction(order) {
    onChange(allActions.filter((a) => !(a.street === street && a.order === order)));
  }

  if (!seats.length) {
    return <p className="pl-panel-sub" style={{ margin: 0 }}>No players still in the hand by this street.</p>;
  }

  return (
    <div className="pl-street-actions">
      <p className="pl-panel-sub" style={{ margin: "0 0 10px" }}>
        Pot entering this street: {potBefore}bb. {seats.length} player{seats.length === 1 ? "" : "s"} still in — log
        each one's action below (amounts are total chips put in for that action).
      </p>
      <div className="pl-seat-action-rows">
        {seats.map((seat) => (
          <SeatActionRow
            key={seat.seat}
            seat={seat}
            loggedActions={streetActions.filter((a) => a.seat === seat.seat)}
            onAdd={(action, amount) => addAction(seat.seat, action, amount)}
            onRemove={removeAction}
          />
        ))}
      </div>
    </div>
  );
}

function SeatActionRow({ seat, loggedActions, onAdd, onRemove }) {
  const [action, setAction] = useState("call");
  const [amount, setAmount] = useState("");
  const needsAmount = action !== "fold" && action !== "check";

  return (
    <div className={`pl-seat-action-row ${seat.is_hero ? "hero" : ""}`}>
      <div className="pl-seat-action-top">
        <span className="pl-seat-action-name">
          {seat.position}
          {seat.is_hero ? " (You)" : ""}
        </span>
        <select className="pl-select" value={action} onChange={(e) => setAction(e.target.value)}>
          {ACTION_TYPES.map((t) => (
            <option value={t} key={t}>
              {ACTION_LABELS[t]}
            </option>
          ))}
        </select>
        {needsAmount && (
          <input
            type="number"
            className="pl-street-amount"
            placeholder="bb"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}
        <button
          type="button"
          className="pl-btn-small"
          onClick={() => {
            onAdd(action, amount);
            setAmount("");
          }}
        >
          + Log
        </button>
      </div>
      {loggedActions.length > 0 && (
        <div className="pl-seat-action-log">
          {loggedActions.map((a) => (
            <span className="pl-seat-action-tag" key={a.order}>
              {describeAction(a)}
              <button type="button" onClick={() => onRemove(a.order)}>
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
