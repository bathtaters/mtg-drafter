import type { ReactNode } from "react"
import type { GameStatus } from "@prisma/client"
import Link from "next/link"
import Header from "components/base/Header"
import PackIcon from "components/svgs/PackIcon"
import CopyLink, { Props as CopyProps } from "components/base/common/CopyLink"
import LogoIcon from "components/svgs/LogoIcon"

const statusIcon: { [status in GameStatus]: ReactNode } = {
  'start':  <span     className="inline-block mr-2 opacity-80 text-base sm:text-2xl fill-base-content ms ms-dfc-day"   />,
  'end':    <span     className="inline-block mr-2 opacity-80 text-base sm:text-2xl fill-base-content ms ms-dfc-night" />,
  'active': <PackIcon className="inline-block mr-2 opacity-80 h-6 sm:h-8 fill-base-100 stroke-base-content" />,
  'last':   <PackIcon className="inline-block mr-2 opacity-80 h-6 sm:h-8 fill-base-100 stroke-base-content" />,
}


export const GameHeaderWrapper = ({ children }: { children: ReactNode }) => (
  <Header>
    <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-4">
      {children}
    </div>
  </Header>
)

export function LogoWrapper({ href = "", title, children }: { href?: string, title?: string, children?: ReactNode }) {
  const ImgWrapper = href ? Link : 'div'
  return (
    <div className="grid [grid-template-columns:6rem_1fr] gap-x-4 flex-shrink-0">
      <ImgWrapper title={title} href={href} className="row-span-2 link link-primary">
        <LogoIcon className="w-16 sm:w-24 h-auto fill-current p-2" />
      </ImgWrapper>
      { children }
    </div>
  )
}

export const GameTitle = ({ label, sublabel, ...props }: CopyProps & { label?: ReactNode, sublabel?: ReactNode }) => (<>
  <div>
    <h1 className="font-serif inline">{label}</h1>
    <CopyLink className="align-top tooltip-bottom" iconClass="w-5 ml-2" {...props} />
  </div>
  <div className="m-1 text-base-content/80 text-lg font-light">{sublabel}</div>
</>)

export const RoundCounter = ({ label, status }: { label: ReactNode, status?: GameStatus }) => (<>
    {status && statusIcon[status]}
    <span>{label}</span>
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
