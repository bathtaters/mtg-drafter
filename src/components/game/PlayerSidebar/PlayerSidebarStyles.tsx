import type { MouseEventHandler, ReactNode } from "react";
import SidebarDrawer, { type Props as SidebarProps } from "components/base/common/SidebarDrawer";
import UserIcon from "components/svgs/UserIcon";

export const SidebarDrawerStyle = (props: Pick<SidebarProps, "isOpen"|"overlayClick"|"sidebarContent"|"children">) => (
  <SidebarDrawer {...props}
    className="drawer-end w-full h-full"
    sidebarClass="!relative z-40"
  >
    <div className="w-full h-full flex flex-col">{props.children}</div>
  </SidebarDrawer>
)

export const SidebarContainer = ({ isOpen, button, children }: { isOpen: boolean, button?: ReactNode, children?: ReactNode }) => (<>
  <div className={`relative h-full ${isOpen ? 'xl:w-[21rem]' : ''}`} />
  <div className="fixed top-0 right-0 flex xl:w-96 h-full overflow-y-auto player-drawer-offset">
    {button}
    <div className="flex justify-start gap-1 min-w-60 md:min-w-72 bg-base-200 border-l-2 border-secondary w-full min-h-full">
      {children}
    </div>
  </div>
</>
)

export const PlayerListWrapper = ({ title = "Draft Order", children }: { title?: string, children?: ReactNode }) => (
    <div className="flex-grow flex flex-col gap-2 py-4 pr-4 overflow-y-auto">
      <h2 className="text-center font-serif mb-4 font-normal opacity-80">{title}</h2>
      {children}
    </div>
  )

export const SidebarButton = ({ hide, active, onClick }: { hide?: boolean, active?: boolean, onClick?: MouseEventHandler<HTMLButtonElement> }) => (
    <button
      type="button" onClick={onClick}
      className={
        `btn btn-secondary btn-outline btn-square btn-sm md:btn-md bg-base-200/80${
          active ? ' swap-active' : ''}${hide ? ' sm:invisible inline-grid' : ''
        } z-50 rounded-e-none border-r-0 mt-[4.5rem] md:mt-20 pointer-events-auto swap swap-rotate`
      }
    >
      <div className="swap-off"><UserIcon className="w-full p-2 md:p-3 fill-current" /></div>
      <div className="swap-on text-2xl md:text-4xl">▶</div> 
    </button>
  )

export const Arrow = ({ isDown }: { isDown?: boolean }) => (
    <div className="w-8 px-1 overflow-hidden">
        <div className={`relative ${isDown ? '-mt-16 ' : 'mt-16 '}transition-all duration-500`}>
            <svg viewBox="0 0 30 10000" className={`absolute w-full ${isDown ? 'bottom-0' : 'top-0'} fill-base-content/50`}>
                { typeof isDown === 'boolean' && <path d={
                    isDown ? "M 30 0 L 30 10000 L 0 9960 L 15 9960 L 15 0 L 30 0 Z" :
                        "M 30 0 L 30 10000 L 15 10000 L 15 40 L 0 40 L 30 0 Z"
                } /> }
            </svg>
        </div>
    </div>
)