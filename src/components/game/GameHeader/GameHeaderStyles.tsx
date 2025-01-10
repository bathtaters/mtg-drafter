import type { ReactNode } from "react"
import type { GameStatus } from "@prisma/client"
import Link from "next/link"
import Header from "components/base/Header"
import PackIcon from "components/svgs/PackIcon"
import CopyLink, { Props as CopyProps } from "components/base/common/CopyLink"
import LogoIcon from "components/svgs/LogoIcon"
import DropdownMenu, { Props as DropdownProps } from "components/base/common/DropdownMenu"

const statusIcon: { [status in GameStatus]: ReactNode } = {
  'start':  <span     className="text-base sm:text-2xl fill-base-content ms ms-dfc-day"   />,
  'end':    <span     className="text-base sm:text-2xl fill-base-content ms ms-dfc-night" />,
  'active': <PackIcon className="h-6 sm:h-8 fill-base-100 stroke-base-content" />,
  'last':   <PackIcon className="h-6 sm:h-8 fill-base-100 stroke-base-content" />,
}


export const GameHeaderWrapper = ({ children }: { children?: ReactNode }) => (
  <Header>
    <div className="w-full grid grid-cols-1 items-center gap-4">
      {children}
    </div>
  </Header>
)

export const UpperContainer = ({ children }: { children?: ReactNode }) => (
  <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center">
    {children}
  </div>
)

export const LowerContainer = ({ end, children }: { end?: ReactNode, children?: ReactNode }) => (
  <div className="flex w-full items-center py-2">
    <div className="flex w-full flex-grow justify-evenly items-center">
      {children}
    </div>
    { end && <div className="flex-shrink">{end}</div> }
  </div>
)

export function LogoWrapper({ href = "", title }: { href?: string, title?: string }) {
  const ImgWrapper = href ? Link : 'div'
  return (
    <ImgWrapper title={title} href={href} className="link link-primary">
      <LogoIcon className="w-12 sm:w-20 h-auto fill-current p-2" />
    </ImgWrapper>
  )
}

export const GameTitle = ({ label, ...props }: CopyProps & { label?: ReactNode }) => (<>
  <div className="flex items-center justify-self-center">
    <h1 className="font-serif inline">{label}</h1>
    <CopyLink className="self-baseline tooltip-bottom" iconClass="w-5 ml-1" {...props} />
  </div>
</>)

export const RightChildWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2 justify-self-end items-center opacity-80">{children}</div>
)

export const RoundCounter = ({ label, status }: { label: ReactNode, status?: GameStatus }) => (<>
  <span>{label}</span>
  {status && statusIcon[status]}
</>)


const Arrow = ({ right, width = 1500, className }: { right?: boolean, width?: number, className?: string }) => (
  <svg viewBox={`${right ? 10000 - width : 0} 0 ${width} 30`} className={className}>
    { typeof right === 'boolean' && <path d={
      right ? "M 0 30 L 10000 30 L 9960 0 L 9960 15 L 0 15 L 0 30 Z" :
        "M 0 30 L 10000 30 L 10000 15 L 40 15 L 40 0 L 0 30 Z"
    } /> }
  </svg>
)

export const PlayerContainersWrapper = ({ rightArrow, sameLine, children }: { rightArrow?: boolean, sameLine?: boolean, children: ReactNode }) => (
  <div className={`w-full col-span-1 ${sameLine ? "" : "md:col-span-2"}`}>
    <Arrow right={rightArrow} className="w-11/12 mb-1 mx-auto fill-base-content/50" />
    <div className="w-full max-h-28 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 m-1">
        {children}
      </div>
    </div>
  </div>
)

export const DropdownMenuStyle = (props: DropdownProps) => (
  <DropdownMenu {...props}
    label="☰"
    className=""
    labelClass="btn-md w-12 md:w-16 text-4xl md:text-5xl pb-1 pb-12 md:pb-14
    text-[color-mix(in_oklab,oklch(var(--p)),black_10%)] hover:text-primary"
  />
)

export const MenuItemStyle = ({ label, icon }: { label: string, icon?: ReactNode }) => (
  <>
    <span className="py-1">{label}</span>
    <span className="justify-self-end">{icon}</span>
  </>
)
