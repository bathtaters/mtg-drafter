import type { Dispatch, ReactNode, SetStateAction } from "react"
import ModalWrapper, { ModalButton } from "components/base/common/Modal"
import getColorClass from "components/base/libs/colors"


export const LargeModal = ({ title, isOpen, setOpen, children }: { title: ReactNode, isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>>, children: ReactNode }) => (
  <ModalWrapper isOpen={isOpen} setOpen={setOpen}
      title={title}
      wrapperClass="z-[1000]" bodyClass="min-h-0"
      className="h-full md:!max-w-screen-2xl flex flex-col"
      buttons={<ModalButton onClick={() => setOpen((s) => !s)}>Return</ModalButton>}
    >
      {children}
    </ModalWrapper>
)

export const LogContainer = ({ children, toolbar }: { children: ReactNode, toolbar: ReactNode }) => (<>
  <div className="absolute top-4 right-4">{toolbar}</div>
  <div className="card w-full h-full bg-base-300 border border-base-content">
    <ul className="card-body overflow-y-auto py-4 px-6">
      {children}
    </ul>
  </div>
</>)

export const ErrorContainer = ({ text }: { text: string }) => <p className="opacity-80 italic">{text}</p>


export const EntryWrapper = ({ children }: { children: ReactNode }) => <li className="flex flex-wrap items-center my-0.5 gap-y-0.5">{children}</li>

export const EntryItem = (
  { tip, below, right, color, inv, children }:
  { tip?: string, below?: boolean, right?: boolean, color?: number, inv?: boolean, children: ReactNode }
) => (
  <span data-tip={tip}
    className={`text-left ${tip ? `tooltip tooltip-primary ${below ? 'tooltip-bottom' : 'tooltip-top'}${
      right ? ' before:content-[attr(data-tip)] before:translate-x-0 before:left-0' : ''} ` : ''}${
      typeof color === 'number' ? `badge badge-lg text-ellipsis whitespace-nowrap ${getColorClass(color, 'all', { inverse: inv })}` : ''}`
  }>
    {children}
  </span>
)

export const EntrySpace = () => <span className="inline-block w-1"></span>