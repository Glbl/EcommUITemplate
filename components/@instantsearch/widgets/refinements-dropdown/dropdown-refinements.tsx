import { memo } from 'react'
import isEqual from 'react-fast-compare'
import type { CurrentRefinementsProvided } from 'react-instantsearch-core'
import { connectCurrentRefinements } from 'react-instantsearch-core'

import { useCurrentRefinementCount } from '../../hooks/useCurrentRefinementCount'

import { Dropdown } from '@/components/@ui/dropdown/dropdown'
import type { DropdownProps } from '@/components/@ui/dropdown/dropdown'

export type RefinementsDropdownProps = CurrentRefinementsProvided &
  DropdownProps & {
    children: React.ReactNode
    attributes?: string[]
  }

export function RefinementsDropdownComponent({
  children,
  attributes = [],
  items,
  header,
  classNameContainer,
}: RefinementsDropdownProps) {
  const currentRefinementCount = useCurrentRefinementCount(items, attributes)

  return (
    <Dropdown
      header={header}
      classNameContainer={classNameContainer}
      count={currentRefinementCount}
    >
      <div className="p-3">{children}</div>
    </Dropdown>
  )
}

export const RefinementsDropdown =
  connectCurrentRefinements<RefinementsDropdownProps>(
    memo(RefinementsDropdownComponent, isEqual)
  )
