"use client"

import { PoweredByGoldRush } from "@/components/PoweredByGoldRush"

export const Footer: React.FC = () => {
  return (
    <footer className="flex bg-background-light dark:bg-background-dark w-full items-center justify-between gap-4 py-4 px-8 border-t border-secondary-light dark:border-secondary-dark h-16 fixed bottom-0 left-0">
      <div className="flex flex-col gap-4 gap-y-2 sm:flex-row">
        <a
          href="https://www.goldrush.dev/docs/api/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium leading-none hover:underline"
        >
          API
        </a>
        <a
          href="https://github.com/covalenthq/goldrush-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium leading-none hover:underline"
        >
          UI Kit
        </a>
      </div>

      <a
        href="https://www.covalenthq.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <PoweredByGoldRush />
      </a>
    </footer>
  )
}
