import { atom, useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useCallback, useEffect, useMemo } from 'react'

import { useGetRefinementWidgets } from '@instantsearch/hooks/useGetRefinementWidgets'
import {
  getPanelAttributes,
  getPanelId,
} from '@instantsearch/utils/refinements'
import { DynamicWidgets } from '@instantsearch/widgets/dynamic-widgets/dynamic-widgets'
import { ExpandablePanel } from '@instantsearch/widgets/expandable-panel/expandable-panel'

import type { RefinementsPanelProps } from './refinements-panel'

import { configAtom } from '@/config/config'
import { useTailwindScreens } from '@/hooks/useTailwindScreens'

export type RefinementsPanelBodyProps = Pick<
  RefinementsPanelProps,
  'dynamicWidgets'
>

export type Panels = {
  [key: string]: boolean
}

function togglePanels(panels: Panels, val: boolean) {
  return Object.keys(panels).reduce(
    (acc, panelKey) => ({ ...acc, [panelKey]: val }),
    {}
  )
}

export const refinementsPanelsAtom = atom<Panels>({})
export const refinementsPanelsExpandedAtom = atom(
  (get) =>
    Boolean(Object.values(get(refinementsPanelsAtom)).find((v) => v === true)),
  (get, set, update: (prev: boolean) => boolean) => {
    const expanded = update(get(refinementsPanelsExpandedAtom))
    set(
      refinementsPanelsAtom,
      togglePanels(get(refinementsPanelsAtom), expanded)
    )
  }
)

export function RefinementsPanelBody({
  dynamicWidgets,
}: RefinementsPanelBodyProps) {
  const { refinements } = useAtomValue(configAtom)
  const { laptop } = useTailwindScreens()

  const [panels, setPanels] = useAtom(refinementsPanelsAtom)

  // Set initial panels value
  useEffect(() => {
    setPanels(
      refinements.reduce(
        (acc, current) => ({
          ...acc,
          [getPanelId(current)]: !laptop ? false : Boolean(current.isExpanded),
        }),
        {}
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onToggle = useCallback(
    (panelId: string) => {
      setPanels((prevPanels) => {
        const otherPanels = !laptop
          ? togglePanels(prevPanels, false)
          : prevPanels

        return {
          ...otherPanels,
          [panelId]: !prevPanels[panelId],
        }
      })
    },
    [setPanels, laptop]
  )

  const widgets = useGetRefinementWidgets(refinements)
  const widgetsPanels = useMemo(
    () =>
      widgets.map((widget, i) => {
        const refinement = refinements[i]
        const panelId = getPanelId(refinement)
        const panelAttributes = getPanelAttributes(refinement)

        return (
          <ExpandablePanel
            key={panelId}
            attributes={panelAttributes}
            header={refinement.header}
            isOpened={panels[panelId]}
            className={i === 0 ? 'pt-0' : ''}
            onToggle={() => onToggle(panelId)}
          >
            {widget}
          </ExpandablePanel>
        )
      }),
    [widgets, refinements, onToggle, panels]
  )

  return (
    <DynamicWidgets enabled={dynamicWidgets}>{widgetsPanels}</DynamicWidgets>
  )
}
