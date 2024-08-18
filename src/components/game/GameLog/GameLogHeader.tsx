import type { GameProps } from "types/game"
import GameHeaderBase from "../GameHeader/GameHeaderBase"
import { PlayerContainerSmall } from "components/game/PlayerContainers/PlayerContainers"
import { PlayerContainersWrapper, RoundCounter } from 'components/game/GameHeader/GameHeaderStyles'
import { useSimpleHeader } from "../GameHeader/header.controller"
import { roundCounter } from "assets/strings"


type Props = {
  game?: GameProps['options'],
  players: GameProps['players'],
  holding: number[],
  packSize: number,
}


export default function GameLogHeader({ game, players, holding, packSize }: Props) {

    const { gameStatus, isRight } = useSimpleHeader(game)
    
    if (!game) return <GameHeaderBase />

    return (
        <GameHeaderBase label={game.name} sublabel={<RoundCounter status={gameStatus} label={roundCounter(gameStatus, game)} />} >
            <PlayerContainersWrapper rightArrow={isRight} sameLine={true}>
                { players.map((play, idx) =>

                    <PlayerContainerSmall
                        player={play} key={String(play.id)}
                        isHost={'hostId' in game ? game.hostId === play.id : false}
                        holding={holding[idx]}
                        packSize={packSize}
                        hideStats={gameStatus === 'end' || gameStatus === 'start'}
                    />
                    
                )}
            </PlayerContainersWrapper>
        </GameHeaderBase>
    )
}