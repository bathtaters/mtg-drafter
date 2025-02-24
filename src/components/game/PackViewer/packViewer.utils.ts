import type { BasicPlayer, GameCardFull, LogEntryFull, PackFull, PickInfo, TabLabels } from "types/game"
import { getPackIdx } from "../shared/game.utils"
import { objToQuery } from "components/base/libs/scrollFetch"

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
        players?.find(({ id }) => id === selectedPlayer) ?? null
    )
]?.cards


export const getDeck = (packs: PackFull[], selectedPlayer: BasicPlayer['id'], selectedBoard: TabLabels) => packs.reduce(
    (deck, pack) => [ ...deck, ...pack.cards.filter(({ playerId, board }) => playerId === selectedPlayer && board === selectedBoard) ],
    [] as PackFull['cards']
)


export const sortByPickOrder = (pack?: GameCardFull[], picks?: PickInfo) => !pack || !picks ? pack :
    pack.toSorted((cardL, cardR) => {
        const packL = picks[cardL.id]?.pack ?? 0
        const packR = picks[cardR.id]?.pack ?? 0
        if (packL !== packR) return packL - packR

        const pickL = picks[cardL.id]?.pick ?? 0
        const pickR = picks[cardR.id]?.pick ?? 0
        return pickL - pickR
    })
