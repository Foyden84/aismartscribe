import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export const metadata = {
  title: "Sign in · AI Smart Scribe",
  description: "Sign in to access your clinical documentation demo.",
};

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <Link href="/" className="auth-brand-link">
          AI Smart Scribe
        </Link>
      </div>
      <div className="auth-content">
        <div className="auth-copy">
          <h1>Welcome to AI Smart Scribe</h1>
          <p>Sign in to access your clinical documentation demo.</p>
        </div>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/demo"
        />
      </div>
    </main>
  );
}
