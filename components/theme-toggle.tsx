"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGoldRush } from "@covalenthq/goldrush-kit"

export function ThemeToggle() {
  const { updateThemeHandler, theme } = useGoldRush()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => updateThemeHandler({ 
        ...theme,
        mode: theme.mode === "dark" ? "light" : "dark",
       }
      )}
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
