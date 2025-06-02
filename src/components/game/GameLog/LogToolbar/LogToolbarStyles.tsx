import type { MouseEventHandler, ReactNode } from "react";
import DropdownMenu from "components/base/common/DropdownMenu";
import Spinner from "components/base/common/Spinner";
import FilterIcon from "components/svgs/FilterIcon";
import GearIcon from "components/svgs/GearIcon";
import { ExitIcon, ExportIcon } from "components/svgs/MenuIcons";
import getColorClass from "components/base/libs/colors";
import { clampText } from "components/base/services/common.services";
import { ReloadButton } from "components/game/CardToolbar/CardToolbarStyles";

export const LogoutLabel = () => (
  <div className="flex justify-between">
    <span>Logout</span>
    <ExitIcon className="w-5 -mr-2" />
  </div>
);

export const DownloadLabel = ({ loading }: { loading: boolean }) => (
  <div className="flex justify-between">
    <span>Export JSON</span>
    {loading ? (
      <Spinner className="w-5 -mr-2" hideWrapper={true} />
    ) : (
      <ExportIcon className="w-5 -mr-2" />
    )}
  </div>
);

export const ToolbarWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex text-secondary">{children}</div>
);

export const TabToolbarWrapper = ({
  clickReload,
  children,
}: {
  clickReload?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}) => (
  <>
    {clickReload && <ReloadButton onClick={clickReload} />}
    <div className="absolute right-0 top-4 p-2">{children}</div>
  </>
);

export const SettingsDropdown = ({ children }: { children: ReactNode }) => (
  <DropdownMenu
    labelClass="btn-sm btn-circle btn-ghost"
    forceOpen="click"
    menuClass="p-2 shadow-lg shadow-black bg-primary-content rounded-box w-52 md:w-56"
    label={<GearIcon className="fill-current w-5" />}
  >
    {children}
  </DropdownMenu>
);

export const SettingToggle = ({
  label,
  value,
  setValue,
}: {
  label: ReactNode;
  value: boolean;
  setValue: (value: boolean) => void;
}) => (
  <label className="label cursor-pointer">
    <input
      type="checkbox"
      className="toggle toggle-primary"
      checked={value}
      onChange={(ev) => setValue(ev.target.checked)}
    />
    <div className="flex justify-end align-middle label-text">{label}</div>
  </label>
);

export const SettingAction = ({
  label,
  onClick,
  loading,
}: {
  label: ReactNode;
  onClick: () => void;
  loading?: boolean;
}) => (
  <label className={`label ${loading ? "cursor-wait" : "cursor-pointer"}`}>
    <a
      className={`label-text block w-full h-full${loading ? " opacity-50 pointer-events-none" : ""}`}
      onClick={loading ? undefined : onClick}
    >
      {label}
    </a>
  </label>
);

export const FilterDropdown = ({ children }: { children: ReactNode }) => (
  <DropdownMenu
    labelClass="btn-sm btn-circle btn-ghost"
    forceOpen="click"
    menuClass="p-2 shadow-lg shadow-black bg-primary-content rounded-box w-48 md:w-52"
    label={<FilterIcon className="fill-current w-5" />}
  >
    {children}
  </DropdownMenu>
);

export const FilterWrapper = ({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) => (
  <div className="label flex flex-col">
    <label className="label-text pb-0.5 text-xl">{label}</label>
    <div className="w-full grid grid-cols-2 grid-flow-row gap-2">
      {children}
    </div>
  </div>
);

export const FilterButton = ({
  color = -1,
  inverse,
  wide,
  isSelected,
  setSelected,
  children,
}: {
  color?: number;
  inverse?: boolean;
  isSelected: boolean;
  wide?: boolean;
  setSelected: (selected: boolean) => void;
  children: string;
}) => (
  <button
    type="button"
    onClick={() => setSelected(!isSelected)}
    className={`btn btn-sm ${wide ? "col-span-2 " : ""}${getColorClass(
      color,
      isSelected ? "all" : "fg",
      { inverse: isSelected !== inverse }
    )}${
      isSelected
        ? ` btn-active ${getColorClass(color, "bg", { inverse: !inverse, dim: true, hover: true })}`
        : ` bg-base-300 hover:bg-base-200 ${getColorClass(color, "fg", { inverse, dim: true, hover: true })}`
    }`}
  >
    {clampText(children, 8, 2)}
  </button>
);
