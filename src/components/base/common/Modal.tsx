import type { Dispatch, ReactNode, SetStateAction, MouseEventHandler } from "react"

type Props = {
  isOpen: boolean,
  setOpen?: Dispatch<SetStateAction<boolean>>,
  title?: ReactNode,
  className?: string,
  bodyClass?: string,
  wrapperClass?: string,
  children?: ReactNode,
  buttons?: ReactNode,
}

export default function ModalWrapper({ title, className, children, buttons, isOpen, setOpen, wrapperClass, bodyClass }: Props) {
  return (
    <div className={`modal modal-bottom md:modal-middle${isOpen ? ' modal-open' : ''} ${wrapperClass || ''}`} onClick={setOpen ? () => setOpen((st) => !st) : undefined}>
      <div className={`modal-box p-4 md:p-6 ${className || ''}`} onClick={(ev) => ev.stopPropagation()}>
        {title && <h2 className="font-serif mb-6">{title}</h2>}
        {children && <div className={`m-0 md:m-2 flex-grow ${bodyClass || ''}`}>{children}</div>}
        {buttons && <div className="modal-action">{buttons}</div>}
      </div>
      {isOpen && <style jsx global>{"html,body,#__next { overflow-y: hidden; }"}</style>}
    </div>
  )
}

export const ModalButton = ({ onClick, className = '', children }: { onClick: MouseEventHandler, className?: string, children: ReactNode }) => (
  <button type="button" className={`btn ${className}`} onClick={onClick}>{children}</button>
)