import type { ReactNode } from "react"
import TextEditor, { Props as TextEditorProps } from "components/base/common/FormElements/TextEditor"
import HostIcon from "components/svgs/HostIcon"
import UserIcon from "components/svgs/UserIcon"
import OpponentIcon from "components/svgs/OpponentIcon"
import CardIcon from "components/svgs/CardIcon"
import PackIcon from "components/svgs/PackIcon"
import { camelToTitle } from "components/base/services/common.services"

const statsIcon = { pick: CardIcon, holding: PackIcon }

export const EmptyPlayerContainer = ({ className = "h-20" }: { className?: string }) => <div className={className} />

export const UserMarker = () => (
  <span className="inline-block ml-1 sm:mr-px tooltip tooltip-right" data-tip="You">
    <UserIcon className="fill-primary/70 h-2 sm:h-3" />
  </span>
)
export const HostMarker = () => (
  <span className="-mr-0.5 ml-0.5 mb-1 text-base/70 sm:text-lg tooltip tooltip-right" data-tip="Host">
    <HostIcon className="opacity-70" />
  </span>
)
export const OppMarker = () => (
  <span className="mr-0.5 ml-1.5 mb-1 text-base sm:text-lg tooltip tooltip-right" data-tip="Opponent">
    <OpponentIcon className="opacity-70" />
  </span>
)

export const HostBadge = () => (
  <span className="badge badge-info badge-md align-top ml-2 pl-1 opacity-80">
    <HostIcon className="opacity-70 text-lg" />
    <span className="ml-0.5">Host</span>
  </span>
)

export const ByeBadge = () => (
  <span className="badge badge-info badge-md align-top ml-2 pl-1 opacity-80">
    <UserIcon className="opacity-40 stroke-current stroke-[4] fill-none h-3 inline-block" />
    <span className="ml-1">Bye</span>
  </span>
)

export const UserHeader = ({ isConnected, isHost, isBye }: { isConnected: boolean, isHost: boolean, isBye?: boolean }) => (
  <span>
    <span className="inline-block tooltip" data-tip="You">
      <UserIcon className={`${isConnected ? "fill-success" : "fill-error"} opacity-80 h-4 sm:h-5`} />
    </span>
    {isHost && <HostBadge />}
    {isBye && <ByeBadge />}
  </span>
)

export const FullStatsWrapper = ({ children }: { children: ReactNode }) => <div className="flex items-center gap-1 px-0.5">{children}</div>
export const FullStatsDivider = () => <span className="px-1">|</span>

export const StatsStyle = ({ type, isMini, count }: { type?: keyof typeof statsIcon, isMini?: boolean, count?: number }) => {
  if (!type) return <div className="h-5" />
  
  const Icon = statsIcon[type]

  return isMini ? (<>
    <span data-tip={camelToTitle(type)} className="w-full h-full tooltip tooltip-left before:text-2xs before:content-[attr(data-tip)]" >
      <Icon className={`${type === 'pick' ? "h-3 mr-0.5 mt-0.5" : "h-4 mb-0.5"} stroke-current fill-base-100 self-center text-right ml-auto`} />
    </span>
    <span className="text-xs min-w-[1.1em] text-left mr-auto">{count ?? '-'}</span>

  </>) : (<>
    <Icon className={`inline-block ${type === 'pick' ? "h-4 pr-0.5" : "h-5"} stroke-current fill-base-100`} />
    <span className="">{`${camelToTitle(type)} ${count ?? '-'}`}</span>
  </>)
}

export const PlayerNameEditor = (props: TextEditorProps) => <TextEditor {...props} className="input-primary join-item text-lg sm:text-2xl " />

  