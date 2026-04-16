import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/db/users";
import { DemoNav } from "@/components/layout/DemoNav";
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
      <DemoNav firstName={user.firstName ?? "Welcome"} activePage="demo" />
      <main className="demo-main">
        <div className="container">
          <DemoRoom />
        </div>
      </main>
    </div>
  );
}
