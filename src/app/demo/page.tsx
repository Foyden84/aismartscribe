import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const metadata = {
  title: "Demo · AI Smart Scribe",
};

export default async function DemoPage() {
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
            <Link href="/demo" aria-current="page">
              Demo
            </Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      <main className="demo-placeholder">
        <div className="container">
          <div className="demo-placeholder-card">
            <span className="demo-placeholder-badge">Coming in Phase 6</span>
            <h1>Hi {firstName} — your demo room is on the way.</h1>
            <p>
              The live patient-encounter simulator (with real-time SOAP note
              generation) ships in the next build step. Check back shortly.
            </p>
            <div className="demo-placeholder-actions">
              <Link href="/" className="btn btn-ghost">
                Back to home
              </Link>
              <Link href="/dashboard" className="btn btn-primary">
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
