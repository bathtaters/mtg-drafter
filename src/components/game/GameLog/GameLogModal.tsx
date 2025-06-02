import type { Dispatch, SetStateAction } from "react";
import GameLog, { Props as LogProps } from "./GameLog";
import { LargeModal } from "components/base/common/Modal";
import LogToolbar from "./LogToolbar/LogToolbar";
import { ModalToolbarWrapper } from "./LogStyles";

type Props = LogProps & {
  gameEnded: boolean;
  isHost?: boolean;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function GameLogModal({
  isHost,
  isOpen,
  setOpen,
  gameEnded,
  ...props
}: Props) {
  return (
    <LargeModal isOpen={isOpen} setOpen={setOpen} title="Game Log">
      <ModalToolbarWrapper>
        <LogToolbar
          gameLog={props.gameLog}
          players={props.players}
          gameEnded={gameEnded}
          isHost={isHost}
        />
      </ModalToolbarWrapper>
      <GameLog {...props} />
    </LargeModal>
  );
}
