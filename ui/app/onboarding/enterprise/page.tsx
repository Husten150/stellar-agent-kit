"use client"

import Link from "next/link"
import { ArrowRight, Building2, Scale, Headphones, ExternalLink } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { DotPattern } from "@/components/dot-pattern"
import { PageTransition } from "@/components/page-transition"
import { OnboardingResourceCard } from "@/components/onboarding-resource-card"

const SHINY_CLASS =
  "rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white/20 hover:bg-white/10"

const STELLAR_ENTERPRISE = "https://www.stellar.org/enterprise"
const STELLAR_USE_CASES = "https://www.stellar.org/use-cases"
const STELLAR_DOCS = "https://developers.stellar.org"

export default function OnboardingEnterprisePage() {
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
                Enterprise solutions
              </h1>
              <p className="mt-3 text-lg text-zinc-400">
                Stellar is built for fast, low-cost payments and compliant infrastructure. See how enterprises use the network.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={STELLAR_ENTERPRISE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white ${SHINY_CLASS}`}
                >
                  <ExternalLink className="h-4 w-4" />
                  Stellar for Enterprise
                </a>
                <Link
                  href="/devkit"
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white ${SHINY_CLASS}`}
                >
                  Orbit DevKit
                </Link>
              </div>
            </div>
          </section>

          <section className="px-4 py-12 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Why Stellar for business
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                <li className={`flex gap-4 rounded-2xl p-6 ${SHINY_CLASS}`}>
                  <Scale className="h-6 w-6 shrink-0 text-zinc-400" />
                  <div>
                    <h3 className="font-semibold text-white">Scalable & low cost</h3>
                    <p className="mt-1 text-sm text-zinc-400">High throughput and sub-cent fees for payments and settlements.</p>
                  </div>
                </li>
                <li className={`flex gap-4 rounded-2xl p-6 ${SHINY_CLASS}`}>
                  <Building2 className="h-6 w-6 shrink-0 text-zinc-400" />
                  <div>
                    <h3 className="font-semibold text-white">Proven adoption</h3>
                    <p className="mt-1 text-sm text-zinc-400">Used by MoneyGram, Visa, and other institutions worldwide.</p>
                  </div>
                </li>
                <li className={`flex gap-4 rounded-2xl p-6 ${SHINY_CLASS}`}>
                  <Headphones className="h-6 w-6 shrink-0 text-zinc-400" />
                  <div>
                    <h3 className="font-semibold text-white">Support & partnerships</h3>
                    <p className="mt-1 text-sm text-zinc-400">Stellar Development Foundation and ecosystem partners for enterprise needs.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="border-t border-zinc-800 px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>Resources</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <OnboardingResourceCard title="Stellar for Enterprise" description="Official overview of Stellar for businesses and institutions." href={STELLAR_ENTERPRISE} />
                <OnboardingResourceCard title="Use cases" description="Payments, remittance, and asset issuance on Stellar." href={STELLAR_USE_CASES} />
                <OnboardingResourceCard title="Developer documentation" description="Technical docs for integrating with Stellar." href={STELLAR_DOCS} />
                <OnboardingResourceCard title="Orbit DevKit" description="SDK, APIs, and tools to build on Stellar — swap, lending, payments." href="/devkit" external={false} />
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
