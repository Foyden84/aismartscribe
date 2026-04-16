import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const runtime = "nodejs";

interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

interface ClerkUserEventData {
  id: string;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string | null;
  first_name: string | null;
  last_name: string | null;
  unsafe_metadata?: { practice_name?: string };
  public_metadata?: { practice_name?: string };
}

interface ClerkEvent {
  type: string;
  data: ClerkUserEventData;
}

function primaryEmail(data: ClerkUserEventData): string {
  const primary = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id,
  );
  return (primary ?? data.email_addresses[0])?.email_address ?? "";
}

function practiceName(data: ClerkUserEventData): string | undefined {
  return (
    data.unsafe_metadata?.practice_name ?? data.public_metadata?.practice_name
  );
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
  }

  const body = await req.text();

  let event: ClerkEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;
  } catch (err) {
    console.error("Svix verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    if (event.type === "user.created") {
      await db
        .insert(users)
        .values({
          clerkId: event.data.id,
          email: primaryEmail(event.data),
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          practiceName: practiceName(event.data),
        })
        .onConflictDoNothing({ target: users.clerkId });
    } else if (event.type === "user.updated") {
      await db
        .update(users)
        .set({
          email: primaryEmail(event.data),
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          practiceName: practiceName(event.data),
        })
        .where(eq(users.clerkId, event.data.id));
    }

    return NextResponse.json({ ok: true, type: event.type });
  } catch (err) {
    console.error("Webhook DB error:", err);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 },
    );
  }
}
