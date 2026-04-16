"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { sessions, notes } from "@/db/schema";
import { getOrCreateUser } from "@/db/users";

export interface ApproveNoteInput {
  transcript: string;
  chiefComplaint: string;
  hpi: string;
  objective: string;
  assessment: string;
  plan: string;
  encounterType?: string;
}

export async function approveNote(input: ApproveNoteInput) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const user = await getOrCreateUser(clerkUser);

  const [session] = await db
    .insert(sessions)
    .values({
      userId: user.id,
      endedAt: new Date(),
      encounterType: input.encounterType ?? "Annual Eye Exam",
      status: "approved",
    })
    .returning();

  const [note] = await db
    .insert(notes)
    .values({
      sessionId: session.id,
      userId: user.id,
      chiefComplaint: input.chiefComplaint,
      hpi: input.hpi,
      objective: input.objective,
      assessment: input.assessment,
      plan: input.plan,
      rawTranscript: input.transcript,
      approvedAt: new Date(),
    })
    .returning();

  return { noteId: note.id };
}
