import type { GameProps } from "./services/game"
import { useMemo } from "react"
import Header from "components/base/Header"
import { PlayerContainerFull, PlayerContainerSmall } from "./subcomponents/PlayerContainers"
import { LeftHeaderWrapper, PlayerContainersWrapper, GameTitle, RoundCounter } from './styles/GameHeaderStyles'
import { getOppIdx, getRound, passingUp } from './services/game.utils'

type Props = {
  game?: GameProps['options'], players: GameProps['players'],
  playerIdx: number, holding: number[],
  dropPlayer: (() => void) | null,
  openLands:  (() => void) | null,
  openHost:   (() => void) | null,
}


const NoData = () => <Header left={<GameTitle title="Game Not Found" />} />


export default function GameHeader({ game, players, playerIdx, holding, openLands, openHost, dropPlayer }: Props) {
  
  if (!game) return <NoData />
  
  const oppIdx = useMemo(() => getOppIdx(playerIdx, players.length), [playerIdx, players.length])

  return (
    <Header
      left={
        <LeftHeaderWrapper>
            <div className="col-span-2">
              <GameTitle title={game.name} />
              <RoundCounter>{getRound(game)}</RoundCounter>
            </div>

            {<PlayerContainerFull
              player={players[playerIdx]}
              holding={holding[playerIdx]}
              openLands={openLands}
              openHost={openHost}
              dropPlayer={dropPlayer}
              maxPick={game.packSize}
            />}
        </LeftHeaderWrapper>
      }
      
      right={
        <PlayerContainersWrapper upArrow={passingUp(game)}>
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
      }
    />
  )
}