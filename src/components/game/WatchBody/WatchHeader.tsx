import type { GameProps } from "types/game"
import GameHeaderBase from "../GameHeader/GameHeaderBase"
import { RoundCounter } from '../GameHeader/GameHeaderStyles'
import { useSimpleHeader } from "../GameHeader/header.controller"
import { roundCounter } from "assets/strings"

type Props = { game?: GameProps['options'] }

export default function WatchHeader({ game }: Props) {

    const { gameStatus } = useSimpleHeader(game)
    
    if (!game) return <GameHeaderBase />

    return (
        <GameHeaderBase title={game.name}
            right={<RoundCounter status={gameStatus} label={roundCounter(gameStatus, game)} />}    
        />
    )
}