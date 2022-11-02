import IconToggle from "components/base/common/FormElements/IconToggle"
import { CardToolbarStyle, ToolbarCollapse, ToolbarSelector, ToolbarEye, ToolbarRange, CardZoomStyle } from "./CardToolbarStyles"
import useToolbar, { sortList, ToolbarProps } from "./toolbar.controller"
import cardZoomLevels from "./cardZoomLevels"


export default function CardToolbar(props: ToolbarProps) {

  const { art, sort, zoom, setArt, setSort, setZoom } = useToolbar(props)

  return (
    <ToolbarCollapse title="..." defaultOpen={false}>
      <CardToolbarStyle>

        <ToolbarSelector label="Sort cards" selected={sort} setSelected={setSort}>
          {sortList}
        </ToolbarSelector>

        <CardZoomStyle>
          <IconToggle label="Card art" value={art} setValue={setArt}>
            <ToolbarEye open={true} />
            <ToolbarEye open={false} />
          </IconToggle>

          <ToolbarRange aria-label="Card size" value={zoom} setValue={setZoom} min={0} max={cardZoomLevels.length - 1} />

        </CardZoomStyle>
      </CardToolbarStyle>
    </ToolbarCollapse>
  )
}

