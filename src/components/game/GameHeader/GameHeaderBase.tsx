import type { ReactNode } from "react"
import { Props as CopyProps } from "components/base/common/CopyLink"
import { GameHeaderWrapper, GameTitle, LogoWrapper } from "components/game/GameHeader/GameHeaderStyles"
import logo from "assets/media/logo-lg.png"

type Props = { label?: ReactNode, sublabel?: ReactNode, children?: ReactNode } & CopyProps

export default function GameHeaderBase({ label = "Mtg Drafter", children, ...copyProps }: Props) {
    return (
        <GameHeaderWrapper>
            <LogoWrapper img={logo} href="/" alt="Mtg-Drafter Logo">
                <GameTitle label={label} {...copyProps} />
            </LogoWrapper>
            {children}
        </GameHeaderWrapper>
    )
}