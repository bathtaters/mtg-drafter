import { BasicPlayer, CardOptions, Game, PackFull, TabLabels } from "types/game"
import CardContainer from "../CardContainer/CardContainer"
import PackViewerForm from "./PackViewerForm"
import { ViewPackButton } from "./PackViewerStyles"
import usePackViewer from "./packViewer.controller"

type Props = {
    packs?: PackFull[],
    cardOptions: CardOptions,
    players?: BasicPlayer[],
    game?: Partial<Game>,
}

export default function PackViewer({ packs, cardOptions, players, game }: Props) {
    const data = usePackViewer(packs, players, game)
    const { pack, packVisible, viewPack,  selectedPlayer, viewType } = data

    return (
        <CardContainer
            label={!packVisible ? 'select' : viewType ?? TabLabels.pack}
            cards={packVisible ? pack || [] : undefined}
            cardOptions={cardOptions}
            // loading={!packs || !players ? -1 : packLoading || undefined}}
            // onCardLoad={handleCardLoad}
            overrideBody={!packVisible && players && packs && <PackViewerForm players={players} game={game} {...data} />}
            players={players}
        >
            {packVisible ? <ViewPackButton label="packHide" onClick={() => viewPack((v) => !v)} />
            : <ViewPackButton label="packShow" disabled={!selectedPlayer || !viewType} onClick={() => viewPack((v) => !v)} />}
        </CardContainer>
    )
}