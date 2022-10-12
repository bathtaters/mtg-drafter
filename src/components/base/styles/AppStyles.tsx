import type { ReactNode } from "react"
import Head from "next/head"

type Children = { children: ReactNode }

export const AppWrapperStyle = ({ children }: Children) => (
  <div className="h-full w-full min-w-[24rem] min-h-[35rem] overflow-x-clip">
    <div className="h-full flex flex-col">
      {children}
    </div>
  </div>
)

export const HeaderWrapperStyle = ({ children }: Children) => (
  <div className="p-0 sm:p-1 mb-1 sm:mb-2 bg-base-300 text-base-content w-full">
    <nav className="navbar justify-center w-full max-w-6xl m-auto p-4">{children}</nav>
  </div>
)

export const BodyWrapperStyle = ({ children }: Children) => (
  <main className="flex-grow w-full max-w-7xl m-auto p-2">{children}</main>
)

export const FooterWrapperStyle = ({ children }: Children) => (
  <footer className="footer footer-center bg-base-300 text-base-content w-full">
    <div className="w-full max-w-6xl m-auto p-4">{children}</div>
  </footer>
)

export const SetPageTitle = ({ title }: { title: string }) => (
  <Head>
    <title>{`MtG Drafter - ${title}`}</title>
    <meta name="title" content={`MtG Drafter - ${title}`} />
    <meta property="og:title" content={`MtG Drafter - ${title}`} />
  </Head>
)