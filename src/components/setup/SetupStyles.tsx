import type { ReactNode } from "react"
import Link from "next/link"
import HistoryIcon from "components/svgs/HistoryIcon"
import LogoIcon from "components/svgs/LogoIcon"


export const TitleStyle = ({ children }: { children: ReactNode }) => (
    <h1 className="font-serif">{children}</h1>
)

export const HeaderLogo = () => (
    <LogoIcon className="w-16 sm:w-24 h-16 sm:h-24 fill-secondary p-1" />
)

export const HistoryLink = ({ href, tip }: { href: string, tip?: string }) => (
    <Link href={href} className={
        `btn btn-secondary btn-circle btn-sm p-1 sm:btn-md sm:p-2 ${tip ? " tooltip" : ""} tooltip-bottom tooltip-secondary`
    } data-tip={tip}>
        <HistoryIcon className="w-full h-auto fill-secondary-content" />
    </Link>
)
