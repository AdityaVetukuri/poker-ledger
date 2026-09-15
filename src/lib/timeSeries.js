// Turns the session list into a running cumulative-bankroll series (one
// point per session, chronological), plus range-slicing for a
// Robinhood-style chart: pick a window, get the points in it and the
// baseline value right before the window started (for the $ delta).

export const RANGE_KEYS = ["1M", "3M", "6M", "YTD", "1Y", "ALL"];

export function dailyCumulativeSeries(sessions) {
  // Defensive: played_on/amount are required by the DB schema, but a row
  // sourced from somewhere less trustworthy than the normal form (a bad
  // import, hand-edited data) missing either shouldn't be able to crash
  // the whole Overview tab — skip it instead.
  const usable = sessions.filter((s) => s.played_on && s.amount != null);
  const sorted = [...usable].sort((a, b) => a.played_on.localeCompare(b.played_on));
  let running = 0;
  return sorted.map((s) => {
    running += Number(s.amount);
    return { date: s.played_on, value: running, location: s.location, amount: Number(s.amount) };
  });
}

function cutoffFor(rangeKey, lastDate) {
  const d = new Date(lastDate.getTime());
  switch (rangeKey) {
    case "1M":
      d.setMonth(d.getMonth() - 1);
      return d;
    case "3M":
      d.setMonth(d.getMonth() - 3);
      return d;
    case "6M":
      d.setMonth(d.getMonth() - 6);
      return d;
    case "1Y":
      d.setFullYear(d.getFullYear() - 1);
      return d;
    case "YTD":
      return new Date(lastDate.getFullYear(), 0, 1);
    case "ALL":
    default:
      return null;
  }
}

export function seriesForRange(series, rangeKey) {
  if (!series.length) return { points: [], startValue: 0, endValue: 0, delta: 0 };
  const endValue = series[series.length - 1].value;
  const lastDate = new Date(series[series.length - 1].date + "T00:00:00");
  const cutoff = cutoffFor(rangeKey, lastDate);

  let startIdx = 0;
  if (cutoff) {
    startIdx = series.findIndex((p) => new Date(p.date + "T00:00:00") >= cutoff);
    if (startIdx === -1) startIdx = series.length - 1;
  }
  const startValue = startIdx > 0 ? series[startIdx - 1].value : 0;
  const points = series.slice(startIdx);
  return { points, startValue, endValue, delta: endValue - startValue };
}

export function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
