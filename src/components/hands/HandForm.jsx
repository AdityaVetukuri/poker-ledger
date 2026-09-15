import { useState } from "react";
import CardPicker from "../cards/CardPicker";
import PokerTable from "./PokerTable";
import StreetActions from "./StreetActions";
import { usedCards } from "../../lib/cards";
import { positionsForTableSize, defaultSeats } from "../../lib/positions";
import { STREETS, potByStreet, activeSeatsAtStreet } from "../../lib/handEngine";
import { LEAK_TAG_CATEGORIES } from "../../lib/leakTags";

const TABLE_SIZES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const STREET_LABELS = { preflop: "Preflop", flop: "Flop", turn: "Turn", river: "River" };

export default function HandForm({ sessions, initial, onSubmit, onCancel, submitLabel = "Save hand" }) {
  const [sessionId, setSessionId] = useState(initial?.session_id || sessions[0]?.id || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [variant, setVariant] = useState(initial?.variant || "NLH");
  const [tableSize, setTableSize] = useState(initial?.table_size || 6);
  const [smallBlind, setSmallBlind] = useState(initial?.small_blind ?? 0.5);
  const [bigBlind, setBigBlind] = useState(initial?.big_blind ?? 1);
  const [effStack, setEffStack] = useState(initial?.effective_stack_bb ?? 100);
  const [heroPosition, setHeroPosition] = useState(
    initial?.seats?.find((s) => s.is_hero)?.position || "BTN"
  );
  const [seats, setSeats] = useState(
    initial?.seats?.length ? initial.seats : defaultSeats(6, "BTN", 100)
  );
  const [board, setBoard] = useState(initial?.board || { flop: [], turn: null, river: null });
  const [actions, setActions] = useState(initial?.actions || []);
  const [result, setResult] = useState(initial?.result ?? "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [tags, setTags] = useState(initial?.tags || []);
  const [customTag, setCustomTag] = useState("");
  const [error, setError] = useState("");

  const heroIndex = seats.findIndex((s) => s.is_hero);
  const heroCards = seats[heroIndex]?.cards || [];

  function regenerateSeats(nextTableSize, nextHeroPosition, stack) {
    setSeats(defaultSeats(nextTableSize, nextHeroPosition, stack));
    setActions([]);
  }

  function handleTableSizeChange(n) {
    setTableSize(n);
    const positions = positionsForTableSize(n);
    const pos = positions.includes(heroPosition) ? heroPosition : "BTN";
    setHeroPosition(pos);
    regenerateSeats(n, pos, effStack);
  }

  function handleHeroPositionChange(pos) {
    setHeroPosition(pos);
    regenerateSeats(tableSize, pos, effStack);
  }

  function updateSeatStack(seatNum, stack) {
    setSeats((prev) => prev.map((s) => (s.seat === seatNum ? { ...s, stack: Number(stack) || 0 } : s)));
  }

  function setHeroCards(cards) {
    setSeats((prev) => prev.map((s) => (s.is_hero ? { ...s, cards } : s)));
  }

  function toggleTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }
  function addCustomTag() {
    const t = customTag.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setCustomTag("");
  }

  const pots = potByStreet(smallBlind, bigBlind, actions);
  const potEntering = { preflop: (Number(smallBlind) || 0) + (Number(bigBlind) || 0), flop: pots.preflop, turn: pots.flop, river: pots.turn };
  const used = usedCards({ seats, board });

  function handleSubmit(e) {
    e.preventDefault();
    if (!sessionId) return setError("Pick which session this hand belongs to.");
    if (heroCards.length !== 2) return setError("Pick your 2 hole cards.");
    setError("");
    onSubmit({
      session_id: sessionId,
      title: title.trim() || null,
      variant,
      table_size: tableSize,
      small_blind: Number(smallBlind) || null,
      big_blind: Number(bigBlind) || null,
      effective_stack_bb: Number(effStack) || null,
      hero_seat: seats[heroIndex]?.seat ?? 1,
      seats,
      board,
      actions,
      result: result === "" ? null : Number(result),
      notes: notes.trim() || null,
      tags,
    });
  }

  return (
    <form className="pl-panel pl-add-form pl-hand-form" onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0 }}>{initial ? "Edit hand" : "Log a hand"}</h2>

      <div className="pl-form-grid">
        <label>
          <span>Session</span>
          <select className="pl-select" value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
            {sessions.map((s) => (
              <option value={s.id} key={s.id}>
                {s.played_on} &ndash; {s.location}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Label</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AA cracked by 72o" />
        </label>
        <label>
          <span>Variant</span>
          <input type="text" value={variant} onChange={(e) => setVariant(e.target.value)} />
        </label>
        <label>
          <span>Table size</span>
          <select className="pl-select" value={tableSize} onChange={(e) => handleTableSizeChange(Number(e.target.value))}>
            {TABLE_SIZES.map((n) => (
              <option value={n} key={n}>
                {n}-max
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Small blind</span>
          <input type="number" step="0.1" value={smallBlind} onChange={(e) => setSmallBlind(e.target.value)} />
        </label>
        <label>
          <span>Big blind</span>
          <input type="number" step="0.5" value={bigBlind} onChange={(e) => setBigBlind(e.target.value)} />
        </label>
        <label>
          <span>Your position</span>
          <select className="pl-select" value={heroPosition} onChange={(e) => handleHeroPositionChange(e.target.value)}>
            {positionsForTableSize(tableSize).map((p) => (
              <option value={p} key={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Effective stack (bb)</span>
          <input
            type="number"
            value={effStack}
            onChange={(e) => {
              setEffStack(e.target.value);
              regenerateSeats(tableSize, heroPosition, Number(e.target.value) || 0);
            }}
          />
        </label>
      </div>

      <p className="pl-wizard-subtitle" style={{ marginTop: 16 }}>Seat stacks (bb) — adjust if any seat wasn't at the default:</p>
      <div className="pl-seat-stacks">
        {seats.map((s) => (
          <label key={s.seat} className="pl-seat-stack-item">
            <span>{s.position}{s.is_hero ? " (You)" : ""}</span>
            <input type="number" value={s.stack} onChange={(e) => updateSeatStack(s.seat, e.target.value)} />
          </label>
        ))}
      </div>

      <CardPicker label="Your hole cards" selected={heroCards} onChange={setHeroCards} count={2} disabled={used} />

      <PokerTable seats={seats} board={board} pot={pots.river} revealStreet="river" />

      {STREETS.map((street, streetIdx) => {
        const activeSeats = activeSeatsAtStreet(seats, actions, street);
        return (
          <section className="pl-panel pl-street-section" key={street}>
            <h3>{STREET_LABELS[street]}</h3>
            {street === "flop" && (
              <CardPicker label="Flop" selected={board.flop || []} onChange={(cards) => setBoard((b) => ({ ...b, flop: cards }))} count={3} disabled={used} />
            )}
            {street === "turn" && (
              <CardPicker label="Turn" selected={board.turn ? [board.turn] : []} onChange={(cards) => setBoard((b) => ({ ...b, turn: cards[0] || null }))} count={1} disabled={used} />
            )}
            {street === "river" && (
              <CardPicker label="River" selected={board.river ? [board.river] : []} onChange={(cards) => setBoard((b) => ({ ...b, river: cards[0] || null }))} count={1} disabled={used} />
            )}
            <StreetActions
              street={street}
              seats={activeSeats}
              allActions={actions}
              onChange={setActions}
              potBefore={streetIdx === 0 ? potEntering.preflop : potEntering[street]}
            />
          </section>
        );
      })}

      <div className="pl-form-grid" style={{ marginTop: 16 }}>
        <label>
          <span>Result for you ($)</span>
          <input type="number" step="1" value={result} onChange={(e) => setResult(e.target.value)} placeholder="-25 or 140" />
        </label>
      </div>

      <label className="pl-notes-label" style={{ marginTop: 12 }}>
        <span>Notes / analysis</span>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What was the read, what would you do differently…" />
      </label>

      <p className="pl-wizard-subtitle">Tag it:</p>
      <div className="pl-tag-groups">
        {LEAK_TAG_CATEGORIES.map((cat) => (
          <div className="pl-tag-group" key={cat.category}>
            <span className="pl-tag-group-label">{cat.category}</span>
            <div className="pl-tag-chips">
              {cat.tags.map((tag) => (
                <button type="button" key={tag} className={`pl-chip ${tags.includes(tag) ? "active" : ""}`} onClick={() => toggleTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pl-custom-tag-row">
        <input type="text" value={customTag} onChange={(e) => setCustomTag(e.target.value)} placeholder="Or add your own tag…" />
        <button type="button" className="pl-btn-small ghost" onClick={addCustomTag}>
          Add
        </button>
      </div>

      {error && <p className="pl-form-error">{error}</p>}
      <div className="pl-row-actions" style={{ marginTop: 16 }}>
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
