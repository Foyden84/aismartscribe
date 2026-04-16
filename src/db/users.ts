import { eq } from "drizzle-orm";
import { db } from "./index";
import { users, type User } from "./schema";

interface ClerkUserLike {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName: string | null;
  lastName: string | null;
}

/**
 * Return the Neon users row for this Clerk user, creating it if the
 * Clerk webhook hasn't fired yet. Keeps the demo working even when the
 * user has configured Clerk auth but not the user.created webhook.
 */
export async function getOrCreateUser(clerkUser: ClerkUserLike): Promise<User> {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const [created] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })
    .returning();

  return created;
}
