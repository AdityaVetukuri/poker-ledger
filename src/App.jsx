import { useEffect, useState } from "react";
import { supabaseConfigured } from "./lib/supabaseClient";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { listSessions, createSession, updateSession, deleteSession, bulkInsertSessions } from "./lib/sessions";
import { computeOverviewStats, getLocations } from "./lib/stats";
import { readLegacySessions, clearLegacySessions } from "./lib/localImport";
import SetupNeeded from "./components/setup/SetupNeeded";
import AuthScreen from "./components/auth/AuthScreen";
import Header from "./components/layout/Header";
import Tabs from "./components/layout/Tabs";
import Overview from "./components/overview/Overview";
import SessionsTab from "./components/sessions/SessionsTab";
import ImportBanner from "./components/sessions/ImportBanner";
import AnalysisTab from "./components/analysis/AnalysisTab";

function AppShell() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [legacy, setLegacy] = useState([]);
  const [legacyDismissed, setLegacyDismissed] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSessionsLoading(true);
    listSessions()
      .then((data) => setSessions(data))
      .catch((e) => setError(e.message))
      .finally(() => setSessionsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLegacy(readLegacySessions());
  }, [user]);

  async function handleImportLegacy() {
    try {
      const inserted = await bulkInsertSessions(user.id, legacy);
      setSessions((prev) => [...inserted, ...prev]);
      clearLegacySessions();
      setLegacy([]);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreate(fields) {
    const created = await createSession(user.id, fields);
    setSessions((prev) => [created, ...prev]);
    return created;
  }

  async function handleUpdate(id, fields) {
    const updated = await updateSession(id, fields);
    setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }

  async function handleDelete(id) {
    await deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) return null;
  if (!user) return <AuthScreen />;

  const stats = computeOverviewStats(sessions);
  const locations = getLocations(sessions);

  return (
    <>
      <Header />
      <Tabs active={activeTab} onChange={setActiveTab} />
      {error && (
        <main>
          <p className="pl-form-error">{error}</p>
        </main>
      )}
      {!sessionsLoading && legacy.length > 0 && !legacyDismissed && (
        <main style={{ paddingBottom: 0 }}>
          <ImportBanner count={legacy.length} onImport={handleImportLegacy} onDismiss={() => setLegacyDismissed(true)} />
        </main>
      )}

      {sessionsLoading ? (
        <main>
          <p className="pl-empty">Loading your sessions…</p>
        </main>
      ) : (
        <>
          {activeTab === "overview" && <Overview stats={stats} />}
          {activeTab === "log" && (
            <SessionsTab
              sessions={sessions}
              locations={locations}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
          {activeTab === "analysis" && <AnalysisTab sessions={sessions} />}
        </>
      )}
    </>
  );
}

export default function App() {
  if (!supabaseConfigured) return <SetupNeeded />;
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
