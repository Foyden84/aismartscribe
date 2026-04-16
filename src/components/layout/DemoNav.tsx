import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface DemoNavProps {
  firstName: string;
  activePage: "demo" | "dashboard";
}

export function DemoNav({ firstName, activePage }: DemoNavProps) {
  return (
    <header className="demo-nav">
      <div className="container demo-nav-inner">
        <Link href="/" className="nav-logo">
          AI Smart Scribe
        </Link>
        <nav className="demo-nav-links">
          <Link
            href="/demo"
            aria-current={activePage === "demo" ? "page" : undefined}
          >
            Demo
          </Link>
          <Link
            href="/dashboard"
            aria-current={activePage === "dashboard" ? "page" : undefined}
          >
            Dashboard
          </Link>
        </nav>
        <div className="demo-nav-user">
          <span className="demo-nav-greeting">{firstName}</span>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
