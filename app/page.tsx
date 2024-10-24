"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CHAINS } from "@/utils/constants/chains"
import { NftContext } from "@/utils/store/NFT.store"
import { ChainItem, GoldRushClient } from "@covalenthq/client-sdk"
import { LoaderCircleIcon } from "lucide-react"
import { COVALENT_API_KEY } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import ChainSelector from "@/components/chain/ChainSelector"

export default function IndexPage() {
  const { nftAddress } = useContext(NftContext)
  const [allChains, setAllChains] = useState<{
    foundational: ChainItem[]
    frontier: ChainItem[]
    community: ChainItem[]
  }>({
    foundational: [],
    frontier: [],
    community: [],
  })
  const [address, setAddress] = useState(
    nftAddress ?? "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
  )
  const [busy, setBusy] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>("eth-mainnet")
  const [chainName, setChainName] = useState<string>("Ethereum Mainnet")
  const { toast } = useToast()

  const handleAllChains = async () => {
    setBusy(true)
    if (!COVALENT_API_KEY) return

    const client = new GoldRushClient(COVALENT_API_KEY)
    try {
      const allChainsResp = await client.BaseService.getAllChains()
      if (allChainsResp.error) {
        toast({
          title: "Something went wrong.",
          description: allChainsResp.error_message,
        })
      }
      if (allChainsResp.data && allChainsResp.data.items) {
        const foundational: ChainItem[] = []
        const frontier: ChainItem[] = []
        const community: ChainItem[] = []

        allChainsResp.data.items.forEach((chain: ChainItem) => {
          if (chain.name && CHAINS.foundational.includes(chain.name)) {
            foundational.push(chain)
          } else if (chain.name && CHAINS.frontier.includes(chain.name)) {
            frontier.push(chain)
          } else {
            community.push(chain)
          }
        })

        setAllChains({
          foundational,
          frontier,
          community,
        })
      }
    } catch (exception) {
      console.log(exception)
    }
    setBusy(false)
  }

  useEffect(() => {
    handleAllChains()
  }, [])

  return (
    <section className="flex flex-col justify-center gap-6 md:py-10 h-[calc(100vh-150px)] items-center ">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          GoldRush NFT Gallery UI
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground font-medium">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setLoading(true)
            router.push(`/collection/${value}/${address}`)
          }}
        >
          <div className="flex flex-col gap-2">
            <ChainSelector
              open={open}
              value={value}
              chainName={chainName}
              busy={busy}
              allChains={allChains}
              setValue={setValue}
              setOpen={setOpen}
              setChainName={setChainName}
            />
            <Label htmlFor="contract_address">Contract Address</Label>
            <Input
              className="w-[400px]"
              type="input"
              id="address"
              placeholder="Contract Address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
              }}
            />
            <div>
              <Button
                disabled={address.length === 0 || !value || busy}
                type="submit"
              >
                {
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <LoaderCircleIcon size={16} className="animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </div>
                }
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
