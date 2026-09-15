import { fmtMoney } from "../../lib/stats";
import { tagCategory } from "../../lib/leakTags";

export default function LeakBoard({ tagArr }) {
  if (!tagArr.length) {
    return (
      <section className="pl-panel">
        <h2>Leak frequency</h2>
        <p className="pl-empty">
          No tagged leaks yet — tag them in the reflection wizard after a session, or when editing one, and
          they'll show up here.
        </p>
      </section>
    );
  }

  const maxCount = Math.max(...tagArr.map((t) => t.count), 1);

  return (
    <section className="pl-panel">
      <h2>Leak frequency &amp; cost</h2>
      <p className="pl-panel-sub">Tags you've applied to sessions, ranked by how often they show up. Red = that leak is, on average, costing you money.</p>
      <div className="pl-loc-list">
        {tagArr.map((t) => (
          <div className="pl-loc-row" key={t.tag}>
            <div className="pl-loc-meta">
              <span className="pl-loc-name">{t.tag}</span>
              <span className="pl-loc-count">
                {tagCategory(t.tag)} &middot; {t.count} session{t.count === 1 ? "" : "s"}
              </span>
            </div>
            <div className="pl-loc-bar-track">
              <div
                className="pl-loc-bar"
                style={{
                  width: `${Math.max((t.count / maxCount) * 100, 3)}%`,
                  background: t.avgAmount >= 0 ? "var(--win)" : "var(--loss)",
                }}
              />
            </div>
            <span className={`pl-loc-total ${t.avgAmount >= 0 ? "win" : "loss"}`}>
              {fmtMoney(t.avgAmount, true)} avg
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
