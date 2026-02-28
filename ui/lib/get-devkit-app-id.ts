/**
 * Client-only: read the current DevKit project's appId from localStorage.
 * Use when calling gated SDK API routes (swap, lending, price, send, balance)
 * so the request includes x-app-id and is allowed if the project has an active plan.
 */
const PROJECT_STORAGE_KEY = "stellar-devkit-project"

export function getDevKitAppId(): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY)
    if (!raw) return null
    const project = JSON.parse(raw) as { appId?: string }
    return project?.appId && typeof project.appId === "string" ? project.appId.trim() : null
  } catch {
    return null
  }
}

/** Headers to add to fetch() for gated SDK routes. Include in every request to swap/lending/price/send/balance. */
export function sdkApiHeaders(): Record<string, string> {
  const appId = getDevKitAppId()
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (appId) headers["x-app-id"] = appId
  return headers
}

/**
 * Headers for in-site demo (Try Swap, Send, Balance, Prices, Lending). Do not send x-app-id
 * so the API allows the request without plan gating. Gating applies when developers use the
 * SDK with x-app-id from their own apps.
 */
export function demoApiHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" }
}
