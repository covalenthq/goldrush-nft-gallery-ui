import { createContext, useState, type ReactNode } from "react"
import { GoldRushProvider } from "@covalenthq/goldrush-kit"
import { useTheme } from "next-themes"

import { KeyDialog } from "@/components/key-dialog"

import { COVALENT_API_KEY } from "./utils"

interface NftContextType {
  nftAddress: string
  setnftAddress: Function
  chains: any
  setChains: Function
  tableState: { [key: string]: boolean }
  setTableState: Function
  color: string
  setColor: Function
  setBorderRadius: Function
  borderRadius: string
}

export const NftContext = createContext<NftContextType>({} as NftContextType)

interface NftProviderProps {
  children: ReactNode
}

export const NftProvider: React.FC<NftProviderProps> = ({ children }) => {
  const { theme } = useTheme()
  const [nftAddress, setnftAddress] = useState<string>("")
  const [chains, setChains] = useState<[]>([])
  const [tableState, setTableState] = useState({})
  const [color, setColor] = useState<any>("slate")
  const [borderRadius, setBorderRadius] = useState<any>("medium")

  const mode: any = theme

  return (
    <GoldRushProvider
      apikey={COVALENT_API_KEY ? COVALENT_API_KEY : ""}
      mode={mode}
      color={color}
      border_radius={borderRadius}
    >
      <NftContext.Provider
        value={{
          nftAddress,
          setnftAddress,
          chains,
          setChains,
          tableState,
          setTableState,
          setColor,
          color,
          setBorderRadius,
          borderRadius,
        }}
      >
        {children}
      </NftContext.Provider>
    </GoldRushProvider>
  )
}
