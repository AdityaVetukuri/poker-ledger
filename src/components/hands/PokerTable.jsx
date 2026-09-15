import PlayingCard from "../cards/PlayingCard";
import { seatLayout } from "../../lib/positions";
import { STREETS } from "../../lib/handEngine";

// Visual oval table. `revealStreet` controls how many board cards are shown
// (used by both the hand builder, as you add streets, and the replayer's
// street stepper). `foldedSeats` greys out seats that are out of the hand
// by that point.
export default function PokerTable({ seats, board = {}, pot, revealStreet = "river", foldedSeats = new Set() }) {
  const laidOut = seatLayout(seats);
  const revealIdx = STREETS.indexOf(revealStreet);

  const flop = revealIdx >= 1 ? board.flop || [] : [];
  const turn = revealIdx >= 2 ? board.turn : null;
  const river = revealIdx >= 3 ? board.river : null;

  return (
    <div className="pl-table-wrap">
      <div className="pl-table-felt">
        <div className="pl-table-center">
          {pot != null && <div className="pl-table-pot">Pot: {pot}</div>}
          <div className="pl-table-board">
            {[0, 1, 2].map((i) => (
              <PlayingCard key={"f" + i} card={flop[i]} empty={!flop[i]} size="sm" />
            ))}
            <PlayingCard card={turn} empty={!turn} size="sm" />
            <PlayingCard card={river} empty={!river} size="sm" />
          </div>
        </div>

        {laidOut.map((seat) => {
          const folded = foldedSeats.has(seat.seat);
          return (
            <div
              key={seat.seat}
              className={`pl-table-seat ${seat.is_hero ? "hero" : ""} ${folded ? "folded" : ""}`}
              style={{ left: `${seat.xPct}%`, top: `${seat.yPct}%` }}
            >
              <div className="pl-table-seat-cards">
                {seat.is_hero && seat.cards?.length ? (
                  seat.cards.map((c, i) => <PlayingCard key={i} card={c} size="xs" />)
                ) : !seat.is_hero && !folded ? (
                  <>
                    <PlayingCard faceDown size="xs" />
                    <PlayingCard faceDown size="xs" />
                  </>
                ) : null}
              </div>
              <div className="pl-table-seat-tag">
                <span className="pl-table-seat-pos">{seat.position}</span>
                <span className="pl-table-seat-stack">{seat.stack}bb</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
