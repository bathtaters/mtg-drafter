import type { ReactNode } from "react"
import TextEditor, { Props as TextEditorProps } from "components/base/common/FormElements/TextEditor"
import UserIcon from "components/svgs/UserIcon"
import CardIcon from "components/svgs/CardIcon"
import PackIcon from "components/svgs/PackIcon"
import { titleCase } from "components/base/services/common.services"

const statsIcon = { pick: CardIcon, holding: PackIcon }

export const EmptyPlayerContainer = () => <div className="h-20" />

export const HostMarker = () => <span className="-mr-0.5 mb-1 text-base sm:text-lg opacity-70"><div className="ms ms-planeswalker" /></span>
export const UserMarker = () => <UserIcon className="fill-current opacity-70 h-2 sm:h-3 inline-block ml-0.5 sm:mr-px" />

export const HostBadge = () => <span className="badge badge-info badge-sm align-top ml-2"><HostMarker />&nbsp;Host</span>

export const UserHeader = ({ isConnected, isHost }: { isConnected: boolean, isHost: boolean }) => (
  <span>
    <UserIcon className={`${isConnected ? "fill-success" : "fill-error"} h-4 sm:h-5 inline-block`} />{isHost && <HostBadge />}
  </span>
)

export const FullStatsWrapper = ({ children }: { children: ReactNode }) => <div className="flex items-center gap-1 px-0.5">{children}</div>
export const FullStatsDivider = () => <span className="px-1">|</span>

export const StatsStyle = ({ type, isMini, count }: { type?: keyof typeof statsIcon, isMini?: boolean, count?: number }) => {
  if (!type) return <div className="h-5" />
  
  const Icon = statsIcon[type]

  return isMini ? (<>
    <span data-tip={titleCase(type)} className="w-full h-full tooltip tooltip-left before:text-2xs before:content-[attr(data-tip)]" >
      <Icon className={`${type === 'pick' ? "h-3 mr-0.5 mt-0.5" : "h-4 mb-0.5"} stroke-current fill-base-100 self-center text-right ml-auto`} />
    </span>
    <span className="text-xs min-w-[1.1em] text-left mr-auto">{count ?? '-'}</span>

  </>) : (<>
    <Icon className={`inline-block ${type === 'pick' ? "h-4 pr-0.5" : "h-5"} stroke-current fill-base-100`} />
    <span className="">{`${titleCase(type)} ${count ?? '-'}`}</span>
  </>)
}

export const PlayerNameEditor = (props: TextEditorProps) => <TextEditor {...props} className="input-primary text-lg sm:text-2xl " />

export const MenuItemStyle = ({ label, icon }: { label: string, icon?: ReactNode }) => (
    <div className="flex justify-between w-full">
      <span>{label}</span>
      <span>{icon}</span>
    </div>
  )
  