import type { ReactNode } from "react"
import { HostMarker, OppMarker, UserMarker } from "./PlayerContainerElemStyles"

const themes = {
  self: [
    /* Outer */ 'border border-primary bg-primary-content',
    /* Inner */ '',
    /* Title */ 'text-primary',
    /* Other */ 'text-primary',
  ],
  opp: [
    /* Outer */ 'bg-accent-content/50',
    /* Inner */ '',
    /* Title */ '',
    /* Other */ '',
  ]
}

export default function PlayerContainerStyle(
  { title, header, subtitle, children, isMini, isHost, disconnected, color, className = "" }:
  PlayerContainerStyleProps
) {
  return (
    <div className={`stats shadow-sm shadow-black ${isMini ? 'h-10 md:h-12 rounded-lg overflow-hidden' : 'min-h-24 overflow-visible'} ${color ? themes[color][0] : ''} ${className}`}>
      <div className={`stat ${isMini ? 'p-0 gap-0' : 'rounded-2xl'} ${color ? themes[color][1] : ''}`}>
        
        <div className={`stat-figure ${
          isMini ? 'grid grid-cols-2 grid-rows-2 gap-x-1 opacity-70' : '-mr-3 md:mr-0'
        } ${color ? themes[color][3] : ''}`}>
          {children}
        </div>

        {header && <div className="stat-title text-xs md:text-base opacity-80">{header}</div>}
        
        <div className={`stat-value font-medium min-w-0 ${
          isMini ? 'row-span-3 self-center text-base flex items-center overflow-hidden' : 'flex items-center'
        } ${
          disconnected && isMini ? "opacity-60 italic" : ''} ${color ? themes[color][2] : ''
        }`}>
          {!isMini ? null : color === 'self' ? <UserMarker /> : color === 'opp' ? <OppMarker /> : isHost ? <HostMarker /> : <span className="w-1" />}
          <span className={isMini ? "text-xs md:text-base ml-1 mr-2 flex-grow truncate" : "text-lg md:text-2xl flex-grow min-w-0 -ml-2 mb-1"}>{title}</span>
        </div>

        {subtitle && <div className={`stat-desc ${color ? themes[color][3] : ''}`}>{subtitle}</div>}

      </div>
    </div>
  )
}


export type ColorTheme = "self" | "opp" | undefined

type PlayerContainerStyleProps = {
  title: ReactNode,
  header?: ReactNode,
  subtitle?: ReactNode,
  children?: ReactNode,
  isMini?: boolean,
  isHost?: boolean,
  disconnected?: boolean,
  color?: ColorTheme,
  className?: string,
}