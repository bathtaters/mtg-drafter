import type { ReactNode } from "react"
import TextEditor, { Props as TextEditorProps } from "components/base/common/FormElements/TextEditor"

export const EmptyPlayerContainer = () => <div className="h-20" />

export const HostMarker = () => <span className="-mx-0.5 mb-1 text-lg opacity-70"><div className="ms ms-planeswalker" /></span>

export const HostBadge = () => <span className="badge badge-info badge-sm align-top ml-2"><HostMarker />&nbsp;Host</span>

export const PlayerNameEditor = (props: TextEditorProps) => <TextEditor {...props} className="input-primary text-lg sm:text-2xl " />

export const MenuItemStyle = ({ label, icon }: { label: string, icon?: ReactNode }) => (
    <div className="flex justify-between w-full">
      <span>{label}</span>
      <span>{icon}</span>
    </div>
  )
  