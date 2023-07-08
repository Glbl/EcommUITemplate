import classNames from 'classnames'
import { useAtomValue } from 'jotai/utils'

import { isSearchStalledAtom } from '@instantsearch/widgets/state-results/state-results'

export function LoadingBar() {
  const isSearchStalled = useAtomValue(isSearchStalledAtom)
  const cn = classNames('loadingBar', {
    'loadingBar--loading': isSearchStalled,
  })

  return <div className={cn} />
}
