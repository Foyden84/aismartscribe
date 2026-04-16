import { createClerkClient } from "@clerk/backend";

export const TEST_EMAIL = "e2e+clerk_test@aismartscribe.com";

/**
 * Ensure a Clerk test user exists before the suite runs. Safe to re-run:
 * users with `+clerk_test` emails can be created on the dev instance
 * without verification, and we no-op if the user is already present.
 */
export default async function globalSetup() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is not set — cannot seed test user");
  }

  const client = createClerkClient({ secretKey });

  const existing = await client.users.getUserList({
    emailAddress: [TEST_EMAIL],
    limit: 1,
  });

  if (existing.data.length > 0) {
    return;
  }

  await client.users.createUser({
    emailAddress: [TEST_EMAIL],
    firstName: "E2E",
    lastName: "Test",
    skipPasswordChecks: true,
    skipPasswordRequirement: true,
  });
}
