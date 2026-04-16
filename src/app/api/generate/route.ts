import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a clinical documentation AI for an optometry practice. Given a patient encounter transcript, generate a structured SOAP note with these exact sections:

CHIEF COMPLAINT: (one line)
HPI: (2-3 sentences)
OBJECTIVE: (VA, SLE findings, IOP — use realistic optometry values)
ASSESSMENT: (numbered diagnosis list)
PLAN: (numbered treatment plan)

Return ONLY the structured note. No preamble. No explanation. Use proper clinical optometry terminology. Format each section on a new line with the label in caps followed by a colon.`;

// Demo transcript fallback when no Anthropic key is set.
// Matches the dry-eye encounter scripted in the Phase 6 demo room.
const FALLBACK_SOAP = `CHIEF COMPLAINT: Dryness and irritation, right eye, three weeks.

HPI: 68-year-old female presents with three-week history of dryness and irritation OD, worse in mornings. Using OTC artificial tears with temporary relief only. Denies pain, flashes, floaters, or change in vision. No contact lens wear.

OBJECTIVE: VA (cc): OD 20/25, OS 20/20 distance. Slit lamp: Reduced tear film quality OD, mild MGD OU. Tear break-up time OD 4 sec, OS 9 sec. Cornea clear bilaterally with no fluorescein staining. IOP: OD 14 mmHg, OS 15 mmHg (Goldmann).

ASSESSMENT:
1. Dry eye syndrome (keratoconjunctivitis sicca), right eye — mild severity, MGD-related
2. Meibomian gland dysfunction, bilateral — early

PLAN:
1. Preservative-free artificial tears QID OD
2. Warm compresses BID OU for 5 minutes
3. Omega-3 supplementation 1000mg daily
4. Follow-up in 4 weeks to reassess tear film quality
5. Patient educated on environmental modifications (humidifier, screen breaks)`;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { transcript?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const transcript = body.transcript;
  if (!transcript || typeof transcript !== "string") {
    return NextResponse.json(
      { error: "transcript is required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Graceful fallback so the demo flow works without a key set.
    return NextResponse.json({ note: FALLBACK_SOAP, fallback: true });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: transcript }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Anthropic API error:", response.status, errBody);
      return NextResponse.json(
        { error: "Failed to generate note" },
        { status: 502 },
      );
    }

    const data = await response.json();
    const note =
      data.content?.[0]?.text ||
      "Unable to generate a note. Please try again.";

    return NextResponse.json({ note, fallback: false });
  } catch (err) {
    console.error("Generate API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
