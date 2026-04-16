import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/db/users";
import { DemoRoom } from "./DemoRoom";

export const metadata = {
  title: "Demo · AI Smart Scribe",
};

export default async function DemoPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // Ensure the Neon users row exists — covers the case where the Clerk
  // webhook hasn't been configured yet.
  const user = await getOrCreateUser(clerkUser);

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
          <DemoRoom />
        </div>
      </main>
    </div>
  );
}
