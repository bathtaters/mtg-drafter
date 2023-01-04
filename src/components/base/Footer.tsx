import type { ReactNode } from "react"
import Link from "next/link"
import { GitHubLogo, MtgJsonLogo } from "components/svgs/FooterLogos"
import { FooterWrapperStyle } from "./styles/AppStyles"
import pkg from "../../../package.json"

const SiteLink = ({ href, className = '', children }: { href: string, className?: string, children?: ReactNode }) => (
  <a href={href} className={`link link-primary link-hover ${className}`} target="_blank" rel="noopener noreferrer">{children}</a>
)

export default function Footer() {
  return (
    <FooterWrapperStyle>
      <div className="flex justify-center items-center gap-2">
        <Link href="/" title="Start New Game" className="link link-primary link-hover" target="_blank">
          MtG Drafter v{pkg.version}
        </Link>
        <span className="opacity-80">|</span>
        <SiteLink href="https://github.com/bathtaters/mtg-drafter" className="inline-flex items-center">
          <GitHubLogo className="w-6 h-6 fill-current" />
          <p className="ml-2">GitHub Repo</p>
        </SiteLink>
        <span className="opacity-80">|</span>
        <SiteLink href="https://mtgjson.com" className="inline-flex items-center">
          <MtgJsonLogo className="w-8 fill-current" />
          <p className="ml-2">Powered by MTGJSON</p>
        </SiteLink>
      </div>

      <div className="text-2xs leading-tight font-thin opacity-80 italic">
        <p>
          This is unofficial Fan Content permitted under the&nbsp;
          <a
            className="link link-hover"
            href="https://github.com/bathtaters/mtg-drafter"
            target="_blank" rel="noopener noreferrer"
          >Fan Content Policy</a>.
        </p><p>
          It is not approved/endorsed by Wizards.
          Portions of the materials used are property of Wizards of the Coast
        </p><p>
          We only use strictly necessary cookies and do not share any data with third parties.
        </p>
      </div>
    </FooterWrapperStyle>
  )
}