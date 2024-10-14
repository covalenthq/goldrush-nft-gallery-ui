import React from "react"
import { minifyAddress } from "@/utils/functions/minify-address"
import { NftDetailsType } from "@/utils/types/shared.types"
import { Chain } from "@covalenthq/client-sdk"
import { useGoldRush } from "@covalenthq/goldrush-kit"
import { CopyIcon } from "lucide-react"
import { useToast } from "../ui/use-toast"
import FloorPriceChart from "./FloorPriceChart"

const NftDetails: React.FC<{
  nftDetails: NftDetailsType
  params: {
    chain: Chain
    address: string
  }
}> = ({ nftDetails, params }) => {
  const { theme } = useGoldRush()
  const { toast } = useToast()

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

      <FloorPriceChart params={params} />
    </div>
  )
}

export default NftDetails
