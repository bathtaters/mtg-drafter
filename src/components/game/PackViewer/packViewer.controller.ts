import type { BasicPlayer, Game, LogEntryFull, PackFull, PickInfo, Player } from "types/game"
import type { GameClient } from "backend/controllers/game.socket.d"
import type { ErrorAlert } from "components/base/common/Alerts/alerts.d"
import { useCallback, useEffect, useMemo, useState } from "react"
import { TabLabels } from "types/game"
import { paginatedFetcher } from "components/base/libs/fetch"
import { getDeck, getPack, logToPickInfo, sortByPickOrder } from "./packViewer.utils"
import { viewAuthError } from "assets/strings"
import { logFetchOptions } from "assets/constants"

const size = logFetchOptions.maxSize, params = { filter: { actions: ["pick"] } }

const formatErr = (message: string): ErrorAlert => ({ message, title: 'Cannot view cards', theme: 'warning' })

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
        
        const res = await paginatedFetcher<LogEntryFull>(`/api/game/${game.url}/log`, { size, params, key: 'log' })
        setLoading(false)
        if (typeof res === 'number') {
            setData(undefined)
            setError(`Error <${res}> while fetching pick order.`)
            return
        }
        setData(logToPickInfo(res, players))

    }, [game?.url, players])

    useEffect(() => { !skip && updatePicks() }, [updatePicks, skip])

    return { data, isLoading, error }
}

export default function usePackViewer(
    packs?: PackFull[],
    pickInfo?: PickInfo,
    players?: BasicPlayer[],
    game?: Partial<Game>,
    sessionId?: Player['sessionId'],
    socket?: GameClient | null,
    onPackView?: () => any,
    newError?: (alert: ErrorAlert) => string | undefined,
) {
    // Settings
    const [ packVisible, setPackVisible ] = useState(false)
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

    const viewPack = useCallback((view: boolean) => {
        if (!view) return setPackVisible(false)
        if (!game?.id || !socket || !sessionId) {
            newError && newError?.(formatErr(viewAuthError.MISSING))
            return setPackVisible(false)
        }
        if (!viewType || !selectedPlayer) {
            newError && newError?.(formatErr(viewAuthError.UI))
            return setPackVisible(false)
        }
        
        const cards = viewType === TabLabels.pack ? round : viewType
        socket.emit('viewCards', game.id, sessionId, selectedPlayer, cards, (success: boolean, reason?: string) => {
            setPackVisible(success)
            success && onPackView?.()
            if (!success && newError) newError(formatErr(reason || viewAuthError.DEFAULT))
        })
    }, [viewType, selectedPlayer, round, game?.id, socket, sessionId, newError, onPackView])

    return {
        pack, packVisible, viewPack,
        selectedPlayer, selectPlayer,
        viewType, setViewType,
        round, setRound,
    }
}

export type PackViewerHook = ReturnType<typeof usePackViewer>
export type PickInfoHook = ReturnType<typeof usePickInfo>