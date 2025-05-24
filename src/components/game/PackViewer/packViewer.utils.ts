import type { BasicPlayer, GameCardFull, LogEntryFull, PackFull, PickInfo, TabLabels } from "types/game"
import { getPackIdx } from "../shared/game.utils"
import { objToQuery } from "components/base/libs/fetch"

export const logQryFilter = objToQuery({ filter: { actions: ["pick"] } })

export const logToPickInfo = (logEntries: LogEntryFull[], players?: BasicPlayer[]) => logEntries.reduce(
    (picks, entry) => {
        if (!entry.cardId) return picks

        const packPick = entry.data?.split(':')
        return { ...picks, [entry.cardId]: {
            name: entry.playerId ? players?.find(({ id }) => id === entry.playerId)?.name : undefined,
            pack: packPick?.[0] ? +packPick[0] : undefined,
            pick: packPick?.[1] ? +packPick[1] : undefined,
        }}
    },
    {} as PickInfo
)


export const getPack = (packs: PackFull[], selectedPlayer: BasicPlayer['id'], round: number, roundCount?: number, players?: BasicPlayer[]) => packs[
    getPackIdx(
        { round, roundCount: roundCount ?? round },
        players ?? [],
        { id: selectedPlayer },
        0 /* Pick 1 */
    )
]?.cards


export const getDeck = (packs: PackFull[], selectedPlayer: BasicPlayer['id'], selectedBoard: TabLabels) => packs.reduce(
    (deck, pack) => [ ...deck, ...pack.cards.filter(({ playerId, board }) => playerId === selectedPlayer && board === selectedBoard) ],
    [] as PackFull['cards']
)


export const sortByPickOrder = (pack?: GameCardFull[], picks?: PickInfo) => !pack || !picks ? pack :
    pack.toSorted((cardL, cardR) => {
        const packL = picks[cardL.id]?.pack
        const packR = picks[cardR.id]?.pack
        
        if (packL === packR) {
            const pickL = picks[cardL.id]?.pick
            const pickR = picks[cardR.id]?.pick

            if (pickL === pickR) return 0
            if (pickL === undefined) return 1
            if (pickR === undefined) return -1
            return pickL - pickR
        }
        if (packL === undefined) return 1
        if (packR === undefined) return -1
        return packL - packR
    })
