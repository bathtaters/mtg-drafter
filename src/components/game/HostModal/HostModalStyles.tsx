import type { MouseEventHandler, ReactNode } from "react"
import TextEditor, { Props as TextEditProps } from "components/base/common/FormElements/TextEditor"
import IconToggle, { Props as IconToggleProps } from "components/base/common/FormElements/IconToggle"
import { PauseIcon, PlayIcon } from "components/svgs/PlayPauseIcons"

// Base

export const Divider = () => <div className="divider" />

export const FieldWrapper = ({ label, children }: { label: ReactNode, children: ReactNode }) => (
  <div className="form-control w-full mb-4">
    <label className="label label-text pt-0">{label}</label>
    {children}
  </div>
)


// Game Editor

export const GameContainer = ({ label, children }: { label: ReactNode, children: ReactNode }) => (
  <FieldWrapper label={label}>
    <div className="flex flex-row gap-4 items-center">{children}</div>
  </FieldWrapper>
)

export const TitleEditor = (props: TextEditProps) => (
  <div className="font-serif text-xl bg-base-300 border border-secondary rounded-lg flex-grow">
    <TextEditor {...props} className="input-secondary bg-base-300 text-xl" />
  </div>
)

export const PauseButton = (props: Omit<IconToggleProps, "className"|"children">) => (
  <IconToggle {...props} className="btn btn-secondary btn-circle">
    <PlayIcon  className="fill-current w-8" />
    <PauseIcon className="fill-current w-8" />
  </IconToggle>
)


// Player Editor

export const PlayersContainer = ({ label, children }: { label: ReactNode, children: ReactNode }) => (
  <FieldWrapper label={label}>
    <div className="grid sm:grid-cols-2 gap-2">{children}</div>
  </FieldWrapper>
)

export const PlayerWrapper = ({ children }: { children: ReactNode }) => (
  <div className="input-group items-center">{children}</div>
)

export const NameEditor = (props: TextEditProps) => (
  <div className="flex-grow h-full bg-base-300 rounded-lg text-right">
    <TextEditor {...props} className="input-secondary text-sm sm:text-base text-right" />
  </div>
)

export const DropButton = ({ onClick, label }: { onClick?: MouseEventHandler, label: ReactNode }) => (
  <button type="button" onClick={onClick} disabled={!onClick}
    className={`btn btn-sm btn-outline ${onClick ? 'btn-error' : 'btn-secondary'} p-2 h-full`}>
      {label}
  </button>
)
