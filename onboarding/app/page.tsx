import Link from "next/link"
import Image from "next/image"
import {
  Zap,
  Shield,
  Globe,
  Wallet,
  ArrowRight,
  Code2,
  Building2,
  MessageCircle,
  Twitter,
  ExternalLink,
} from "lucide-react"

const ORBIT_MAIN_URL = "https://orbitkit.fun"

const PATHS = [
  {
    id: "beginners",
    title: "New to Crypto",
    subtitle: "New to crypto (and Stellar)?",
    description:
      "Complete beginner's guide to crypto on Stellar — learn to set up your wallet, get XLM, and explore your first DeFi apps.",
    bullets: ["Set up wallet", "Get XLM tokens", "Explore decentralized finance"],
    cta: "Get Started",
    href: "/beginners",
    external: false,
    icon: Wallet,
  },
  {
    id: "explore",
    title: "Seasoned Web3 Users",
    subtitle: "Explore the Stellar ecosystem",
    description:
      "Already familiar with crypto? Explore what makes Stellar unique and bridge your assets today.",
    bullets: ["Bridge assets", "Trade tokens", "Explore DeFi"],
    cta: "Explore Now",
    href: "/explore",
    external: false,
    icon: Globe,
  },
  {
    id: "developers",
    title: "Developers",
    subtitle: "Ready to build?",
    description:
      "Access comprehensive documentation, DevKit tools, and community support for building on Stellar.",
    bullets: ["Technical docs", "DevKit & SDK", "Community support"],
    cta: "Start Building",
    href: `${ORBIT_MAIN_URL}/devkit`,
    external: true,
    icon: Code2,
  },
  {
    id: "enterprise",
    title: "Businesses",
    subtitle: "Enterprise solution?",
    description:
      "Discover how leading enterprises leverage Stellar for scalable payments and compliant blockchain solutions.",
    bullets: ["Enterprise partnerships", "Scalable solutions", "Professional support"],
    cta: "Learn More",
    href: "/enterprise",
    external: false,
    icon: Building2,
  },
]

const STATS = [
  { value: "500+", label: "Projects", sub: "Active projects in the ecosystem" },
  { value: "< 5s", label: "Finality", sub: "Fast transaction confirmation" },
  { value: "< $0.01", label: "Fees", sub: "Low transaction costs" },
  { value: "Global", label: "Scale", sub: "Network capacity worldwide" },
]

const NAV_LINKS = [
  { href: "#", label: "Home" },
  { href: "#paths", label: "New Crypto Users" },
  { href: "#paths", label: "Web3 Natives" },
  { href: "#paths", label: "Developers" },
  { href: "#paths", label: "Businesses" },
  { href: "#numbers", label: "By the Numbers" },
  { href: "#join", label: "Community" },
]

const ADOPTION_LOGOS = [
  { name: "Stellar", src: "/brand/logos/stellar.png", width: 140, height: 40 },
  { name: "Circle", src: "/brand/logos/circle.png", width: 140, height: 40 },
  { name: "IBM", src: "/brand/logos/ibm.png", width: 140, height: 40 },
  { name: "Franklin Templeton", src: "/brand/logos/franklin.png", width: 160, height: 40 },
  { name: "MoneyGram", src: "/brand/logos/moneygram.png", width: 160, height: 40 },
  { name: "Visa", src: "/brand/logos/visa.png", width: 140, height: 40 },
  { name: "BlackRock", src: "/brand/logos/blackrock.png", width: 160, height: 40 },
]

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={ORBIT_MAIN_URL}
            className="flex items-center gap-2 text-lg font-semibold text-white hover:text-zinc-200"
          >
            <span className="rounded-lg bg-white/10 px-2 py-1 font-mono text-sm">Orbit</span>
            Onboarding
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href={ORBIT_MAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            Open Orbit
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-zinc-800/50 px-4 py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Welcome to Stellar
            </h1>
            <p className="mt-4 text-lg text-zinc-400 sm:text-xl">
              The fast, scalable network for payments and DeFi. Choose your path to join the future
              of decentralized finance.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Fast & low-cost
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                Built for scale
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-sky-400" />
                Global ecosystem
              </li>
            </ul>
          </div>
        </section>

        {/* Choose Your Path */}
        <section id="paths" className="border-b border-zinc-800/50 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-white">Choose Your Path</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-zinc-400">
              Find the right resources for your Stellar journey
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PATHS.map((path) => {
                const Icon = path.icon
                const cardClass =
                  "group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-600 hover:bg-zinc-900"
                const content = (
                  <>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <Icon className="h-5 w-5 text-zinc-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{path.title}</h3>
                    <p className="mt-1 text-sm font-medium text-zinc-500">{path.subtitle}</p>
                    <p className="mt-3 flex-1 text-sm text-zinc-400">{path.description}</p>
                    <ul className="mt-4 space-y-1.5 text-sm text-zinc-500">
                      {path.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-zinc-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white group-hover:underline">
                      {path.cta}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </>
                )
                if (path.external) {
                  return (
                    <a key={path.id} href={path.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                      {content}
                    </a>
                  )
                }
                return (
                  <Link key={path.id} href={path.href} className={cardClass}>
                    {content}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* By the Numbers */}
        <section id="numbers" className="border-b border-zinc-800/50 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-white">
              Stellar by the Numbers
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center"
                >
                  <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-sm font-medium text-zinc-400">{stat.label}</div>
                  <div className="mt-2 text-xs text-zinc-500">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Worldwide Adoption */}
        <section className="border-b border-zinc-800/50 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-white">
              Worldwide Adoption
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-zinc-400">
              Some of the many enterprises and institutions building on Stellar
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
              {ADOPTION_LOGOS.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-4"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={logo.width}
                    height={logo.height}
                    className="h-8 w-auto object-contain md:h-10"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join / Footer */}
        <section id="join" className="px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Join Orbit</h2>
            <p className="mt-4 text-zinc-400">
              Connect with the Stellar and Orbit community. Build the future of decentralized
              applications together.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://discord.gg/stellar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                <MessageCircle className="h-4 w-4" />
                Join Discord
              </a>
              <a
                href="https://x.com/StellarOrg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                <Twitter className="h-4 w-4" />
                Follow on X
              </a>
              <Link
                href={ORBIT_MAIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                Explore Orbit
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-8 text-xs text-zinc-500">
              © Orbit. Stellar onboarding experience.{" "}
              <a href={ORBIT_MAIN_URL} className="underline hover:text-zinc-400">
                orbitkit.fun
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
