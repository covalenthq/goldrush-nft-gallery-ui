"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NftContext } from "@/utils/store/NFT.store"
import { ChainItem, GoldRushClient } from "@covalenthq/client-sdk"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn, COVALENT_API_KEY } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"

export default function IndexPage() {
  const { nftAddress } = useContext(NftContext)
  const [allChains, setAllChains] = useState<ChainItem[]>([])
  const [address, setAddress] = useState(
    nftAddress ?? "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
  )
  const [busy, setBusy] = useState<boolean>(false)
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>("eth-mainnet")
  const { toast } = useToast()

  const handleAllChains = async () => {
    setBusy(true)
    if (!COVALENT_API_KEY) return

    const client = new GoldRushClient(COVALENT_API_KEY)
    try {
      const allChainsResp = await client.BaseService.getAllChains()
      if (allChainsResp.error) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: allChainsResp.error_message,
        })
      }
      if (allChainsResp.data && allChainsResp.data.items) {
        setAllChains(allChainsResp.data.items)
      }
    } catch (exception) {
      console.log(exception)
    }
    setBusy(false)
  }

  useEffect(() => {
    handleAllChains()
  }, [])

  console.log(allChains)

  return (
    <section className="container flex flex-col justify-center gap-6 md:py-10 h-[calc(100vh-150px)] items-center ">
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
            router.push(`/collection/${value}/${address}`)
          }}
        >
          <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  aria-expanded={open}
                  className="w-[400px] justify-between"
                >
                  {busy
                    ? "Loading..."
                    : value
                      ? allChains.find((chain) => chain.name === value)?.label
                      : "Select Chain"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search Chain..." />
                  <CommandList>
                    <CommandEmpty>No chain found.</CommandEmpty>
                    <CommandGroup>
                      {allChains.map((chain) => (
                        <CommandItem
                          key={chain.label}
                          value={chain.name as string}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                          className="flex items-center cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === chain.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {chain.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
                Continue
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
