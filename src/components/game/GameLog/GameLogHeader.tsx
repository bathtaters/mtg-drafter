import type { GameProps } from "types/game"
import Header from "components/base/Header"
import { PlayerContainerSmall } from "components/game/PlayerContainers/PlayerContainers"
import { LogHeaderWrapper } from "./LogStyles"
import { PlayerContainersWrapper, GameTitle, RoundCounter, LogoWrapper } from 'components/game/GameHeader/GameHeaderStyles'
import { useSimpleHeader } from "../GameHeader/header.controller"
import { roundCounter } from "assets/strings"
import logo from 'assets/media/logo-lg.png'


type Props = {
  game?: GameProps['options'],
  players: GameProps['players'],
  holding: number[],
  packSize: number,
}


export default function GameLogHeader({ game, players, holding, packSize }: Props) {

    const { gameStatus, isRight } = useSimpleHeader(game)
    
    if (!game) return <Header><GameTitle title="Mtg Drafter" /></Header>

    return (
        <Header>
            <LogHeaderWrapper>
                <LogoWrapper img={logo} href="/" alt="Mtg-Drafter Logo">
                    <GameTitle title={game.name} />
                    <RoundCounter status={gameStatus} label={roundCounter(gameStatus, game)} />
                </LogoWrapper>
        
                <PlayerContainersWrapper rightArrow={isRight}>
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
            </LogHeaderWrapper>
        </Header>
    )
}