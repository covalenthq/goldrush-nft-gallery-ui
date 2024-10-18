import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Chain, NftTokenContract } from "@covalenthq/client-sdk"
import { useGoldRush } from "@covalenthq/goldrush-kit"
import {
  ExternalLinkIcon,
  Grid2X2Icon,
  Grid3X3Icon,
  Square,
} from "lucide-react"
import { thumbHashToDataURL } from "thumbhash"

import { cn, COVALENT_API_KEY } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"
import NFTCollectionTokenListItem from "./NFTCollectionTokenListItem"

const NftCollectionTokenList: React.FC<{
  params: { chain: Chain; address: string }
}> = ({ params }) => {
  const [nftTokens, setNftTokens] = useState<NftTokenContract[] | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [busy, setBusy] = useState<boolean>(false)
  const [imageSize, setImageSize] = useState<number>(60)
  const { theme } = useGoldRush()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      setBusy(true)
      const response = await fetch(
        `https://api.covalenthq.com/v1/${params.chain}/nft/${params.address}/metadata/?key=${COVALENT_API_KEY}&page-number=${page - 1}&page-size=${pageSize}`
      )
      const nftData = await response.json()
      if (nftData.error) return

      setNftTokens(nftData.data.items)
      setTotalPages(Math.ceil(nftData.data.pagination.total_count / pageSize))
      setBusy(false)
    })()
  }, [params, page, pageSize])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }

  const generatePagination = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "...", totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-end w-full p-3">
        <Square
          className={cn(
            "inline-block mr-2 text-secondary-light dark:text-secondary-dark cursor-pointer",
            imageSize === 60 && "text-primary-light dark:text-primary-dark"
          )}
          onClick={() => setImageSize(60)}
        />
        <Grid2X2Icon
          className={cn(
            "inline-block mr-2 text-secondary-light dark:text-secondary-dark cursor-pointer",
            imageSize === 40 && "text-primary-light dark:text-primary-dark"
          )}
          onClick={() => setImageSize(40)}
        />
        <Grid3X3Icon
          className={cn(
            "inline-block mr-2 text-secondary-light dark:text-secondary-dark cursor-pointer",
            imageSize === 28 && "text-primary-light dark:text-primary-dark"
          )}
          onClick={() => setImageSize(28)}
        />
      </div>
      {busy ? (
        <div className="flex flex-wrap items-center gap-4">
          {[...Array(pageSize)].map((_) => (
            <div
              key={_}
              className="bg-secondary-light dark:bg-secondary-dark rounded animate-pulse"
              style={{
                borderRadius: theme.borderRadius,
              }}
            >
              <div
                className={cn(
                  "group bg-secondary-light dark:bg-secondary-dark transition-all relative h-72 w-60",
                  imageSize === 40 && "h-48 w-40",
                  imageSize === 28 && "h-32 w-28"
                )}
                style={{
                  borderRadius: theme.borderRadius,
                }}
              ></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-4">
            {nftTokens?.map((token) => (
              <NFTCollectionTokenListItem
                token={token}
                imageSize={imageSize}
                params={params}
                key={token.nft_data?.token_id}
              />
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between mt-4 w-full">
        <div className="mb-4">
          <Select
            onValueChange={(value) => handlePageSizeChange(parseInt(value))}
            defaultValue={pageSize.toString()}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent className="bg-background-light dark:bg-background-dark">
              {["5", "10", "20", "30", "50"].map((size) => (
                <SelectItem key={size} value={size}>
                  Items Per Page: {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Pagination className="my-4 mx-0 justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (page > 1) {
                    handlePageChange(page - 1)
                  }
                }}
                isActive={page !== 1}
              />
            </PaginationItem>

            {generatePagination().map((pg) =>
              pg === "..." ? (
                <PaginationItem key={pg}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pg}>
                  <PaginationLink
                    isActive={pg === page}
                    onClick={() => handlePageChange(Number(pg))}
                  >
                    {pg}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (page < totalPages) {
                    handlePageChange(page + 1)
                  }
                }}
                isActive={page !== totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default NftCollectionTokenList
