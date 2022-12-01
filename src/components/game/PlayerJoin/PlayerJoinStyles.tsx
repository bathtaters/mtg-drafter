import type { MouseEventHandler, ReactNode } from "react"

export const PlayerJoinContainer = ({ title, children }: { title: ReactNode, children: ReactNode }) => (
  <div className="w-full flex flex-col justify-center items-center gap-4">
    <h2 className="font-serif">{title}</h2>
    {children}
  </div>
)

export const PlayersWrapper = ({ children }: { children: ReactNode }) => (
  <ul className="flex flex-col gap-2 items-stretch w-full max-w-xl">{children}</ul>
)

export const PlayerWrapper = ({ children }: { children: ReactNode }) => (
  <li className="px-12">{children}</li>
)

export const PlayerButton = ({ onClick, label }: { onClick?: MouseEventHandler<HTMLButtonElement>, label: ReactNode }) => (
  <button type="button" className="btn btn-lg btn-secondary w-full text-xl font-light normal-case" onClick={onClick}>
    {label}
  </button>
)