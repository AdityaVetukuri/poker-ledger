export default function ActionItems({ actionItems }) {
  return (
    <section className="pl-panel">
      <h2>Things to work on</h2>
      <p className="pl-panel-sub">Pulled from your last few reflections, most recent first.</p>
      {actionItems.length === 0 ? (
        <p className="pl-empty">No action items yet — the reflection wizard's "next step" answers land here.</p>
      ) : (
        <ul className="pl-action-list">
          {actionItems.map((a) => (
            <li key={a.id} className="pl-action-item">
              <span className="pl-action-meta">
                {a.playedOn} &middot; {a.location}
              </span>
              <span className="pl-action-text">{a.action}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
