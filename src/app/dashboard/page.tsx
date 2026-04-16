import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { getOrCreateUser } from "@/db/users";
import { NoteCard } from "@/components/dashboard/NoteCard";

export const metadata = {
  title: "Dashboard · AI Smart Scribe",
};

export const dynamic = "force-dynamic";

function formatSubheader(first: string | null, last: string | null, practice: string | null) {
  const name = [first, last].filter(Boolean).join(" ").trim();
  const label = name ? `Dr. ${name}` : "Your account";
  return practice ? `${label} · ${practice}` : label;
}

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await getOrCreateUser(clerkUser);

  const userNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, user.id))
    .orderBy(desc(notes.approvedAt), desc(notes.createdAt));

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
          <div className="demo-nav-user">
            <span className="demo-nav-greeting">
              {user.firstName ?? "Welcome"}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="demo-main">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Your Clinical Notes</h1>
              <p>
                {formatSubheader(
                  user.firstName,
                  user.lastName,
                  user.practiceName,
                )}
              </p>
            </div>
            <Link href="/demo" className="btn btn-primary btn-sm">
              + New Encounter
            </Link>
          </div>

          {userNotes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="note-list">
              {userNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="dashboard-empty">
      <div className="dashboard-empty-icon" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="32"
          height="32"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="15" y2="17" />
        </svg>
      </div>
      <h2>No notes yet</h2>
      <p>
        Head to the Demo to generate your first AI-powered SOAP note. Approved
        notes land here — ready to copy into Optomate or any EHR.
      </p>
      <Link href="/demo" className="btn btn-primary">
        Go to Demo →
      </Link>
    </div>
  );
}
