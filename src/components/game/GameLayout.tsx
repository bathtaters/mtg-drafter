import type { GameProps, PickCard, SwapCard } from './services/game'
import CardContainer from "./subcomponents/CardContainer"
import { NoCardStyle, PickCardButton } from "./styles/GameCardStyles"
import { RoundButton, GameLayoutWrapper, Divider, CardZoomWrapper } from './styles/GameLayoutStyles'
import usePickController from "./services/pick.controller"
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import RangeInput from 'components/base/common/RangeInput'
import CardZoom from './subcomponents/CardZoom'

type Props = {
  game: GameProps['options'],
  player: GameProps['player'],
  pack?: GameProps['packs'][number],
  pickCard: PickCard,
  swapCard: SwapCard,
  clickRoundBtn?: () => void,
  loadingPack: boolean,
}

export default function GameLayout({ game, player, pack, clickRoundBtn, pickCard, swapCard, loadingPack }: Props) {

  const {
    selectedCard, deselectCard, clickPickButton, clickPackCard, clickBoardCard, cardWidth, setCardWidth
  } = usePickController(pickCard, swapCard, pack)

  if (game.round < 1 || !player) return (
    <GameLayoutWrapper>
      { clickRoundBtn && <RoundButton onClick={clickRoundBtn} label="start" /> }
      <NoCardStyle>Waiting for draft to start.</NoCardStyle>
    </GameLayoutWrapper>
  )

  return (
    <GameLayoutWrapper>

      <CardZoomWrapper><CardZoom updateClass={setCardWidth} /></CardZoomWrapper>

      {game.round <= game.roundCount &&
        <CardContainer
          label="Pack" cardWidth={cardWidth}
          cards={pack?.cards} selectedIdx={selectedCard}
          onClick={clickPackCard} onBgdClick={deselectCard}
        >
          { clickRoundBtn ?
            <RoundButton onClick={clickRoundBtn} label={game.round === game.roundCount ? 'end' : 'next'} /> :
            pack &&
            <PickCardButton disabled={loadingPack || selectedCard < 0} onClick={clickPickButton} />}

          { loadingPack && <Overlay className="absolute z-40"><Spinner /></Overlay> }
        </CardContainer>
      }

      <Divider />

      <CardContainer label="Main" cards={player.cards.filter(({ board }) => board === 'main')} onClick={clickBoardCard('main')} cardWidth={cardWidth} />

      <Divider />

      <CardContainer label="Side" cards={player.cards.filter(({ board }) => board === 'side')} open={false} onClick={clickBoardCard('side')} cardWidth={cardWidth} />
    </GameLayoutWrapper>
  )
}