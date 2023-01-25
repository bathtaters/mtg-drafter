import { MouseEventHandler, ReactNode } from "react"
import Selector from "components/base/common/FormElements/Selector"
import UserIcon from "components/svgs/UserIcon"
import TimerIcon from "components/svgs/TimerIcon"
import PackIcon from "components/svgs/PackIcon"
import DeckIcon from "components/svgs/DeckIcon"

// SHARED

export const InputWrapper = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 p-4 pt-0 gap-8 sm:grid-cols-2">{children}</div>
)

export const FieldWrapper = ({ label, children }: { label: string, children: ReactNode }) => (
  <fieldset className="form-control w-full border border-secondary rounded-lg relative pb-4">
    <legend className="px-2"><h3>{label}</h3></legend>
    {children}
  </fieldset>
)

export const PlayersLabel  = () => (<span className="flex items-center gap-2">
  <UserIcon className="fill-current stroke-base-300 inline-block h-5 w-6" />Players
</span>)
export const TimerLabel  = () => (<span className="flex items-center gap-2">
  <TimerIcon className="fill-current stroke-base-300 inline-block h-5 w-6" />Timer
</span>)


// CUBE FORM

export const PacksLabel    = () => (<span className="flex items-center gap-2">
  <PackIcon className="fill-current stroke-base-300 inline-block h-7 w-6" />Packs
</span>)
export const PackSizeLabel = () => (<span className="flex items-center gap-2">
  <DeckIcon className="fill-current stroke-base-300 inline-block h-6 w-6" />Pack Size
</span>)

export const HelpButton = ({ tip }: { tip: string }) => (
  <div data-tip={tip} className="absolute bottom-2 right-2 
    btn btn-circle btn-sm btn-secondary p-0 text-lg
    border-none bg-opacity-60 hover:bg-opacity-60
    tooltip tooltip-left flex whitespace-pre-line">?</div>
)


// BOOSTER FORM

export const PacksWrapper = ({ children }: { children: ReactNode }) => (
  <div className="min-h-[18rem] flex flex-col gap-2 items-center px-4 py-2">{children}</div>
)

export const PackSelector = (props: Parameters<typeof Selector>['0']) => <Selector {...props} className="select-secondary max-w-[19rem] w-full" />

export const PackButtonWrapper = ({ children }: { children: ReactNode }) => (
  <div className="btn-group place-self-stretch">{children}</div>
)

export const PackButton = ({ onClick, children }: { onClick?: MouseEventHandler, children: ReactNode }) => (
  <button type="button" onClick={onClick} className="btn btn-secondary btn-outline text-lg flex-grow">
    {children}
  </button>
)
