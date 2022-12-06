import type { CardOptions } from "types/game"
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react"
import { useLocalStorage } from "components/base/services/storage.services"
import { sortKeys } from "components/base/services/cardSort.services"
import cardZoomLevels from "./cardZoomLevels"
import { zoomToPixels, warn } from "./toolbar.utils"

export type ToolbarProps = { setCardOptions: Dispatch<SetStateAction<CardOptions>>, clickReload?: () => void }

export default function useToolbar({ setCardOptions }: ToolbarProps) {
  
  const [ art,  setArt  ] = useLocalStorage<boolean>('showArt')
  const [ sort, setSort ] = useLocalStorage<number>('sortBy')
  const [ zoom, setZoom, setTempZoom ] = useLocalStorage<number>('zoom')

  useLayoutEffect(() => {
    const limitWidth = () => {
      if (typeof window === 'undefined' || window.innerWidth > (zoomToPixels(zoom) || 0)) return false

      let z = zoom
      while (z-- && (zoomToPixels(z) || window.innerWidth) > window.innerWidth) {}
      setTempZoom(z)
      return true
    }
    if (limitWidth()) warn('Zoom value limited by window width')

    window.addEventListener('resize', limitWidth)
    return () => window.removeEventListener('resize', limitWidth)
  }, [zoom, setTempZoom])

  useEffect(() => { setCardOptions((opt) => ({ ...opt, showArt: art })) }, [art])
  useEffect(() => { setCardOptions((opt) => ({ ...opt, sort: sortKeys[sort] })) }, [sort])
  useEffect(() => { setCardOptions((opt) => ({ ...opt, width: cardZoomLevels[zoom] })) }, [zoom])

  return {
    art, sort, zoom,
    setArt, setSort, setZoom: (v: string) => setZoom(+v),
  }
}