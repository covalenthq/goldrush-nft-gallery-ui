import * as React from "react"
import Link from "next/link"
import kit from "@/goldrush.config"
import { NavItem } from "@/utils/types/shared.types"

import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: Readonly<MainNavProps>) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link
        href={`/`}
        className="flex w-fit items-center gap-2"
      >
        <figure className="relative h-10 w-10">
          <img
            src={kit.brand.logo_url}
            alt={`GoldRush NFT UI Kit`}
            className="object-cover"
          />
        </figure>

        <h1 className="whitespace-nowrap text-md font-medium leading-none">
          {kit.brand.title}
          <br />
          {kit.brand.subtitle}
        </h1>
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
