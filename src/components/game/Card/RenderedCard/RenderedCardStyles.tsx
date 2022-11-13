import type { ReactElement, ReactNode } from "react"

type Style = (props: { html?: string, className?: string, children?: ReactNode }) => ReactElement


// MAIN WRAPPERS \\

export const Border: Style = ({ children }) => (
  <div className="w-full h-full absolute flex bg-black text-black rounded-[4%]">{children}</div>
)

export const Layout: Style = ({ className = '', children }) => (
  <div className={
    `grid grid-rows-card grid-cols-card grid-flow-col place-items-stretch
    w-[92%] h-[94%] m-auto p-[2%] rounded-[3%] font-serif ${className}`
  }>{children}</div>
)


// INNER CONTAINERS \\

export const CardBox: Style = ({ children }) => ( // Header/Type Box
  <div className="col-span-2 flex justify-between items-center m-[2%] py-[1%] px-[2%] bg-white/40 rounded-[0.3em] shadow-top">{children}</div>
)

export const ArtBox: Style = ({ children }) => (
  <div className="col-span-2 flex justify-center items-center my-0 mx-[4%] bg-zinc-300 text-white/60 font-sans text-[1.8em]">{children}</div>
)

export const Footer: Style = ({ children }) => (<>
  <div />
  <div className="flex justify-center items-center mt-[4%] mr-[15%]
    text-[0.93em] tracking-wide bg-white/40 rounded-[0.3em] shadow-top text-shadow">
      {children}
  </div>
</>)


// HEADER STYLES \\

export const Name: Style = ({ children }) => (
  <span className="text-[0.9em] font-bold self-start mt-[0.2em] z-[1] text-left leading-[0.9em]">{children}</span>
)

export const Mana: Style = ({ html = '' }) => (
  <span className="text-[0.78em] whitespace-nowrap z-[1] text-left leading-[0.9em]"
    dangerouslySetInnerHTML={{__html: html}} />
)


// TYPE STYLES \\

export const Type: Style = ({ children }) => (
  <span className="text-[0.7em] font-bold text-shadow z-[1] text-left leading-[0.9em]">{children}</span>
)

export const Rarity: Style = ({ className = '', children }) => (
  <span className={`text-[0.6em] icon-shadow opacity-[0.85] z-[1] text-left leading-[0.9em] ${className}`}>{children}</span>
)


// TEXT BOX STYLES \\

export const TextBox: Style = ({ children }) => (
  <div className="col-span-2 flex overflow-y-visible overflow-x-auto m-[1%] py-[1%] px-[2%] text-[0.75em] text-left bg-white/95 shadow-inset">
    <div className="z-[1] text-left leading-[0.9em] my-auto mx-0">{children}</div>
  </div>
)

export const TextLine: Style = ({ html = '' }) => (
  <p className="text-shadow mt-0 mb-[0.4em] leading-[1.15em]" dangerouslySetInnerHTML={{__html: html}} />
)