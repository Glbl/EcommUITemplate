import FilterIcon from '@material-design-icons/svg/outlined/filter_list.svg'
import classNames from 'classnames'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'

import {
  CurrentRefinements,
  refinementCountAtom,
} from '@instantsearch/widgets/current-refinements/current-refinements'
import { SortBy } from '@instantsearch/widgets/sort-by/sort-by'
import { Button } from '@ui/button/button'
import { Count } from '@ui/count/count'
import { IconLabel } from '@ui/icon-label/icon-label'

import { refinementsPanelMobileExpandedAtom } from '@/components/refinements-panel/refinements-panel'
import { ToggleFilters } from '@/components/toggle-filters/toggle-filters'
import { ViewModes } from '@/components/view-modes/view-modes'
import { configAtom } from '@/config/config'
import { Laptop, Tablet } from '@/lib/media'

const RefinementsBarDropdowns = dynamic<any>(() =>
  import(
    /* webpackChunkName: 'refinements-bar' */ '@/components/refinements-bar/refinements-bar-dropdowns'
  ).then((mod) => mod.RefinementsBarDropdowns)
)

export type RefinementsBarProps = {
  dynamicWidgets?: boolean
  showWidgets?: boolean
  className?: string
}

export function RefinementsBar({
  dynamicWidgets = true,
  showWidgets = false,
  className,
}: RefinementsBarProps) {
  const { sorts } = useAtomValue(configAtom)
  const sortDefaultRefinement = sorts.find((s) => s.isDefault)?.value

  const setMobileExpanded = useUpdateAtom(refinementsPanelMobileExpandedAtom)
  const refinementCount = useAtomValue(refinementCountAtom)

  return (
    <section className={classNames('w-full', className)}>
      <Tablet className="flex justify-between">
        <ViewModes />

        <Button
          className="flex items-center gap-1"
          onClick={() => setMobileExpanded(true)}
        >
          <IconLabel
            icon={FilterIcon}
            label="Filter &amp; Sort"
            labelPosition="right"
            labelTheme="body-regular"
          />
          {refinementCount > 0 && <Count>{refinementCount}</Count>}
        </Button>
      </Tablet>

      <Laptop className="flex flex-col gap-4">
        <div className="flex-grow flex">
          {showWidgets && (
            <RefinementsBarDropdowns dynamicWidgets={dynamicWidgets} />
          )}

          {!showWidgets && <CurrentRefinements />}

          <div className="flex gap-6 ml-auto">
            {!showWidgets && <ToggleFilters />}
            <ViewModes />
            <SortBy
              defaultRefinement={sortDefaultRefinement}
              items={sorts}
              className="w-52"
            />
          </div>
        </div>

        {showWidgets && <CurrentRefinements />}
      </Laptop>
    </section>
  )
}
