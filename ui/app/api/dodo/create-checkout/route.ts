import { NextResponse } from "next/server"

const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY
const DODO_ENV = process.env.DODO_PAYMENTS_ENVIRONMENT || "test_mode"
const BASE_URL =
  DODO_ENV === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com"

const PRODUCT_IDS: Record<string, string> = {
  builder: process.env.DODO_PAYMENTS_PRODUCT_BUILDER || "",
  pro: process.env.DODO_PAYMENTS_PRODUCT_PRO || "",
}

export async function POST(req: Request) {
  if (!DODO_API_KEY) {
    return NextResponse.json(
      { error: "Dodo Payments not configured. Set DODO_PAYMENTS_API_KEY." },
      { status: 500 }
    )
  }
  let body: { planId: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const planId = (body.planId || "").toLowerCase()
  if (planId !== "builder" && planId !== "pro") {
    return NextResponse.json(
      { error: "Invalid planId. Use 'builder' or 'pro'." },
      { status: 400 }
    )
  }
  const productId = PRODUCT_IDS[planId]
  if (!productId) {
    return NextResponse.json(
      {
        error: `Product not configured for plan '${planId}'. Set DODO_PAYMENTS_PRODUCT_BUILDER and DODO_PAYMENTS_PRODUCT_PRO.`,
      },
      { status: 500 }
    )
  }

  const origin = req.headers.get("origin") || req.headers.get("referer") || ""
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (origin ? new URL(origin).origin : "http://localhost:3000")
  const returnUrl = `${baseUrl}/pricing`

  const res = await fetch(`${BASE_URL}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DODO_API_KEY}`,
    },
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: returnUrl,
      metadata: { plan_id: planId },
      customer: { email: "", name: "Stellar DevKit Customer" },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json(
      { error: "Dodo Payments checkout creation failed", details: err },
      { status: 502 }
    )
  }

  const session = (await res.json()) as { session_id?: string; checkout_url?: string | null }
  const checkoutUrl = session.checkout_url
  if (!checkoutUrl) {
    return NextResponse.json(
      { error: "No checkout URL returned from Dodo Payments" },
      { status: 502 }
    )
  }

  return NextResponse.json({
    checkoutUrl,
    sessionId: session.session_id,
    planId,
  })
}
