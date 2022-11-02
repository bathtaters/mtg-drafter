import type { Dispatch, SetStateAction } from "react"
import ModalWrapper from "components/base/common/Modal"

type Props = {
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

export default function HostModal({ isOpen, setOpen }: Props) {
  return (
    <ModalWrapper isOpen={isOpen} setOpen={setOpen}
      buttons={<button type="button" className="btn" onClick={() => setOpen((st) => !st)}>Cancel</button>}
    >
      Host Tools Coming Soon
    </ModalWrapper>
  )
}