"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NftDetailsType } from "@/utils/types/shared.types"
import { Chain } from "@covalenthq/client-sdk"
import { useGoldRush } from "@covalenthq/goldrush-kit"

import { COVALENT_API_KEY } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import NftDetails from "@/components/nft/NftDetails"
import NftRender from "@/components/nft/NftRender"

export default function Collection({
  params,
}: Readonly<{ params: { chain: Chain; address: string; token_id: string } }>) {
  const router = useRouter()
  const { theme } = useGoldRush()
  const [nftDetails, setNftDetails] = useState<NftDetailsType | null>(null)
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    ;(async () => {
      setBusy(true)
      const response = await fetch(
        `https://api.covalenthq.com/v1/${params.chain}/nft/${params.address}/metadata/${params.token_id}/?key=${COVALENT_API_KEY}`
      )
      const nftData = await response.json()

      setNftDetails({
        collection_name: nftData.data.items[0].contract_name,
        collection_address: nftData.data.items[0].contract_address,
        token_id: nftData.data.items[0].nft_data.token_id,
        token_name: nftData.data.items[0].nft_data.external_data.name,
        image_url: nftData.data.items[0].nft_data.external_data.image,
        attributes: nftData.data.items[0].nft_data.external_data.attributes,
        current_owner: nftData.data.items[0].nft_data.owner_address,
        original_owner: nftData.data.items[0].nft_data.original_owner,
        thumbhash:
          nftData.data.items[0].nft_data.external_data.thumbnails?.thumbhash ?? "",
      })
      setBusy(false)
    })()
  }, [params])

  return (
    <div className="flex flex-col gap-4 w-full">
      {busy && (
        <div className="flex items-start gap-x-4">
          <div
            className="h-[500px] w-[500px] bg-secondary-light dark:bg-secondary-dark animate-pulse"
            style={{
              borderRadius: `${theme.borderRadius}px`,
            }}
          />
          <div className="flex flex-col gap-2 w-full">
            <div
              className="h-60 w-full bg-secondary-light dark:bg-secondary-dark animate-pulse"
              style={{
                borderRadius: `${theme.borderRadius}px`,
              }}
            />
            <div
              className="h-96 w-full bg-secondary-light dark:bg-secondary-dark animate-pulse"
              style={{
                borderRadius: `${theme.borderRadius}px`,
              }}
            />
          </div>
        </div>
      )}
      {nftDetails && (
        <div className="flex items-start gap-x-4">
          <NftRender nftDetails={nftDetails} />
          <NftDetails nftDetails={nftDetails} params={params} />
        </div>
      )}
      <Button
        className="w-20 mb-20"
        onClick={() => {
          router.back()
        }}
      >
        Back
      </Button>
    </div>
  )
}
