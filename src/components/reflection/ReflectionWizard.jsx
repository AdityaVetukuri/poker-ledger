import { useState } from "react";
import { LEAK_TAG_CATEGORIES } from "../../lib/leakTags";

const RATING_LABELS = {
  1: "Rough — tilted, lost focus",
  2: "Below par",
  3: "Solid, nothing special",
  4: "Good, in control",
  5: "A-game the whole time",
};

export default function ReflectionWizard({ session, onSave, onSkip }) {
  const [step, setStep] = useState(0);
  const [tiltRating, setTiltRating] = useState(0);
  const [notesGood, setNotesGood] = useState("");
  const [notesLeak, setNotesLeak] = useState("");
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [notesAction, setNotesAction] = useState("");
  const [notesVillains, setNotesVillains] = useState("");

  const steps = ["Mental game", "What worked", "The leak", "Next step", "Reads"];

  function toggleTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function addCustomTag() {
    const t = customTag.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setCustomTag("");
  }

  function handleFinish() {
    onSave({
      tilt_rating: tiltRating || null,
      notes_good: notesGood.trim() || null,
      notes_leak: notesLeak.trim() || null,
      notes_action: notesAction.trim() || null,
      notes_villains: notesVillains.trim() || null,
      tags,
    });
  }

  return (
    <div className="pl-modal-overlay">
      <div className="pl-modal">
        <div className="pl-modal-head">
          <h2>Session logged — quick reflection</h2>
          <p>
            {session.location} &middot; {session.played_on} &middot; 2 minutes, tops. Skip any step you don't have
            an answer for.
          </p>
        </div>

        <div className="pl-wizard-steps">
          {steps.map((s, i) => (
            <span key={s} className={`pl-wizard-dot ${i === step ? "active" : i < step ? "done" : ""}`} />
          ))}
        </div>

        <div className="pl-wizard-body">
          {step === 0 && (
            <>
              <h3>How was your mental game?</h3>
              <div className="pl-rating-row">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`pl-rating-btn ${tiltRating === n ? "active" : ""}`}
                    onClick={() => setTiltRating(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {tiltRating > 0 && <p className="pl-rating-caption">{RATING_LABELS[tiltRating]}</p>}
            </>
          )}

          {step === 1 && (
            <>
              <h3>What's one thing you did well?</h3>
              <textarea
                rows={3}
                value={notesGood}
                onChange={(e) => setNotesGood(e.target.value)}
                placeholder="e.g. Folded a top-pair hand to heavy river aggression instead of paying it off."
              />
            </>
          )}

          {step === 2 && (
            <>
              <h3>What's one leak or mistake you noticed?</h3>
              <textarea
                rows={3}
                value={notesLeak}
                onChange={(e) => setNotesLeak(e.target.value)}
                placeholder="Describe it in your own words…"
              />
              <p className="pl-wizard-subtitle">Tag it (pick any that fit):</p>
              <div className="pl-tag-groups">
                {LEAK_TAG_CATEGORIES.map((cat) => (
                  <div className="pl-tag-group" key={cat.category}>
                    <span className="pl-tag-group-label">{cat.category}</span>
                    <div className="pl-tag-chips">
                      {cat.tags.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          className={`pl-chip ${tags.includes(tag) ? "active" : ""}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pl-custom-tag-row">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Or add your own tag…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTag();
                    }
                  }}
                />
                <button type="button" className="pl-btn-small ghost" onClick={addCustomTag}>
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="pl-tag-chips" style={{ marginTop: 8 }}>
                  {tags.map((tag) => (
                    <span className="pl-chip active" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h3>One specific thing to work on next session</h3>
              <textarea
                rows={3}
                value={notesAction}
                onChange={(e) => setNotesAction(e.target.value)}
                placeholder="e.g. Review 3-bet pot ranges out of position before next session."
              />
            </>
          )}

          {step === 4 && (
            <>
              <h3>Anything worth remembering about opponents?</h3>
              <textarea
                rows={3}
                value={notesVillains}
                onChange={(e) => setNotesVillains(e.target.value)}
                placeholder="Reads, tendencies, players to avoid or target…"
              />
            </>
          )}
        </div>

        <div className="pl-modal-actions">
          <button type="button" className="pl-btn-small ghost" onClick={onSkip}>
            Skip reflection
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 0 && (
              <button type="button" className="pl-btn-small ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button type="button" className="pl-btn-primary" onClick={() => setStep((s) => s + 1)}>
                Next
              </button>
            ) : (
              <button type="button" className="pl-btn-primary" onClick={handleFinish}>
                Save reflection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
