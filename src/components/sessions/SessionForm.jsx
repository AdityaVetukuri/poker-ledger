import { useState } from "react";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function SessionForm({ initial, locations = [], onSubmit, onCancel, submitLabel = "Save session" }) {
  const [playedOn, setPlayedOn] = useState(initial?.played_on || todayKey());
  const [location, setLocation] = useState(initial?.location || "");
  const [gameType, setGameType] = useState(initial?.game_type || "cash");
  const [variant, setVariant] = useState(initial?.variant || "");
  const [stakes, setStakes] = useState(initial?.stakes || "");
  const [tableSize, setTableSize] = useState(initial?.table_size ?? "");
  const [buyIn, setBuyIn] = useState(initial?.buy_in ?? "");
  const [cashOut, setCashOut] = useState(initial?.cash_out ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [amountTouched, setAmountTouched] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(initial?.duration_minutes ?? "");
  const [error, setError] = useState("");

  function recomputeAmount(nextBuyIn, nextCashOut) {
    if (amountTouched) return;
    const b = parseFloat(nextBuyIn);
    const c = parseFloat(nextCashOut);
    if (!isNaN(b) && !isNaN(c)) setAmount(String(c - b));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!location.trim()) return setError("Enter where you played.");
    if (!playedOn) return setError("Pick a date.");
    if (amount === "" || isNaN(amt)) return setError("Enter a result (use a minus sign for a loss).");

    setError("");
    onSubmit({
      played_on: playedOn,
      location: location.trim(),
      game_type: gameType,
      variant: variant.trim() || null,
      stakes: stakes.trim() || null,
      table_size: tableSize === "" ? null : parseInt(tableSize, 10),
      buy_in: buyIn === "" ? null : parseFloat(buyIn),
      cash_out: cashOut === "" ? null : parseFloat(cashOut),
      amount: amt,
      duration_minutes: durationMinutes === "" ? null : parseInt(durationMinutes, 10),
    });
  }

  return (
    <form className="pl-panel pl-add-form" onSubmit={handleSubmit}>
      <div className="pl-form-grid">
        <label>
          <span>Date</span>
          <input type="date" value={playedOn} onChange={(e) => setPlayedOn(e.target.value)} />
        </label>
        <label>
          <span>Where</span>
          <input
            list="pl-locations"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Ballantyne game"
          />
          <datalist id="pl-locations">
            {locations.map((l) => (
              <option value={l} key={l} />
            ))}
          </datalist>
        </label>
        <label>
          <span>Game</span>
          <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="tournament">Tournament</option>
          </select>
        </label>
        <label>
          <span>Variant</span>
          <input type="text" value={variant} onChange={(e) => setVariant(e.target.value)} placeholder="NLH, PLO…" />
        </label>
        <label>
          <span>Stakes</span>
          <input type="text" value={stakes} onChange={(e) => setStakes(e.target.value)} placeholder="1/2, 1/3…" />
        </label>
        <label>
          <span>Table size</span>
          <input type="number" min="2" max="10" value={tableSize} onChange={(e) => setTableSize(e.target.value)} />
        </label>
        <label>
          <span>Buy-in ($)</span>
          <input
            type="number"
            step="1"
            value={buyIn}
            onChange={(e) => {
              setBuyIn(e.target.value);
              recomputeAmount(e.target.value, cashOut);
            }}
          />
        </label>
        <label>
          <span>Cash-out ($)</span>
          <input
            type="number"
            step="1"
            value={cashOut}
            onChange={(e) => {
              setCashOut(e.target.value);
              recomputeAmount(buyIn, e.target.value);
            }}
          />
        </label>
        <label>
          <span>Result ($)</span>
          <input
            type="number"
            step="1"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setAmountTouched(true);
            }}
            placeholder="-150 or 300"
          />
        </label>
        <label>
          <span>Duration (min)</span>
          <input type="number" min="0" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
        </label>
      </div>
      {error && <p className="pl-form-error">{error}</p>}
      <div className="pl-row-actions">
        <button className="pl-btn-primary" type="submit">
          {submitLabel}
        </button>
        {onCancel && (
          <button className="pl-btn-small ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
