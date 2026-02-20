"use client"

type Props = {
  text: string
  className?: string
  as?: "span" | "h1" | "h2" | "h3"
}

export function ScrambleText({ text, className = "", as: Tag = "span" }: Props) {
  return <Tag className={className}>{text}</Tag>
}
