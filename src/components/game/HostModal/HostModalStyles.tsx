import type { HTMLProps, MouseEventHandler, ReactNode } from "react"
import type { IconType, PlayerButtonData } from "./host.controller"
import TextEditor, { type Props as TextEditProps } from "components/base/common/FormElements/TextEditor"
import IconToggle, { type Props as IconToggleProps } from "components/base/common/FormElements/IconToggle"
import RangeInput, { type Props as RangeInputProps } from "components/base/common/FormElements/RangeInput"
import { PauseIcon, PlayIcon } from "components/svgs/PlayPauseIcons"
import HostIcon from "components/svgs/HostIcon"
import UserIcon from "components/svgs/UserIcon"
import BotIcon from "components/svgs/BotIcon"
import EmptyIcon from "components/svgs/EmptyIcon"
import LockIcon from "components/svgs/LockIcon"
import { ExitIcon } from "components/svgs/MenuIcons"
import { BanIcon, UnbanIcon } from "components/svgs/BanIcons"
import { TimerLabel } from "components/setup/styles/FormStyles"
import { timerText } from "assets/strings"

// Base

export const FieldWrapper = ({ children }: { children?: ReactNode }) => (
  <div className="form-control w-full mb-4">{children}</div>
)

export const NameWrapper = ({ tooltip, formatLight, className = "", children }: { tooltip?: string, formatLight?: boolean, className?: string, children?: ReactNode }) => (
  <div data-tip={tooltip} className={`flex-grow min-w-0 h-full border border-base-content/70${
    tooltip ? ' tooltip' : ''}${formatLight ? ' italic font-extralight text-sm text-opacity-80' : ''
  } ${className}`}>
    {children}
  </div>
)

export const Collapser = ({ label, isOpen, toggle, children }: { label?: ReactNode, isOpen: boolean, toggle: MouseEventHandler<HTMLInputElement>, children?: ReactNode }) => (
  <div className="collapse collapse-plus bg-base-300 mt-2" onClick={(ev) => ev.stopPropagation()}>
    <input type="checkbox" className="min-h-0" checked={isOpen} onClick={toggle} readOnly />
    <label className="collapse-title p-3 pl-4 min-h-0 text-lg justify-start gap-1 after:!top-3">{label || ""}</label>
    <div className="collapse-content">
      <FieldWrapper>{children}</FieldWrapper>
    </div>
  </div>
)

export const NoPlayers = ({ children }: { children?: ReactNode }) => (
  <div className="w-full text-center italic font-extralight text-sm opacity-70">{children}</div>
)


// Game Editor

export const TitlePauseContainer = ({ children }: { children?: ReactNode }) => (
  <div className="flex flex-row gap-4 items-center pb-4">{children}</div>
)

export const TitleEditor = (props: TextEditProps) => (
  <div className="font-serif text-xl bg-base-300 border border-secondary rounded-lg flex-grow">
    <TextEditor {...props} className="input-secondary join-item bg-base-300 text-xl" />
  </div>
)

export const PauseButton = (props: Omit<IconToggleProps, "className"|"children">) => (
  <IconToggle {...props} className="btn btn-secondary btn-circle">
    <PlayIcon  className="fill-current w-8" />
    <PauseIcon className="fill-current w-8" />
  </IconToggle>
)

export const HostTimerInput = (props: Pick<RangeInputProps, "value"|"setValue"|"min"|"max">) => (
  <RangeInput
    keys={timerText}
    caption={<span className="label-text"><TimerLabel /></span>}
    wrapperClass="w-full py-4" boxClass="w-16"
    {...props}
  />
)


// Player Editor

const buttonIcon: { [name in IconType]: ReactNode } = {
  host:   <HostIcon />,
  player: <UserIcon className="w-4 m-auto fill-current" />,
  bot:    <BotIcon className="w-5 m-auto fill-current stroke-current" />,
  empty:  <EmptyIcon className="w-5 m-auto fill-current" />,
  kick:   <ExitIcon className="w-5 m-auto ml-1.5 fill-current" />,
  ban:    <BanIcon className="text-3xl -mt-1.5" />,
  unban:  <UnbanIcon className="text-2xl" />,
}

export const PlayersWrapper = ({ label, children }: { label?: ReactNode, children?: ReactNode }) => (<>
  {label && <h4 className="text-sm font-medium pt-4">{label}</h4>}
  <div className="grid sm:grid-cols-2 gap-2 py-2">{children}</div>
</>)

export const PlayerWrapper = ({ children }: { children?: ReactNode }) => (
  <div className="join items-center">{children}</div>
)

export const NameEditor = (props: TextEditProps) => (
  <NameWrapper className="bg-base-300 rounded-r-lg">
    <TextEditor {...props} className="input-secondary join-item text-sm sm:text-base" />
  </NameWrapper>
)

export const PlayerButton = ({ icon, tooltip, action }: PlayerButtonData) => (
  <button type="button" onClick={action || undefined} disabled={!action} data-tip={tooltip}
    className={`btn btn-sm btn-square btn-outline join-item h-full p-0 ${
      icon === 'empty' ? 'btn-primary tooltip-primary' :
      icon === 'kick' ? 'btn-warning tooltip-warning' :
      icon === 'ban' ? 'btn-error tooltip-error' :
      icon === 'unban' ? 'btn-success tooltip-success' :
      /* Default */ 'btn-secondary tooltip-secondary'
    }${
      tooltip ? ' tooltip tooltip-top' : ''
      // 'relative' class required (for some reason) to keep border when button is disabled.
    } relatie text-xl disabled:text-opacity-70`}>
      {buttonIcon[icon]}
  </button>
)


// Watchers Section

export const WatchersContainer = ({ label, children }: { label?: ReactNode, children?: ReactNode }) => (
  <div className="pt-4 w-full">
    {label && <h4 className="text-sm font-medium pb-2">{label}</h4>}
    <div className="w-full flex justify-around items-center gap-2font-light">{children}</div>
  </div>
)

export const linkClass = "link link-hover link-primary"

// Kick/Ban Component

export const BanNameWrapper = ({ tooltip, id, isBanned, children }: { tooltip?: string, id?: string, isBanned?: boolean, children?: ReactNode }) => (
  <NameWrapper tooltip={tooltip} formatLight={!children}
    className={`bg-base-100 py-1 pl-2 rounded-l-lg text-left ${
      isBanned ? 'text-error ' : ''
    }tooltip-bottom before:not-italic before:font-light`}
  >
    {children || `<...${id?.slice(-10)}>`}
  </NameWrapper>
)

export const LockButton = ({ locked, ...props }: { locked?: boolean } & HTMLProps<HTMLButtonElement>) => (
  <div className="w-full flex justify-center p-2">
    <button {...props} type="button"
      data-tip={locked ? 'Allow players to join' : 'Prevent new players from joining'}
      className={`w-32 tooltip btn btn-sm ${
        locked ? 'btn-success tooltip-success' : 'btn-outline btn-error tooltip-error'
      } flex gap-1 justify-evenly ${props.className}`}
    >
      <LockIcon className="w-4" />{locked ? "Unlock" : "Lock"}<LockIcon className="w-4" />
    </button>
  </div>
)
