"use client"

import Link from "next/link"
import { ArrowRight, Globe, ExternalLink } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { DotPattern } from "@/components/dot-pattern"
import { PageTransition } from "@/components/page-transition"
import { OnboardingResourceCard } from "@/components/onboarding-resource-card"

const SHINY_CLASS =
  "rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white/20 hover:bg-white/10"

const STELLAR_DEX = "https://developers.stellar.org/docs/defi/direct-dex"
const ALLBRIDGE = "https://allbridge.io"
const SOROBAN_RUST_GUIDE = "https://developers.stellar.org/docs/learn/fundamentals/contract-development"

export default function OnboardingExplorePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <PageTransition>
        <main>
          <section className="relative overflow-hidden border-b border-zinc-800/50">
            <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-screen" aria-hidden>
              <DotPattern fixed={false} baseColor="#52525b" glowColor="#71717a" gap={22} dotSize={2.5} proximity={140} waveSpeed={0.4} baseOpacityMin={0.28} baseOpacityMax={0.48} />
            </div>
            <div className="relative z-10 mx-auto max-w-3xl px-4 pt-24 pb-16 text-center sm:pt-28 sm:pb-20">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Explore the Stellar ecosystem
              </h1>
              <p className="mt-3 text-lg text-zinc-400">
                Bridge assets, trade tokens, and use DeFi on Stellar. Orbit connects you to protocols in one place.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/swap"
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white ${SHINY_CLASS}`}
                >
                  <Globe className="h-4 w-4" />
                  Open Swap
                </Link>
                <Link
                  href="/protocols#try"
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white ${SHINY_CLASS}`}
                >
                  <ExternalLink className="h-4 w-4" />
                  My Protocols
                </Link>
              </div>
            </div>
          </section>

          <section className="px-4 py-12 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                On Orbit
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <OnboardingResourceCard
                  title="Swap"
                  description="Swap tokens on Stellar DEX (SoroSwap) with a simple interface."
                  href="/swap"
                  external={false}
                />
                <OnboardingResourceCard
                  title="My Protocols"
                  description="Supply, borrow, and interact with lending and other DeFi protocols."
                  href="/protocols#try"
                  external={false}
                />
              </div>
            </div>
          </section>

          <section className="border-t border-zinc-800 px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Build with Soroban
              </h2>
              <p className="mt-2 text-zinc-400">Write smart contracts and understand the Stellar smart contract platform.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <OnboardingResourceCard
                  title="Soroban & Rust Guide"
                  description="Official guide to writing Soroban smart contracts in Rust. Covers the SDK, deployment, and testing."
                  href={SOROBAN_RUST_GUIDE}
                  external={true}
                />
              </div>
            </div>
          </section>

          <section className="border-t border-zinc-800 px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Bridge & move assets
              </h2>
              <p className="mt-2 text-zinc-400">Bring assets from other chains to Stellar or move value across the network.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <OnboardingResourceCard title="Allbridge" description="Cross-chain bridge to and from Stellar." href={ALLBRIDGE} />
                <OnboardingResourceCard title="Stellar DEX" description="Learn how the built-in DEX and liquidity pools work." href={STELLAR_DEX} />
              </div>
            </div>
          </section>

          <section className="border-t border-zinc-800 px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <div className={`rounded-2xl p-6 sm:p-8 ${SHINY_CLASS}`}>
                <h3 className="text-lg font-semibold text-white">One place for Stellar DeFi</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Orbit gives you swap, lending, and protocol UIs so you don’t have to jump between multiple apps.
                </p>
                <Link href="/" className={`mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white ${SHINY_CLASS}`}>
                  Open Orbit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/onboarding#paths" className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 ${SHINY_CLASS}`}>
                  ← Back to paths
                </Link>
                <Link href="/" className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white ${SHINY_CLASS}`}>
                  Open Orbit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
    </div>
  )
}
