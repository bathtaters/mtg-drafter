import type { ReactNode } from "react"
import { Props as CopyProps } from "components/base/common/CopyLink"
import { GameHeaderWrapper, UpperContainer, LowerContainer, GameTitle, LogoWrapper, RightChildWrapper } from "components/game/GameHeader/GameHeaderStyles"

type Props = { label?: ReactNode, leftChild?: ReactNode, rightChild?: ReactNode, children?: ReactNode } & CopyProps

export default function GameHeaderBase({ label = "Mtg Drafter", leftChild = <div />, rightChild, children, ...copyProps }: Props) {
    return (
        <GameHeaderWrapper>
            <UpperContainer>
                {leftChild}
                <GameTitle label={label} {...copyProps} />
                <LogoWrapper href="/" title="Start New Game" />
                <RightChildWrapper>{rightChild}</RightChildWrapper>
            </UpperContainer>
            { children && <LowerContainer>{children}</LowerContainer> }
        </GameHeaderWrapper>
    )
}