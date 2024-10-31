"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CollectionStats } from "@/utils/types/shared.types"
import { Chain } from "@covalenthq/client-sdk"
import { AddressCard, useGoldRush } from "@covalenthq/goldrush-kit"
import { GOLDRUSH_API_KEY } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import FloorPriceChart from "@/components/nft/FloorPriceChart"
import NftCollectionTokenList from "@/components/nft/NftCollectionTokenList"
import SalesHistoryChart from "@/components/nft/SalesHistoryChart"

export default function Collection({
  params,
}: Readonly<{ params: { chain: Chain; address: string } }>) {
  const router = useRouter()
  const { theme } = useGoldRush()
  const [loading, setLoading] = useState<boolean>(true)
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionStats | null>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const responses = await Promise.all([
        fetch(
          `https://api.covalenthq.com/v1/${params.chain}/nft/${params.address}/metadata/?key=${GOLDRUSH_API_KEY}&page-size=1`
        ),
        fetch(
          `https://api.covalenthq.com/v1/${params.chain}/nft_market/${params.address}/floor_price/?key=${GOLDRUSH_API_KEY}&days=7`
        ),
        fetch(
          `https://api.covalenthq.com/v1/${params.chain}/nft_market/${params.address}/volume/?key=${GOLDRUSH_API_KEY}`
        ),
      ])

      const metadataData = await responses[0].json()
      const floorPriceData = await responses[1].json()
      const marketVolumeData = await responses[2].json()

      setCollectionDetails({
        name: metadataData.data.items[0].contract_name,
        avatar: metadataData.data.items[0].nft_data.external_data.asset_url,
        floorPrice:
          floorPriceData.data.items[floorPriceData.data.items.length - 1]
            .pretty_floor_price_quote,
        marketVolume:
          marketVolumeData.data.items[marketVolumeData.data.items.length - 1]
            .pretty_volume_quote,
      })
      setLoading(false)
    })()
  }, [params.address])

  return (
    <div className="w-full flex flex-col gap-4 pb-10">
      <div className="container w-full flex justify-between gap-2">
        <div className="flex flex-col gap-2">
          <AddressCard
            address={params.address}
            avatar={{ rounded: true, custom_avatar: collectionDetails?.avatar }}
            label={loading ? "Loading..." : collectionDetails?.name}
          />
          <div
            className="flex flex-col gap-4 border border-borderColor p-2 w-96"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          >
            <div className="w-40">
              <h6 className="text-base font-semibold text-secondary-light dark:text-secondary-dark">
                Market volume
              </h6>
              {loading ? (
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                <p className="text-xl">{collectionDetails?.marketVolume}</p>
              )}
            </div>
            <div className="w-36">
              <h6 className="text-base font-semibold text-secondary-light dark:text-secondary-dark">
                Floor Price
              </h6>
              {loading ? (
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                <p className="text-xl">{collectionDetails?.floorPrice}</p>
              )}
            </div>
          </div>
        </div>
        <FloorPriceChart params={params} />
        <SalesHistoryChart params={params} />
      </div>
      <div className="px-40"> 
        <NftCollectionTokenList params={params} />
        <Button
          onClick={() => {
            router.back()
          }}
          className="w-24"
        >
          Back
        </Button>
      </div>
    </div>
  )
}
