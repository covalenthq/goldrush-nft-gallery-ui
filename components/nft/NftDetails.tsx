import React, { useEffect, useState } from "react"
import { minifyAddress } from "@/utils/functions/minify-address"
import { NftDetailsType } from "@/utils/types/shared.types"
import { Chain } from "@covalenthq/client-sdk"
import { useGoldRush } from "@covalenthq/goldrush-kit"
import { CopyIcon } from "lucide-react"

import { COVALENT_API_KEY } from "@/lib/utils"

import LineChart from "../charts/LineChart"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"

const NftDetails: React.FC<{
  nftDetails: NftDetailsType
  params: {
    chain: Chain
    address: string
  }
}> = ({ nftDetails, params }) => {
  const { theme } = useGoldRush()
  const { toast } = useToast()
  const [floorChartData, setFloorChartData] = useState<any>({
    data: [],
    labels: [],
  })
  const [days, setDays] = useState<number>(7)
  const [currency, setCurrency] = useState<"usd" | "native">("usd")

  useEffect(() => {
    ;(async () => {
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
    })()
  }, [params, days, currency])

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-4xl font-bold">
        {nftDetails.token_name ??
          `${nftDetails.collection_name} #${nftDetails.token_id}`}
      </h2>
      <p className="max-w-[700px] text-base font-medium text-muted-foreground flex items-center gap-2 ">
        {nftDetails.collection_name}
        <CopyIcon
          className="w-4 h-4 cursor-pointer text-secondary-light dark:text-secondary-dark"
          onClick={() => {
            navigator.clipboard.writeText(nftDetails.collection_address)
            toast({
              title: "Collection Address copied to clipboard",
              description: `Address: ${nftDetails.collection_address} copied to clipboard`,
            })
          }}
        />
      </p>
      {nftDetails.current_owner && (
        <p className="flex items-center gap-1">
          Owned by{" "}
          <span className="text-base font-medium text-foreground-light dark:text-foreground-dark flex items-center gap-2">
            {minifyAddress(nftDetails.current_owner)}{" "}
            <CopyIcon
              className="w-4 h-4 cursor-pointer text-secondary-light dark:text-secondary-dark"
              onClick={() => {
                navigator.clipboard.writeText(nftDetails.collection_address)
                toast({
                  title: "Token Address copied to clipboard",
                  description: `Address: ${nftDetails.collection_address} copied to clipboard`,
                })
              }}
            />
          </span>
        </p>
      )}
      <div className="pb-4">
        <h3 className="text-lg font-bold mb-2">Attributes</h3>
        <ul className="grid grid-cols-5 gap-2">
          {nftDetails.attributes.map((attribute) => (
            <li
              key={attribute.trait_type}
              className="w-full flex justify-start flex-col border px-2 py-1"
              style={{ borderRadius: `${theme.borderRadius}px` }}
            >
              <p className="flex-1 text-base font-medium text-secondary-light dark:text-secondary-dark">
                {attribute.trait_type}:
              </p>
              <p className="flex-1 text-base font-medium text-foreground-light dark:text-foreground-dark">
                {attribute.value}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="flex flex-col gap-6 border p-4"
        style={{ borderRadius: `${theme.borderRadius}px` }}
      >
        <div className="flex w-full justify-between items-center">
          <h5 className="text-lg font-bold">Floor Price</h5>
          <div className="flex gap-4">
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
        <LineChart
          data={floorChartData.data}
          labels={floorChartData.labels}
          mode={theme.mode}
          dataLabel="Floor Price"
        />
      </div>
    </div>
  )
}

export default NftDetails
