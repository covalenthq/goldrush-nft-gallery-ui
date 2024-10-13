"use client"

import { useRouter } from "next/navigation"
import { useGoldRush } from "@covalenthq/goldrush-kit"

import { BORDER_RADIUS, COLORS } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Settings({
  params,
}: Readonly<{ params: { slug: string } }>) {
  const { updateThemeHandler, theme } = useGoldRush()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div>
        <h2 className="text-xl font-bold leading-tight tracking-tighter md:text-2xl">
          Color Selection
        </h2>
        <p className="max-w-[700px] text-base font-medium text-muted-foreground">
          Select color to change the accent of your portfolio.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(COLORS).map(([_color, value]) => (
          <button
            key={_color}
            style={{ backgroundColor: value }}
            className={`tokenAvatar w-8 h-8 rounded-full cursor-pointer ${
              value === theme.colors.light?.foreground &&
              "border-2 border-black dark:border-white"
            }`}
            onClick={() => {
              updateThemeHandler({
                ...theme,
                colors: {
                  light: {
                    foreground: value,
                    background: theme.colors.light?.background,
                    primary: theme.colors.light?.primary,
                    secondary: theme.colors.light?.secondary,
                  },
                  dark: {
                    foreground: value,
                    background: theme.colors.dark?.background,
                    primary: theme.colors.dark?.primary,
                    secondary: theme.colors.dark?.secondary,
                  },
                },
              })
            }}
          />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold leading-tight tracking-tighter md:text-2xl">
          Border Radius Selection
        </h2>
        <p className="max-w-[700px] text-base font-medium text-muted-foreground">
          Select border radius.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(BORDER_RADIUS).map(([radius, value]) => (
          <button
            key={radius}
            style={{ borderRadius: value }}
            className={`border p-2 cursor-pointer ${
              value === theme.borderRadius && "border-black dark:border-white"
            }`}
            onClick={() => {
              updateThemeHandler({
                ...theme,
                borderRadius: value,
              })
            }}
          >
            {radius}
          </button>
        ))}
      </div>
      <Button
        className="w-16"
        onClick={() => {
          router.back()
        }}
      >
        Back
      </Button>
    </div>
  )
}
