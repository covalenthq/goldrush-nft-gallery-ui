'use client'
import { Button } from "@/components/ui/button";
import { Chain} from "@covalenthq/client-sdk"
import { NFTDetailView } from "@covalenthq/goldrush-kit";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export default function Collection({ params }: { params: { chain: Chain, address: string, token_id: string } }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 w-full">
      <NFTDetailView
        chain_name={params.chain}
        collection_address={params.address}
        token_id={params.token_id}
      />
      <Flex onClick={()=>{
        router.back()
      }}>
        <Button>Back</Button>
      </Flex>
    </div>
  )
}
