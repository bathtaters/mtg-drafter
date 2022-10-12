import type { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
  isOpen: boolean,
  setOpen?: Dispatch<SetStateAction<boolean>>,
  title?: ReactNode,
  className?: string,
  children?: ReactNode,
  buttons?: ReactNode,
}

export default function ModalWrapper({ title, className, children, buttons, isOpen, setOpen }: Props) {
  return (
    <div className={`modal modal-bottom md:modal-middle${isOpen ? ' modal-open' : ''}`} onClick={setOpen ? () => setOpen((st) => !st) : undefined}>
      <div className={`modal-box p-4 md:p-6 ${className || ''}`} onClick={(ev) => ev.stopPropagation()}>
        {title && <h2 className="font-serif mb-6">{title}</h2>}
        {children && <div className="m-0 md:m-2">{children}</div>}
        {buttons && <div className="modal-action">{buttons}</div>}
      </div>
    </div>
  )
}
