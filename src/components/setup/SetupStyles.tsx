import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import logo from 'assets/media/logo-lg.png'
import HistoryIcon from "components/svgs/HistoryIcon"


export const TitleStyle = ({ children }: { children: ReactNode }) => (
    <h1 className="font-serif">{children}</h1>
)

export const HeaderLogo = ({ href, alt }: { href: string, alt: string }) => (
    <Link href={href}>
        <Image className="w-16 sm:w-24 h-auto" src={logo} alt={alt} />
    </Link>
)

export const HistoryLink = ({ href, tip }: { href: string, tip?: string }) => (
    <Link href={href} className={
        `btn btn-secondary btn-circle btn-sm p-1 sm:btn-md sm:p-2 ${tip ? " tooltip" : ""} tooltip-bottom tooltip-secondary`
    } data-tip={tip}>
        <HistoryIcon className="w-full h-auto fill-secondary-content" />
    </Link>
)
