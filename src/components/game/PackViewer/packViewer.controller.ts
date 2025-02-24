import type { BasicPlayer, Game, LogFull, PackFull, PickInfo } from "types/game"
import { useCallback, useEffect, useMemo, useState } from "react"
import { TabLabels } from "types/game"
import { fetcher } from "components/base/libs/fetch"
import { getDeck, getPack, logQryFilter, logToPickInfo, sortByPickOrder } from "./packViewer.utils"

export default function usePackViewer(packs?: PackFull[], players?: BasicPlayer[], game?: Partial<Game>) {
    // Settings
    const [ packVisible, viewPack ] = useState(false)
    const [ selectedPlayer, selectPlayer ] = useState<BasicPlayer['id']>()
    const [ viewType, setViewType ] = useState<TabLabels>()
    const [ round, setRound ] = useState(1)

    // Fetched Data
    const [ pickInfo, setPickInfo ] = useState<PickInfo>()
    const [ error, setError ] = useState<string>()
    const [ isLoading, setLoading ] = useState(true)

    // Format Cards
    const pack = useMemo(() => !(!isLoading && packVisible && selectedPlayer && viewType && packs) ? undefined :
        viewType === TabLabels.pack ?
            sortByPickOrder(getPack(packs, selectedPlayer, round, game?.roundCount, players), pickInfo) :
            sortByPickOrder(getDeck(packs, selectedPlayer, viewType), pickInfo),
        [isLoading, packVisible, selectedPlayer, viewType, round, pickInfo, game?.roundCount, packs, players]
    )

    // Handle Fetching
    const updatePicks = useCallback(async () => {
        setError(undefined)
        if (!game?.url) return setPickInfo(undefined)
        
        setLoading(true)
        const res = await fetcher<LogFull>(`/api/game/${game.url}/log?${logQryFilter}`)
        if (res.status === 204) {
            setPickInfo(undefined) // Empty log
            setLoading(false)            
        } else if (res.status !== 200 || res.error || res.data?.total == null) {
            setPickInfo(undefined)
            setError(`Error <${res.status}> while fetching pick order.`)
            setLoading(false)
        } else {
            setPickInfo(logToPickInfo(res.data.log, players))
            setLoading(false)
        }
    }, [game?.url, players])

    useEffect(() => { updatePicks() }, [updatePicks])

    return {
        pack, packVisible, viewPack,
        selectedPlayer, selectPlayer,
        viewType, setViewType,
        round, setRound,
        pickInfo, updatePicks, error, isLoading,
    }
}

export type ReturnProps = ReturnType<typeof usePackViewer>