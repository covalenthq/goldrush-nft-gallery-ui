'use client'
import { Button } from "@/components/ui/button"
import { Flex } from "@radix-ui/themes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useEffect, useState } from "react"
import { NftContext } from "@/lib/store"
import { ChainItem, CovalentClient } from "@covalenthq/client-sdk"
import { COVALENT_API_KEY, cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"

export default function IndexPage() {
    const { nftAddress } = useContext(NftContext);
    const [allChains, setChains] = useState<ChainItem[]>([]);
    const [address, setAddress] = useState(nftAddress ? nftAddress : "");
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const { toast } = useToast();


    const handleAllChains = async () => {
        setBusy(true);

        const client = new CovalentClient(COVALENT_API_KEY ? COVALENT_API_KEY : "");
        try {
            const allChainsResp =
                await client.BaseService.getAllChains();
            if (allChainsResp.error) {
                toast({
                    variant: "destructive",
                    title: "Something went wrong.",
                    description: allChainsResp.error_message
                })
            }
            setChains(allChainsResp.data.items);

        } catch (exception) {
            console.log(exception)
        }
        setBusy(false);
    }

    useEffect(()=>{
        handleAllChains()
    },[])


    return (
        <section className="container flex flex-col justify-center gap-6 md:py-10 h-[calc(100vh-150px)] items-center ">
            <Flex direction="column" gap="4">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    GoldRush NFT UI
                </h1>
                <p className="max-w-[700px] text-lg text-muted-foreground">
                    Accessible and customizable components that you can copy and paste
                    into your apps. Free. Open Source. And Next.js 13 Ready.
                </p>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    router.push(`/collection/${value}/${address}`)
                }}>
                    <Flex direction="column" gap="3">
                    <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[400px] justify-between"
                                >
                                {value
                                    ? allChains.find((chain) => chain.name === value)?.label
                                    : "Select chain..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                                <Command>
                                <CommandInput placeholder="Search framework..." />
                                <CommandEmpty>No chain found.</CommandEmpty>
                                <CommandGroup>
                                    {allChains.map((chain) => (
                                    <CommandItem
                                        key={chain.label}
                                        value={chain.name}
                                        onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                        }}
                                    >
                                        <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === chain.label ? "opacity-100" : "opacity-0"
                                        )}
                                        />
                                        {chain.label}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Label htmlFor="contract_address">Contract Address</Label>
                        <Input className="w-[400px]" type="input" id="address" placeholder="Contract Address" value={address} onChange={(e) => {
                            setAddress(e.target.value)
                        }} />
                        <div>
                            <Button disabled={address.length === 0 || !value ||  busy} type="submit">
                                Continue
                            </Button>
                        </div>
                    </Flex>
                </form>
            </Flex>
        </section>
    )
}
