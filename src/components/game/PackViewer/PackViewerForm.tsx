import { type BasicPlayer, type Game, TabLabels } from "types/game"
import type { PackViewerHook } from "./packViewer.controller"
import { Fragment } from "react"
import { FormContainer, RangeStyle, SelectorContainer, SelectorStyle } from "./PackViewerStyles"
import { camelToTitle } from "components/base/services/common.services"

type Props = PackViewerHook & { players: BasicPlayer[], game?: Partial<Game> }

const allLabels = Object.values(TabLabels)
const upperLabels = allLabels.map((view) => camelToTitle(view.valueOf()))

export default function PackViewerForm({ players, game, selectedPlayer, selectPlayer, viewType, setViewType, round, setRound }: Props) {
    return (
        <FormContainer>
            <SelectorContainer>
                <SelectorStyle placeholder="Select Player" selected={selectedPlayer} setSelected={selectPlayer}>
                    {players.map((player) => <Fragment key={player.id}>{player.name}</Fragment>)}
                </SelectorStyle>

                <SelectorStyle placeholder="Select Pack or Board" selected={viewType} setSelected={setViewType}>
                    {upperLabels.map((val, idx) => <Fragment key={allLabels[idx]}>{val}</Fragment>)}
                </SelectorStyle>

            </SelectorContainer>

            {viewType === TabLabels.pack && game?.roundCount && (game.roundCount > 1 ?
                <RangeStyle caption="Select Round" min={1} max={game.roundCount} value={round} setValue={(num) => setRound(+num)} />
                :
                <RangeStyle caption="Select Round" min={round} max={round} value={round} disabled={true} />
            )}
        </FormContainer>
    )
}