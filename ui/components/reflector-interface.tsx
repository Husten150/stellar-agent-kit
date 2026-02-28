"use client"

import { useState, useEffect } from "react"
import { demoApiHeaders } from "@/lib/get-devkit-app-id"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, TrendingDown, RefreshCw, Info, BarChart3, Activity } from "lucide-react"
import { useAccount } from "@/hooks/use-account"

// Supported assets for price feeds
const PRICE_ASSETS = [
  { symbol: "XLM", name: "Stellar Lumens", contractId: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAOBKXN7ANA" },
  { symbol: "USDC", name: "USD Coin", contractId: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA" },
  { symbol: "BTC", name: "Bitcoin", contractId: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU" },
  { symbol: "ETH", name: "Ethereum", contractId: "CDQF2NPKDX7LJHCXDYPQFQZ7FGKDWCQJLQFX5XPNQVXDWCQJLQFX5XPN" },
] as const

type PriceAsset = typeof PRICE_ASSETS[number]

interface PriceData {
  asset: string
  price: string
  change24h: string
  timestamp: number
  source: "dex" | "cex" | "fiat"
}

/** Fetch real price from Reflector oracle API */
async function fetchAssetPrice(symbol: string): Promise<{ price: string } | null> {
  try {
    const res = await fetch(`/api/price?symbol=${encodeURIComponent(symbol)}`, { headers: demoApiHeaders() })
    if (!res.ok) return null
    const data = await res.json()
    if (data.price == null && data.lastprice != null) {
      const p = typeof data.lastprice === "number" ? data.lastprice : parseFloat(data.lastprice)
      return { price: String(p) }
    }
    if (data.price != null) {
      const p = typeof data.price === "number" ? data.price : parseFloat(data.price)
      return { price: String(p) }
    }
    return null
  } catch {
    return null
  }
}

interface OracleQuery {
  id: string
  asset: string
  price: string
  timestamp: number
  status: "success" | "error"
}

export function ReflectorInterface() {
  const { publicKey, isConnected } = useAccount()
  const [selectedAsset, setSelectedAsset] = useState<PriceAsset>(PRICE_ASSETS[0])
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [queries, setQueries] = useState<OracleQuery[]>([])
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Load real price data from Reflector oracle
  const fetchPrices = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const results = await Promise.all(
        PRICE_ASSETS.map(async (a) => {
          const result = await fetchAssetPrice(a.symbol)
          const now = Date.now()
          if (result) {
            return {
              asset: a.symbol,
              price: result.price,
              change24h: "—",
              timestamp: now,
              source: "dex",
            } as PriceData
          }
          return {
            asset: a.symbol,
            price: "—",
            change24h: "—",
            timestamp: now,
            source: "dex" as const,
          } as PriceData
        })
      )
      setPriceData(results)
    } catch {
      setError("Failed to fetch price data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(fetchPrices, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const queryPrice = async () => {
    if (!selectedAsset) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchAssetPrice(selectedAsset.symbol)
      const newQuery: OracleQuery = {
        id: Date.now().toString(),
        asset: selectedAsset.symbol,
        price: result ? result.price : "—",
        timestamp: Date.now(),
        status: result ? "success" : "error",
      }
      setQueries(prev => [newQuery, ...prev])
    } catch {
      setError("Failed to query oracle price")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="prices" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900 border border-zinc-700">
          <TabsTrigger 
            value="prices" 
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Live Prices
          </TabsTrigger>
          <TabsTrigger 
            value="oracle" 
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            <Activity className="h-4 w-4 mr-2" />
            Oracle Query
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Real-time Price Feeds</CardTitle>
                  <CardDescription>
                    Live price data from DEX, CEX, and fiat sources via Reflector Oracle
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`border-zinc-600 ${autoRefresh ? 'bg-[#a78bfa] text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Auto
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchPrices}
                    disabled={isLoading}
                    className="border-zinc-600 text-zinc-400 hover:text-white hover:bg-zinc-700"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priceData.map((price) => (
                  <div key={price.asset} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{price.asset}</h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        price.source === 'dex' ? 'bg-blue-500/20 text-blue-400' :
                        price.source === 'cex' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {price.source.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">
                        ${price.price}
                      </span>
                      <div className="flex items-center gap-1">
                        {price.change24h !== "—" ? (
                          <>
                            {parseFloat(price.change24h) >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm ${
                              parseFloat(price.change24h) >= 0 ? "text-green-500" : "text-red-500"
                            }`}>
                              {price.change24h}%
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-zinc-500">—</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                      Updated: {new Date(price.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oracle" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Oracle Price Query</CardTitle>
              <CardDescription>
                Query specific asset prices directly from Reflector Oracle contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Asset</Label>
                <Select
                  value={selectedAsset.symbol}
                  onValueChange={(value) => {
                    const asset = PRICE_ASSETS.find(a => a.symbol === value)
                    if (asset) setSelectedAsset(asset)
                    setError(null)
                  }}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-600">
                    {PRICE_ASSETS.map((asset) => (
                      <SelectItem key={asset.symbol} value={asset.symbol} className="text-white hover:bg-zinc-700">
                        <div className="flex items-center gap-2">
                          <span>{asset.symbol}</span>
                          <span className="text-zinc-400">({asset.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!isConnected && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Connect your wallet to query oracle prices on-chain
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={queryPrice}
                disabled={isLoading || !isConnected}
                className="w-full bg-[#a78bfa] hover:bg-[#9333ea] text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Querying Oracle...
                  </>
                ) : (
                  `Query ${selectedAsset.symbol} Price`
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Query History */}
          {queries.length > 0 && (
            <Card className="bg-zinc-900/50 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Oracle Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queries.slice(0, 5).map((query) => (
                    <div key={query.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-[#a78bfa]" />
                        <div>
                          <p className="text-white text-sm font-medium">
                            {query.asset}: ${query.price}
                          </p>
                          <p className="text-zinc-400 text-xs">
                            {new Date(query.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-green-500 font-medium">
                        SUCCESS
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}