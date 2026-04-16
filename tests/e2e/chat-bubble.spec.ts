import { test, expect } from "@playwright/test";

test("chat bubble opens and returns a canned reply on the marketing page", async ({
  page,
}) => {
  await page.goto("/");

  // The FAB is hidden on load — it appears after 15s OR once the hero is
  // scrolled out of view. Scroll the page to trigger the IntersectionObserver.
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));

  const fab = page.getByRole("button", { name: /Chat with AI Smart Scribe/i });
  await expect(fab).toBeVisible({ timeout: 5_000 });
  await fab.click();

  // Starter pills render when the conversation is empty.
  const hipaaPill = page.getByRole("button", {
    name: "Is this HIPAA compliant?",
  });
  await expect(hipaaPill).toBeVisible();
  await hipaaPill.click();

  // User message bubble appears, then the canned HIPAA response.
  await expect(page.locator(".chat-msg.user").last()).toContainText(
    "Is this HIPAA compliant?",
  );

  // Wait for the assistant reply to land.
  const assistant = page.locator(".chat-msg.assistant").last();
  await expect(assistant).toBeVisible({ timeout: 10_000 });
  await expect(assistant).toContainText(/HIPAA/i);
});
