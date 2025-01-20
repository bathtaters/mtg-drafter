import type { MouseEventHandler, ReactNode } from "react"
import type { GameStatus } from "@prisma/client"
import Link from "next/link"
import Header from "components/base/Header"
import DropdownMenu, { type Props as DropdownProps } from "components/base/common/DropdownMenu"
import CopyLink, { Props as CopyProps } from "components/base/common/CopyLink"
import PackIcon from "components/svgs/PackIcon"
import LogoIcon from "components/svgs/LogoIcon"

const statusIcon: { [status in GameStatus]: ReactNode } = {
  'start':  <span     className="text-base sm:text-2xl fill-base-content ms ms-dfc-day"   />,
  'end':    <span     className="text-base sm:text-2xl fill-base-content ms ms-dfc-night" />,
  'active': <PackIcon className="h-6 sm:h-8 fill-base-100 stroke-base-content" />,
  'last':   <PackIcon className="h-6 sm:h-8 fill-base-100 stroke-base-content" />,
}

export const NewGameIcon = () => <LogoIcon className="inline-block w-6 h-6 fill-current" />

export const Divider = () => <hr className="m-2 opacity-30" />

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
    <div className="flex gap-2 w-full flex-grow justify-evenly items-center">
      {children}
    </div>
    { end && <div className="ml-4 flex-shrink">{end}</div> }
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
    <h1 className="font-serif inline text-3xl sm:text-4xl text-right">{label}</h1>
    <CopyLink className="self-baseline tooltip-bottom" iconClass="w-5 ml-1" {...props} />
  </div>
</>)

export const RoundCounter = ({ label, status }: { label: ReactNode, status?: GameStatus }) => (
  <div className="flex gap-2 justify-self-end items-center opacity-80">
    <span className="text-xs sm:text-base text-nowrap whitespace-nowrap">{label}</span>
    {status && statusIcon[status]}
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

export const MenuItemStyle = ({ label, icon, action }: { label: string, icon?: ReactNode, action?: MouseEventHandler<HTMLAnchorElement> | string | false }) => 
  typeof action === 'undefined' ? undefined :
  typeof action === 'string' ? (
    <li className={action ? "" : "disabled"}>
      <Link title={label} href={action || "#"}>
        <span className="py-1">{label}</span>
        <span className="justify-self-end">{icon}</span>
      </Link>
    </li>
  ) : (
    <li className={action ? "" : "disabled"}>
      <a title={label} onClick={action || undefined}>
        <span className="py-1">{label}</span>
        <span className="justify-self-end">{icon}</span>
      </a>
    </li>
  )


export const PlayerSeperator = ({ passRight, bothWays, alt = "" }: { passRight?: boolean, bothWays?: boolean, alt?: string }) => (
  <div className={`text-lg opacity-70 hidden ${alt ? 'lg:block' : 'sm:block'}`}>
    {bothWays ? "↔" : passRight === undefined ? alt : passRight ? "→" : "←"}
  </div>
)