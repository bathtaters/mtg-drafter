import type { Dispatch, ReactNode, SetStateAction, MouseEventHandler } from "react"

type Props = {
  isOpen: boolean,
  setOpen?: Dispatch<SetStateAction<boolean>>,
  title?: ReactNode,
  className?: string,
  defaultClass?: string,
  bodyClass?: string,
  wrapperClass?: string,
  children?: ReactNode,
  buttons?: ReactNode,
}

export default function ModalWrapper({
  title, buttons, children, 
  isOpen, setOpen, className,
  defaultClass = "p-4 md:p-6",
  wrapperClass = "modal-bottom md:modal-middle",
  bodyClass = "m-0 md:m-2 flex-grow"
}: Props) {
  return (
    <dialog className={`modal${isOpen ? ' modal-open' : ''} ${wrapperClass || ''}`} onClick={setOpen ? () => setOpen((st) => !st) : undefined}>
      <div className={`modal-box ${defaultClass} ${className || ''}`} onClick={(ev) => ev.stopPropagation()}>
        {title && <h2 className="font-serif mb-6">{title}</h2>}
        {children && <div className={bodyClass}>{children}</div>}
        {buttons && <div className="modal-action">{buttons}</div>}
      </div>
      {isOpen && <style jsx global>{"html,body,#__next { overflow-y: hidden; }"}</style>}
    </dialog>
  )
}

export const ModalButton = ({ onClick, className = 'btn-neutral', children }: { onClick: MouseEventHandler, className?: string, children: ReactNode }) => (
  <button type="button" className={`btn ${className}`} onClick={onClick}>{children}</button>
)

export const LargeModal = ({ title, isOpen, setOpen, children }: { title: ReactNode, isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>>, children: ReactNode }) => (
  <ModalWrapper isOpen={isOpen} setOpen={setOpen}
      title={title}
      wrapperClass="z-[1000]" bodyClass="min-h-0 m-0 md:m-2 flex-grow"
      className="h-full md:!max-w-screen-2xl flex flex-col"
      buttons={<ModalButton onClick={() => setOpen((s) => !s)}>Return</ModalButton>}
    >
      {children}
    </ModalWrapper>
)