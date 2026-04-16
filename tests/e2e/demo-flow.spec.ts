import { test, expect } from "@playwright/test";
import {
  clerk,
  clerkSetup,
  setupClerkTestingToken,
} from "@clerk/testing/playwright";

// Clerk treats any email with a `+clerk_test` local-part as a test email on
// development instances. Sign-in with verification code 424242 is permitted
// automatically — no inbox required. The test user is auto-created on the
// first successful attempt.
const TEST_EMAIL = "e2e+clerk_test@aismartscribe.com";

test.beforeAll(async () => {
  await clerkSetup();
});

test.beforeEach(async ({ page }) => {
  await setupClerkTestingToken({ page });
});

test("doctor completes the demo flow end-to-end", async ({ page }) => {
  // Navigate home first so Clerk's client SDK initializes on the page.
  await page.goto("/");

  // Programmatic sign-in. Clerk's helper handles the 424242 code internally
  // for +clerk_test test emails.
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "email_code",
      identifier: TEST_EMAIL,
    },
  });

  // Middleware will allow us into the protected demo route once signed in.
  await page.goto("/demo");

  // The demo nav should show the user's first name or "Welcome".
  await expect(page.getByRole("link", { name: "AI Smart Scribe" })).toBeVisible();

  // Start the scripted encounter.
  await page.getByLabel("Start simulation").click();

  // Dialogue streams for ~15 seconds, then the Approve button becomes visible.
  const approveButton = page.getByRole("button", { name: /Approve & Save/i });
  await expect(approveButton).toBeVisible({ timeout: 30_000 });

  // Sanity: SOAP content is rendered in the right-hand documentation panel.
  const soapPanel = page.locator(".soap-panel");
  await expect(
    soapPanel.getByText(/Dry eye syndrome/i).first(),
  ).toBeVisible();
  await expect(
    soapPanel.getByText(/Preservative-free artificial tears/i),
  ).toBeVisible();

  // Save the note.
  await approveButton.click();

  // Server action → Neon insert → state flips to approved → confirmation card.
  await expect(page.getByText("Note saved successfully")).toBeVisible({
    timeout: 20_000,
  });

  // Follow the link to the dashboard.
  const dashboardLink = page.getByRole("link", { name: /View in Dashboard/i });
  await dashboardLink.click();
  await expect(page).toHaveURL(/\/dashboard$/);
});
