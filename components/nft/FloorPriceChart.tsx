"use client"

import React, { useEffect, useState } from "react"
import { Chain } from "@covalenthq/client-sdk"
import { useGoldRush } from "@covalenthq/goldrush-kit"

import { COVALENT_API_KEY } from "@/lib/utils"

import LineChart from "../charts/LineChart"
import { Button } from "../ui/button"

const FloorPriceChart: React.FC<{
  params: { chain: Chain; address: string }
}> = ({ params }) => {
  const { theme } = useGoldRush()
  const [days, setDays] = useState<number>(7)
  const [busy, setBusy] = useState<boolean>(false)
  const [currency, setCurrency] = useState<"usd" | "native">("usd")
  const [floorChartData, setFloorChartData] = useState<any>({
    data: [],
    labels: [],
  })

  useEffect(() => {
    ;(async () => {
      setBusy(true)
      const response = await fetch(
        `https://api.covalenthq.com/v1/${params.chain}/nft_market/${params.address}/floor_price/?key=${COVALENT_API_KEY}&days=${days}`
      )
      const floorPriceData = await response.json()
      const labels = floorPriceData.data.items.map(
        (item: any) => item.date.split("T")[0]
      )
      const prices = floorPriceData.data.items.map((item: any) =>
        currency === "usd"
          ? item.floor_price_quote
          : item.floor_price_native_quote
      )
      setFloorChartData({ labels, data: prices })
      setBusy(false)
    })()
  }, [params, days, currency])

  return (
    <div
      className="flex flex-col gap-2 border p-4 w-full"
      style={{ borderRadius: `${theme.borderRadius}px` }}
    >
      <div className="flex w-full justify-between items-center">
        <h5 className="text-lg font-bold">Floor Price</h5>
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            className="text-sm font-medium"
            variant={currency === "usd" ? "primary" : "outline"}
            onClick={() => setCurrency("usd")}
          >
            USD
          </Button>
          <Button
            className="text-sm font-medium"
            variant={currency === "native" ? "primary" : "outline"}
            onClick={() => setCurrency("native")}
          >
            Native
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="text-sm font-medium"
            variant={days === 7 ? "primary" : "outline"}
            onClick={() => setDays(7)}
          >
            7d
          </Button>
          <Button
            className="text-sm font-medium"
            variant={days === 30 ? "primary" : "outline"}
            onClick={() => setDays(30)}
          >
            30d
          </Button>
          <Button
            className="text-sm font-medium"
            variant={days === 90 ? "primary" : "outline"}
            onClick={() => setDays(90)}
          >
            90d
          </Button>
        </div>
      </div>
      {busy ? (
        <div className="flex w-full justify-center items-center h-52 animate-pulse bg-secondary-light dark:bg-secondary-dark rounded-md" />
      ) : (
        <LineChart
          data={floorChartData.data}
          labels={floorChartData.labels}
          mode={theme.mode}
          dataLabel="Floor Price"
        />
      )}
    </div>
  )
}

export default FloorPriceChart
