"use client"

import React from "react"
import { ChainSelectorProps } from "@/utils/types/props.types"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const ChainSelector: React.FC<ChainSelectorProps> = ({
  open,
  value,
  chainName,
  busy,
  allChains,
  setValue,
  setOpen,
  setChainName,
}) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {busy ? "Loading..." : value ? chainName : "Select Chain"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search Chain..." />
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup heading="Foundational Chains">
              {allChains.foundational.map((chain) => (
                <CommandItem
                  key={chain.label}
                  value={chain.name as string}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setChainName(
                      chain.label === chainName ? "" : (chain.label ?? "")
                    )
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
            <CommandSeparator />
            <CommandGroup heading="Frontier Chains">
              {allChains.frontier.map((chain) => (
                <CommandItem
                  key={chain.label}
                  value={chain.name as string}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setChainName(
                      chain.label === chainName ? "" : (chain.label ?? "")
                    )
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
            <CommandSeparator />
            <CommandGroup heading="Community Chains">
              {allChains.community.map((chain) => (
                <CommandItem
                  key={chain.label}
                  value={chain.name as string}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setChainName(
                      chain.label === chainName ? "" : (chain.label ?? "")
                    )
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
  )
}

export default ChainSelector
