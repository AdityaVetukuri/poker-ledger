import { rankOf, suitOf, SUIT_SYMBOL, SUIT_COLOR } from "../../lib/cards";

export default function PlayingCard({ card, size = "md", faceDown = false, empty = false }) {
  if (empty) return <div className={`pl-card pl-card-${size} empty`} />;
  if (faceDown || !card) return <div className={`pl-card pl-card-${size} back`} />;

  const rank = rankOf(card);
  const suit = suitOf(card);
  return (
    <div className={`pl-card pl-card-${size} ${SUIT_COLOR[suit]}`}>
      <span className="pl-card-rank">{rank}</span>
      <span className="pl-card-suit">{SUIT_SYMBOL[suit]}</span>
    </div>
  );
}
