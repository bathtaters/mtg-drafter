import type { MouseEventHandler, ReactNode } from "react"
import TextEditor, { Props as TextEditProps } from "components/base/common/FormElements/TextEditor"
import IconToggle, { Props as IconToggleProps } from "components/base/common/FormElements/IconToggle"
import RangeInput, { Props as RangeInputProps } from "components/base/common/FormElements/RangeInput"
import { PauseIcon, PlayIcon } from "components/svgs/PlayPauseIcons"
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

export const PlayersContainer = ({ label, children }: { label: ReactNode, children: ReactNode }) => (
  <FieldWrapper label={label}>
    <div className="grid sm:grid-cols-2 gap-2">{children}</div>
  </FieldWrapper>
)

export const PlayerWrapper = ({ children }: { children: ReactNode }) => (
  <div className="join items-center">{children}</div>
)

export const NameEditor = ({ wrapperClass, ...props }: TextEditProps & { wrapperClass?: string }) => (
  <div className={`flex-grow min-w-0 h-full bg-base-300 text-right border border-base-content/50 ${wrapperClass}`}>
    <TextEditor {...props} className="input-secondary join-item text-sm sm:text-base text-right" />
  </div>
)

export const PlayerButton = ({ onClick, label, tooltip, className }: PlayerButtonProps) => (
  <button type="button" onClick={onClick || undefined} disabled={!onClick} data-tip={tooltip}
    className={`h-full btn join-item btn-sm btn-outline disabled:text-opacity-50 ${
      className ?? 'py-0 px-1 text-xl btn-secondary tooltip-secondary'}${
      tooltip ? ' tooltip tooltip-top' : ''
    }`}>
      {label}
  </button>
)

export const DropButton = (props: PlayerButtonProps) => (
  <PlayerButton
    {...props}
    className={`p-2 ${
      !props.onClick ? 'btn-secondary' :
      props.label === 'Bot' ? 'btn-success' : 'btn-error'
    }`}
  />
)


// Log Watching Settings

export const WatchContainer = ({ children }: { children?: any }) => <div className="flex">{children}</div>


// Prop Types

type PlayerButtonProps = {
  label?: ReactNode,
  tooltip?: string,
  className?: string
  onClick?: MouseEventHandler | false,
}