import type { HTMLProps, ReactNode } from "react"

export const EmptyPlayerContainer = () => <div className="h-20" />

export const HostBadge = () => <span className="badge badge-info badge-sm align-top ml-2">Host</span>

const TitleDot = ({ isMini }: { isMini?: boolean }) => isMini ?
  <span className="w-0 -ml-1 text-2xs align-top opacity-60">•</span> :
  <span className="w-2 -ml-3 pr-3 text-xs align-middle opacity-60">•</span>


// Player Name Editor
export const PlayerNameWrapper = (props: HTMLProps<HTMLDivElement>) => <div className="h-8" {...props} />
export const PlayerNameEditWrapper = (props: HTMLProps<HTMLDivElement>) => <div className="input-group h-8 w-auto" {...props} />
export const PlayerNameEditBtn = (props: HTMLProps<HTMLInputElement>) => (
  <input type="button" {...props} className={`btn btn-square ${props.className} btn-xs h-auto`} />
)
export const PlayerNameTextBox = (props: HTMLProps<HTMLInputElement>) => (
  <input type="text" className="input input-primary h-auto p-2 text-lg sm:text-2xl w-full" {...props} />
)


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
  { title, header, subtitle, children, isMini, showDot, disconnected, color }:
  { title: ReactNode, header?: ReactNode, subtitle?: ReactNode, children?: ReactNode, isMini?: boolean, showDot?: boolean, disconnected?: boolean, color?: ColorTheme }
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
        
        <div className={`stat-value ${
          isMini ? 'row-span-3 self-center text-base' : 'flex items-center'
        } ${
          disconnected ? "opacity-60 italic" : ''} ${color ? themes[color][1] : ''
        }`}>
          {showDot && <TitleDot isMini={isMini} />}
          <span className={isMini ? "ml-1 flex-grow" : "text-lg sm:text-2xl flex-grow"}>{title}</span>
        </div>

        {subtitle && <div className={`stat-desc ${color ? themes[color][2] : ''}`}>{subtitle}</div>}

      </div>
    </div>
  )
}


export type ColorTheme = "self" | "opp" | undefined
