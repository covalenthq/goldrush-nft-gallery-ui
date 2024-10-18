import React from "react"
import { useRouter } from "next/navigation"
import { useGoldRush } from "@covalenthq/goldrush-kit"
import { ExternalLinkIcon } from "lucide-react"
import { thumbHashToDataURL } from "thumbhash"

import { cn } from "@/lib/utils"
import { Chain } from "@covalenthq/client-sdk"

const NFTCollectionTokenListItem: React.FC<{
  token: any
  imageSize?: number
  params: { chain: Chain; address: string }
}> = ({ token, imageSize = 60, params }) => {
  const { theme } = useGoldRush()
  const router = useRouter()

  return (
    <div
      key={token.nft_data?.token_id}
      className="border border-secondary-light dark:border-secondary-dark"
      style={{
        borderRadius: theme.borderRadius,
      }}
    >
      <button
        className="group bg-slate-100 transition-all relative cursor-pointer"
        onClick={() => {
          router.push(
            `/collection/${params.chain}/${params.address}/token/${token.nft_data?.token_id}`
          )
        }}
        style={{
          borderRadius: theme.borderRadius,
        }}
      >
        <div className="absolute h-full w-full rounded-t bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
          <ExternalLinkIcon className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100" />
        </div>
        <img
          src={thumbHashToDataURL(
            new Uint8Array(
              atob(
                token.nft_data?.external_data?.thumbnails.thumbhash
              )
                .split("")
                .map((x) => x.charCodeAt(0))
            )
          )}
          alt={"Token"}
          loading="lazy"
          onLoad={(e) => {
            ;(e.target as HTMLImageElement).src =
              token.nft_data?.external_data?.image_1024 ||
              token.nft_data?.external_data?.thumbnails.thumbhash ||
              ""
          }}
          className={cn(
            "object-cover h-60 w-60 mx-auto",
            imageSize === 40 && "h-40 w-40",
            imageSize === 28 && "h-28 w-28"
          )}
          style={{
            borderTopLeftRadius: theme.borderRadius,
            borderTopRightRadius: theme.borderRadius,
          }}
        />
      </button>

      <div>
        <div className="font-bold px-2 pb-2">
          {token.nft_data?.external_data?.name ??
            `#${token.nft_data?.token_id}`}
        </div>
      </div>
    </div>
  )
}

export default NFTCollectionTokenListItem
