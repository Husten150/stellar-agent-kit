import * as React from "react"

import { cn } from "@/lib/utils"

type CodeWindowProps = {
  code: string
  title?: string
  startLine?: number
  className?: string
  headerRight?: React.ReactNode
}

function highlightLine(line: string, lineIndex: number): React.ReactNode {
  if (!line) return " "

  const commentIndex = line.indexOf("//")
  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : null

  const parts: React.ReactNode[] = []
  const tokenRegex =
    /(".*?"|'.*?'|`.*?`|\b\d+(?:\.\d+)?\b|\b(import|from|const|let|var|await|async|return|new|export|function|if|else|for|while|switch|case|default|class|extends|type|interface|try|catch|finally)\b)/g

  let lastIndex = 0
  let match: RegExpExecArray | null
  let tokenIndex = 0

  while ((match = tokenRegex.exec(codePart)) !== null) {
    if (match.index > lastIndex) {
      parts.push(codePart.slice(lastIndex, match.index))
    }

    const token = match[0]
    let className = ""

    if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
      className = "text-[#98c379]" // strings: green
    } else if (/^\d/.test(token)) {
      className = "text-[#d19a66]" // numbers: orange
    } else {
      className = "text-[#c678dd]" // keywords: purple
    }

    parts.push(
      <span key={`t-${lineIndex}-${tokenIndex++}`} className={className}>
        {token}
      </span>,
    )

    lastIndex = tokenRegex.lastIndex
  }

  if (lastIndex < codePart.length) {
    parts.push(codePart.slice(lastIndex))
  }

  if (commentPart) {
    parts.push(
      <span key={`c-${lineIndex}`} className="text-zinc-500">
        {commentPart}
      </span>,
    )
  }

  return parts
}

export function CodeWindow({
  code,
  title = "stellar-agent-kit",
  startLine = 1,
  className,
  headerRight,
}: CodeWindowProps) {
  const lines = React.useMemo(
    () => code.replace(/\n$/, "").split("\n"),
    [code],
  )

  return (
    <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-3 h-3 rounded-full bg-zinc-600" />
          <span className="w-3 h-3 rounded-full bg-zinc-600" />
          <span className="w-3 h-3 rounded-full bg-zinc-600" />
          {title ? (
            <span className="text-zinc-500 text-xs font-medium ml-2 truncate max-w-[60%]">
              {title}
            </span>
          ) : null}
        </div>
        {headerRight ? <div className="flex items-center gap-2 shrink-0">{headerRight}</div> : null}
      </div>
      <div className="p-4 font-mono text-xs sm:text-sm overflow-y-auto overflow-x-hidden">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index}>
                <td className="text-zinc-600 select-none w-8 align-top py-0.5 pr-3 text-right">
                  {startLine + index}
                </td>
                <td className="text-zinc-300 whitespace-pre-wrap break-words leading-relaxed">
                  {highlightLine(line, index)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

