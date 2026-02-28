"use client"

import { useState, useEffect } from "react"
import { useAccount } from "./use-account"
import { useNetworkProfile } from "@/contexts/network-profile-context"
import { demoApiHeaders } from "@/lib/get-devkit-app-id"

interface BalanceEntry {
  code: string
  issuer: string | null
  balance: string
}

export function useBalance() {
  const { account } = useAccount()
  const { network: profileNetwork } = useNetworkProfile()
  const [balances, setBalances] = useState<BalanceEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = async () => {
    if (!account?.publicKey) {
      setBalances([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/balance', {
        method: 'POST',
        headers: demoApiHeaders(),
        body: JSON.stringify({
          publicKey: account.publicKey,
          network: profileNetwork
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = errorText || 'Failed to fetch balances'
        
        // Parse JSON error if possible
        try {
          const errorJson = JSON.parse(errorText)
          if (errorJson.error) {
            errorMessage = errorJson.error
          }
        } catch {
          // Keep original error text if not JSON
        }
        
        throw new Error(errorMessage)
      }

      const balanceData = await response.json()
      setBalances(balanceData)
    } catch (err) {
      console.error("Error fetching balances:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch balances"
      setError(errorMessage)
      setBalances([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalances()
  }, [account?.publicKey, profileNetwork])

  const getBalance = (assetCode: string, issuer?: string | null): string => {
    const balance = balances.find(b => 
      b.code === assetCode && 
      (issuer === undefined || b.issuer === issuer)
    )
    return balance ? parseFloat(balance.balance).toFixed(4) : "--"
  }

  return {
    balances,
    isLoading,
    error,
    getBalance,
    refetch: fetchBalances
  }
}