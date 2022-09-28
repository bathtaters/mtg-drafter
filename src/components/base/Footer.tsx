import { FooterWrapperStyle } from "./AppStyles";

export default function Footer() {
  return (
    <FooterWrapperStyle>
      <a
        className="link link-primary link-hover"
        href="https://github.com/bathtaters/mtg-drafter"
        target="_blank" rel="noopener noreferrer"
      >
        GitHub Repo
      </a>
    </FooterWrapperStyle>
  )
}