import { FooterWrapperStyle } from "./styles/AppStyles"
import pkg from "../../../package.json"
import { GitHubLogo, MtgJsonLogo } from "components/svgs/FooterLogos"
import Link from "next/link"


export default function Footer() {
  return (
    <FooterWrapperStyle>
      <div className="flex justify-center items-center gap-2">
        <Link href="/" className="link link-primary link-hover">MtG Drafter v{pkg.version}</Link>
        <span className="opacity-80">|</span>
        <a
          className="inline-flex items-center link link-primary link-hover"
          href="https://github.com/bathtaters/mtg-drafter"
          target="_blank" rel="noopener noreferrer"
        >
          <GitHubLogo className="w-6 h-6 fill-current" />
          <p className="ml-2">GitHub Repo</p>
        </a>
        <span className="opacity-80">|</span>
        <a href="https://mtgjson.com" className="inline-flex items-center link link-primary link-hover">
          <MtgJsonLogo className="w-8 fill-current" />
          <p className="ml-2">Powered by MTGJSON</p>
        </a>
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