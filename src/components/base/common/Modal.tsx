import { Dispatch, ReactNode, SetStateAction } from "react";

export default function ModalWrapper({ title, className, children, buttons, isOpen, setOpen }: {
  isOpen: boolean,
  setOpen?: Dispatch<SetStateAction<boolean>>,
  title?: ReactNode,
  className?: string,
  children?: ReactNode,
  buttons?: ReactNode,
}) {
  return (
    <div className={`modal${isOpen ? ' modal-open' : ''}`} onClick={setOpen ? () => setOpen((st) => !st) : undefined}>
      <div className={`modal-box ${className || ''}`} onClick={(ev) => ev.stopPropagation()}>
        {title && <h2 className="font-serif mb-6">{title}</h2>}
        {children && <div className="m-2">{children}</div>}
        {buttons && <div className="modal-action">{buttons}</div>}
      </div>
    </div>
  )
}
