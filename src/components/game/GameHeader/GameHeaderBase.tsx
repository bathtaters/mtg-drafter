import type { ReactNode } from "react";
import type { Props as CopyProps } from "components/base/common/CopyLink";
import {
  GameHeaderWrapper,
  UpperContainer,
  GameTitle,
  LogoWrapper,
} from "components/game/GameHeader/GameHeaderStyles";

type Props = {
  title?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
} & CopyProps;

export default function GameHeaderBase({
  title,
  left,
  right,
  children,
  ...copyProps
}: Props) {
  return (
    <GameHeaderWrapper>
      <UpperContainer>
        {left ? left : <LogoWrapper href="/" title="Start New Game" />}
        {title ? (
          <GameTitle label={title} {...copyProps} />
        ) : (
          <LogoWrapper href="/" title="Start New Game" />
        )}
        {right || <div />}
      </UpperContainer>
      {children}
    </GameHeaderWrapper>
  );
}
