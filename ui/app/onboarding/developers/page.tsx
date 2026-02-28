"use client"

import Link from "next/link"
import { ArrowRight, Code2, BookOpen, Bot, Terminal, ExternalLink } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { DotPattern } from "@/components/dot-pattern"
import { PageTransition } from "@/components/page-transition"
import { OnboardingResourceCard } from "@/components/onboarding-resource-card"

const SHINY_CLASS =
  "rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white/20 hover:bg-white/10"

const STELLAR_DOCS = "https://developers.stellar.org"
const STELLAR_DISCORD = "https://discord.gg/stellardev"
const GITHUB_SDK = "https://github.com/stellar/stellar-agent-kit"

const STEPS = [
  {
    step: 1,
    title: "Read the docs",
    description: "Stellar’s developer documentation covers the network, Soroban, and DeFi building blocks.",
    href: STELLAR_DOCS,
    cta: "Open documentation",
    icon: BookOpen,
  },
  {
    step: 2,
    title: "Use the DevKit",
    description: "Orbit’s DevKit gives you one SDK for swap, send, lending, oracles, and MCP for Cursor/Claude.",
    href: "/devkit",
    internal: true,
    cta: "Open DevKit",
    icon: Code2,
  },
  {
    step: 3,
    title: "Join the community",
    description: "Ask questions and share what you build in the Stellar developer Discord.",
    href: STELLAR_DISCORD,
    cta: "Join Discord",
    icon: Bot,
  },
]

function StepBadge({ step }: { step: number }) {
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${SHINY_CLASS}`}>
      {step}
    </span>
  )
}

export default function OnboardingDevelopersPage() {
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
                Developers
              </h1>
              <p className="mt-3 text-lg text-zinc-400">
                Documentation, DevKit tools, and community support for building on Stellar.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/devkit"
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white ${SHINY_CLASS}`}
                >
                  <Terminal className="h-4 w-4" />
                  Open DevKit
                </Link>
                <a
                  href={STELLAR_DOCS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white ${SHINY_CLASS}`}
                >
                  <ExternalLink className="h-4 w-4" />
                  Stellar docs
                </a>
              </div>
            </div>
          </section>

          <section className="px-4 py-12 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Your path
              </h2>
              <ol className="mt-8 space-y-8">
                {STEPS.map(({ step, title, description, href, cta, icon: Icon, internal }) => (
                  <li key={step} className="flex gap-6">
                    <StepBadge step={step} />
                    <div className={`min-w-0 flex-1 rounded-2xl p-6 ${SHINY_CLASS}`}>
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                          <Icon className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{title}</h3>
                          <p className="mt-2 text-zinc-400">{description}</p>
                          {internal ? (
                            <Link href={href} className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white ${SHINY_CLASS}`}>
                              {cta}
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          ) : (
                            <a href={href} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white ${SHINY_CLASS}`}>
                              {cta}
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="border-t border-zinc-800 px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>Resources</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <OnboardingResourceCard title="Orbit DevKit" description="SDK, swap, lending, MCP. Build on Stellar in one place." href="/devkit" external={false} />
                <OnboardingResourceCard title="Stellar documentation" description="Official technical docs for the Stellar network." href={STELLAR_DOCS} />
                <OnboardingResourceCard title="stellar-agent-kit" description="Unified SDK and CLI on GitHub." href={GITHUB_SDK} />
                <OnboardingResourceCard title="Stellar Discord" description="Developer community and support." href={STELLAR_DISCORD} />
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
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
