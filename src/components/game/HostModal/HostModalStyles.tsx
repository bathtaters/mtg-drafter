import type { ReactNode } from "react"
import type { IconType, PlayerButtonData } from "./host.controller"
import TextEditor, { type Props as TextEditProps } from "components/base/common/FormElements/TextEditor"
import IconToggle, { type Props as IconToggleProps } from "components/base/common/FormElements/IconToggle"
import RangeInput, { type Props as RangeInputProps } from "components/base/common/FormElements/RangeInput"
import { PauseIcon, PlayIcon } from "components/svgs/PlayPauseIcons"
import HostIcon from "components/svgs/HostIcon"
import UserIcon from "components/svgs/UserIcon"
import BotIcon from "components/svgs/BotIcon"
import EmptyIcon from "components/svgs/EmptyIcon"
import { TimerLabel } from "components/setup/styles/FormStyles"
import { timerText } from "assets/strings"

// Base

export const Divider = () => <div className="divider" />

export const FieldWrapper = ({ label, children }: { label?: ReactNode, children?: ReactNode }) => (
  <div className="form-control w-full mb-4">
    {label && <label className="label label-text pt-0">{label}</label>}
    {children}
  </div>
)


// Game Editor

export const GameContainer = ({ label, children }: { label?: ReactNode, children?: ReactNode }) => (
  <FieldWrapper label={label}>
    <div className="flex flex-row gap-4 items-center">{children}</div>
  </FieldWrapper>
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
  <RangeInput caption={<TimerLabel />} keys={timerText} wrapperClass="w-full" boxClass="w-16" {...props} />
)


// Player Editor

const buttonIcon: { [name in IconType]: ReactNode } = {
  host:   <HostIcon />,
  player: <UserIcon className="w-4 m-auto fill-current" />,
  bot:    <BotIcon className="w-5 m-auto fill-current stroke-current" />,
  empty:  <EmptyIcon className="w-5 m-auto fill-current" />,
}

export const PlayersContainer = ({ label, children }: { label: ReactNode, children: ReactNode }) => (
  <FieldWrapper label={label}>
    <div className="grid sm:grid-cols-2 gap-2">{children}</div>
  </FieldWrapper>
)

export const PlayerWrapper = ({ children }: { children: ReactNode }) => (
  <div className="join items-center">{children}</div>
)

export const NameEditor = (props: TextEditProps) => (
  <div className={`flex-grow min-w-0 h-full bg-base-300 border border-base-content/70 rounded-r-lg`}>
    <TextEditor {...props} className="input-secondary join-item text-sm sm:text-base" />
  </div>
)

export const PlayerButton = ({ icon, tooltip, action }: PlayerButtonData) => (
  <button type="button" onClick={action || undefined} disabled={!action} data-tip={tooltip}
    className={`btn btn-sm btn-square btn-outline join-item h-full p-0 ${
      icon === 'empty' ? 'btn-primary tooltip-primary' : 'btn-secondary tooltip-secondary'}${
      tooltip ? ' tooltip tooltip-top' : ''
      // 'relative' class required (for some reason) to keep border when button is disabled.
    } relatie text-xl disabled:text-opacity-70`}>
      {buttonIcon[icon]}
  </button>
)


// Log Watching Settings

export const WatchContainer = ({ children }: { children?: any }) => <div className="flex">{children}</div>
