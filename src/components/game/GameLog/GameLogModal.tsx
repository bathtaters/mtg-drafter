import type { Dispatch, SetStateAction } from "react"
import GameLog, { Props as LogProps } from "./GameLog"
import { LargeModal } from "components/base/common/Modal"

type Props = LogProps & {
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

export default function GameLogModal({ isOpen, setOpen, ...props }: Props) {
  return (
    <LargeModal isOpen={isOpen} setOpen={setOpen} title="Game Log">
      <GameLog {...props} />
    </LargeModal>
  )
}