import type { ReactNode } from "react"
import { Props as CopyProps } from "components/base/common/CopyLink"
import { GameHeaderWrapper, GameTitle, LogoWrapper } from "components/game/GameHeader/GameHeaderStyles"

type Props = { label?: ReactNode, sublabel?: ReactNode, children?: ReactNode } & CopyProps

export default function GameHeaderBase({ label = "Mtg Drafter", children, ...copyProps }: Props) {
    return (
        <GameHeaderWrapper>
            <LogoWrapper href="/" title="Start New Game">
                <GameTitle label={label} {...copyProps} />
            </LogoWrapper>
            {children}
        </GameHeaderWrapper>
    )
}