import type { PackFull, ServerProps, Local } from 'types/game'
import { useCallback, useMemo, useState } from 'react'
import { spliceInPlace, updateArrayIdx } from 'components/base/services/common.services'
import { canAdvance, filterPackIds, getHolding, getPackIdx, getPlayerIdx, getSlots, playerIsHost } from '../../shared/game.utils'
import { reloadData } from '../game.controller'
import { AlertsReturn } from 'components/base/common/Alerts/alerts.hook'


export default function useLocalController(props: ServerProps, throwError: AlertsReturn['newError'], notify: AlertsReturn['newToast']) {
  const [loadingAll,  setLoadingAll] = useState(0)
  const [loadingPack, setLoadingPack] = useState(1)

  const [ game,    updateGame    ] = useState(props.options)
  const [ player,  updatePlayer  ] = useState(props.player || undefined)
  const [ packs,   updatePacks   ] = useState(props.packs || [])
  const [ players, updatePlayers ] = useState(props.players || [])
  const [ slots,   updateSlots   ] = useState(getSlots(props.players))
  const [ pack,    updatePack    ] = useState<PackFull | undefined>()
  
  const isHost = playerIsHost(player, game)
  const holding = getHolding(players, game)
  const playerIdx = useMemo(() => getPlayerIdx(players, player), [player?.id, players.length])
  const isReady = isHost && canAdvance(game, players, holding)

  const nextRound: Local.NextRound = useCallback((round) => {
    updateGame((g) => g && ({ ...g, round }))
    updatePlayers((list) => list.map((p) => ({ ...p, pick: 1 })))
    updatePlayer((p) => p && ({ ...p, pick: 1 }))
    isHost && setLoadingPack((v) => v && v - 1)
  }, [])


  const renamePlayer: Local.RenamePlayer = useCallback((playerId, name) => {
    if (playerId === player?.id) updatePlayer((p) => p && ({ ...p, name }))
    updatePlayers((list) => list && updateArrayIdx(list,
      ({ id }) => id === playerId, (p) => ({ ...p, name })
    ))
  }, [player?.id])


  const pickCard: Local.PickCard = useCallback((playerId, pick, passingToId) => {
    updatePlayers((list) => updateArrayIdx(list,
      ({ id }) => id === playerId, (p) => ({ ...p, pick })
    ))
    
    if (passingToId && player?.id === passingToId) updatePack((pack) => {
      if (!pack) reloadData({ game, updateLocal }, throwError)
      return pack
    })
  }, [game?.id, player?.id])


  const swapCard: Local.SwapCard = useCallback((pickedCardId, board) => {
    updatePlayer((p) => p && ({ ...p,
      cards: updateArrayIdx(p.cards, ({ id }) => id === pickedCardId, (c) => ({ ...c, board }))
    }))
  }, [])


  const setLands: Local.SetLands = useCallback((basics) => {
    updatePlayer((p) => p && ({ ...p, basics }))
  }, [])


  const setStatus: Local.SetStatus = useCallback((playerId, sessionId) => {
    updateSlots((s) => sessionId ? spliceInPlace(s, (pid) => pid === playerId) : s.concat(playerId))
    updatePlayers((list) => list && updateArrayIdx(list,
      ({ id }) => id === playerId, (p) => ({ ...p, sessionId })
    ))
    updatePlayer((p) => p?.id !== playerId ? p : sessionId ? ({ ...p, sessionId }) : undefined)
    if (!sessionId) setLoadingAll((v) => v && v - 1)
  }, [])
    
  const updateLocal = useCallback((data: ServerProps) => {
    if ('error' in data) throw new Error(`CAnnot updating data: ${data.error}`)

    updateGame(data.options)
    updatePlayer(data.player || undefined)
    updatePacks(data.packs || [])
    updatePlayers(data.players)
    updateSlots(getSlots(data.players))

    const newPack = data.packs?.[getPackIdx(data.options, data.players, data.player)] as PackFull | undefined
    updatePack(filterPackIds(newPack))
  }, [])

  const reload = useCallback(() => {
    setLoadingAll((v) => v + 1)
    reloadData({ game, updateLocal }, throwError).finally(() => setLoadingAll((v) => v && v - 1))
  }, [game?.url, updateLocal])


  return {
    loadingPack, setLoadingPack, loadingAll, setLoadingAll, updatePlayer, updateGame, updateLocal,
    game, player, players, playerIdx, holding, isHost, isReady, pack, packs, slots,
    sessionId: props.sessionId,
    renamePlayer, nextRound, pickCard, swapCard, setLands, setStatus, reload,
  }
}

export type LocalController = ReturnType<typeof useLocalController>