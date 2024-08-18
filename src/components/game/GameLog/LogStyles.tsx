import type { MouseEventHandler, ReactNode } from "react"
import Image from "next/image"
import ModalWrapper from "components/base/common/Modal"
import getColorClass from "components/base/libs/colors"
import cardZoomLevels from "../CardToolbar/cardZoomLevels"

const cardSize = cardZoomLevels[4]

export const GameLogWatchWrapper = ({ title, children }: { title: string, children: ReactNode }) => (
  <div className="relative pt-14 w-full h-full -top-6">
    <h2 className="absolute top-2 left-2 font-serif mb-6">{title}</h2>
    {children}
  </div>
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
  { tip, below, right, color, inv, children, onClick }:
  { tip?: string, below?: boolean, right?: boolean, color?: number, inv?: boolean, children: ReactNode, onClick?: MouseEventHandler }
) => (
  <span data-tip={tip} onClick={onClick}
    className={`text-left ${tip ? `tooltip tooltip-primary ${below ? 'tooltip-bottom' : 'tooltip-top'
      }${right ?' before:content-[attr(data-tip)] before:translate-x-0 before:left-0' : ''} ` : ''}${
      typeof color === 'number' ? `badge badge-lg text-ellipsis whitespace-nowrap ${getColorClass(color, 'all', { inverse: inv })}` : ''
      }${onClick ? ' cursor-pointer badge badge-lg hover:badge-primary' : ''}`
  }>
    {children}
  </span>
)

export const CardModal = ({ src, alt, close }: { src: string | null, alt: string, close: () => void }) => (
  <ModalWrapper
    isOpen={!!src} setOpen={close}
    defaultClass={`p-0 rounded-card ${cardSize}`}
    bodyClass="flex-grow" wrapperClass="modal-middle"
  >
    {src && <Image src={src} alt={alt} fill />}
  </ModalWrapper>
)

export const MissingCard = () => <span className="italic opacity-50">Empty Pack</span>

export const EntrySpace = () => <span className="inline-block w-1"></span>