import { fmtMoney } from "../../lib/stats";
import { dailyCumulativeSeries } from "../../lib/timeSeries";
import RobinhoodChart from "./RobinhoodChart";
import MonthlyChart from "./MonthlyChart";

export default function Overview({ stats, sessions }) {
  if (!stats) {
    return (
      <main>
        <p className="pl-empty">
          No sessions yet — log your first one in the Session log tab to see
          your stats here.
        </p>
      </main>
    );
  }

  const maxAbsLoc = Math.max(...stats.locArr.map((l) => Math.abs(l.total)), 1);
  const series = dailyCumulativeSeries(sessions);

  return (
    <main>
      <RobinhoodChart series={series} />
      <p className="pl-rh-caption">
        {stats.total} sessions &middot; {stats.wins} winning &middot; {stats.losses} losing &middot;{" "}
        {stats.total - stats.wins - stats.losses} even
      </p>

      <section className="pl-stat-grid">
        <div className="pl-stat-card">
          <span className="pl-stat-label">Win rate</span>
          <span className="pl-stat-value">{stats.winRate.toFixed(0)}%</span>
        </div>
        <div className="pl-stat-card">
          <span className="pl-stat-label">Average session</span>
          <span className={`pl-stat-value ${stats.avg >= 0 ? "win" : "loss"}`}>{fmtMoney(stats.avg)}</span>
        </div>
        <div className="pl-stat-card">
          <span className="pl-stat-label">Best month</span>
          <span className="pl-stat-value win">{stats.bestMonth.label}</span>
          <span className="pl-stat-footnote win">{fmtMoney(stats.bestMonth.monthTotal, true)}</span>
        </div>
        <div className="pl-stat-card">
          <span className="pl-stat-label">Toughest month</span>
          <span className="pl-stat-value loss">{stats.worstMonth.label}</span>
          <span className="pl-stat-footnote loss">{fmtMoney(stats.worstMonth.monthTotal, true)}</span>
        </div>
        <div className="pl-stat-card">
          <span className="pl-stat-label">Best single session</span>
          <span className="pl-stat-value win">{fmtMoney(stats.bestSession.amount, true)}</span>
          <span className="pl-stat-footnote">
            {stats.bestSession.location} &middot; {stats.bestSession.played_on}
          </span>
        </div>
        <div className="pl-stat-card">
          <span className="pl-stat-label">Worst single session</span>
          <span className="pl-stat-value loss">{fmtMoney(stats.worstSession.amount, true)}</span>
          <span className="pl-stat-footnote">
            {stats.worstSession.location} &middot; {stats.worstSession.played_on}
          </span>
        </div>
      </section>

      <MonthlyChart cumulative={stats.cumulative} />

      <section className="pl-panel">
        <h2>Where you play</h2>
        <div className="pl-loc-list">
          {stats.locArr.map((l) => (
            <div className="pl-loc-row" key={l.display}>
              <div className="pl-loc-meta">
                <span className="pl-loc-name">{l.display}</span>
                <span className="pl-loc-count">
                  {l.count} session{l.count === 1 ? "" : "s"}
                </span>
              </div>
              <div className="pl-loc-bar-track">
                <div
                  className={`pl-loc-bar ${l.total >= 0 ? "win" : "loss"}`}
                  style={{
                    width: `${Math.max((Math.abs(l.total) / maxAbsLoc) * 100, 3)}%`,
                    background: l.total >= 0 ? "var(--win)" : "var(--loss)",
                  }}
                />
              </div>
              <span className={`pl-loc-total ${l.total >= 0 ? "win" : "loss"}`}>{fmtMoney(l.total, true)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
