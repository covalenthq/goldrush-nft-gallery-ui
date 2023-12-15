'use client'
import { Chain } from "@covalenthq/client-sdk"
import { useRouter } from "next/navigation";
import { NFTCollectionTokenListView } from "@covalenthq/goldrush-kit";
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";

export default function Collection({ params }: { params: { chain: Chain, address: string } }) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-4">
      <NFTCollectionTokenListView
        chain_name={params.chain}
        collection_address={params.address}
        on_nft_click={(e: any)=>{
          router.push(`/collection/${params.chain}/${params.address}/token/${e.nft_data.token_id}`)
        }}
      />
      <Flex onClick={()=>{
        router.back()
      }}>
        <Button>Back</Button>
      </Flex>
    </div>
  )

}
