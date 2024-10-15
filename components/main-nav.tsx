import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavItem } from "@/utils/types/shared.types"
import kit from "@/goldrush.config"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: Readonly<MainNavProps>) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">{kit.brand.subtitle}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item) =>
              item.href && (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
