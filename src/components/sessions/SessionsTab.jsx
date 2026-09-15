import { useState } from "react";
import { normLoc } from "../../lib/stats";
import SessionForm from "./SessionForm";
import SessionRow from "./SessionRow";
import ReflectionWizard from "../reflection/ReflectionWizard";

export default function SessionsTab({ sessions, locations, onCreate, onUpdate, onDelete }) {
  const [locFilter, setLocFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reflectingSession, setReflectingSession] = useState(null);
  const [busy, setBusy] = useState(false);

  let list = sessions;
  if (locFilter !== "all") list = list.filter((s) => normLoc(s.location) === locFilter);
  list = [...list].sort((a, b) => {
    if (a.played_on !== b.played_on) return b.played_on.localeCompare(a.played_on);
    return (b.created_at || "").localeCompare(a.created_at || "");
  });

  async function handleCreate(fields) {
    setBusy(true);
    try {
      const created = await onCreate(fields);
      setShowAddForm(false);
      setReflectingSession(created);
    } finally {
      setBusy(false);
    }
  }

  async function handleReflectionSave(fields) {
    await onUpdate(reflectingSession.id, fields);
    setReflectingSession(null);
  }

  return (
    <main>
      <section className="pl-log-controls">
        <select className="pl-select" value={locFilter} onChange={(e) => setLocFilter(e.target.value)}>
          <option value="all">All locations</option>
          {locations.map((l) => (
            <option value={normLoc(l)} key={l}>
              {l}
            </option>
          ))}
        </select>
        <button className="pl-btn-primary" onClick={() => setShowAddForm((s) => !s)} type="button">
          {showAddForm ? "× Cancel" : "+ Log a session"}
        </button>
      </section>

      {showAddForm && (
        <SessionForm
          locations={locations}
          onCancel={() => setShowAddForm(false)}
          onSubmit={handleCreate}
          submitLabel={busy ? "Saving…" : "Save session"}
        />
      )}

      <section className="pl-list">
        {list.length === 0 && <p className="pl-empty">No sessions logged for this filter yet.</p>}
        {list.map((s) => (
          <SessionRow
            key={s.id}
            session={s}
            locations={locations}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onReopenReflection={setReflectingSession}
          />
        ))}
      </section>

      {reflectingSession && (
        <ReflectionWizard
          session={reflectingSession}
          onSave={handleReflectionSave}
          onSkip={() => setReflectingSession(null)}
        />
      )}
    </main>
  );
}
