// Target fields a spreadsheet column can be mapped to. `required: true` on
// at least played_on/location/amount (or buy_in+cash_out) is enforced at
// import time, not here.
export const TARGET_FIELDS = [
  { key: "ignore", label: "Ignore this column" },
  { key: "played_on", label: "Date" },
  { key: "location", label: "Location" },
  { key: "game_type", label: "Game type (cash/tournament)" },
  { key: "variant", label: "Variant (NLH, PLO…)" },
  { key: "stakes", label: "Stakes" },
  { key: "table_size", label: "Table size" },
  { key: "buy_in", label: "Buy-in ($)" },
  { key: "cash_out", label: "Cash-out ($)" },
  { key: "amount", label: "Result ($)" },
  { key: "duration_minutes", label: "Duration (minutes)" },
  { key: "notes_leak", label: "Notes" },
];

// Header text -> guessed target field, matched case/space/punct-insensitively.
const GUESS_MAP = {
  date: "played_on",
  playedon: "played_on",
  session: "played_on",
  month: "played_on",
  location: "location",
  where: "location",
  venue: "location",
  game: "game_type",
  gametype: "game_type",
  type: "game_type",
  variant: "variant",
  format: "variant",
  stakes: "stakes",
  blinds: "stakes",
  tablesize: "table_size",
  seats: "table_size",
  buyin: "buy_in",
  cashout: "cash_out",
  result: "amount",
  amount: "amount",
  net: "amount",
  profit: "amount",
  pnl: "amount",
  winloss: "amount",
  duration: "duration_minutes",
  minutes: "duration_minutes",
  length: "duration_minutes",
  notes: "notes_leak",
  note: "notes_leak",
  comments: "notes_leak",
};

function slug(s) {
  return String(s || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function guessMapping(headers) {
  return headers.map((h) => GUESS_MAP[slug(h)] || "ignore");
}

// Reads the file (xlsx, xls, or csv) and returns { headers, rows } where
// rows are arrays of raw cell values aligned to headers.
export async function parseSheetFile(file) {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const workbook = XLSX.read(buf, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const grid = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });
  if (!grid.length) return { headers: [], rows: [] };
  const [headers, ...rows] = grid;
  return { headers: headers.map(String), rows: rows.filter((r) => r.some((c) => c !== "" && c != null)) };
}

function toDateString(value) {
  if (value instanceof Date && !isNaN(value)) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }
  const s = String(value || "").trim();
  if (!s) return null;
  // Already YYYY-MM or YYYY-MM-DD
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(s)) return s.length === 7 ? `${s}-15` : s;
  const parsed = new Date(s);
  if (!isNaN(parsed)) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
  }
  return null;
}

function toNumber(value) {
  if (value === "" || value == null) return null;
  const n = parseFloat(String(value).replace(/[$,]/g, ""));
  return isNaN(n) ? null : n;
}

// Builds { rows, errors } — rows are ready for bulkInsertSessions; errors
// are { rowIndex, message } for rows that couldn't be used.
export function buildSessionRows(headers, rawRows, mapping) {
  const colIndexFor = (field) => mapping.findIndex((m) => m === field);
  const idx = {
    played_on: colIndexFor("played_on"),
    location: colIndexFor("location"),
    game_type: colIndexFor("game_type"),
    variant: colIndexFor("variant"),
    stakes: colIndexFor("stakes"),
    table_size: colIndexFor("table_size"),
    buy_in: colIndexFor("buy_in"),
    cash_out: colIndexFor("cash_out"),
    amount: colIndexFor("amount"),
    duration_minutes: colIndexFor("duration_minutes"),
    notes_leak: colIndexFor("notes_leak"),
  };

  const rows = [];
  const errors = [];

  rawRows.forEach((raw, i) => {
    const get = (key) => (idx[key] >= 0 ? raw[idx[key]] : "");

    const played_on = toDateString(get("played_on"));
    const location = String(get("location") || "").trim();
    let amount = toNumber(get("amount"));
    const buy_in = toNumber(get("buy_in"));
    const cash_out = toNumber(get("cash_out"));
    if (amount == null && buy_in != null && cash_out != null) amount = cash_out - buy_in;

    if (!played_on) return errors.push({ rowIndex: i, message: "Missing or unreadable date" });
    if (!location) return errors.push({ rowIndex: i, message: "Missing location" });
    if (amount == null) return errors.push({ rowIndex: i, message: "Missing result (and no buy-in/cash-out to compute it)" });

    const gameTypeRaw = String(get("game_type") || "").trim().toLowerCase();
    const game_type = gameTypeRaw.startsWith("t") ? "tournament" : "cash";

    rows.push({
      played_on,
      location,
      game_type,
      variant: String(get("variant") || "").trim() || null,
      stakes: String(get("stakes") || "").trim() || null,
      table_size: idx.table_size >= 0 ? parseInt(get("table_size"), 10) || null : null,
      buy_in,
      cash_out,
      amount,
      duration_minutes: idx.duration_minutes >= 0 ? parseInt(get("duration_minutes"), 10) || null : null,
      notes_leak: String(get("notes_leak") || "").trim() || null,
      tags: [],
    });
  });

  return { rows, errors };
}
