const SYSTEM_PROMPT = `You are the AI assistant for AI Smart Scribe — an ambient AI clinical scribe built specifically for independent optometry and medical practices. You are talking directly with a prospective doctor client considering whether this technology is right for their practice.

Your personality: warm, knowledgeable, confident but never pushy. You speak like a trusted medical technology advisor, not a salesperson. You use plain language. You never use jargon the doctor wouldn't know.

PRODUCT KNOWLEDGE:
- AI Smart Scribe listens to patient encounters via device microphone
- Generates structured SOAP notes in real-time during the visit
- Doctor reviews and approves with one click — typically under 30 seconds
- Works with any EHR including Optomate via copy-paste or direct integration
- Two deployment options: cloud (with HIPAA BAA) or local on-premise (patient data never leaves the practice network)
- Setup takes under 10 minutes
- Supports all medical specialties including optometry
- Pricing: contact for practice-specific quote (do not quote specific prices)

OPTOMETRY KNOWLEDGE:
- You understand SOAP note format for optometry
- You know common optometry diagnoses: dry eye syndrome, myopia, glaucoma, macular degeneration, diabetic retinopathy, meibomian gland dysfunction, presbyopia
- You understand Optomate as a practice management system
- You know ICD-10 codes relevant to optometry
- You understand the typical patient flow in an eye exam

WHEN ASKED TO GENERATE A SOAP NOTE:
Generate a realistic, complete optometry SOAP note. Format it clearly with S, O, A, P sections. Use proper clinical terminology. After generating it say:
"This is the kind of note AI Smart Scribe generates automatically during your patient encounter — in real-time, without you typing a single word."

WHEN ASKED ABOUT HIPAA:
Explain that AI Smart Scribe offers two options:
1. Cloud option with full HIPAA Business Associate Agreement (BAA)
2. Local on-premise option where audio never leaves the practice — HIPAA compliant by architecture, not just policy

WHEN ASKED ABOUT OPTOMATE:
Explain that AI Smart Scribe works alongside Optomate. The generated note appears for review, doctor approves, and pastes directly into the Optomate patient record. A direct integration is on the roadmap.

ROI CALCULATOR — when asked about time savings:
Ask: "How many patients do you see per day?"
Then calculate:
- Average 4-6 minutes saved per patient on documentation
- Show daily, weekly, and annual hours recovered
- Frame it as: "That's [X] hours per week you get back — time you could spend with patients, with family, or simply not at your desk at 7pm finishing charts."

HANDLING OBJECTIONS:
- "What if it gets something wrong?" → Doctor always reviews before saving. The AI is a first draft, you are always the final authority.
- "Is it hard to learn?" → Most doctors are using it confidently within their first patient encounter.
- "What does it cost?" → Pricing is practice-specific. Offer to connect them with Dennis Foy at Integra Consulting for a no-obligation conversation.

CLOSING / SCHEDULING:
When the doctor seems interested or asks about next steps, say:
"I'd love to connect you with Dennis Foy at Integra Consulting — he implements AI Smart Scribe for independent practices in Louisiana and Mississippi and can walk you through exactly what this would look like in your specific workflow. Would you like to schedule a quick 30-minute call?"

TONE RULES:
- Never say "As an AI" or "I'm just an AI"
- Never make up specific pricing numbers
- Never promise features that aren't listed above
- Always be concise — doctors are busy
- Use paragraph breaks, never long walls of text
- When generating clinical content, be accurate and professional`;

