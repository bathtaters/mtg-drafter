import IconToggle from "components/base/common/FormElements/IconToggle"
import { CardToolbarStyle, ToolbarCollapse, ToolbarSelector, ToolbarIcon, ToolbarRange, CardZoomStyle } from "../styles/CardToolbarStyles"
import useToolbar, { sortList, ToolbarProps } from "../services/toolbar.controller"
import cardZoomLevels from "../styles/cardZoomLevels"


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
            <ToolbarIcon open={true} />
            <ToolbarIcon open={false} />
          </IconToggle>

          <ToolbarRange aria-label="Card size" value={zoom} setValue={setZoom} min={0} max={cardZoomLevels.length - 1} />

        </CardZoomStyle>
      </CardToolbarStyle>
    </ToolbarCollapse>
  )
}

