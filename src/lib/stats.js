const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function monthKeyFromDate(playedOn) {
  return playedOn ? playedOn.slice(0, 7) : ""; // "YYYY-MM-DD" -> "YYYY-MM"
}

export function monthKeyToLabel(key) {
  if (!key) return "";
  const [y, m] = key.split("-");
  const idx = parseInt(m, 10) - 1;
  return `${MONTH_NAMES[idx] || m} ${y}`;
}

export function fmtMoney(n, showPlus) {
  const val = Math.round(n);
  const sign = val < 0 ? "-" : showPlus ? "+" : "";
  return `${sign}$${Math.abs(val).toLocaleString("en-US")}`;
}

export function normLoc(loc) {
  return (loc || "").trim().toLowerCase().replace(/\s+/g, " ");
}

// ---------- overview (bankroll / by-month / by-location) ----------
export function computeOverviewStats(sessions) {
  if (!sessions.length) return null;

  const net = sessions.reduce((s, x) => s + Number(x.amount), 0);
  const wins = sessions.filter((s) => s.amount > 0).length;
  const losses = sessions.filter((s) => s.amount < 0).length;
  const winRate = (wins / sessions.length) * 100;
  const avg = net / sessions.length;

  const byMonth = {};
  sessions.forEach((s) => {
    const k = monthKeyFromDate(s.played_on);
    byMonth[k] = (byMonth[k] || 0) + Number(s.amount);
  });
  const monthKeys = Object.keys(byMonth).sort();
  let running = 0;
  const cumulative = monthKeys.map((k) => {
    running += byMonth[k];
    return {
      monthKey: k,
      label: monthKeyToLabel(k),
      monthTotal: byMonth[k],
      cumulative: running,
    };
  });
  const bestMonth = cumulative.reduce(
    (a, b) => (b.monthTotal > a.monthTotal ? b : a),
    cumulative[0]
  );
  const worstMonth = cumulative.reduce(
    (a, b) => (b.monthTotal < a.monthTotal ? b : a),
    cumulative[0]
  );

  const byLoc = {};
  sessions.forEach((s) => {
    const key = normLoc(s.location);
    if (!byLoc[key]) byLoc[key] = { display: (s.location || "").trim(), total: 0, count: 0 };
    byLoc[key].total += Number(s.amount);
    byLoc[key].count += 1;
  });
  const locArr = Object.values(byLoc).sort((a, b) => b.total - a.total);

  const bestSession = sessions.reduce((a, b) => (b.amount > a.amount ? b : a), sessions[0]);
  const worstSession = sessions.reduce((a, b) => (b.amount < a.amount ? b : a), sessions[0]);

  return {
    net, wins, losses, winRate, avg, cumulative, bestMonth, worstMonth,
    locArr, bestSession, worstSession, total: sessions.length,
  };
}

export function getLocations(sessions) {
  const seen = new Map();
  sessions.forEach((s) => {
    const key = normLoc(s.location);
    if (!seen.has(key)) seen.set(key, (s.location || "").trim());
  });
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

// ---------- leak / reflection analytics ----------
export function computeLeakStats(sessions) {
  const tagStats = {}; // tag -> { count, totalAmount }
  sessions.forEach((s) => {
    (s.tags || []).forEach((tag) => {
      if (!tagStats[tag]) tagStats[tag] = { tag, count: 0, totalAmount: 0 };
      tagStats[tag].count += 1;
      tagStats[tag].totalAmount += Number(s.amount);
    });
  });
  const tagArr = Object.values(tagStats)
    .map((t) => ({ ...t, avgAmount: t.totalAmount / t.count }))
    .sort((a, b) => b.count - a.count);

  // Result vs tilt rating (1-5): average session result at each rating.
  const tiltBuckets = [1, 2, 3, 4, 5].map((rating) => {
    const withRating = sessions.filter((s) => s.tilt_rating === rating);
    const total = withRating.reduce((sum, s) => sum + Number(s.amount), 0);
    return {
      rating,
      count: withRating.length,
      avgAmount: withRating.length ? total / withRating.length : null,
    };
  });

  const actionItems = sessions
    .filter((s) => s.notes_action)
    .sort((a, b) => (b.played_on || "").localeCompare(a.played_on || ""))
    .slice(0, 12)
    .map((s) => ({
      id: s.id,
      playedOn: s.played_on,
      location: s.location,
      action: s.notes_action,
    }));

  return { tagArr, tiltBuckets, actionItems, taggedSessionCount: sessions.filter((s) => (s.tags || []).length).length };
}
