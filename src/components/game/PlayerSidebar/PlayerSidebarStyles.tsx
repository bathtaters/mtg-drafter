import type { ReactNode } from "react";
import SidebarDrawer, { type Props as SidebarProps } from "components/base/common/SidebarDrawer";

export const SidebarDrawerStyle = (props: Pick<SidebarProps, "isOpen"|"overlayClick"|"sidebarContent"|"children">) => (
  <SidebarDrawer {...props}
    className="drawer-end w-full h-full"
    sidebarClass="!overflow-visible z-40"
  >
    <div className="w-full h-full flex flex-col">{props.children}</div>
  </SidebarDrawer>
)

export const SidebarContainer = ({ children }: { children?: ReactNode }) => (
  <div className="flex justify-start gap-1 bg-base-300 h-full">
    {children}
  </div>
)

export const PlayerListWrapper = ({ title = "Draft Order", children }: { title?: string, children?: ReactNode }) => (
    <div className="flex flex-col gap-2 py-4 pr-4 overflow-y-auto min-w-48">
      <h2 className="text-center font-serif mb-4 font-normal opacity-80">{title}</h2>
      {children}
    </div>
  )

export const Arrow = ({ isDown }: { isDown?: boolean }) => (
    <div className="h-full w-8 px-1 overflow-hidden">
        <div className={`relative h-full ${isDown ? '-mt-16 ' : 'mt-16 '}transition-all duration-500`}>
            <svg viewBox="0 0 30 10000" className={`absolute w-full ${isDown ? 'bottom-0' : 'top-0'} fill-base-content/50`}>
                { typeof isDown === 'boolean' && <path d={
                    isDown ? "M 30 0 L 30 10000 L 0 9960 L 15 9960 L 15 0 L 30 0 Z" :
                        "M 30 0 L 30 10000 L 15 10000 L 15 40 L 0 40 L 30 0 Z"
                } /> }
            </svg>
        </div>
    </div>
)