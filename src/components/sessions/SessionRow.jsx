import { useState } from "react";
import { fmtMoney } from "../../lib/stats";
import SessionForm from "./SessionForm";

export default function SessionRow({ session: s, locations, onUpdate, onDelete, onReopenReflection }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  const hasReflection = s.notes_good || s.notes_leak || s.notes_action || s.notes_villains || (s.tags || []).length;

  if (editing) {
    return (
      <div className="pl-row">
        <SessionForm
          initial={s}
          locations={locations}
          submitLabel="Save changes"
          onCancel={() => setEditing(false)}
          onSubmit={(fields) => {
            onUpdate(s.id, fields);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="pl-row">
      <button className="pl-row-head" onClick={() => setExpanded((e) => !e)} type="button">
        <span className="pl-row-month">{s.played_on}</span>
        <span className="pl-row-location">{s.location}</span>
        {hasReflection ? <span className="pl-note-flag">&#9998;</span> : <span></span>}
        <span className={`pl-row-amount ${s.amount >= 0 ? "win" : "loss"}`}>{fmtMoney(s.amount, true)}</span>
        <span className={`pl-chevron ${expanded ? "open" : ""}`}>&#9660;</span>
      </button>

      {expanded && (
        <div className="pl-row-body">
          <div className="pl-detail-grid">
            {s.game_type && <span className="pl-detail-tag">{s.game_type === "tournament" ? "Tournament" : "Cash"}</span>}
            {s.variant && <span className="pl-detail-tag">{s.variant}</span>}
            {s.stakes && <span className="pl-detail-tag">{s.stakes}</span>}
            {s.table_size && <span className="pl-detail-tag">{s.table_size}-max</span>}
            {s.duration_minutes ? <span className="pl-detail-tag">{s.duration_minutes} min</span> : null}
            {s.tilt_rating ? <span className="pl-detail-tag">Mental game: {s.tilt_rating}/5</span> : null}
          </div>

          {(s.tags || []).length > 0 && (
            <div className="pl-tag-chips" style={{ marginBottom: 10 }}>
              {s.tags.map((t) => (
                <span className="pl-chip active" key={t}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {s.notes_good && (
            <p className="pl-note-block">
              <strong>Went well:</strong> {s.notes_good}
            </p>
          )}
          {s.notes_leak && (
            <p className="pl-note-block">
              <strong>Leak:</strong> {s.notes_leak}
            </p>
          )}
          {s.notes_action && (
            <p className="pl-note-block">
              <strong>Next time:</strong> {s.notes_action}
            </p>
          )}
          {s.notes_villains && (
            <p className="pl-note-block">
              <strong>Reads:</strong> {s.notes_villains}
            </p>
          )}

          <div className="pl-row-actions">
            <button className="pl-btn-small ghost" onClick={() => setEditing(true)} type="button">
              Edit
            </button>
            {!hasReflection && (
              <button className="pl-btn-small ghost" onClick={() => onReopenReflection(s)} type="button">
                Add reflection
              </button>
            )}
            <button className="pl-btn-small danger" onClick={() => onDelete(s.id)} type="button">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
