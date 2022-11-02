import type { CardOptions } from "../GameBody/pick.controller"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useLocalStorage } from "components/base/services/storage.services"
import { sortKeys } from "components/base/services/cardSort.services"
import cardZoomLevels from "./cardZoomLevels"

export type ToolbarProps = { setCardOptions: Dispatch<SetStateAction<CardOptions>> }

export const sortList = sortKeys.map((k) => k.charAt(0).toUpperCase() + k.slice(1))

export default function useToolbar({ setCardOptions }: ToolbarProps) {
  
  const [ art,  setArt  ] = useLocalStorage<boolean>('showArt')
  const [ sort, setSort ] = useLocalStorage<number>('sortBy')
  const [ zoom, setZoom ] = useLocalStorage<number>('zoom')

  useEffect(() => { setCardOptions((opt) => ({ ...opt, showArt: art })) }, [art])
  useEffect(() => { setCardOptions((opt) => ({ ...opt, sort: sortKeys[sort] })) }, [sort])
  useEffect(() => { setCardOptions((opt) => ({ ...opt, width: cardZoomLevels[zoom] })) }, [zoom])

  return {
    art, sort, zoom,
    setArt, setSort,
    setZoom: (v: string) => setZoom(+v),
  }
}