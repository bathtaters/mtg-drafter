import type { ReactNode } from "react"
import CollapseContainer, { Props as CollapseProps } from "components/base/common/Collapse"
import Selector, { Props as SelectorProps } from "components/base/common/FormElements/Selector"
import RangeInput, { Props as RangeProps } from "components/base/common/FormElements/RangeInput"
import IconToggle, { Props as ToggleProps } from "components/base/common/FormElements/IconToggle"
import ArtIcon from "components/svgs/ArtIcon"
import EyeIcon from "components/svgs/EyeIcon"
import SortIcon from "components/svgs/SortIcon"
import CardIcon from "components/svgs/CardIcon"

export const ToolbarContainer = ({ children }: { children: ReactNode }) => (
  <div className="w-full p-2 flex justify-between">{children}</div>
)

export const ToolbarCollapse = (props: CollapseProps) => (
  <CollapseContainer className="-mt-7 pt-7" buttonClass="absolute right-0 top-4 p-2 btn-ghost swap-rotate" {...props} />
)

export const ToolbarButton = [
  <CardIcon key="open"  innerIcon="X"    className="h-8 fill-secondary text-secondary-content" />,
  <CardIcon key="close" innerIcon="gear" className="h-8 fill-secondary-content text-secondary" />,
]


export const CardSort = (props: SelectorProps) => (
  <div className="flex">
    <SortIcon className="fill-base-content h-7 mr-2" />
    <Selector className="select-secondary select-sm tooltip-secondary" {...props} />
  </div>
)

export const CardArtWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-1/2 md:w-1/4 flex items-center">
    <ArtIcon className="fill-base-content h-8" />
    {children}
  </div>
)


export const ArtSize = (props: RangeProps) => (
  <RangeInput wrapperClass="w-full px-2 pt-2" {...props} />
)

export const ArtToggle = ({ label, value, setValue }: Pick<ToggleProps, "label"|"value"|"setValue">) => (
  <IconToggle label={label} value={value} setValue={setValue} className="btn btn-sm btn-circle btn-secondary">
    <EyeIcon className="fill-secondary-content w-6 h-6" open={true}  />
    <EyeIcon className="fill-secondary-content w-6 h-6" open={false} />
  </IconToggle>
)
