const TABS = [
  { key: "overview", label: "Overview" },
  { key: "log", label: "Session log" },
  { key: "hands", label: "Hands" },
  { key: "analysis", label: "Analysis" },
];

export default function Tabs({ active, onChange }) {
  return (
    <nav className="pl-tabs">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`pl-tab ${active === t.key ? "active" : ""}`}
          onClick={() => onChange(t.key)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
