import { useState } from "react";

export default function ImportBanner({ count, onImport, onDismiss }) {
  const [busy, setBusy] = useState(false);

  return (
    <section className="pl-panel pl-import-banner">
      <div>
        <strong>Found {count} session{count === 1 ? "" : "s"} saved in this browser</strong>
        <p className="pl-panel-sub" style={{ margin: "4px 0 0" }}>
          From the old single-device version of this app. Import them into your account?
        </p>
      </div>
      <div className="pl-row-actions">
        <button
          className="pl-btn-primary"
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await onImport();
            setBusy(false);
          }}
        >
          {busy ? "Importing…" : `Import ${count} sessions`}
        </button>
        <button className="pl-btn-small ghost" type="button" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </section>
  );
}
