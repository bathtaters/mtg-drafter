import type { Ban } from '@prisma/client'
import type { PackFull, ServerProps, Local, PlayerFull } from 'types/game'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { spliceInPlace, updateArrayIdx } from 'components/base/services/common.services'
import { gameIsPaused, getCanAdvance, getCurrentPack, getHolding, getPlayerIdx, getSlots, playerIsHost } from '../../shared/game.utils'
import { playerIsBanned } from 'components/game/shared/player.utils'
import { reloadData } from '../basic.controller'
import { useTimerStore } from 'components/base/libs/hooks'
import { AlertsReturn } from 'components/base/common/Alerts/alerts.hook'
import { shareWatch } from 'assets/constants'


const isWatchRegex = RegExp(`^${shareWatch.url('')}[a-zA-Z0-9_-]+$`)

export default function useLocalController(props: ServerProps, throwError: AlertsReturn['newError'], notify: AlertsReturn['newToast']) {
  const router = useRouter()
  const isWatchPage = isWatchRegex.test(router.asPath)

  const [loadingAll,  setLoadingAll] = useState(1)
  const [loadingPack, setLoadingPack] = useState(1)

  const [ game,    updateGame    ] = useState(props.options)
  const [ player,  updatePlayer  ] = useState<Omit<PlayerFull,'timer'> | undefined>(props.player || undefined)
  const [ packs,   updatePacks   ] = useState(props.packs || [])
  const [ players, updatePlayers ] = useState(props.players || [])
  const [ slots,   updateSlots   ] = useState(getSlots(props.players))
  const [ pack,    updatePack    ] = useState<PackFull>()
  const [ maxPackSize, updatePackSize ] = useState(props.packSize ?? 0)
  
  const { timer, startTimer, resetTimer, storeTimer } = useTimerStore(props.player?.timer, props.now)
  
  const isHost = playerIsHost(player, game)
  const isBanned = playerIsBanned(game, props.sessionId)
  const holding = getHolding(players, maxPackSize, game)
  const canAdvance = isHost && getCanAdvance(game, players, holding)
  const playerIdx = useMemo(() => getPlayerIdx(players, player), [player, players])

  const updateLocal = useCallback((data: ServerProps) => {
    if (data.error) throw new Error(`Cannot update data: ${data.error}`)

    const newPack = getCurrentPack(data)
    if (newPack && data.player?.pick && data.player.pick <= (data.packSize ?? 0)) storeTimer(data.player?.timer, data.now)
    else resetTimer()

    if (gameIsPaused(data.options) && data.now) data.options.pause += Date.now() - data.now

    updateGame(data.options)
    updatePacks(data.packs || [])
    updatePackSize(data.packSize || 0)
    updatePlayers(data.players || [])
    updateSlots(getSlots(data.players))
    updatePack(newPack)
    updatePlayer(data.player || undefined)
  }, [storeTimer, resetTimer])


  const nextRound: Local.NextRound = useCallback((round) => {
    updateGame((g) => g && ({ ...g, round }))
    updatePlayers((list) => list.map((p) => ({ ...p, pick: 1 })))
    updatePlayer((p) => p && ({ ...p, pick: 1 }))
    updatePack(undefined)
    isHost && setLoadingPack((v) => v && v - 1)
  }, [isHost])


  const pauseGame: Local.PauseGame = useCallback((pause) => {
    if (pause) updateGame((g) => g && ({ ...g, pause }))
    isHost && setLoadingAll((v) => v && v - 1)
  }, [isHost])


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

    if (playerId === player?.id) {
      updatePack(undefined)
      resetTimer()
    }
    
    if (passingToId && player?.id === passingToId) updatePack((pack) => {
      if (!pack) reloadData(game?.url, updateLocal, throwError)
      return pack
    })
  }, [game?.url, player?.id, updateLocal, resetTimer, throwError])


  const swapCard: Local.SwapCard = useCallback((pickedCardId, board) => {
    updatePlayer((p) => p && ({ ...p,
      cards: updateArrayIdx(p.cards, ({ id }) => id === pickedCardId, (c) => ({ ...c, board }))
    }))
  }, [])


  const setLands: Local.SetLands = useCallback((basics) => {
    updatePlayer((p) => p && ({ ...p, basics }))
  }, [])


  const setStatus: Local.SetStatus = useCallback((playerId, sessionId, join, name) => {
    if (!playerId) return updateGame(
      (game) => !game || !('watchers' in game) || !game.watchers || !sessionId ? game : {
        ...game,
        watchers: join ? game.watchers.concat({ sessionId, name: name || null }) :
          game.watchers.filter(({ sessionId: session }) => session !== sessionId),
      }
    )

    updateSlots((s) => join ? spliceInPlace(s, (pid) => pid === playerId) : s.concat(playerId))
    updatePlayers((list) => list && updateArrayIdx(list,
      ({ id }) => id === playerId,
      (p) => ({ ...p, sessionId: join ? sessionId : null })
    ))
    updatePlayer((p) => p?.id !== playerId ? p : !join || !sessionId ? undefined : ({ ...p, sessionId }))
    if (!join) setLoadingAll((v) => v && v - 1)
  }, [])


  const banSession: Local.BanSession = useCallback(({ unban, ...data }) => {
    if (!unban && data.sessionId) setStatus(data.playerId, data.sessionId, false)
    
    updateGame((game) => {
      if (!game) return game

      if ('banned' in game) return {
        ...game,
        banned: !unban ?
          (game.banned || []).concat(data as Ban) :
          (game.banned || []).filter(({ sessionId }) => sessionId !== (data.sessionId || null))
      }
      return {
        ...game,
        locked: !unban,
        isBanned: props.sessionId === data.sessionId ? !unban : game.isBanned
      }
    })
    if (props.sessionId === data.sessionId) reload()
  }, [props.sessionId])


  const reload = useCallback(() => {
    setLoadingAll((v) => v + 1)
    reloadData(game?.url, updateLocal, throwError).finally(() => setLoadingAll((v) => v && v - 1))
  }, [game?.url, updateLocal, throwError])


  return {
    loadingPack, setLoadingPack, loadingAll, setLoadingAll, updatePlayer, updateGame, updateLocal,
    game, player, players, playerIdx, maxPackSize, holding, pack, packs, slots, timer,
    isHost, canAdvance, isBanned, isWatchPage,
    sessionId: props.sessionId,
    renamePlayer, nextRound, pauseGame, pickCard, swapCard, setLands, setStatus, banSession,
    startTimer, reload,
  }
}

export type LocalController = ReturnType<typeof useLocalController>