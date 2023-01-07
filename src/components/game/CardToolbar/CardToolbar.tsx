import { ToolbarContainer, ToolbarCollapse, ToolbarButton, CardSort, ArtToggle, ArtSize, CardArtWrapper, ReloadButton } from "./CardToolbarStyles"
import useToolbar, { ToolbarProps } from "./toolbar.controller"
import { sortList } from "./toolbar.utils"
import cardZoomLevels from "./cardZoomLevels"
import { Fragment } from "react"


export default function CardToolbar(props: ToolbarProps) {

  const { art, sort, zoom, setArt, setSort, setZoom } = useToolbar(props)

  return (<>
    {props.clickReload && <ReloadButton onClick={props.clickReload} />}

    <ToolbarCollapse button={ToolbarButton} defaultOpen={false}>
      <ToolbarContainer>

        <CardSort label="Sort cards" selected={sort} setSelected={(idx) => setSort(+idx)}>
          {sortList.map((sortType, idx) => <Fragment key={idx}>{sortType}</Fragment>)}
        </CardSort>

        <CardArtWrapper>
          <ArtSize aria-label="Card zoom" value={zoom} setValue={setZoom} min={0} max={cardZoomLevels.length - 1} />

          <ArtToggle label={art ? "Hide art" : "Show art"} value={art} setValue={setArt} />
          
        </CardArtWrapper>
      </ToolbarContainer>
    </ToolbarCollapse>
  </>)
}

