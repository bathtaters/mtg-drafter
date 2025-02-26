import type { PickInfoHook, PackViewerHook } from "./packViewer.controller"
import type { BasicPlayer, CardOptions, Game, PackFull } from "types/game"
import { TabLabels } from "types/game"
import CardContainer from "../CardContainer/CardContainer"
import PackViewerForm from "./PackViewerForm"
import { ViewPackButton } from "./PackViewerStyles"

type Props = {
    data: PackViewerHook,
    packs?: PackFull[],
    cardOptions: CardOptions,
    players?: BasicPlayer[],
    game?: Partial<Game>,
    pickInfo?: PickInfoHook,
}

export default function PackViewer({ packs, cardOptions, players, game, pickInfo, data }: Props) {
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