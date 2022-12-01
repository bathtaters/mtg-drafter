import type { ReactNode } from "react"
import { HorizontalCollapse, Props as CollapseProps } from "components/base/common/Collapse"
import Selector, { Props as SelectorProps } from "components/base/common/FormElements/Selector"
import RangeInput, { Props as RangeProps } from "components/base/common/FormElements/RangeInput"
import ArtIcon from "components/svgs/ArtIcon"
import EyeIcon from "components/svgs/EyeIcon"
import ResizeIcon from "components/svgs/ResizeIcon"
import SortIcon from "components/svgs/SortIcon"

export const ToolbarCollapse = (props: CollapseProps) => <HorizontalCollapse titleClass="m-1 btn-sm btn-ghost" {...props} />

export const ToolbarButton = () => <ArtIcon className="w-6 h-6 fill-secondary" />

export const ToolbarSort = (props: SelectorProps) => (
  <div className="flex">
    <SortIcon className="fill-secondary h-7 mr-1" />
    <Selector className="select-secondary select-sm tooltip-secondary" {...props} />
  </div>
)

export const ToolbarRange = (props: RangeProps) => (
  <RangeInput wrapperClass="w-full px-2" {...props} />
)

export const ToolbarEye = ({ open }: { open: boolean }) => <EyeIcon className="fill-secondary w-6 h-6" open={open} />

export const CardToolbarStyle = ({ children }: { children: ReactNode }) => (
  <div className="w-full p-2 flex justify-between">{children}</div>
)

export const CardZoomStyle = ({ children }: { children: ReactNode }) => (
  <div className="w-1/2 md:w-1/4 flex items-center">{children}</div>
)
