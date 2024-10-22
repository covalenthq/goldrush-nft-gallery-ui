import React, { useEffect, useState } from "react"
import { NftTraitFilter } from "@/utils/types/shared.types"
import { Chain, GoldRushClient, NftTraitSummary } from "@covalenthq/client-sdk"

import { cn, COVALENT_API_KEY } from "@/lib/utils"

const FacetSearch: React.FC<{
  params: {
    chain: Chain
    address: string
  }
  selectedTraits: NftTraitFilter
  setSelectedTraits: React.Dispatch<React.SetStateAction<NftTraitFilter | null>>
}> = ({ params, selectedTraits, setSelectedTraits }) => {
  const [attributes, setAttributes] = useState<NftTraitSummary[]>([])
  const [openAttribute, setOpenAttribute] = useState<string[]>([])

  const handleUpdateTraits = (trait_type: string, value: string) => {
    if (
      selectedTraits &&
      selectedTraits[trait_type] &&
      selectedTraits[trait_type][0] === value
    ) {
      const updatedTraits = { ...selectedTraits }
      delete updatedTraits[trait_type]
      setSelectedTraits(
        Object.keys(updatedTraits).length > 0 ? updatedTraits : null
      )
    } else {
      setSelectedTraits({
        ...selectedTraits,
        [trait_type]: [value],
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      const client = new GoldRushClient(COVALENT_API_KEY!)
      const attributeData = await client.NftService.getCollectionTraitsSummary(
        params.chain,
        params.address
      )
      if (attributeData.error) return
      if (attributeData.data.items) {
        setAttributes(attributeData.data.items)
      }
    })()
  }, [params])

  return (
    <div className="min-w-52">
      <h6 className="text-sm font-semibold text-foreground-light dark:text-foreground-dark">
        Filter by Attributes
      </h6>
      <span className="text-xs font-semibold text-foreground-light dark:text-foreground-dark opacity-70">
        Single value per trait
      </span>
      {attributes.map((attribute, index) => (
        <div key={attribute.name}>
          <button
            className="flex flex-col items-start justify-between mt-2 gap-y-1.5 w-full pr-12"
            onClick={() => {
              if (attribute.name) {
                if (openAttribute.includes(attribute.name)) {
                  setOpenAttribute(
                    openAttribute.filter((attr) => attr !== attribute.name)
                  )
                } else {
                  setOpenAttribute([...openAttribute, attribute.name])
                }
              }
            }}
          >
            <span className="text-sm text-foreground-light dark:text-foreground-dark">
              {attribute.name}
            </span>
          </button>
          {attribute.name &&
          openAttribute.includes(attribute.name) &&
          attribute.attributes
            ? attribute.attributes.map((attr, index) => (
                <span
                  key={attr.trait_type}
                  className="text-xs text-gray-500 flex flex-col gap-y-1 w-full"
                >
                  {attr.values
                    ? attr.values.map((value, index) => (
                        <button
                          key={value.value}
                          className={cn(
                            "flex items-center text-xs text-secondary-light dark:text-secondary-dark justify-between w-full gap-x-2",
                            selectedTraits[attr.trait_type ?? ""]?.includes(
                              value.value ?? ""
                            ) && "text-primary-light dark:text-primary-dark"
                          )}
                          onClick={() => {
                            handleUpdateTraits(
                              attr.trait_type ?? "",
                              value.value ?? ""
                            )
                          }}
                        >
                          <span>{value.value}</span>
                          <span>{value.count}</span>
                        </button>
                      ))
                    : null}
                </span>
              ))
            : null}
        </div>
      ))}
    </div>
  )
}

export default FacetSearch
