import { useState } from "react";
import PlayingCard from "../cards/PlayingCard";
import HandReplayer from "./HandReplayer";
import HandForm from "./HandForm";
import { fmtMoney } from "../../lib/stats";

export default function HandRow({ hand, sessions, sessionLabel, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const heroSeat = (hand.seats || []).find((s) => s.is_hero);

  if (editing) {
    return (
      <div className="pl-row">
        <HandForm
          sessions={sessions}
          initial={hand}
          submitLabel="Save changes"
          onCancel={() => setEditing(false)}
          onSubmit={(fields) => {
            onUpdate(hand.id, fields);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="pl-row">
      <button className="pl-row-head pl-hand-row-head" onClick={() => setExpanded((e) => !e)} type="button">
        <span className="pl-hand-row-cards">
          {(heroSeat?.cards || []).map((c, i) => (
            <PlayingCard key={i} card={c} size="xs" />
          ))}
        </span>
        <span className="pl-row-location">{hand.title || `${heroSeat?.position || ""} · ${hand.table_size}-max`}</span>
        <span className="pl-panel-sub" style={{ margin: 0 }}>{sessionLabel}</span>
        {hand.result != null && (
          <span className={`pl-row-amount ${hand.result >= 0 ? "win" : "loss"}`}>{fmtMoney(hand.result, true)}</span>
        )}
        <span className={`pl-chevron ${expanded ? "open" : ""}`}>&#9660;</span>
      </button>

      {expanded && (
        <div className="pl-row-body">
          <HandReplayer hand={hand} />
          {hand.notes && (
            <p className="pl-note-block">
              <strong>Notes:</strong> {hand.notes}
            </p>
          )}
          {(hand.tags || []).length > 0 && (
            <div className="pl-tag-chips" style={{ marginTop: 10 }}>
              {hand.tags.map((t) => (
                <span className="pl-chip active" key={t}>
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="pl-row-actions">
            <button className="pl-btn-small ghost" onClick={() => setEditing(true)} type="button">
              Edit
            </button>
            <button className="pl-btn-small danger" onClick={() => onDelete(hand.id)} type="button">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
