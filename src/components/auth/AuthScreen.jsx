import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ChipMark from "../layout/ChipMark";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    const { error: err } =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (mode === "signup") {
      setInfo("Account created. Check your email if confirmation is required, then sign in.");
      setMode("signin");
    }
  }

  return (
    <div className="pl-auth-wrap">
      <div className="pl-auth-card">
        <div className="pl-header-title" style={{ justifyContent: "center", marginBottom: 18 }}>
          <ChipMark size={34} />
          <div>
            <h1>The Ledger</h1>
            <p>Your poker journal — sessions, reflections, leaks</p>
          </div>
        </div>

        <div className="pl-auth-tabs">
          <button
            className={`pl-tab ${mode === "signin" ? "active" : ""}`}
            onClick={() => setMode("signin")}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`pl-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pl-auth-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="At least 6 characters"
            />
          </label>
          {error && <p className="pl-form-error">{error}</p>}
          {info && <p className="pl-form-info">{info}</p>}
          <button className="pl-btn-primary" type="submit" disabled={busy}>
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
