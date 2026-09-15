import { useState } from "react";
import { parseSheetFile, guessMapping, buildSessionRows, TARGET_FIELDS } from "../../lib/sheetImport";

export default function ImportSheetModal({ onImport, onClose }) {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [mapping, setMapping] = useState([]);
  const [parseError, setParseError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { imported, skipped }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError("");
    setResult(null);
    setFileName(file.name);
    try {
      const { headers: h, rows } = await parseSheetFile(file);
      if (!h.length) {
        setParseError("Couldn't find any rows in that file.");
        return;
      }
      setHeaders(h);
      setRawRows(rows);
      setMapping(guessMapping(h));
    } catch {
      setParseError("Couldn't read that file — is it a .xlsx, .xls, or .csv?");
    }
  }

  function updateMapping(colIndex, field) {
    setMapping((prev) => prev.map((m, i) => (i === colIndex ? field : m)));
  }

  const { rows: previewRows, errors: previewErrors } = headers.length
    ? buildSessionRows(headers, rawRows, mapping)
    : { rows: [], errors: [] };

  async function handleImport() {
    setBusy(true);
    try {
      await onImport(previewRows);
      setResult({ imported: previewRows.length, skipped: previewErrors.length });
    } catch (err) {
      setParseError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pl-modal-overlay">
      <div className="pl-modal" style={{ maxWidth: 640 }}>
        <div className="pl-modal-head">
          <h2>Import sessions from a spreadsheet</h2>
          <p>
            Upload a .xlsx, .xls, or .csv file. We'll try to guess which column is which — check the mapping
            below before importing. A date, a location, and either a result or a buy-in/cash-out pair are
            required for a row to import.
          </p>
        </div>

        {result ? (
          <div style={{ marginTop: 18 }}>
            <p className="pl-form-info">
              Imported {result.imported} session{result.imported === 1 ? "" : "s"}
              {result.skipped ? `, skipped ${result.skipped} row${result.skipped === 1 ? "" : "s"} that were missing required fields.` : "."}
            </p>
            <div className="pl-modal-actions" style={{ justifyContent: "flex-end" }}>
              <button className="pl-btn-primary" type="button" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 16 }}>
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
              {fileName && <p className="pl-panel-sub" style={{ marginTop: 8 }}>{fileName}</p>}
              {parseError && <p className="pl-form-error">{parseError}</p>}
            </div>

            {headers.length > 0 && (
              <>
                <p className="pl-wizard-subtitle" style={{ marginTop: 18 }}>
                  Column mapping ({rawRows.length} row{rawRows.length === 1 ? "" : "s"} found):
                </p>
                <div className="pl-detail-grid" style={{ flexDirection: "column", gap: 8, alignItems: "stretch" }}>
                  {headers.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ flex: 1, fontSize: 13 }}>{h || `Column ${i + 1}`}</span>
                      <select
                        className="pl-select"
                        value={mapping[i] || "ignore"}
                        onChange={(e) => updateMapping(i, e.target.value)}
                      >
                        {TARGET_FIELDS.map((f) => (
                          <option value={f.key} key={f.key}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <p className="pl-wizard-subtitle">
                  Preview: {previewRows.length} row{previewRows.length === 1 ? "" : "s"} ready to import
                  {previewErrors.length ? `, ${previewErrors.length} will be skipped` : ""}.
                </p>
                {previewRows.length > 0 && (
                  <div className="pl-loc-list" style={{ maxHeight: 180, overflowY: "auto" }}>
                    {previewRows.slice(0, 8).map((r, i) => (
                      <div className="pl-loc-row" key={i} style={{ gridTemplateColumns: "90px 1fr 80px" }}>
                        <span className="pl-loc-count">{r.played_on}</span>
                        <span className="pl-loc-name">{r.location}</span>
                        <span className={`pl-loc-total ${r.amount >= 0 ? "win" : "loss"}`}>
                          {r.amount >= 0 ? "+" : ""}
                          {r.amount}
                        </span>
                      </div>
                    ))}
                    {previewRows.length > 8 && (
                      <p className="pl-panel-sub" style={{ padding: "8px 0 2px" }}>
                        …and {previewRows.length - 8} more
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="pl-modal-actions">
              <button type="button" className="pl-btn-small ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="pl-btn-primary"
                disabled={!previewRows.length || busy}
                onClick={handleImport}
              >
                {busy ? "Importing…" : `Import ${previewRows.length} session${previewRows.length === 1 ? "" : "s"}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
