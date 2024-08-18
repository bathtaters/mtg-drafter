import type { GameProps } from "types/game"
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import GameHeaderBase from "./GameHeaderBase"
import { PlayerContainerFull, PlayerContainerSmall } from "../PlayerContainers/PlayerContainers"
import { PlayerContainersWrapper, RoundCounter } from './GameHeaderStyles'
import useGameHeader, { getPlayerColor } from "./header.controller"
import { roundCounter } from "assets/strings"


type Props = {
  game?: GameProps['options'],
  players: GameProps['players'],
  playerIdx: number,
  holding: number[],
  packSize: number,
  isConnected: boolean,
  notify: AlertsReturn['newToast'],
  saveDeck?:   (() => void),
  dropPlayer?: (() => void),
  openLands?:  (() => void),
  openHost?:   (() => void),
  renamePlayer: ((name: string) => void),
}


export default function GameHeader({ game, players, playerIdx, holding, packSize, isConnected, notify, saveDeck, openLands, openHost, dropPlayer, renamePlayer }: Props) {

  const { oppIdx, gameStatus, isRight, copyProps } = useGameHeader(game, players, playerIdx)
  
  if (!game) return <GameHeaderBase />

  return (
    <GameHeaderBase
      label={game.name}
      sublabel={<RoundCounter status={gameStatus} label={roundCounter(gameStatus, game, !players[playerIdx])} />}
      notify={notify}
      {...copyProps}
    >
      <PlayerContainerFull
        player={players[playerIdx]}
        holding={holding[playerIdx]}
        isConnected={isConnected}
        saveDeck={saveDeck}
        openLands={openLands}
        openHost={openHost}
        dropPlayer={dropPlayer}
        renamePlayer={renamePlayer}
        packSize={packSize}
        hideStats={gameStatus === 'end' || gameStatus === 'start'}
      />
  
      <PlayerContainersWrapper rightArrow={isRight}>
          { players[playerIdx] && players.map((play, idx) =>

            <PlayerContainerSmall
              player={play} key={String(play.id)}
              isHost={'hostId' in game ? game.hostId === play.id : false}
              color={getPlayerColor(idx, playerIdx, oppIdx, game)}
              holding={holding[idx]}
              packSize={packSize}
              hideStats={gameStatus === 'end' || gameStatus === 'start'}
            />
            
          )}
      </PlayerContainersWrapper>
    </GameHeaderBase>
  )
}