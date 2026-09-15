import { useAuth } from "../../contexts/AuthContext";
import ChipMark from "./ChipMark";

export default function Header() {
  const { user, signOut } = useAuth();
  return (
    <header>
      <div className="pl-header-title">
        <ChipMark size={34} />
        <div>
          <h1>The Ledger</h1>
          <p>Sessions, reflections, and leaks — tracked over time</p>
        </div>
      </div>
      {user && (
        <div className="pl-header-user">
          <span className="pl-header-email">{user.email}</span>
          <button className="pl-btn-small ghost" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
