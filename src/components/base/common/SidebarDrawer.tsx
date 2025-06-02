import type { MouseEventHandler, ReactNode } from "react";

export type Props = {
  isOpen: boolean;
  overlayClick?: MouseEventHandler<HTMLLabelElement>;
  className?: string;
  sidebarClass?: string;
  sidebarContent?: ReactNode;
  children?: ReactNode;
};

export default function SidebarDrawer({
  isOpen,
  overlayClick,
  className = "",
  sidebarClass = "z-20",
  sidebarContent,
  children,
}: Props) {
  return (
    <div className={`drawer${isOpen ? " xl:drawer-open" : ""} ${className}`}>
      <input
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        readOnly={true}
      />

      <div className="drawer-content">{children}</div>

      <div className={`drawer-side ${sidebarClass}`}>
        {overlayClick && (
          <label
            aria-label="close sidebar"
            className="drawer-overlay !fixed left-0 w-full h-full xl:hidden"
            onClick={overlayClick}
          />
        )}
        {sidebarContent}
      </div>
    </div>
  );
}
