import type { LogAction } from "@prisma/client"
import type { Game, BasicPlayer, LogFull, LogEntryFull, GameCardFull, GameCardPartial, PackFull, CardOptions, Player } from "types/game"
import type { LogFilterParam } from "types/log.validation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "components/base/libs/storage"
import { fetcher } from "components/base/libs/fetch"
import downloadTextFile from "components/base/libs/download"
import useAdvancedFetch, { type FetchHandler } from "components/base/libs/advancedFetch"
import useToolbar from "../CardToolbar/toolbar.controller"
import { adaptEntry, filterEntry, stringifyLogEntries } from "./log.utils"
import { logOptions, logFetchOptions } from "assets/constants"
import { LOG_EXT, logFilename } from "assets/strings"
import { allActions, otherPlayers } from "types/logs"


export function useCardPopout(packs?: PackFull[]) {
  const [card, showCard] = useState<GameCardFull | GameCardPartial>()
  const setCard = (card?: GameCardPartial) => showCard(card ? packs?.[card.packIdx].cards.find(({ id }) => id === card.id) ?? card : card)

  const [{ width }, setCardOptions] = useState<CardOptions>({ width: '', showArt: true })
  const { zoom, setZoom } = useToolbar({ setCardOptions, notify: ({ message }) => console.error(message) })

  return { card, setCard, width, zoom, setZoom }
}


export default function useGameLog(url: Game['url'], playerData: BasicPlayer[]) {
  const allPlayers = useMemo(() => playerData.map(({ id }) => id).concat(otherPlayers), [playerData])
  const [ players, setPlayers ] = useState(allPlayers)
  const [ options, setOptions ] = useState(logOptions)
  const [ actions, setActions ] = useLocalStorage<LogAction[]>('logActions')

  const filter = useCallback((entry?: LogEntryFull) => filterEntry(entry, players, actions, options), [players, actions, options])

  const fetchLogs = useCallback<FetchHandler<LogEntryFull, LogParams>>(async (query, params) => {
    const res = await fetcher<LogFull>(`/api/game/${url}/log?${query}`)
    if (res.status === 204) return; // End of log
    if (res.status !== 200 || res.error || res.data?.total == null) return { error: `Error <${res.status}> while fetching log.` }

    const data = params.offset == null && !params.isPreview ? res.data.log.toReversed() : res.data.log
    return { data: data.map(adaptEntry), total: res.data.total, offset: res.data.offset }
  }, [url])

  const {
    entries, fetchAll,
    fetch, intersectFetch, reset,
    enabled, setEnabled,
    error, setError,
  } = useAdvancedFetch(fetchLogs, { filter, initalEnabled: false, ...logFetchOptions })

  const download = async () => {
    const jsonData = await fetchAll().then((data) => stringifyLogEntries(data, playerData))
    downloadTextFile(logFilename(url), jsonData, LOG_EXT)
  }
  
  // Handle minor changes -- Reset cache on URL change, reload preview on filter change
  useEffect(() => { reset(true) }, [url, reset])
  useEffect(() => { reset(false) }, [enabled, reset])
  useEffect(() => { fetch({ filter: { ...options, players, actions }, isPreview: true }) }, [options, players, actions, fetch])
  
  return {
    entries, fetch, intersectFetch, reset,
    allActions, allPlayers,
    error, setError,
    players, setPlayers,
    actions, setActions,
    options, setOptions,
    enabled, setEnabled,
    download,
  }
}

export type GameLog = ReturnType<typeof useGameLog>

export type LogParams = { offset?: number, size?: number, isPreview?: boolean, filter?: LogFilterParam }