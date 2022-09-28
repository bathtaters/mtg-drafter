import { Dispatch, SetStateAction } from "react";
import ModalWrapper from "../../base/common/Modal";


export default function HostModal({ isOpen, setOpen }: {
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}) {
  return (
    <ModalWrapper isOpen={isOpen} setOpen={setOpen}
      buttons={<button type="button" className="btn" onClick={() => setOpen((st) => !st)}>Cancel</button>}
    >
      Host Tools Coming Soon
    </ModalWrapper>
  )
}