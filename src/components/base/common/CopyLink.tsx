import {
  type ReactEventHandler,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import LinkIcon from "components/svgs/LinkIcon";
import browserShare, { canShare } from "../libs/share";
import { sharingMessage } from "assets/strings";
import { AlertsReturn } from "./Alerts/alerts.hook";

export type Props = {
  title?: string;
  message?: string;
  url?: string;
  tooltip?: string;
  notify?: AlertsReturn["newToast"];
  className?: string;
  iconClass?: string;
  children?: ReactNode;
};

export default function CopyLink({
  url,
  message,
  title,
  notify,
  tooltip = "Copy Link",
  className = "",
  iconClass = "w-4",
  children,
}: Props) {
  const [shareable, setCanShare] = useState(false);
  useEffect(() => {
    setCanShare(typeof window !== "undefined" && !!url && canShare());
  }, [url]); // Needed for server-side hydration

  const handleShare: ReactEventHandler<HTMLAnchorElement> | undefined =
    !url || !shareable
      ? undefined
      : (ev) => {
          ev.preventDefault();
          const link = url.startsWith("/")
            ? `${window.location.origin}${url}`
            : url;
          browserShare(message || link, link, title || message || link).then(
            (res) => {
              notify && res in sharingMessage && notify(sharingMessage[res]);
            }
          );
        };

  return (
    handleShare && (
      <a
        href={url}
        className={`link ${tooltip ? "tooltip tooltip-primary " : ""}${className}`}
        onClick={handleShare}
        data-tip={tooltip}
      >
        {children || (
          <LinkIcon
            className={`${iconClass} h-auto fill-primary hover:fill-[color-mix(in_oklab,oklch(var(--p)),black_10%)] inline-block`}
          />
        )}
      </a>
    )
  );
}
