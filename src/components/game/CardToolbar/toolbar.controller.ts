import type { CardOptions } from "types/game"
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react"
import { useLocalStorage } from "components/base/libs/storage"
import { sortKeys } from "components/base/services/cardSort.services"
import cardZoomLevels from "./cardZoomLevels"
import { zoomToPixels, warn } from "./toolbar.utils"
import { storageDefaults } from "assets/constants"

export type ToolbarProps = { setCardOptions: Dispatch<SetStateAction<CardOptions>>, notify: AlertsReturn['newToast'], clickReload?: () => void }

const getMaxZoom = () => {
  let z = cardZoomLevels.length
  if (typeof window === 'undefined') return z

  while (--z && (zoomToPixels(z) || window.innerWidth) > window.innerWidth) {}
  return z
}

export default function useToolbar({ setCardOptions, notify }: ToolbarProps) {

  const maxZoom = useRef(getMaxZoom())
  const [ art,  setArt  ] = useLocalStorage<boolean>('showArt')
  const [ sort, setSort ] = useLocalStorage<number>('sortBy')
  const [ zoom, setZoomValue, setTempZoom ] = useLocalStorage<number>('zoom')

  const updateZoom = useCallback((v: string | number) => {
    if ((v = +v) <= maxZoom.current) return setZoomValue(v)
    warn('Zoom value limited by window width', notify)
    setZoomValue(maxZoom.current)
  }, [notify, setZoomValue])

  useEffect(() => {
    const updateMax = () => (maxZoom.current = getMaxZoom()) < zoom && setTempZoom(maxZoom.current)

    window.addEventListener('resize', updateMax)
    return () => window.removeEventListener('resize', updateMax)
  }, [zoom, setTempZoom])

  useEffect(() => { setCardOptions((opt) => ({ ...opt, showArt: art })) }, [art, setCardOptions])
  useEffect(() => { setCardOptions((opt) => ({ ...opt, sort: sortKeys[sort] })) }, [sort, setCardOptions])
  useEffect(() => { setCardOptions((opt) => ({ ...opt, width: cardZoomLevels[zoom] })) }, [zoom, setCardOptions])

  return {
    art, sort, zoom,
    setArt, setSort, setZoom: updateZoom,
  }
}