import type { GameCardFull, GameProps } from "types/game"
import Header from "components/base/Header"
import { PlayerContainerFull, PlayerContainerSmall } from "../PlayerContainers/PlayerContainers"
import { GameHeaderWrapper, PlayerContainersWrapper, GameTitle, RoundCounter } from './GameHeaderStyles'
import useGameHeader from "./header.controller"

type Props = {
  game?: GameProps['options'], players: GameProps['players'],
  playerCards?: GameCardFull[],
  playerIdx: number, holding: number[],
  saveDeck:   (() => void) | null,
  dropPlayer: (() => void) | null,
  openLands:  (() => void) | null,
  openHost:   (() => void) | null,
  renamePlayer: ((name: string) => void),
}


export default function GameHeader({ game, players, playerIdx, holding, saveDeck, openLands, openHost, dropPlayer, renamePlayer }: Props) {

  const { oppIdx, handleShare, round, isRight } = useGameHeader(game, players, playerIdx)
  
  if (!game) return <Header><GameTitle title="Game Not Found" /></Header>

  return (
    <Header>
        <GameHeaderWrapper>
            <div>
              <GameTitle title={game.name} onClick={handleShare} />
              <RoundCounter>{round}</RoundCounter>
            </div>

            <PlayerContainerFull
              player={players[playerIdx]}
              holding={holding[playerIdx]}
              saveDeck={saveDeck}
              openLands={openLands}
              openHost={openHost}
              dropPlayer={dropPlayer}
              renamePlayer={renamePlayer}
              maxPick={game.packSize}
            />
      
          <PlayerContainersWrapper rightArrow={isRight}>
              { players[playerIdx] && players.map((play, idx) =>

                <PlayerContainerSmall
                  player={play} key={String(play.id)}
                  isHost={game.hostId ? game.hostId === play.id : false}
                  color={idx === playerIdx ? 'self' : idx === oppIdx ? 'opp' : undefined }
                  holding={holding[idx]}
                  maxPick={game.packSize}
                />
                
              )}
          </PlayerContainersWrapper>
        </GameHeaderWrapper>
    </Header>
  )
}