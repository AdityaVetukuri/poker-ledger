import { Component } from "react";

// Error boundaries have to be class components (no hook equivalent yet).
// Without this, any uncaught render error blanks the whole page with
// nothing in the UI to explain why — this turns that into a readable
// message instead, which is the actual "log" for a client-side crash on
// someone else's device you can't otherwise see.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Unhandled error:", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="pl-auth-wrap">
          <div className="pl-auth-card">
            <h1 style={{ marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ marginBottom: 16 }}>
              The app hit an unexpected error and couldn't continue. Reloading usually fixes it; if it
              keeps happening, send this message to whoever's maintaining the app:
            </p>
            <p
              className="pl-panel-sub"
              style={{ fontFamily: "var(--font-mono)", background: "var(--felt)", padding: 10, border: "1px solid var(--line)" }}
            >
              {String(this.state.error?.message || this.state.error)}
            </p>
            <button className="pl-btn-primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
