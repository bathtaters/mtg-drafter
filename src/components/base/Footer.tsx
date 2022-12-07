import { FooterWrapperStyle } from "./styles/AppStyles"
import pkg from "../../../package.json"


export default function Footer() {
  return (
    <FooterWrapperStyle>
      <div className="flex justify-center gap-2">
        <span>MtG Drafter v{pkg.version}</span>
        <span className="">|</span>
        <a
          className="link link-primary link-hover"
          href="https://github.com/bathtaters/mtg-drafter"
          target="_blank" rel="noopener noreferrer"
        >
          GitHub Repo
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