import { NextResponse } from "next/server"
import { setPlanForOrder, type PlanId } from "@/lib/subscription-store"

const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY
const DODO_ENV = process.env.DODO_PAYMENTS_ENVIRONMENT || "test_mode"
const BASE_URL =
  DODO_ENV === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com"

export async function POST(req: Request) {
  if (!DODO_API_KEY) {
    return NextResponse.json(
      { error: "Dodo Payments not configured." },
      { status: 500 }
    )
  }
  let body: { paymentId: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { paymentId } = body
  if (!paymentId) {
    return NextResponse.json(
      { error: "paymentId required" },
      { status: 400 }
    )
  }

  const res = await fetch(`${BASE_URL}/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${DODO_API_KEY}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: "Payment not found or verification failed" },
      { status: 400 }
    )
  }

  const payment = (await res.json()) as {
    status?: string
    metadata?: Record<string, string>
  }

  if (payment.status !== "succeeded") {
    return NextResponse.json(
      { error: "Payment not succeeded" },
      { status: 400 }
    )
  }

  const planId = (payment.metadata?.plan_id || "").toLowerCase() as PlanId
  if (planId !== "builder" && planId !== "pro") {
    return NextResponse.json(
      { error: "Invalid plan in payment metadata" },
      { status: 400 }
    )
  }

  setPlanForOrder(paymentId, planId)
  return NextResponse.json({ success: true, plan: planId, paymentId })
}
