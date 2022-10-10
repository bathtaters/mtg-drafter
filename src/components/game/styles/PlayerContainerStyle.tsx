import type { ReactNode } from "react"

export const HostBadge = () => <span className="badge badge-info badge-sm align-top ml-2">Host</span>

const TitleDot = ({ isMini }: { isMini?: boolean }) => isMini ?
  <span className="w-0 -ml-1 text-2xs align-top opacity-60">•</span> :
  <span className="w-2 -ml-3 pr-3 text-xs align-middle opacity-60">•</span>


const themes = {
  self: [
    'bg-primary-content',
    'text-primary',
    'text-primary'
  ],
  opp: [
    'bg-accent-content',
    'text-accent',
    'text-accent'
  ]
}

export const EmptyPlayerContainer = () => <div className="h-20" />

export default function PlayerContainerStyle(
  { title, header, subtitle, children, isMini, showDot, disconnected, color }:
  { title: ReactNode, header?: ReactNode, subtitle?: ReactNode, children?: ReactNode, isMini?: boolean, showDot?: boolean, disconnected?: boolean, color?: ColorTheme }
) {
  return (
    <div className={`stats shadow-sm shadow-black ${isMini ? 'rounded-lg' : 'col-span-2 overflow-visible'}`}>
      <div className={`stat ${isMini ? 'py-0 px-2' : 'rounded-2xl'} ${color ? themes[color][0] : ''}`}>
        
        <div className={`stat-figure ${
          isMini ? 'flex flex-col justify-center opacity-70' : '-mr-3 sm:mr-0'
        } ${color ? themes[color][2] : ''}`}>
          {children}
        </div>

        {header && <div className="stat-title text-xs sm:text-base">{header}</div>}
        
        <div className={`stat-value ${
          isMini ? 'row-span-3 self-center text-base' : 'flex items-center'
        } ${
          disconnected ? "opacity-60 italic" : ''} ${color ? themes[color][1] : ''
        }`}>
          {showDot && <TitleDot isMini={isMini} />}
          <span className={isMini ? "ml-1" : "text-lg sm:text-2xl"}>{title}</span>
        </div>

        {subtitle && <div className={`stat-desc ${color ? themes[color][2] : ''}`}>{subtitle}</div>}

      </div>
    </div>
  )
}


export type ColorTheme = "self" | "opp" | undefined
