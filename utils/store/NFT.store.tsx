"use client"

import {
  GoldRushProvider,
  GoldRushThemeType,
  useGoldRush,
} from "@covalenthq/goldrush-kit"

import "@covalenthq/goldrush-kit/styles.css"

import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import kit from "@/goldrush.config"

interface NftContextType {
  nftAddress: string | null
  setNftAddress: Function
  chains: any
  setChains: Function
  themeKit: GoldRushThemeType
  setThemeKit: React.Dispatch<React.SetStateAction<GoldRushThemeType>>
}

export const NftContext = createContext<NftContextType>({} as NftContextType)

interface NftUiProviderProps {
  children: ReactNode
}

export const NftUiProvider: React.FC<NftUiProviderProps> = ({ children }) => {
  const [nftAddress, setNftAddress] = useState<string | null>(null)
  const [chains, setChains] = useState<[]>([])
  const [themeKit, setThemeKit] = useState<GoldRushThemeType>(kit.theme)
  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
        localStorage.setItem("goldrush_theme", JSON.stringify(themeKit))
    }
  }, [isClient, themeKit])

  const contextValue = useMemo(
    () => ({
      nftAddress,
      setNftAddress,
      chains,
      setChains,
      themeKit,
      setThemeKit,
    }),
    [nftAddress, chains, themeKit]
  )

  if (!isClient) {
    return <div></div>
  }

  return (
    <GoldRushProvider
      apikey={process.env.NEXT_PUBLIC_GOLDRUSH_API_KEY!}
      theme={
        localStorage.getItem("goldrush_theme")
          ? JSON.parse(localStorage.getItem("goldrush_theme")!)
          : kit.theme
      }
    >
      <NftContext.Provider value={contextValue}>{children}</NftContext.Provider>
    </GoldRushProvider>
  )
}
