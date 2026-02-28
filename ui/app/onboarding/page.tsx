"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import {
  ExternalLink,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DotPattern } from "@/components/dot-pattern"
import { PageTransition } from "@/components/page-transition"
import { NumberTicker } from "@/components/ui/number-ticker"

const viewport = { once: true, amount: 0.12 }
const transition = { duration: 0.55, ease: "easeOut" as const }
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
}

function FadeInSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
const NUMBERS_HEADLINE = "Let's build something great."
const NUMBERS_DESCRIPTION =
  "Stellar powers fast, low-cost payments and DeFi at scale. Join thousands of projects and developers building on a network designed for the real world."

const ORBIT_DISCORD_URL = "https://discord.gg/stellardev"
const ORBIT_X_URL = "https://x.com/StellarOrg"
const ORBIT_WEBSITE_URL = "https://orbitkit.fun"

// Logo links without box — icon only, subtle hover
function JoinOrbitLogoLink({
  href,
  ariaLabel,
  children,
  external = true,
}: {
  href: string
  ariaLabel: string
  children: ReactNode
  external?: boolean
}) {
  const className =
    "flex h-12 w-12 shrink-0 items-center justify-center text-white transition-opacity duration-300 hover:opacity-80 sm:h-14 sm:w-14"
  const content = <>{children}</>
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={className}>
        {content}
      </a>
    )
  }
  return (
    <Link href={href} aria-label={ariaLabel} className={className}>
      {content}
    </Link>
  )
}

const PATHS = [
  {
    id: "beginners",
    title: "New to Crypto",
    subtitle: "New to crypto (and Stellar)?",
    href: "/onboarding/beginners",
    percentage: 10,
  },
  {
    id: "explore",
    title: "Seasoned Web3 Users",
    subtitle: "Explore the Stellar Ecosystem",
    href: "/onboarding/explore",
    percentage: 25,
  },
  {
    id: "developers",
    title: "Developers",
    subtitle: "Ready to Build?",
    href: "/onboarding/developers",
    percentage: 50,
  },
  {
    id: "enterprise",
    title: "Businesses",
    subtitle: "Enterprise Solution?",
    href: "/onboarding/enterprise",
    percentage: 75,
  },
]

