import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NftTraitFilter } from "@/utils/types/shared.types"
import { Chain, NftTokenContract } from "@covalenthq/client-sdk"
import { useGoldRush } from "@covalenthq/goldrush-kit"
import { Grid2X2Icon, Grid3X3Icon, Square } from "lucide-react"

import { cn, GOLDRUSH_API_KEY } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import FacetSearch from "../filters/FacetSearch"
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
  const [selectedTraits, setSelectedTraits] = useState<NftTraitFilter | null>(
    null
  )
  const [totalPages, setTotalPages] = useState<number>(1)
  const [busy, setBusy] = useState<boolean>(false)
  const [imageSize, setImageSize] = useState<number>(60)

  const { theme } = useGoldRush()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pageParam = searchParams.get("page")
  const pageSizeParam = searchParams.get("pageSize")

  const [page, setPage] = useState<number>(
    pageParam ? parseInt(pageParam, 10) : 1
  )
  const [pageSize, setPageSize] = useState<number>(
    pageSizeParam ? parseInt(pageSizeParam, 10) : 10
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    router.push(`?page=${newPage}&pageSize=${pageSize}`)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    router.push(`?page=1&pageSize=${newPageSize}`)
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

  useEffect(() => {
    ;(async () => {
      setBusy(true)
      let response
      if (Object.keys(selectedTraits ?? {}).length !== 0) {
        response = await fetch(
          `https://api.covalenthq.com/v1/${params.chain}/nft/${params.address}/metadata/?key=${GOLDRUSH_API_KEY}&page-number=${page - 1}&page-size=${pageSize}&traits-filter=${Object.keys(selectedTraits ?? {}).join("%2C")}&values-filter=${Object.values(
            selectedTraits ?? {}
          )
            .flat()
            .join("%2C")}`
        )
      } else {
        response = await fetch(
          `https://api.covalenthq.com/v1/${params.chain}/nft/${params.address}/metadata/?key=${GOLDRUSH_API_KEY}&page-number=${page - 1}&page-size=${pageSize}`
        )
      }
      const nftData = await response.json()
      if (nftData.error) return

      setNftTokens(nftData.data.items)
      setTotalPages(Math.ceil(nftData.data.pagination.total_count / pageSize))
      setBusy(false)
    })()
  }, [params, page, pageSize, selectedTraits])

  return (
    <div className="flex flex-col gap-4 w-full">
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
        <div className="flex items-start gap-x-4">
          <FacetSearch
            params={params}
            selectedTraits={selectedTraits ?? {}}
            setSelectedTraits={setSelectedTraits}
          />
          <div className="flex flex-wrap items-center gap-4">
            {[...Array(pageSize)].map((_, idx) => (
              <div
                key={idx}
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
        </div>
      ) : (
        <div className="flex items-start gap-x-4">
          <FacetSearch
            params={params}
            selectedTraits={selectedTraits ?? {}}
            setSelectedTraits={setSelectedTraits}
          />
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
