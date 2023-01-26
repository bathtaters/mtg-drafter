import type { ReactElement, ReactNode } from "react"
import type { Props } from './RenderedCard'
import { Card } from "@prisma/client"
import { splitRatios } from "components/game/CardToolbar/cardZoomLevels"

/** Layout Array [ Base class, SideA class, SideB class, SideA is Half?, SideB is Half? ] */
type Layout = [string, string, string, boolean, boolean]

type Style = (props: { html?: string, className?: string, children?: ReactNode, small?: boolean }) => ReactElement
type LayoutProps = { layout?: Layout, side: Props['side'], className?: string, children: ReactNode }


// MAIN WRAPPERS \\

export const splitLayouts: { [layout in NonNullable<Card['layout']>]?: Layout} = {
  split: [' left-[15%] -rotate-90 '+splitRatios.join(' '), ' -bottom-[9%]', ' -top-[9%]', false, false],
  aftermath: ['',' top-[1%] h-1/2',' -bottom-[9%] left-[15%] rotate-90 '+splitRatios.join(' '), true, false],
  flip: ['w-full h-1/2',' top-[1%]',' bottom-[1%] rotate-180', true, true],
  adventure: ['',' top-[1%] w-full h-[63%]',' bottom-[1.75%] left-[1%] w-3/4 h-[45%]', true, true],
}

export const Border = ({ hide, flipSide, children }: { flipSide?: number, children?: ReactNode, hide?: boolean }) => (
  <div className={`absolute${hide ? '' : ' bg-black'} text-black rounded-card w-full h-full${
    flipSide === 2 ? ' flip-back' : flipSide === 1 ? ' flip-front' : ''
  }`}>
    {children}
  </div>
)

export const CardBgd = ({ color }: { color?: string | false }) => !color ? null :
  <div className={`absolute top-[2.5%] left-[4%] w-[92%] h-[95%] z-0 ${color}`} />

export const Layout = ({ layout, side, className = '', children }: LayoutProps) => (
  <div className={`absolute ${side && layout ? `${layout[0]} ${layout[side] ?? ''}` : 'w-full h-full'} flex`}>
    <div className={
      `grid ${side && layout?.[2 + side] ? 'grid-rows-split' : 'grid-rows-card'
    } grid-cols-card grid-flow-col place-items-stretch relative
      w-[92%] h-[94%] m-auto p-[2%] font-serif ${className}`
    }>{children}</div>
  </div>
)


// INNER CONTAINERS \\

export const CardBox: Style = ({ children }) => ( // Header/Type Box
  <div className="col-span-2 flex justify-between items-center m-[2%] py-[1%] px-[2%] bg-white/40 rounded-[0.3em] shadow-top">{children}</div>
)

export const ArtBox: Style = ({ children }) => (
  <div className="relative col-span-2 my-0 mx-[4%] bg-zinc-300">
    {children}
  </div>
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

export const ArtMainText: Style = ({ small, children }) => (
  <div className={`flex flex-col justify-center items-center h-full ${
    small ? 'text-[1em]' : 'text-[1.8em]'} font-sans leading-[1.3em] text-zinc-700/60`}>
    {children}
  </div>
)

export const ArtSubText: Style = ({ children }) => (
  <div className={`absolute top-[1%] right-[2%] text-[0.7em] italic text-black/50 font-sans`}>
    {children}
  </div>
)
