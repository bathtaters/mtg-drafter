import type { Dispatch, SetStateAction } from "react"
import type { GameStatus } from "@prisma/client"
import type { GameProps } from "types/game"
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import GameHeaderBase from "./GameHeaderBase"
import GameMenu from "./GameMenu"
import { PlayerContainerFull, PlayerContainerSmall } from "../PlayerContainers/PlayerContainers"
import { RoundCounter, SidebarButton, LowerContainer, PlayerSeperator } from './GameHeaderStyles'
import { getPlayerColor } from "../PlayerSidebar/playersidebar.controller"
import useGameHeader from "./header.controller"
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
  sidebarVisible: boolean,
  setSidebar: Dispatch<SetStateAction<boolean>>,
}


export default function GameHeader({ game, players, playerIdx, holding, packSize, isConnected, notify, renamePlayer, sidebarVisible, setSidebar, ...menuProps }: Props) {

  const { gameStatus, isRight, indexes, copyProps, hideStats, showMenu, editingName, setEditingName, enableEdit } = useGameHeader(game, players, playerIdx)
  
  if (!game) return <GameHeaderBase left={<div />} />

  const playerProps = { game, players, gameStatus, holding, packSize, playerIdx, opp: indexes?.opp }

  return (
    <GameHeaderBase {...copyProps} notify={notify} title={game.name}
      left={players[playerIdx] &&
        <GameMenu forceShow={showMenu} editName={enableEdit} {...menuProps} />
      }
      right={<RoundCounter label={roundCounter(gameStatus, game, !players[playerIdx])} status={gameStatus} />}
    >
      
      {indexes &&
        <LowerContainer end={<SidebarButton active={sidebarVisible} onClick={() => setSidebar((show) => !show)} />}>
          <HeaderPlayerContainer idx={indexes.prev} {...playerProps} />
          {indexes.prev !== undefined && <PlayerSeperator passRight={isRight} />}

          <PlayerContainerFull
            player={players[playerIdx]}
            holding={holding[playerIdx]}
            packSize={packSize}
            isHost={!!menuProps.openHost}
            isBye={players.length > 1 && indexes.opp === undefined}
            isConnected={isConnected}
            isEditing={editingName}
            setEditing={setEditingName}
            renamePlayer={renamePlayer}
            hideStats={hideStats}
            className={players.length > 1 ? "sm:flex-grow" : "min-w-96"}
          />

          {indexes.next !== undefined && <PlayerSeperator passRight={isRight} bothWays={!indexes.prev} />}
          <HeaderPlayerContainer idx={indexes.next} {...playerProps} />

          {![undefined, indexes.prev, indexes.next].includes(indexes.opp) && <>
            <PlayerSeperator passRight={players.length === 4 ? isRight : undefined} alt="..." />
            <HeaderPlayerContainer idx={indexes.opp} isOpp={true} {...playerProps} />
          </>}
        </LowerContainer>
      }
    </GameHeaderBase>
  )
}


const HeaderPlayerContainer = ({ game, players, gameStatus, holding, packSize, playerIdx, opp, idx, isOpp }: PlayerContainerProps) => idx !== undefined && (
  <PlayerContainerSmall
    player={players[idx]}
    isHost={'hostId' in game ? game.hostId === players[idx].id : false}
    color={getPlayerColor(idx, playerIdx, opp, game)}
    holding={holding[idx]}
    packSize={packSize}
    hideStats={gameStatus === 'end' || gameStatus === 'start'}
    className={`flex-grow hidden ${isOpp ? 'md:grid' : 'sm:grid'}`}
  />
)

type PlayerContainerProps = {
  game: NonNullable<Props['game']>,
  players: Props['players'],
  gameStatus?: GameStatus,
  holding: number[],
  packSize: number,
  playerIdx: number,
  opp?: number,
  idx?: number,
  isOpp?: boolean,
}