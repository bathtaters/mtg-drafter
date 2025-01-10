import type { GameProps } from "types/game"
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import GameHeaderBase from "./GameHeaderBase"
import GameMenu from "./GameMenu"
import { PlayerContainerFull, PlayerContainerSmall } from "../PlayerContainers/PlayerContainers"
import { PlayerContainersWrapper, RoundCounter } from './GameHeaderStyles'
import useGameHeader, { getPlayerColor } from "./header.controller"
import useGameMenu from "./gameMenu.controller"
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
  const { hideStats, showMenu, editingName, setEditingName, enableEdit } = useGameMenu(gameStatus)
  
  if (!game) return <GameHeaderBase left={<div />} />

  return (
    <GameHeaderBase {...copyProps} notify={notify} title={game.name}
      left={players[playerIdx] &&
        <GameMenu forceShow={showMenu} editName={enableEdit} {...menuProps} />
      }
      right={<RoundCounter label={roundCounter(gameStatus, game, !players[playerIdx])} status={gameStatus} />}
    >
      
      <PlayerContainerFull
        player={players[playerIdx]}
        holding={holding[playerIdx]}
        packSize={packSize}
        isHost={!!openHost}
        isConnected={isConnected}
        isEditing={editingName}
        setEditing={setEditingName}
        renamePlayer={renamePlayer}
        hideStats={hideStats}
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