import type { GameProps, PickCard, PlayerFull, SwapCard } from 'types/game'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import CardContainer from "../CardContainer/CardContainer"
import CardToolbar from '../CardToolbar/CardToolbar'
import { PickCardButton, RoundButton, GameLayoutWrapper, Divider } from './GameLayoutStyles'
import { EmptyStyle } from 'components/base/styles/AppStyles'
import usePickController from "./pick.controller"

type Props = {
  game: GameProps['options'],
  player: PlayerFull,
  pack?: GameProps['packs'][number],
  pickCard: PickCard,
  swapCard: SwapCard,
  clickRoundBtn?: () => void,
  loadingPack: boolean,
}

export default function GameLayout({ game, player, pack, clickRoundBtn, pickCard, swapCard, loadingPack }: Props) {

  const {
    selectedCard, deselectCard, clickPickButton, clickPackCard, clickBoardCard, cardOptions, setCardOptions
  } = usePickController(pickCard, swapCard, pack)

  if (game.round < 1 || !player) return (
    <GameLayoutWrapper>
      { clickRoundBtn && <RoundButton onClick={clickRoundBtn} label="start" /> }
      <EmptyStyle>Waiting for draft to start.</EmptyStyle>
    </GameLayoutWrapper>
  )

  return (
    <GameLayoutWrapper>

      <CardToolbar setCardOptions={setCardOptions} />

      {game.round <= game.roundCount &&
        <CardContainer
          label="Pack" cardOptions={cardOptions}
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

      <CardContainer
        label="Main" lands={player.basics.main}
        cards={player.cards.filter(({ board }) => board === 'main')}
        onClick={clickBoardCard('main')} cardOptions={cardOptions} />

      <Divider />

      <CardContainer
        label="Side" lands={player.basics.side} open={false}
        cards={player.cards.filter(({ board }) => board === 'side')}
        onClick={clickBoardCard('side')} cardOptions={cardOptions} />
    </GameLayoutWrapper>
  )
}