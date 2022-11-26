import type { ReactNode } from "react"
import { HostMarker } from "./PlayerContainerElemStyles"

const themes = {
  self: [
    'bg-primary-content',
    'text-primary',
    'text-primary',
    'border border-primary',
  ],
  opp: [
    'bg-accent-content/50',
    //'text-accent',
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
    <div className={`stats shadow-sm shadow-black ${isMini ? 'rounded-lg' : 'overflow-visible'} ${color ? themes[color][3] : ''}`}>
      <div className={`stat ${isMini ? 'py-0 px-2' : 'rounded-2xl'} ${color ? themes[color][0] : ''}`}>
        
        <div className={`stat-figure ${
          isMini ? 'flex flex-col justify-center opacity-70' : '-mr-3 sm:mr-0'
        } ${color ? themes[color][2] : ''}`}>
          {children}
        </div>

        {header && <div className="stat-title text-xs sm:text-base">{header}</div>}
        
        <div className={`stat-value font-medium ${
          isMini ? 'row-span-3 self-center text-base flex items-center' : 'flex items-center'
        } ${
          disconnected ? "opacity-60 italic" : ''} ${color ? themes[color][1] : ''
        }`}>
          {isMini && isHost && <HostMarker />}
          <span className={isMini ? "ml-1 flex-grow" : "text-lg sm:text-2xl flex-grow -ml-2 mb-1"}>{title}</span>
        </div>

        {subtitle && <div className={`stat-desc ${color ? themes[color][2] : ''}`}>{subtitle}</div>}

      </div>
    </div>
  )
}


export type ColorTheme = "self" | "opp" | undefined
