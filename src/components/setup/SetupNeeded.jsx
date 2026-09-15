export default function SetupNeeded() {
  return (
    <div className="pl-auth-wrap">
      <div className="pl-auth-card">
        <h1 style={{ marginBottom: 8 }}>Almost there</h1>
        <p style={{ marginBottom: 16 }}>
          This app needs a Supabase project to store sessions. Copy{" "}
          <code>.env.example</code> to <code>.env.local</code>, fill in your
          project's URL and anon key, and restart the dev server.
        </p>
        <p className="pl-panel-sub">See the README for full setup steps.</p>
      </div>
    </div>
  );
}
