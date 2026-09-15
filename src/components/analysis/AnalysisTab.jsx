import { computeLeakStats } from "../../lib/stats";
import LeakBoard from "./LeakBoard";
import TiltChart from "./TiltChart";
import ActionItems from "./ActionItems";

export default function AnalysisTab({ sessions }) {
  if (!sessions.length) {
    return (
      <main>
        <p className="pl-empty">Log a few sessions with reflections and your leak analysis will show up here.</p>
      </main>
    );
  }

  const { tagArr, tiltBuckets, actionItems, taggedSessionCount } = computeLeakStats(sessions);

  return (
    <main>
      <section className="pl-hero" style={{ paddingBottom: 18 }}>
        <span className="pl-hero-label">Reflections logged</span>
        <span className="pl-hero-number">
          {taggedSessionCount}/{sessions.length}
        </span>
        <span className="pl-hero-sub">sessions with at least one tagged leak</span>
      </section>

      <LeakBoard tagArr={tagArr} />
      <TiltChart tiltBuckets={tiltBuckets} />
      <ActionItems actionItems={actionItems} />
    </main>
  );
}
