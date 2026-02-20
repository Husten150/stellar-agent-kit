"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  name: ReactNode
  className?: string
  background?: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <a
    href={href}
    key={typeof name === "string" ? name : "card"}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl transition-all duration-300",
      "border border-zinc-800 bg-zinc-900/40 hover:border-[#5100fd]/50 hover:bg-zinc-900/70",
      className
    )}
    {...props}
  >
    {background != null ? (
      <div className="absolute inset-0 mask-[linear-gradient(to_top,transparent_30%,#000_70%)]">
        {background}
      </div>
    ) : null}
    <div className="relative z-10 flex flex-1 flex-col p-6">
      <div className="flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-1">
        <Icon className="h-8 w-8 shrink-0 text-[#a78bfa] transition-transform duration-300 ease-out group-hover:scale-95" />
        <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {name}
        </h3>
        <p className="max-w-lg text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
      <div className="mt-4 flex items-center text-sm text-[#a78bfa] group-hover:underline">
        <span>{cta}</span>
        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  </a>
)

export { BentoCard, BentoGrid }
