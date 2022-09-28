import { Game } from '../../models/Game'
import CardContainer from "./subcomponents/CardContainer"
import { NoCardStyle, PickCardButton } from "./styles/GameCardStyles"
import useGameController from "./services/game.controller"


export default function GameLayout({ data, playerIdx }: { data: Game, playerIdx: number }) {
  const { selectedCard, packIdx, pickCard, clickPackCard, clickBoardCard } = useGameController(data, playerIdx)

  if (data.round < 1) return (
    <div className="w-full text-center my-6">
      <NoCardStyle>Waiting to start draft.</NoCardStyle>
    </div>
  )

  return (
    <div className="flex flex-col">

      {data.round <= data.roundCount &&
        <CardContainer
          label="Pack" cards={typeof packIdx === 'number' ? data.packs[packIdx] : undefined}
          selectedIdx={selectedCard} onClick={clickPackCard}
        >
          {typeof packIdx === 'number' && <PickCardButton disabled={selectedCard < 0} onClick={pickCard} />}
        </CardContainer>
      }

      <div className="divider" />

      <CardContainer label="Main" cards={data.players[playerIdx].mainBoard} onClick={clickBoardCard('main')} />

      <div className="divider" />

      <CardContainer label="Side" cards={data.players[playerIdx].sideBoard} open={false} onClick={clickBoardCard('side')} />
    </div>
  )
}