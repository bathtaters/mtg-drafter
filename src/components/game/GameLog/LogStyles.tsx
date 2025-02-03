import type { Ref, MouseEventHandler, ReactNode } from "react"
import Image from "next/image"
import ModalWrapper from "components/base/common/Modal"
import { IntersectionChildProps } from "components/base/libs/hooks"
import getColorClass from "components/base/libs/colors"

export const GameLogWatchWrapper = ({ title, children }: { title: string, children: ReactNode }) => (
  <div className="relative pt-14 w-full h-full -top-6">
    <h2 className="absolute top-2 left-2 font-serif mb-6">{title}</h2>
    {children}
  </div>
)

export const LogContainer = ({ children, toolbar, ref }: { children: ReactNode, toolbar: ReactNode, ref?: Ref<HTMLElement> }) => (<>
  <div className="absolute top-4 right-4">{toolbar}</div>
  <div className="card w-full h-full bg-base-300 border border-base-content">
    <ul className="card-body overflow-y-auto py-4 px-6 min-h-full max-h-80" ref={ref as Ref<HTMLUListElement>}>
      {children}
    </ul>
  </div>
</>)

export const ErrorContainer = ({ text }: { text: string }) => <p className="opacity-80 italic">{text}</p>

export const EntryWrapper = ({ children, childProps }: { children: ReactNode, childProps?: IntersectionChildProps<any> }) => (
  <li className="flex flex-wrap items-center my-0.5 gap-y-0.5" {...childProps}>{children}</li>
)

export const EntryItem = (
  { tip, below, right, color, inv, children, onClick }:
  { tip?: string, below?: boolean, right?: boolean, color?: number, inv?: boolean, children: ReactNode, onClick?: MouseEventHandler }
) => (
  <span data-tip={tip} onClick={onClick}
    className={`text-left ${tip ? `tooltip tooltip-primary ${below ? 'tooltip-bottom' : 'tooltip-top'
      }${right ?' before:content-[attr(data-tip)] before:translate-x-0 before:left-0' : ''} ` : ''}${
      typeof color === 'number' ? `badge badge-lg truncate ${getColorClass(color, 'all', { inverse: inv })}` : ''
      }${onClick ? ' cursor-pointer badge badge-lg hover:badge-primary' : ''}`
  }>
    {children}
  </span>
)

export const CardModal = ({ src, alt, close }: { src: string | null, alt: string, close: () => void }) => (
  <ModalWrapper
    isOpen={!!src} setOpen={close}
    defaultClass={`p-0 rounded-card w-card h-card` /* Uses default card sizes from global.css */}
    bodyClass="flex-grow" wrapperClass="modal-middle"
  >
    {src && <Image src={src} alt={alt} fill />}
  </ModalWrapper>
)

export const MissingCard = () => <span className="italic opacity-50">Empty Pack</span>

export const EntrySpace = () => <span className="inline-block w-1"></span>

export const EntryLoading = ({ childProps }: { childProps?: IntersectionChildProps }) => (
  <EntryWrapper childProps={childProps}>
    <div className="skeleton bg-base-content/20 h-4 w-14" />
    <div className="skeleton bg-base-content/20 h-6 w-20" />
    <div className="skeleton bg-base-content/20 h-6 w-24" />
    <div className="skeleton bg-base-content/20 h-5 w-5 rounded-full" />
    <div className="skeleton bg-base-content/20 h-6 w-24" />
  </EntryWrapper>
)
