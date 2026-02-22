"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import { useAccount } from "@/hooks/use-account"
import { Wallet } from "lucide-react"
import { toast } from "sonner"
import { isConnected } from "@stellar/freighter-api"

interface ConnectButtonProps {
  label?: string
  variant?: "default" | "shiny" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  /** For variant="shiny": button width in px (default from size) */
  width?: number
}

export function ConnectButton({
  label = "Connect Wallet",
  variant = "shiny", // Force rebuild
  size = "default",
  className,
  width,
}: ConnectButtonProps) {
  const { connect, isLoading } = useAccount()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false)

  // Debug what's disabling the button
  console.log("ConnectButton state:", { isLoading, isConnecting, isFreighterAvailable, disabled: isLoading || isConnecting || !isFreighterAvailable })

  // Check if Freighter is available using the same method as AccountProvider
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        // This will throw if Freighter is not available
        await isConnected()
        console.log("Freighter available via isConnected()")
        setIsFreighterAvailable(true)
      } catch (error) {
        console.log("Freighter not available:", error)
        setIsFreighterAvailable(false)
        
        // Fallback: also check window.freighter
        if (typeof window !== "undefined" && window.freighter) {
          console.log("Freighter found via window.freighter, setting available")
          setIsFreighterAvailable(true)
        }
      }
    }
    
    checkFreighter()
    
    // Also check after a delay in case Freighter loads late
    const delayedCheck = setTimeout(checkFreighter, 2000)
    return () => clearTimeout(delayedCheck)
  }, [])

  const handleConnect = async () => {
    if (!isFreighterAvailable) {
      toast.error("Freighter wallet not found", {
        description: "Please install the Freighter wallet extension to continue.",
        action: {
          label: "Install Freighter",
          onClick: () => window.open("https://www.freighter.app/", "_blank"),
        },
      })
      return
    }

    try {
      setIsConnecting(true)
      await connect()
      toast.success("Wallet connected successfully!")
    } catch (error: unknown) {
      console.error("Failed to connect wallet:", error)
      const message = error instanceof Error ? error.message : ""
      if (message?.includes("User declined access")) {
        toast.error("Connection cancelled", {
          description: "You declined the wallet connection request.",
        })
      } else {
        toast.error("Failed to connect wallet", {
          description: "Please try again or check your Freighter wallet.",
        })
      }
    } finally {
      setIsConnecting(false)
    }
  }

  if (variant === "shiny") {
    const metalWidth = width ?? (size === "lg" ? 180 : size === "sm" ? 120 : 152)
    return (
      <LiquidMetalButton
        label={isConnecting ? "Connecting..." : label}
        onClick={handleConnect}
        disabled={isLoading || isConnecting || !isFreighterAvailable}
        width={metalWidth}
        className={className}
      />
    )
  }

  return (
    <Button
      variant={variant}
      onClick={handleConnect}
      disabled={isLoading || isConnecting || !isFreighterAvailable}
      size={size}
      className={className ?? "gap-2 px-5 py-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-600"}
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : label}
    </Button>
  )
}