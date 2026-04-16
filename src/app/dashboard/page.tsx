import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const metadata = {
  title: "Dashboard · AI Smart Scribe",
};

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <div className="demo-shell">
      <header className="demo-nav">
        <div className="container demo-nav-inner">
          <Link href="/" className="nav-logo">
            AI Smart Scribe
          </Link>
          <nav className="demo-nav-links">
            <Link href="/demo">Demo</Link>
            <Link href="/dashboard" aria-current="page">
              Dashboard
            </Link>
          </nav>
          <UserButton />
        </div>
      </header>

      <main className="demo-placeholder">
        <div className="container">
          <div className="demo-placeholder-card">
            <span className="demo-placeholder-badge">Coming in Phase 7</span>
            <h1>Your notes will appear here, {firstName}.</h1>
            <p>
              Once you approve your first SOAP note in the demo room, it will
              be saved to this dashboard so you can review, copy, or export it
              to your EHR.
            </p>
            <div className="demo-placeholder-actions">
              <Link href="/demo" className="btn btn-primary">
                Go to demo
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
