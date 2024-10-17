"use client"

import React, { useEffect, useState } from "react"
import { Chain } from "@covalenthq/client-sdk"
import { useGoldRush } from "@covalenthq/goldrush-kit"

import { COVALENT_API_KEY } from "@/lib/utils"

import BarChart from "../charts/BarChart"
import { Button } from "../ui/button"

const SalesHistoryChart: React.FC<{
  params: { chain: Chain; address: string }
}> = ({ params }) => {
  const { theme } = useGoldRush()
  const [days, setDays] = useState<number>(7)
  const [busy, setBusy] = useState<boolean>(false)
  const [salesChartData, setSalesChartData] = useState<any>({
    data: [],
    labels: [],
  })

  useEffect(() => {
    ;(async () => {
      setBusy(true)
      const response = await fetch(
        `https://api.covalenthq.com/v1/${params.chain}/nft_market/${params.address}/sale_count/?key=${COVALENT_API_KEY}&days=${days}`
      )
      const saleHistoryData = await response.json()
      const labels = saleHistoryData.data.items.map(
        (item: any) => item.date.split("T")[0]
      )
      const sales = saleHistoryData.data.items.map(
        (item: any) => item.sale_count
      )
      setSalesChartData({ labels, data: sales })
      setBusy(false)
    })()
  }, [params, days])

  return (
    <div
      className="flex flex-col gap-2 border p-4 w-full"
      style={{ borderRadius: `${theme.borderRadius}px` }}
    >
      <div className="flex w-full justify-between items-center">
        <h5 className="text-lg font-bold">Sales History</h5>
      </div>
      <div className="flex w-full justify-end items-center">
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
        <BarChart
          data={salesChartData.data}
          labels={salesChartData.labels}
          mode={theme.mode}
          dataLabel="Sales"
        />
      )}
    </div>
  )
}

export default SalesHistoryChart
