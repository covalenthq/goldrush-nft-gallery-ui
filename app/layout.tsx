'use client'

import { Analytics } from '@vercel/analytics/react';
import "@/styles/globals.css"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import "@radix-ui/themes/styles.css"
import { NftUiProvider } from "@/utils/store/NFT.store"
import { Toaster } from "@/components/ui/toaster"
import { KeyDialog } from "@/components/key-dialog"
import { Footer } from '@/components/footer';

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
              <NftUiProvider>
                <div className="relative flex min-h-screen flex-col">
                  <Header />
                  <div className="flex-1">{children}</div>
                  <Analytics />
                  <Footer/>
                  <KeyDialog />
                  <Toaster />
                </div>
              </NftUiProvider>
        </body>
      </html>
  )
}
