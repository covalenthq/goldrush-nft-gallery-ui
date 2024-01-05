"use client"

import "@/styles/globals.css"
import "@covalenthq/goldrush-kit/styles.css"
import { Theme } from "@radix-ui/themes"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

import "@radix-ui/themes/styles.css"
import { NftProvider } from "@/lib/store"
import { poweredCovalent } from "@/lib/svg"
import { Toaster } from "@/components/ui/toaster"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Theme>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <NftProvider>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="flex-1">{children}</div>
                  <footer className="border-t">
                    <a
                      href="https://www.covalenthq.com/"
                      className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 "
                    >
                      {poweredCovalent}
                    </a>
                  </footer>
                  <Toaster />
                </div>
              </NftProvider>
            </ThemeProvider>
          </Theme>
        </body>
      </html>
    </>
  )
}
