import type { GameCardFull, GameProps } from "types/game"
import Header from "components/base/Header"
import { PlayerContainerFull, PlayerContainerSmall } from "../PlayerContainers/PlayerContainers"
import { GameHeaderWrapper, PlayerContainersWrapper, GameTitle, RoundCounter } from './GameHeaderStyles'
import useGameHeader, { getPlayerColor } from "./header.controller"
import { roundCounter } from "assets/strings"


type Props = {
  game?: GameProps['options'], players: GameProps['players'],
  playerCards?: GameCardFull[],
  playerIdx: number, holding: number[],
  isConnected: boolean,
  saveDeck?:   (() => void),
  dropPlayer?: (() => void),
  openLands?:  (() => void),
  openHost?:   (() => void),
  renamePlayer: ((name: string) => void),
}


export default function GameHeader({ game, players, playerIdx, holding, isConnected, saveDeck, openLands, openHost, dropPlayer, renamePlayer }: Props) {

  const { oppIdx, handleShare, gameStatus, isRight, packSize } = useGameHeader(game, players, playerIdx)
  
  if (!game) return <Header><GameTitle title="Game Not Found" /></Header>

  return (
    <Header>
        <GameHeaderWrapper>
            <div>
              <GameTitle title={game.name} onClick={handleShare} />
              <RoundCounter status={gameStatus} label={players[playerIdx] && 'packSize' in game ? roundCounter(gameStatus, game) : "Waiting Room"} />
            </div>

            <PlayerContainerFull
              player={players[playerIdx]}
              holding={holding[playerIdx]}
              isConnected={isConnected}
              saveDeck={saveDeck}
              openLands={openLands}
              openHost={openHost}
              dropPlayer={dropPlayer}
              renamePlayer={renamePlayer}
              maxPick={packSize}
            />
      
          <PlayerContainersWrapper rightArrow={isRight}>
              { players[playerIdx] && players.map((play, idx) =>

                <PlayerContainerSmall
                  player={play} key={String(play.id)}
                  isHost={'hostId' in game ? game.hostId === play.id : false}
                  color={getPlayerColor(idx, playerIdx, oppIdx, game)}
                  holding={holding[idx]}
                  maxPick={packSize}
                />
                
              )}
          </PlayerContainersWrapper>
        </GameHeaderWrapper>
    </Header>
  )
}