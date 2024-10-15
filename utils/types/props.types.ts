import React from "react"
import { ChainItem } from "@covalenthq/client-sdk"

export interface ChainSelectorProps {
  open: boolean
  value: string
  chainName: string
  busy: boolean
  allChains: {
    foundational: ChainItem[]
    frontier: ChainItem[]
    community: ChainItem[]
  }
  setValue: React.Dispatch<React.SetStateAction<string>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setChainName: React.Dispatch<React.SetStateAction<string>>
}