const STATS: Array<{
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimalPlaces?: number
}> = [
  { label: "Projects", value: 500, suffix: "+" },
  { label: "Finality", value: 5, prefix: "< ", suffix: "s" },
  { label: "Fees", value: 0.01, prefix: "< $", decimalPlaces: 2 },
  { label: "TPS", value: 1000, suffix: "+" },
]

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <PageTransition>
        <main>
          {/* Hero — Stellar logo + Welcome + tagline */}
          <section className="relative overflow-hidden border-b border-zinc-800/50">
            <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-screen" aria-hidden>
              <DotPattern
                fixed={false}
                baseColor="#52525b"
                glowColor="#71717a"
                gap={22}
                dotSize={2.5}
                proximity={140}
                waveSpeed={0.4}
                baseOpacityMin={0.28}
                baseOpacityMax={0.48}
              />
            </div>
            <FadeInSection className="relative z-10 mx-auto max-w-3xl px-4 pt-28 pb-20 text-center sm:pt-32 sm:pb-28">
              <div className="mx-auto w-fit mix-blend-screen">
                <Image
                  src="/stellar-logo.png"
                  alt="Stellar"
                  width={380}
                  height={98}
                  className="h-20 w-auto sm:h-24 md:h-28 lg:h-32 xl:h-36 object-contain"
                  priority
                />
              </div>
              <h1
                className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Welcome to Stellar
              </h1>
              <p className="mt-4 text-lg text-zinc-400 sm:text-xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                The fast, scalable network for payments and DeFi. Choose your path to join the future of decentralized applications.
              </p>
            </FadeInSection>
          </section>

          {/* Choose Your Path */}
          <section id="paths" className="relative scroll-mt-24 border-b border-zinc-800/50 px-4 py-20 sm:py-28">
            <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-screen bg-black/40" aria-hidden />
            <FadeInSection className="relative z-10 mx-auto max-w-6xl">
              <div className="space-y-3 text-center">
                <h2
                  className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Choose Your Path
                </h2>
                <p className="mx-auto max-w-xl text-zinc-400">
                  Find the right resources for your Stellar journey
                </p>
              </div>
              <motion.div
                className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={{
                  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
                  hidden: {},
                }}
              >
                {PATHS.map((path) => {
                  const percentage = path.percentage ?? 10
                  return (
                    <motion.div key={path.id} variants={cardVariants} className="flex min-h-[160px]">
                      <Link
                        href={path.href}
                        className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-zinc-800/80 bg-black text-left transition-all duration-300 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/20"
                      >
                        <div
                          className="absolute inset-0 rounded-3xl"
                          style={{
                            background:
                              "linear-gradient(165deg, rgba(255,255,255,0.07) 0%, transparent 35%, transparent 70%, rgba(0,0,0,0.4) 100%), linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
                            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
                          }}
                          aria-hidden
                        />
                        <div className="relative z-10 flex flex-1 flex-col justify-center p-6">
                          <h3 className="text-lg font-semibold uppercase tracking-wider text-white sm:text-xl">
                            {path.subtitle}
                          </h3>
                          <p className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            {percentage}%
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </FadeInSection>
          </section>

          {/* Stellar by the Numbers — two columns: big headline + paragraph left, 2x2 stats right (no box) */}
          <section id="numbers" className="relative scroll-mt-24 border-b border-zinc-800/50 px-4 py-20 sm:py-28">
            <FadeInSection className="mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
                {/* Left: big headline + paragraph */}
                <div className="space-y-5">
                  <h2
                    className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {NUMBERS_HEADLINE}
                  </h2>
                  <p
                    className="max-w-lg text-lg leading-relaxed text-zinc-400 sm:text-xl"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {NUMBERS_DESCRIPTION}
                  </p>
                </div>
                {/* Right: 2x2 stats — icon, value, label */}
                <div className="grid grid-cols-2 gap-10 sm:gap-14">
                  {STATS.map((stat, idx) => (
                    <div key={stat.label} className="flex flex-col gap-4">
                      <div
                        className="text-5xl font-semibold tracking-tight text-white sm:text-6xl"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {stat.prefix ?? ""}
                        <NumberTicker
                          value={stat.value}
                          decimalPlaces={stat.decimalPlaces ?? 0}
                          delay={0.08 * idx}
                          className="text-5xl font-semibold tracking-tight text-white sm:text-6xl"
                        />
                        {stat.suffix ?? ""}
                      </div>
                      <div className="text-lg font-medium text-zinc-400 sm:text-xl">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* Join Orbit */}
          <section id="join" className="relative scroll-mt-24 px-4 py-20 sm:py-28">
            <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-screen bg-zinc-950/50" aria-hidden />
            <FadeInSection className="relative z-10 mx-auto max-w-2xl text-center">
              <div className="space-y-4">
                <h2
                  className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Join Orbit
                </h2>
                <p className="text-zinc-400">
                  Connect with the global Stellar community. Orbit is building the future of decentralized applications together.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                <JoinOrbitLogoLink href={ORBIT_DISCORD_URL} ariaLabel="Join Discord" external>
                  <svg className="h-7 w-7 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </JoinOrbitLogoLink>
                <JoinOrbitLogoLink href={ORBIT_X_URL} ariaLabel="Follow on X" external>
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </JoinOrbitLogoLink>
                <JoinOrbitLogoLink href={ORBIT_WEBSITE_URL} ariaLabel="Orbit website (orbitkit.fun)" external>
                  <ExternalLink className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-300" aria-hidden />
                </JoinOrbitLogoLink>
              </div>
              <footer className="mt-14 border-t border-zinc-800 pt-10">
                <p className="text-sm text-zinc-500">
                  © Orbit. All rights reserved.
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                  <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                    Privacy Policy
                  </Link>
                  <span aria-hidden>•</span>
                  <Link href="/docs" className="hover:text-zinc-300 transition-colors">
                    FAQ
                  </Link>
                  <span aria-hidden>•</span>
                  <Link href="/docs" className="hover:text-zinc-300 transition-colors">
                    Disclaimer
                  </Link>
                </div>
              </footer>
            </FadeInSection>
          </section>
        </main>
      </PageTransition>
      <Footer />
    </div>
  )
}
