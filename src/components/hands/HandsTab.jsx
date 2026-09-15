import { useState } from "react";
import HandForm from "./HandForm";
import HandRow from "./HandRow";

export default function HandsTab({ hands, sessions, onCreate, onUpdate, onDelete }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [sessionFilter, setSessionFilter] = useState("all");
  const [busy, setBusy] = useState(false);

  const sessionLabel = (id) => {
    const s = sessions.find((x) => x.id === id);
    return s ? `${s.played_on} · ${s.location}` : "";
  };

  let list = hands;
  if (sessionFilter !== "all") list = list.filter((h) => h.session_id === sessionFilter);

  async function handleCreate(fields) {
    setBusy(true);
    try {
      await onCreate(fields);
      setShowAddForm(false);
    } finally {
      setBusy(false);
    }
  }

  if (!sessions.length) {
    return (
      <main>
        <p className="pl-empty">Log a session first — hands need to be attached to one.</p>
      </main>
    );
  }

  return (
    <main>
      <section className="pl-log-controls">
        <select className="pl-select" value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)}>
          <option value="all">All sessions</option>
          {sessions.map((s) => (
            <option value={s.id} key={s.id}>
              {s.played_on} &ndash; {s.location}
            </option>
          ))}
        </select>
        <button className="pl-btn-primary" onClick={() => setShowAddForm((s) => !s)} type="button">
          {showAddForm ? "× Cancel" : "+ Log a hand"}
        </button>
      </section>

      {showAddForm && (
        <HandForm
          sessions={sessions}
          onCancel={() => setShowAddForm(false)}
          onSubmit={handleCreate}
          submitLabel={busy ? "Saving…" : "Save hand"}
        />
      )}

      <section className="pl-list">
        {list.length === 0 && <p className="pl-empty">No hands logged yet.</p>}
        {list.map((h) => (
          <HandRow
            key={h.id}
            hand={h}
            sessions={sessions}
            sessionLabel={sessionLabel(h.session_id)}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </section>
    </main>
  );
}
