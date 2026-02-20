import { NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { setPlanForOrder, type PlanId } from "@/lib/subscription-store"

const WEBHOOK_SECRET = process.env.DODO_PAYMENTS_WEBHOOK_SECRET

function verifySignature(rawBody: string, headers: { id?: string; timestamp?: string; signature?: string }): boolean {
  if (!WEBHOOK_SECRET || !headers.id || !headers.timestamp || !headers.signature) return false
  const signedPayload = `${headers.id}.${headers.timestamp}.${rawBody}`
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(signedPayload).digest("base64")
  const received = headers.signature.replace(/^v1,/, "")
  try {
    return timingSafeEqual(Buffer.from(expected, "base64"), Buffer.from(received, "base64"))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }
  const rawBody = await req.text()
  const webhookId = req.headers.get("webhook-id") ?? ""
  const webhookTimestamp = req.headers.get("webhook-timestamp") ?? ""
  const webhookSignature = req.headers.get("webhook-signature") ?? ""

  if (!verifySignature(rawBody, { id: webhookId, timestamp: webhookTimestamp, signature: webhookSignature })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let payload: { type?: string; data?: { payment_id?: string; metadata?: Record<string, string> } }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (payload.type === "payment.succeeded" && payload.data) {
    const data = payload.data as { payment_id?: string; metadata?: Record<string, string> }
    const paymentId = data.payment_id
    const planId = (data.metadata?.plan_id || "").toLowerCase() as PlanId
    if (paymentId && (planId === "builder" || planId === "pro")) {
      setPlanForOrder(paymentId, planId)
    }
  }

  return NextResponse.json({ received: true })
}
