import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export const metadata = {
  title: "Create your account · AI Smart Scribe",
  description:
    "Create an account to generate your first AI-powered SOAP note.",
};

export default function SignUpPage() {
  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <Link href="/" className="auth-brand-link">
          AI Smart Scribe
        </Link>
      </div>
      <div className="auth-content">
        <div className="auth-copy">
          <h1>Create your account</h1>
          <p>Generate your first AI-powered SOAP note in under five minutes.</p>
        </div>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/demo"
        />
      </div>
    </main>
  );
}
