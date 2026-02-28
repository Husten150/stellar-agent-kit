"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { DotPattern } from "@/components/dot-pattern"
import { PageTransition } from "@/components/page-transition"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import { AnimatedList } from "@/components/ui/animated-list"
import { TextAnimate } from "@/components/ui/text-animate"

const STELLAR_LEARN = "https://developers.stellar.org/docs/learn"
const FREIGHTER = "https://www.freighter.app"
const FREIGHTER_TUTORIAL_VIDEO = "https://youtu.be/UKmEJYdP6Mg?si=lofJKGqCnKCpuLfE"
const XLM_FAUCET = "https://laboratory.stellar.org/#account-creator"

const SHINY_CLASS =
  "rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white/20 hover:bg-white/10"

const STEPS = [
  {
    step: 1,
    title: "Choose a wallet",
    description: "A wallet holds your XLM and lets you sign transactions. Freighter is a popular browser extension on Stellar.",
    links: [{ name: "Freighter", href: FREIGHTER, desc: "Browser extension" }],
  },
  {
    step: 2,
    title: "Get XLM",
    description: "You need a little XLM for transaction fees. Use the lab faucet for testnet or an exchange for mainnet.",
    links: [{ name: "Get test XLM", href: XLM_FAUCET, desc: "Testnet faucet" }],
  },
  {
    step: 3,
    title: "Explore DeFi on Orbit",
    description: "Swap tokens, supply or borrow, and try real Stellar apps — all from Orbit.",
    links: [{ name: "Try Orbit", href: "/swap", desc: "Try it live", internal: true }],
  },
]

function AnimatedStepCard({
  step,
  title,
  description,
  links,
}: {
  step: number
  title: string
  description: string
  links: Array<{ name: string; href: string; desc: string; internal?: boolean }>
}) {
  return (
    <div
      className="flex flex-col gap-3 py-4"
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold tabular-nums text-white sm:text-4xl">{step}.</span>
        <h3 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h3>
      </div>
      <p className="text-lg text-zinc-400 sm:text-xl">{description}</p>
      <div className="mt-1 flex flex-wrap gap-3">
        {links.map((link: { name: string; href: string; desc: string; internal?: boolean }) =>
          link.internal ? (
            <LiquidMetalButton
              key={link.name}
              href={link.href}
              label={link.name}
              width={150}
            />
          ) : (
            <LiquidMetalButton
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              label={link.name}
              width={150}
            />
          )
        )}
      </div>
    </div>
  )
}

export default function OnboardingBeginnersPage() {
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
                New to Crypto
              </h1>
              <p className="mt-3 text-lg text-zinc-400">A short guide to get you from zero to using Stellar and Orbit.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <LiquidMetalButton
                  href={FREIGHTER}
                  target="_blank"
                  rel="noopener noreferrer"
                  label="Download Freighter"
                  width={180}
                />
                <LiquidMetalButton
                  href={FREIGHTER_TUTORIAL_VIDEO}
                  target="_blank"
                  rel="noopener noreferrer"
                  label="Watch tutorial"
                  width={160}
                />
              </div>
            </div>
          </section>

          <section className="px-4 py-12 sm:py-16">
            <div className="mx-auto max-w-3xl">
              <TextAnimate
                as="h2"
                animation="slideUp"
                by="word"
                duration={1}
                className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                How to get started
              </TextAnimate>
              <p className="mt-2 text-zinc-400">Follow these steps to go from zero to using Stellar and Orbit.</p>
              <AnimatedList delay={800} className="mt-8 w-full gap-4">
                {STEPS.map(({ step, title, description, links }) => (
                  <AnimatedStepCard
                    key={step}
                    step={step}
                    title={title}
                    description={description}
                    links={links}
                  />
                ))}
              </AnimatedList>
            </div>
          </section>

          <section className="border-t border-zinc-800 px-4 py-10">
            <div className="mx-auto max-w-3xl">
              <div className={`rounded-2xl p-6 sm:p-8 ${SHINY_CLASS}`}>
                <h3 className="text-lg font-semibold text-white">Learn more</h3>
                <p className="mt-2 text-sm text-zinc-400">Stellar’s official docs cover concepts, wallets, and building on the network.</p>
                <a href={STELLAR_LEARN} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white ${SHINY_CLASS}`}>
                  Stellar documentation
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/onboarding#paths" className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-zinc-300 ${SHINY_CLASS}`}>
                  ← Back to paths
                </Link>
                <Link href="/" className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${SHINY_CLASS}`}>
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
