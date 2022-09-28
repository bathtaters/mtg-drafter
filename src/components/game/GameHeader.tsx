import { useMemo } from "react";
import { Game } from "../../models/Game";
import Header from "../base/Header";
import { PlayerContainerFull, PlayerContainerSmall } from "./subcomponents/PlayerContainers";
import { LeftHeaderWrapper, PlayerContainersWrapper, GameTitle, RoundCounter } from './styles/GameHeaderStyles'
import { getOppIdx, getRound, passingUp } from './services/game.utils'


const NoData = () => <Header left={<GameTitle title="New Game" />} />


export default function GameHeader({ data, playerIdx }: { data?: Game | number, playerIdx: number }) {
  if (!data || typeof data === 'number' || playerIdx === -1) return <NoData />
  
  const isHost = data.players[playerIdx].sessionId === data.hostId
  const oppIdx = useMemo(() => getOppIdx(playerIdx, data.players.length), [playerIdx, data.players.length])

  return (
    <Header
      left={
        <LeftHeaderWrapper>
            <div className="col-span-2">
              <GameTitle title={data.name} />
              <RoundCounter>{getRound(data)}</RoundCounter>
            </div>

            <PlayerContainerFull player={data.players[playerIdx]} isHost={isHost} />
        </LeftHeaderWrapper>
      }
      
      right={
        <PlayerContainersWrapper upArrow={passingUp(data)}>
            { data.players.map((play, idx) =>

              <PlayerContainerSmall
                player={play} key={play.id}
                isHost={play.sessionId === data.hostId}
                spec={idx === playerIdx ? 'self' : idx === oppIdx ? 'opp' : undefined }
              />
              
            )}
        </PlayerContainersWrapper>
      }
    />
  )
}