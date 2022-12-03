import type { ReactNode } from "react"
import TextEditor, { Props as TextEditorProps } from "components/base/common/FormElements/TextEditor"
import UserIcon from "components/svgs/UserIcon"

export const EmptyPlayerContainer = () => <div className="h-20" />

export const HostMarker = () => <span className="-mx-0.5 mb-1 text-base sm:text-lg opacity-70"><div className="ms ms-planeswalker" /></span>
export const UserMarker = () => <UserIcon className="fill-current opacity-70 h-2 sm:h-3 inline-block sm:mr-0.5" />

export const HostBadge = () => <span className="badge badge-info badge-sm align-top ml-2"><HostMarker />&nbsp;Host</span>

export const UserHeader = ({ isHost }: { isHost: boolean }) => (
  <span>
    <UserIcon className="fill-current h-4 sm:h-5 inline-block" />{isHost && <HostBadge />}
  </span>
)

export const PickStyle = ({ count }: { count?: number }) => (
  <div className="text-xs mt-0.5 whitespace-nowrap">Pick {count ?? '-'}</div>
)

export const HoldingStyle = ({ count }: { count?: number }) => (
  <div className="text-2xs whitespace-nowrap">Holding {count ?? '-'}</div>
)

export const PlayerNameEditor = (props: TextEditorProps) => <TextEditor {...props} className="input-primary text-lg sm:text-2xl " />

export const MenuItemStyle = ({ label, icon }: { label: string, icon?: ReactNode }) => (
    <div className="flex justify-between w-full">
      <span>{label}</span>
      <span>{icon}</span>
    </div>
  )
  