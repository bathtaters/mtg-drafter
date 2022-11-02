import type { ReactNode, MouseEventHandler } from "react"

const buttonLabel: { [label: string]: string } = {
  start: 'Start Game',
  next:  'Next Round',
  end:   'End Game',
}

export const RoundButton = ({ label, onClick }: { onClick: MouseEventHandler, label: RoundButtonLabel }) => (
  <div className="w-full text-center my-4">
    <button type="button" onClick={onClick} className="btn btn-secondary btn-xl text-xl h-16 w-48 m-auto">
      {buttonLabel[label] || buttonLabel.next}
    </button>
  </div>
)


export const GameLayoutWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col text-center">{children}</div>
)


export const Divider = () => <div className="divider" />

export type RoundButtonLabel = "start" | "next" | "end"
