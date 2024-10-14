import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Chain, NftTokenContract } from "@covalenthq/client-sdk"
import { useGoldRush } from "@covalenthq/goldrush-kit"
import { ExternalLinkIcon } from "lucide-react"

import { COVALENT_API_KEY } from "@/lib/utils"
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

const NftCollectionTokenList: React.FC<{
  params: { chain: Chain; address: string }
}> = ({ params }) => {
  const [nftTokens, setNftTokens] = useState<NftTokenContract[] | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [busy, setBusy] = useState<boolean>(false)
  const { theme } = useGoldRush()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      setBusy(true)
      const response = await fetch(
        `https://api.covalenthq.com/v1/${params.chain}/nft/${params.address}/metadata/?key=${COVALENT_API_KEY}&page-number=${page}&page-size=${pageSize}`
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
      <div className="flex flex-wrap items-center gap-4">
        {busy
          ? [...Array(10)].map((_) => (
              <div
                key={_}
                className="bg-secondary-light dark:bg-secondary-dark rounded animate-pulse"
                style={{
                  borderRadius: theme.borderRadius,
                }}
              >
                <div
                  className="group bg-secondary-light dark:bg-secondary-dark transition-all relative h-72 w-60"
                  style={{
                    borderRadius: theme.borderRadius,
                  }}
                ></div>
              </div>
            ))
          : nftTokens?.map((token) => (
              <div
                key={token.nft_data?.token_id}
                className="border border-secondary-light dark:border-secondary-dark"
                style={{
                  borderRadius: theme.borderRadius,
                }}
              >
                <div
                  className="group bg-slate-100 transition-all relative cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/collection/${params.chain}/${params.address}/token/${token.nft_data?.token_id}`
                    )
                  }}
                  style={{
                    borderRadius: theme.borderRadius,
                  }}
                >
                  <div className="absolute h-full w-full rounded-t bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                    <ExternalLinkIcon className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100" />
                  </div>
                  <img
                    src={token.nft_data?.external_data?.image}
                    alt={token.nft_data?.external_data?.name}
                    className="w-60 h-60 block cursor-pointer"
                    style={{
                      borderTopLeftRadius: theme.borderRadius,
                      borderTopRightRadius: theme.borderRadius,
                    }}
                  />
                </div>

                <div>
                  <div className="text-secondary-light dark:text-secondary-dark px-2 pt-2">
                    {token.contract_name}
                  </div>
                  <div className="font-bold px-2 pb-2">
                    {token.nft_data?.external_data?.name ??
                      `#${token.nft_data?.token_id}`}
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="flex justify-between mt-4 w-full">
        <div className="mb-4">
          <Select
            onValueChange={(value) => setPageSize(parseInt(value))}
            defaultValue={pageSize.toString()}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent className="bg-background-light dark:bg-background-dark">
              {["5", "10", "20", "30", "50"].map((size) => (
                <SelectItem key={size} value={size}>
                  Row Size: {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Pagination className="my-4 mx-0 justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                isActive={page === 1}
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
                onClick={() => handlePageChange(page + 1)}
                isActive={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default NftCollectionTokenList
