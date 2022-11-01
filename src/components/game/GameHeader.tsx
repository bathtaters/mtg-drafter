import type { GameCardFull, GameProps } from "./services/game"
import { useEffect, useMemo, useState } from "react"
import Header from "components/base/Header"
import { PlayerContainerFull, PlayerContainerSmall } from "./subcomponents/PlayerContainers"
import { GameHeaderWrapper, PlayerContainersWrapper, GameTitle, RoundCounter } from './styles/GameHeaderStyles'
import { getOppIdx, getRound, passingUp } from './services/game.utils'
import { canShare, shareData } from "components/base/services/common.services"
import { shareGame } from "assets/constants"

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


const NoData = () => <Header><GameTitle title="Game Not Found" /></Header>


export default function GameHeader({ game, players, playerIdx, holding, saveDeck, openLands, openHost, dropPlayer, renamePlayer }: Props) {
  const [ shareable, setShareable ] = useState(false)
  useEffect(() => { setShareable(!!game && canShare()) }, [])
  
  if (!game) return <NoData />
  
  const oppIdx = useMemo(() => getOppIdx(playerIdx, players.length), [playerIdx, players.length])

  const handleShare = shareable ? () => shareData(shareGame.message, shareGame.url(game.url), shareGame.title) : undefined

  return (
    <Header>
        <GameHeaderWrapper>
            <div>
              <GameTitle title={game.name} onClick={handleShare} />
              <RoundCounter>{getRound(game)}</RoundCounter>
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
        </GameHeaderWrapper>
    </Header>
  )
}