import React from "react"
import { NftDetailsType } from "@/utils/types/shared.types"
import { useGoldRush } from "@covalenthq/goldrush-kit"

const NftRender: React.FC<{
  nftDetails: NftDetailsType
}> = ({ nftDetails }) => {
  const { theme } = useGoldRush()

  return (
    <div
      className="flex flex-col gap-2 border"
      style={{ borderRadius: `${theme.borderRadius}px` }}
    >
      <img
        src={nftDetails.image_url}
        alt="NFT"
        className="h-[500px] w-[500px] object-contain"
      />
    </div>
  )
}

export default NftRender
