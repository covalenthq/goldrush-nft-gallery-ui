"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { minifyAddress } from "@/utils/functions/minify-address"
import { NftDetails } from "@/utils/types/shared.types"
import { Chain } from "@covalenthq/client-sdk"
import { NFT, useGoldRush } from "@covalenthq/goldrush-kit"
import { CopyIcon } from "lucide-react"

import { COVALENT_API_KEY } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function Collection({
  params,
}: Readonly<{ params: { chain: Chain; address: string; token_id: string } }>) {
  const router = useRouter()
  const { theme } = useGoldRush()
  const [nftDetails, setNftDetails] = useState<NftDetails | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      const response = await fetch(
        `https://api.covalenthq.com/v1/${params.chain}/tokens/${params.address}/nft_metadata/${params.token_id}/?key=${COVALENT_API_KEY}`
      )
      const nftData = await response.json()

      setNftDetails({
        collection_name: nftData.data.items[0].contract_name,
        collection_address: nftData.data.items[0].contract_address,
        token_id: nftData.data.items[0].nft_data[0].token_id,
        token_name: nftData.data.items[0].nft_data[0].external_data.name,
        image_url: nftData.data.items[0].nft_data[0].external_data.image,
        attributes: nftData.data.items[0].nft_data[0].external_data.attributes,
        current_owner: nftData.data.items[0].nft_data[0].owner_address,
        original_owner: nftData.data.items[0].nft_data[0].original_owner,
      })
    })()
  }, [params])

  console.log(nftDetails)

  return (
    <div className="flex flex-col gap-4 w-full">
      {nftDetails && (
        <div className="flex items-start gap-x-4">
          <div
            className="flex flex-col gap-2 border"
            style={{ borderRadius: `${theme.borderRadius}px` }}
          >
            <img
              src={nftDetails.image_url}
              alt="NFT"
              className="h-96 w-96 object-contain"
            />
            <div className="px-4 pb-4">
              <h3 className="text-lg font-bold">Attributes</h3>
              <ul className="grid gap-2">
                {nftDetails.attributes.map((attribute) => (
                  <li
                    key={attribute.trait_type}
                    className="w-full flex justify-start"
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
          </div>
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
                    title: "Address copied to clipboard",
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
                      navigator.clipboard.writeText(
                        nftDetails.collection_address
                      )
                      toast({
                        title: "Address copied to clipboard",
                        description: `Address: ${nftDetails.collection_address} copied to clipboard`,
                      })
                    }}
                  />
                </span>
              </p>
            )}
          </div>
        </div>
      )}
      <Button
        className="w-20"
        onClick={() => {
          router.back()
        }}
      >
        Back
      </Button>
    </div>
  )
}
