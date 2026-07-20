/// <reference types="node" />
// Vercel Serverless Function: /api/send-whatsapp
// Sends a WhatsApp message to the DocHome team when a new enquiry comes in.
// IMPORTANT: This never causes enquiry data loss - it's called AFTER the enquiry
// is already saved to the database. If this fails, we just log the error.

export const config = {
  runtime: 'edge',
}

interface EnquiryPayload {
  id: string
  name: string
  phone: string
  city: string
  specialty: string
  message: string | null
}

// Comma separated list of team numbers in E.164 format, e.g. "919876543210,919812345678"
function getTeamNumbers(): string[] {
  const raw = process.env.WHATSAPP_TEAM_NUMBERS || ''
  return raw
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)
}

function buildMessage(e: EnquiryPayload): string {
  const messagePart = e.message ? e.message : '(no additional message)'
  return `🩺 *New DocHome Enquiry*

*Name:* ${e.name}
*Phone:* ${e.phone}
*City:* ${e.city}
*Needs:* ${e.specialty}
*Message:* ${messagePart}

_Please contact the patient as soon as possible._`
}

async function sendToNumber(to: string, text: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    throw new Error('WhatsApp env vars (WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN) are missing')
  }

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`WhatsApp API error (${res.status}): ${errBody}`)
  }

  return res.json()
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const enquiry = (await req.json()) as EnquiryPayload
    const teamNumbers = getTeamNumbers()

    if (teamNumbers.length === 0) {
      // eslint-disable-next-line no-console
      console.error('No WHATSAPP_TEAM_NUMBERS configured - skipping notification')
      return new Response(JSON.stringify({ ok: false, reason: 'no-team-numbers' }), { status: 200 })
    }

    const message = buildMessage(enquiry)

    const results = await Promise.allSettled(teamNumbers.map((num) => sendToNumber(num, message)))

    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length > 0) {
      // eslint-disable-next-line no-console
      console.error('Some WhatsApp notifications failed:', failures)
    }

    return new Response(
      JSON.stringify({
        ok: failures.length < teamNumbers.length,
        sent: teamNumbers.length - failures.length,
        failed: failures.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    // Enquiry is already saved in DB at this point - we only log here, never throw up to the client
    // eslint-disable-next-line no-console
    console.error('send-whatsapp handler error:', err)
    return new Response(JSON.stringify({ ok: false, error: 'Internal error, but enquiry is saved' }), {
      status: 200,
    })
  }
}