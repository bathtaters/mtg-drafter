import type { BasicPlayer, Game, LogFull, PackFull, PickInfo } from "types/game"
import { useCallback, useEffect, useMemo, useState } from "react"
import { TabLabels } from "types/game"
import { fetcher } from "components/base/libs/fetch"
import { getDeck, getPack, logQryFilter, logToPickInfo, sortByPickOrder } from "./packViewer.utils"

export function usePickInfo(game?: Partial<Game>, players?: BasicPlayer[], skip?: boolean) {
    // Fetched Data
    const [ data, setData ] = useState<PickInfo>()
    const [ error, setError ] = useState<string>()
    const [ isLoading, setLoading ] = useState(true)

    // Handle Fetching
    const updatePicks = useCallback(async () => {
        setError(undefined)
        if (!game?.url) return setData(undefined)
        
        setLoading(true)
        const res = await fetcher<LogFull>(`/api/game/${game.url}/log?${logQryFilter}`)
        if (res.status === 204) {
            setData(undefined) // Empty log
            setLoading(false)            
        } else if (res.status !== 200 || res.error || res.data?.total == null) {
            setData(undefined)
            setError(`Error <${res.status}> while fetching pick order.`)
            setLoading(false)
        } else {
            setData(logToPickInfo(res.data.log, players))
            setLoading(false)
        }
    }, [game?.url, players])

    useEffect(() => { !skip && updatePicks() }, [updatePicks, skip])

    return { data, isLoading, error }
}

export default function usePackViewer(packs?: PackFull[], pickInfo?: PickInfo, players?: BasicPlayer[], game?: Partial<Game>) {
    // Settings
    const [ packVisible, viewPack ] = useState(false)
    const [ selectedPlayer, selectPlayer ] = useState<BasicPlayer['id']>()
    const [ viewType, setViewType ] = useState<TabLabels>()
    const [ round, setRound ] = useState(1)

    // Format Cards
    const pack = useMemo(() => !(packVisible && selectedPlayer && viewType && packs) ? undefined :
        viewType === TabLabels.pack ?
        sortByPickOrder(getPack(packs, selectedPlayer, round, game?.roundCount, players), pickInfo) :
        sortByPickOrder(getDeck(packs, selectedPlayer, viewType), pickInfo),
        [packVisible, selectedPlayer, viewType, round, pickInfo, game?.roundCount, packs, players]
    )

    return {
        pack, packVisible, viewPack,
        selectedPlayer, selectPlayer,
        viewType, setViewType,
        round, setRound,
    }
}

export type ReturnProps = ReturnType<typeof usePackViewer>
export type PickInfoHook = ReturnType<typeof usePickInfo>