import { RANKS, SUITS, SUIT_SYMBOL, SUIT_COLOR } from "../../lib/cards";

// A 13x4 grid for picking up to `count` cards. `selected` is the array of
// cards already chosen for this slot (hero cards, flop, etc); `disabled` is
// every card in use elsewhere in the hand, so it can't be picked twice.
export default function CardPicker({ selected = [], onChange, count, disabled = new Set(), label }) {
  function toggle(card) {
    if (disabled.has(card) && !selected.includes(card)) return;
    if (selected.includes(card)) {
      onChange(selected.filter((c) => c !== card));
      return;
    }
    if (selected.length >= count) {
      onChange([...selected.slice(1), card]);
    } else {
      onChange([...selected, card]);
    }
  }

  return (
    <div className="pl-card-picker">
      {label && (
        <div className="pl-card-picker-label">
          {label} <span className="pl-panel-sub" style={{ margin: 0 }}>({selected.length}/{count})</span>
        </div>
      )}
      <div className="pl-card-picker-selected">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`pl-card pl-card-md ${selected[i] ? SUIT_COLOR[selected[i][1]] : "empty"}`}>
            {selected[i] && (
              <>
                <span className="pl-card-rank">{selected[i][0]}</span>
                <span className="pl-card-suit">{SUIT_SYMBOL[selected[i][1]]}</span>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="pl-card-grid">
        {SUITS.map((suit) => (
          <div className="pl-card-grid-row" key={suit}>
            {RANKS.map((rank) => {
              const card = rank + suit;
              const isSelected = selected.includes(card);
              const isDisabled = disabled.has(card) && !isSelected;
              return (
                <button
                  type="button"
                  key={card}
                  className={`pl-mini-card ${SUIT_COLOR[suit]} ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                  disabled={isDisabled}
                  onClick={() => toggle(card)}
                  title={card}
                >
                  {rank}
                  {SUIT_SYMBOL[suit]}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
