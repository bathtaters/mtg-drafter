import type { PackFull, ServerProps, Local } from './game'
import { useCallback, useMemo, useState } from 'react'
import { updateArrayIdx } from 'components/base/services/common.services'
import { filterPackIds, getHolding, getNeighborIdx, getPackIdx } from './game.utils'


export default function useLocalController(props: ServerProps) {
  const [loadingPack, setLoadingPack] = useState(false)

  const [ game,    updateGame    ] = useState(props.options)
  const [ player,  updatePlayer  ] = useState(props.player)
  const [ packs,   updatePacks   ] = useState(props.packs || [])
  const [ players, updatePlayers ] = useState(props.players || [])

  const playerIdx = props.playerIdx ?? -1
  const neighborIdx = useMemo(() => getNeighborIdx(game, players.length, playerIdx), [game?.round, players.length, props.playerIdx])
  const packIdx = useMemo(() => getPackIdx(game, players, playerIdx, neighborIdx), [game?.round, player?.pick, players[neighborIdx]?.pick])

  const [ pack, setPack ] = useState<PackFull | undefined>(packs[packIdx])

  const holding = getHolding(game, players)

  const isReady = game != null && game?.hostId && game.hostId === player?.id && (
    game.round < 1 ? players.every(({ sessionId }) => sessionId) : holding.every((n) => !n)
  )


  const nextRound: Local.NextRound = useCallback((round) => {
    updateGame((g) => g && ({ ...g, round }))
    updatePlayers((list) => list.map((p) => ({ ...p, pick: 1 })))
    updatePlayer((p) => p && ({ ...p, pick: 1 }))
  }, [])


  const renamePlayer: Local.RenamePlayer = useCallback((playerId, name) => {
    if (playerId === player?.id) updatePlayer((p) => p && ({ ...p, name }))
    updatePlayers((list) => list && updateArrayIdx(list,
      ({ id }) => id === playerId, (p) => ({ ...p, name })
    ))
  }, [player?.id])


  const otherPick: Local.OtherPick = useCallback((playerId, pick) => {
    updatePlayers((list) => list && updateArrayIdx(list,
      ({ id }) => id === playerId, (p) => ({ ...p, pick })
    ))
  }, [])

  const pickCard: Local.PickCard = useCallback((pick, gameCardId, board = 'main') => {
    const gameCard = pack?.cards.find(({ id }) => id === gameCardId)
    if (!gameCard) {
      updatePlayer((p) => p && ({ ...p, pick }))
      return console.error('Pick not found in current pack',pack?.id,gameCardId)
    }
    
    updatePlayer((p) => p && ({ ...p, pick,
      cards: p.cards.findIndex(({ id }) => id === gameCardId) === -1 ?
        p.cards.concat({ ...gameCard, playerId: p.id, board }) :
        p.cards
    }))
  }, [pack, player?.id])


  const swapCard: Local.SwapCard = useCallback((pickedCardId, board) => {
    updatePlayer((p) => p && ({ ...p,
      cards: updateArrayIdx(p.cards, ({ id }) => id === pickedCardId, (c) => ({ ...c, board }))
    }))
  }, [])


  const setLands: Local.SetLands = useCallback((basics) => {
    updatePlayer((p) => p && ({ ...p, basics }))
  }, [])


  const setNextPack: Local.SetPack = useCallback((pickableIds) => {
    if (!pickableIds || !packs[packIdx]?.id) return setPack(undefined)
    setPack(filterPackIds(packs[packIdx], pickableIds))
    setLoadingPack(false)
  }, [packs, packIdx])

  return {
    loadingPack, setLoadingPack,
    game, player, players, playerIdx, holding, isReady, pack, packIdx, packs,
    renamePlayer, nextRound, otherPick, pickCard, swapCard, setLands, setNextPack,
  }
}

export type LocalController = ReturnType<typeof useLocalController>