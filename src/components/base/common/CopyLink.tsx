import LinkIcon from "components/svgs/LinkIcon"
import browserShare, { canShare } from "../libs/share"
import { sharingMessage } from "assets/strings"
import { AlertsReturn } from "./Alerts/alerts.hook"

export type Props = {
  title?: string,
  message?: string,
  url?: string,
  tooltip?: string,
  notify?: AlertsReturn['newToast'],
  className?: string,
  iconClass?: string
}

export default function CopyLink({ url, message, title, notify, tooltip = "Copy Link", className = "", iconClass = "w-4" }: Props) {

  const handleShare = !url || !canShare() ? undefined : () => browserShare(message || url, url, title || message || url)
    .then((res) => notify && res in sharingMessage ? notify(sharingMessage[res]) : undefined)

  return !handleShare ? null : (
    <a className={`link tooltip tooltip-primary ${className}`} onClick={handleShare} data-tip={tooltip}>
      <LinkIcon className={`${iconClass} h-auto fill-primary hover:fill-[color-mix(in_oklab,oklch(var(--p)),black_10%)] inline-block`} />
    </a>
  )
}