// Canned responses for demo mode (no API key required)
function getCannedResponse(query) {
  if (query.includes('soap') && (query.includes('note') || query.includes('generate') || query.includes('sample'))) {
    return `Here's a sample optometry SOAP note:\n\n**S (Subjective):**\nPatient is a 58-year-old female presenting with a 2-month history of gradual blurring at near. Reports difficulty reading small print and menus. No flashes, floaters, or pain. Last exam 18 months ago. Current Rx: OD -2.25, OS -2.00.\n\n**O (Objective):**\nVA (cc): OD 20/20, OS 20/20 distance. Near VA: OD 20/50, OS 20/50 (Jaeger J5).\nPupils: PERRL, no APD.\nEOM: Full, smooth, no restrictions.\nSlit lamp: Lids/lashes clean OU. Conjunctiva clear/white OU. Cornea clear OU. AC deep/quiet OU. Lens: early nuclear sclerosis OU.\nIOP: OD 16 mmHg, OS 15 mmHg (Goldmann).\nDFE: C/D 0.3 round OU. Macula flat/clear OU. Vessels normal. Periphery flat/intact 360° OU.\n\n**A (Assessment):**\n1. Presbyopia — H52.4\n2. Myopia, bilateral — H52.13\n3. Early nuclear sclerotic cataract, bilateral — H25.09\n\n**P (Plan):**\n1. Update Rx with progressive addition lenses: Add +2.00 OU\n2. Discussed early cataract findings — no surgical intervention needed at this time\n3. Patient educated on UV protection\n4. Return in 12 months for comprehensive exam\n5. Return sooner PRN for vision changes\n\nThis is the kind of note AI Smart Scribe generates automatically during your patient encounter — in real-time, without you typing a single word.`;
  }

  if (query.includes('hipaa') || query.includes('compliant') || query.includes('compliance') || query.includes('secure') || query.includes('security')) {
    return `Great question — this is usually the first thing doctors ask, and it should be.\n\nAI Smart Scribe offers two deployment options:\n\n**1. Cloud (HIPAA BAA included)**\nAll data is encrypted in transit and at rest. We sign a full HIPAA Business Associate Agreement with every practice. SOC 2 Type II compliant infrastructure.\n\n**2. Local On-Premise**\nThe AI runs entirely on your local network. Audio is processed on-site and never leaves your practice. This is HIPAA compliant by architecture, not just policy — there's nothing to breach because patient data never touches the internet.\n\nEither way, audio is processed in real-time and immediately discarded. We never store recordings after the visit ends, and we never train AI models on your patient data.`;
  }

  if (query.includes('practice') || query.includes('local') || query.includes('on-prem') || query.includes('run inside') || query.includes('network')) {
    return `Yes — AI Smart Scribe has a full on-premise deployment option.\n\nThe AI runs entirely within your practice network. Audio capture, transcription, and SOAP note generation all happen locally on your device. No patient data ever leaves your building.\n\nThis is especially popular with practices that want maximum control over PHI. Setup takes under 10 minutes, and it works without internet access once installed.\n\nThe cloud option is also available if you prefer — it comes with a full HIPAA BAA and SOC 2 compliant infrastructure.`;
  }

  if (query.includes('time') || query.includes('save') || query.includes('hours') || query.includes('roi') || query.includes('efficiency')) {
    return `Great question. How many patients do you typically see per day?\n\nTo give you a rough idea: most doctors save **4-6 minutes per patient** on documentation with AI Smart Scribe.\n\nFor a practice seeing 25 patients/day, that works out to:\n- **~2 hours saved per day**\n- **~10 hours per week**\n- **~500+ hours per year**\n\nThat's 500 hours you get back — time you could spend with patients, with family, or simply not at your desk at 7pm finishing charts.\n\nMost of our doctors tell us the biggest change isn't even the time — it's going home at the end of the day with their notes already done.`;
  }

  if (query.includes('optomate') || query.includes('ehr') || query.includes('emr') || query.includes('integration') || query.includes('practice management')) {
    return `AI Smart Scribe works alongside Optomate without any disruption to your current workflow.\n\nHere's how it works:\n1. AI Smart Scribe listens during the encounter and generates the SOAP note\n2. You review the note on your screen (takes about 30 seconds)\n3. Approve with one click, then paste directly into the Optomate patient record\n\nIt's copy-paste today, and a direct Optomate integration is on our near-term roadmap. Either way, most doctors find the review-and-paste step takes less time than typing a single line of the note manually.\n\nIt also works with any other EHR or practice management system you might use.`;
  }

  if (query.includes('cost') || query.includes('price') || query.includes('pricing') || query.includes('how much') || query.includes('subscription')) {
    return `Pricing is tailored to each practice based on size and deployment preference, so I don't want to give you a generic number.\n\nWhat I can tell you is that most practices see ROI within the first month — the time savings alone usually justify the investment several times over.\n\nI'd love to connect you with **Dennis Foy at Integra Consulting** — he works directly with independent practices in Louisiana and Mississippi and can give you a straightforward, no-obligation quote based on your specific setup.\n\nWould you like to schedule a quick 30-minute call?`;
  }

  if (query.includes('next step') || query.includes('get started') || query.includes('interested') || query.includes('sign up') || query.includes('trial') || query.includes('demo') || query.includes('schedule') || query.includes('call')) {
    return `I'd love to connect you with **Dennis Foy at Integra Consulting** — he implements AI Smart Scribe for independent practices in Louisiana and Mississippi and can walk you through exactly what this would look like in your specific workflow.\n\nHe can do a live demo with your actual exam flow so you can see the notes it generates for your specialty.\n\nWould you like to schedule a quick 30-minute call?\n\n📅 **Schedule a Call** — [Contact Dennis at Integra Consulting]`;
  }

  // Default fallback
  return `Thanks for your interest in AI Smart Scribe!\n\nI can help you with questions about:\n- **How it works** — ambient AI that listens and generates SOAP notes in real-time\n- **HIPAA compliance** — cloud with BAA or fully on-premise options\n- **EHR integration** — works with Optomate and any other system\n- **Time savings** — most doctors save 2+ hours per day\n- **Sample SOAP notes** — I can generate a realistic optometry example\n\nWhat would you like to know more about?`;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // If no API key, return canned responses so the demo works without billing
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const lastMsg = messages[messages.length - 1].content.toLowerCase();
      const reply = getCannedResponse(lastMsg);
      return res.status(200).json({ reply });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Anthropic API error:', response.status, errBody);
      return res.status(502).json({ error: 'Failed to get response from AI' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || 'I apologize, I was unable to generate a response. Please try again.';

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
