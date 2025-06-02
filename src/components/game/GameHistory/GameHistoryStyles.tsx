import type { ReactNode } from "react";
import Link from "next/link";
import PackIcon from "components/svgs/PackIcon";
import HostIcon from "components/svgs/HostIcon";

export const GameSelectContainer = ({ children }: { children: ReactNode }) => (
  <div className="w-full flex flex-col justify-center items-center gap-4 py-2">
    {children}
  </div>
);

export const GameHistoryWrapper = ({ children }: { children: ReactNode }) => (
  <ul className="flex flex-col gap-2 items-stretch w-full max-w-xl">
    {children}
  </ul>
);

export const GameButton = ({
  game,
  player,
  link,
  isHost,
}: {
  game: ReactNode;
  player: ReactNode;
  link: string;
  isHost?: boolean;
}) => (
  <li className="px-12">
    <Link
      className="btn btn-lg btn-secondary w-full relative flex flex-col gap-0 normal-case"
      href={link}
    >
      <div className="text-xl">{game}</div>
      <div className="text-base font-light italic">{player}</div>
      <PackIcon className="h-10 fill-[color-mix(in_oklab,oklch(var(--s)),black_10%)] stroke-secondary-content absolute left-2" />
      {isHost && (
        <HostIcon className="text-secondary-content ms-2x absolute right-2" />
      )}
    </Link>
  </li>
);
