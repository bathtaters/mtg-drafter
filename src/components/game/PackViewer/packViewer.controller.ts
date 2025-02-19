import { type BasicPlayer, type Game, type PackFull, TabLabels } from "types/game"
import { useMemo, useState } from "react"
import { getPackIdx } from "../shared/game.utils"

export default function usePackViewer(packs?: PackFull[], players?: BasicPlayer[], game?: Partial<Game>) {
    const [ packVisible, viewPack ] = useState(false)
    const [ selectedPlayer, selectPlayer ] = useState<BasicPlayer['id']>()
    const [ viewType, setViewType ] = useState<TabLabels>()
    const [ round, setRound ] = useState(1)

    const pack = useMemo(() => !(packVisible && selectedPlayer && viewType && packs) ? undefined :
        viewType === TabLabels.pack ? packs[
            getPackIdx(
                { round, roundCount: game?.roundCount ?? round },
                players ?? [],
                players?.find(({ id }) => id === selectedPlayer) ?? null
            )
        ]?.cards : packs.reduce(
            (deck, pack) => [ ...deck, ...pack.cards.filter(({ playerId, board }) => playerId === selectedPlayer && board === viewType) ],
            [] as PackFull['cards']
        ),
        [packVisible, selectedPlayer, viewType, round, game?.roundCount, packs, players]
    )

    return {
        pack, packVisible, viewPack,
        selectedPlayer, selectPlayer,
        viewType, setViewType,
        round, setRound,
    }
}

export type ReturnProps = ReturnType<typeof usePackViewer>