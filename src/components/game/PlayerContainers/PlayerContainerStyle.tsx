import type { ReactNode } from "react"
import { HostMarker, OppMarker, UserMarker } from "./PlayerContainerElemStyles"

const themes = {
  self: [
    'bg-primary-content',
    'text-primary',
    'text-primary',
    'border border-primary',
  ],
  opp: [
    'bg-accent-content/50',
    '',
    '',
    '',
  ]
}

export default function PlayerContainerStyle(
  { title, header, subtitle, children, isMini, isHost, disconnected, color }:
  { title: ReactNode, header?: ReactNode, subtitle?: ReactNode, children?: ReactNode, isMini?: boolean, isHost?: boolean, disconnected?: boolean, color?: ColorTheme }
) {
  return (
    <div className={`stats shadow-sm shadow-black ${isMini ? 'rounded-lg overflow-hidden' : 'overflow-visible'} ${color ? themes[color][3] : ''}`}>
      <div className={`stat ${isMini ? 'p-0 gap-0' : 'rounded-2xl'} ${color ? themes[color][0] : ''}`}>
        
        <div className={`stat-figure ${
          isMini ? 'grid grid-cols-2 grid-rows-2 gap-x-1 opacity-70' : '-mr-3 sm:mr-0'
        } ${color ? themes[color][2] : ''}`}>
          {children}
        </div>

        {header && <div className="stat-title text-xs sm:text-base opacity-80">{header}</div>}
        
        <div className={`stat-value font-medium ${
          isMini ? 'row-span-3 self-center text-base flex items-center overflow-hidden' : 'flex items-center'
        } ${
          disconnected && isMini ? "opacity-60 italic" : ''} ${color ? themes[color][1] : ''
        }`}>
          {!isMini ? null : color === 'self' ? <UserMarker /> : color === 'opp' ? <OppMarker /> : isHost ? <HostMarker /> : <span className="w-1" />}
          <span className={isMini ? "ml-1 flex-grow truncate" : "text-lg sm:text-2xl flex-grow -ml-2 mb-1"}>{title}</span>
        </div>

        {subtitle && <div className={`stat-desc ${color ? themes[color][2] : ''}`}>{subtitle}</div>}

      </div>
    </div>
  )
}


export type ColorTheme = "self" | "opp" | undefined
