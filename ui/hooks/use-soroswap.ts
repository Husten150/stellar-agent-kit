"use client"

import { useState } from "react"
import { demoApiHeaders } from "@/lib/get-devkit-app-id"

// Types matching the SoroSwapClient
interface Asset {
  contractId?: string
  code?: string
  issuer?: string
}

interface QuoteResponse {
  expectedIn: string
  expectedOut: string
  minOut: string
  route: string[]
  rawData?: unknown
}

export function useSoroSwap() {
  const [isLoading, setIsLoading] = useState(false)

  const getQuote = async (
    fromAsset: Asset,
    toAsset: Asset,
    amount: string,
    network: "testnet" | "mainnet" = "mainnet"
  ): Promise<QuoteResponse> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/swap/quote', {
        method: 'POST',
        headers: demoApiHeaders(),
        body: JSON.stringify({
          fromAsset,
          toAsset,
          amount,
          network
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to get quote')
      }

      return await response.json()
    } finally {
      setIsLoading(false)
    }
  }

  /** Build unsigned swap XDR. Sign with Freighter then call submitSwap. */
  const buildSwap = async (
    quote: QuoteResponse,
    fromAddress: string,
    network: "testnet" | "mainnet" = "mainnet"
  ): Promise<{ xdr: string }> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/swap/build', {
        method: 'POST',
        headers: demoApiHeaders(),
        body: JSON.stringify({ quote, fromAddress, network })
      })
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to build swap')
      }
      return await response.json()
    } finally {
      setIsLoading(false)
    }
  }

  /** Submit signed XDR (from Freighter) to the network. */
  const submitSwap = async (
    signedXdr: string,
    network: "testnet" | "mainnet" = "mainnet"
  ): Promise<{ hash: string; status: string }> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/swap/submit', {
        method: 'POST',
        headers: demoApiHeaders(),
        body: JSON.stringify({ signedXdr, network })
      })
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to submit swap')
      }
      return await response.json()
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getQuote,
    buildSwap,
    submitSwap,
    isLoading
  }
}