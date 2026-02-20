"use client"

import { ArrowUpRight } from "lucide-react"
import { ReactNode } from "react"

type FeatureCardProps = {
  icon: ReactNode
  label: string
  title: string
  description: string
  href?: string
  cta?: string
}

export function FeatureCard({
  icon,
  label,
  title,
  description,
  href = "#",
  cta = "Learn more",
}: FeatureCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10">
      <div className="space-y-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl text-white">
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/50">
          {label}
        </p>
        <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {title}
        </h3>
        <p className="text-sm text-white/70 leading-relaxed">{description}</p>
      </div>

      <a
        href={href}
        className="mt-6 inline-flex items-center text-sm font-medium text-[#a78bfa] hover:text-[#c4b5fd]"
      >
        {cta}
        <ArrowUpRight className="ml-1 h-4 w-4" />
      </a>
    </div>
  )
}
