import IconToggle from "components/base/common/FormElements/IconToggle"
import { CardToolbarStyle, ToolbarCollapse, ToolbarButton, ToolbarSort, ToolbarEye, ToolbarRange, CardZoomStyle } from "./CardToolbarStyles"
import useToolbar, { sortList, ToolbarProps } from "./toolbar.controller"
import cardZoomLevels from "./cardZoomLevels"


export default function CardToolbar(props: ToolbarProps) {

  const { art, sort, zoom, setArt, setSort, setZoom } = useToolbar(props)

  return (
    <ToolbarCollapse title={<ToolbarButton />} defaultOpen={false}>
      <CardToolbarStyle>

        <ToolbarSort label="Sort cards" selected={sort} setSelected={setSort}>
          {sortList}
        </ToolbarSort>

        <CardZoomStyle>
          <ToolbarRange aria-label="Card size" value={zoom} setValue={setZoom} min={0} max={cardZoomLevels.length - 1} />

          <IconToggle label="Card art" value={art} setValue={setArt}>
            <ToolbarEye open={true} />
            <ToolbarEye open={false} />
          </IconToggle>
          
        </CardZoomStyle>
      </CardToolbarStyle>
    </ToolbarCollapse>
  )
}

