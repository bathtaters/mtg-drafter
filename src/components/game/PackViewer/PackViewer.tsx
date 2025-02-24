import { BasicPlayer, CardOptions, Game, PackFull, TabLabels } from "types/game"
import CardContainer from "../CardContainer/CardContainer"
import PackViewerForm from "./PackViewerForm"
import { ViewPackButton } from "./PackViewerStyles"
import usePackViewer, { type PickInfoHook } from "./packViewer.controller"

type Props = {
    packs?: PackFull[],
    cardOptions: CardOptions,
    players?: BasicPlayer[],
    game?: Partial<Game>,
    pickInfo?: PickInfoHook,
}

export default function PackViewer({ packs, cardOptions, players, game, pickInfo }: Props) {
    const data = usePackViewer(packs, pickInfo?.data, players, game)
    const { pack, packVisible, viewPack, selectedPlayer, viewType } = data

    return (
        <CardContainer
            label={!packVisible ? 'select' : viewType ?? TabLabels.pack}
            cards={packVisible ? pack || [] : undefined}
            cardOptions={cardOptions}
            // loading={!packs || !players ? -1 : packLoading || undefined}}
            // onCardLoad={handleCardLoad}
            overrideBody={!packVisible && players && packs && <PackViewerForm players={players} game={game} {...data} />}
            pickInfo={pickInfo?.data}
        >
            {packVisible ?
                <ViewPackButton label="packHide"
                    error={pickInfo?.error} isLoading={pickInfo?.isLoading}
                    onClick={() => viewPack((v) => !v)}
                />
                :
                <ViewPackButton label="packShow"
                    error={pickInfo?.error} isLoading={pickInfo?.isLoading}
                    disabled={pickInfo?.isLoading || !selectedPlayer || !viewType}
                    onClick={() => viewPack((v) => !v)}
                />}
        </CardContainer>
    )
}