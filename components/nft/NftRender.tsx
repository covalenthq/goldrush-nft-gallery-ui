import React from "react"
import { NftDetailsType } from "@/utils/types/shared.types"
import { useGoldRush } from "@covalenthq/goldrush-kit"
import { thumbHashToDataURL } from "thumbhash"

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
        src={thumbHashToDataURL(
          new Uint8Array(
            atob(nftDetails.thumbhash)
              .split("")
              .map((x) => x.charCodeAt(0))
          )
        )}
        alt={"Token"}
        loading="lazy"
        onLoad={(e) => {
          ;(e.target as HTMLImageElement).src =
            nftDetails.image_url || nftDetails.thumbhash || ""
        }}
        className="max-h-fit h-[500px] w-[500px] object-contain rounded-lg"
        style={{
          borderTopLeftRadius: theme.borderRadius,
          borderTopRightRadius: theme.borderRadius,
        }}
      />
      {/* <img
        src={nftDetails.image_url}
        alt="NFT"
        className="max-h-fit h-[500px] w-[500px] object-contain"
      /> */}
    </div>
  )
}

export default NftRender
