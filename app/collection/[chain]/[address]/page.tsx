"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CollectionStats } from "@/utils/types/shared.types"
import { Chain } from "@covalenthq/client-sdk"
import {
  AddressCard,
  NFTCollectionTokensList,
  useGoldRush,
} from "@covalenthq/goldrush-kit"
import { Flex } from "@radix-ui/themes"

import { COVALENT_API_KEY } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Collection({
  params,
}: Readonly<{ params: { chain: Chain; address: string } }>) {
  const router = useRouter()
  const { theme } = useGoldRush()
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionStats | null>(null)

  useEffect(() => {
    ;(async () => {
      const responses = await Promise.all([
        fetch(
          `https://api.covalenthq.com/v1/${params.chain}/nft/${params.address}/metadata/?key=${COVALENT_API_KEY}&page-size=1`
        ),
        fetch(
          `https://api.covalenthq.com/v1/${params.chain}/nft_market/${params.address}/floor_price/?key=${COVALENT_API_KEY}&days=1`
        ),
        fetch(
          `https://api.covalenthq.com/v1/${params.chain}/nft_market/${params.address}/volume/?key=${COVALENT_API_KEY}`
        ),
      ])

      const metadataData = await responses[0].json()
      const floorPriceData = await responses[1].json()
      const marketVolumeData = await responses[2].json()

      setCollectionDetails({
        name: metadataData.data.items[0].name,
        avatar: metadataData.data.items[0].nft_data.external_data.asset_url,
        floorPrice: floorPriceData.data.items[0].pretty_floor_price_quote,
        marketVolume:
          marketVolumeData.data.items[marketVolumeData.data.items.length - 1]
            .pretty_volume_quote,
      })
    })()
  }, [params.address])

  return (
    <div className="w-full flex flex-col gap-4 pb-10">
      <div className="w-full flex justify-between items-center">
        <AddressCard
          address={params.address}
          avatar={{ rounded: true, custom_avatar: collectionDetails?.avatar }}
          label={collectionDetails?.name}
        />
        <div
          className="flex gap-8 border border-borderColor p-2"
          style={{ borderRadius: `${theme.borderRadius}px` }}
        >
          <div>
            <h6 className="text-base font-semibold text-secondary-light dark:text-secondary-dark">
              Market volume
            </h6>
            <p className="text-xl">{collectionDetails?.marketVolume}</p>
          </div>
          <div>
            <h6 className="text-base font-semibold text-secondary-light dark:text-secondary-dark">
              Floor Price
            </h6>
            <p className="text-xl">{collectionDetails?.floorPrice}</p>
          </div>
        </div>
      </div>
      <NFTCollectionTokensList
        chain_name={params.chain}
        collection_address={params.address}
      />
      <Flex
        onClick={() => {
          router.back()
        }}
      >
        <Button>Back</Button>
      </Flex>
    </div>
  )
}
