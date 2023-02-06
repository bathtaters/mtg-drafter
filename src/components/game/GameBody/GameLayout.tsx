import type { MouseEventHandler } from 'react'
import type { Game } from '@prisma/client'
import type { GameProps, PartialGame, PickCard, PlayerFull, SwapCard } from 'types/game'
import type { AlertsReturn } from 'components/base/common/Alerts/alerts.hook'
import CardContainer from "../CardContainer/CardContainer"
import CardToolbar from '../CardToolbar/CardToolbar'
import { PickCardButton, RoundButton, GameLayoutWrapper, TimerStyle } from './GameLayoutStyles'
import { EmptyStyle } from 'components/base/styles/AppStyles'
import usePickController from "./pick.controller"
import ContainerTabs from './ContainerTabs'
import { getBoard, getGameStatus } from '../shared/game.utils'

type Props = {
  game: Game | PartialGame,
  player: PlayerFull,
  pack?: GameProps['packs'][number],
  playerTimer?: number,
  pickCard: PickCard,
  swapCard: SwapCard,
  clickRoundBtn?: () => void,
  onLandClick?: MouseEventHandler,
  clickReload?: () => void,
  onPackLoad?: () => void,
  loadingPack: boolean,
  notify: AlertsReturn['newToast'],
}

export default function GameLayout({ game, player, pack, playerTimer, clickRoundBtn, onLandClick, pickCard, swapCard, clickReload, onPackLoad, loadingPack, notify }: Props) {

  const {
    autopickCard, selectedCard, deselectCard, clickPickButton, clickPackCard, clickBoardCard,
    cardOptions, setCardOptions, selectedTab, selectTab, hidePack, timer, packLoading, handleCardLoad
  } = usePickController(pickCard, swapCard, notify, pack, game, player, playerTimer, onPackLoad)
  
  if (!('round' in game) || game.round < 1 || !player) return (
    <GameLayoutWrapper>
      { clickRoundBtn && <RoundButton onClick={clickRoundBtn} label="start" /> }
      <EmptyStyle>{'round' in game ? "Waiting for draft to start." : "Loading game..."}</EmptyStyle>
    </GameLayoutWrapper>
  )

  return (
    <GameLayoutWrapper>
      <ContainerTabs pack={pack?.cards} player={player} selectedTab={selectedTab} selectTab={selectTab} hidePack={hidePack} />

      <CardToolbar setCardOptions={setCardOptions} clickReload={clickReload} notify={notify} />

      {selectedTab === 'pack' ?
        <CardContainer
          label="pack" cardOptions={cardOptions} loading={loadingPack ? -1 : packLoading || undefined}
          cards={pack?.cards} selectedId={selectedCard} highlightId={autopickCard}
          onClick={clickPackCard} onBgdClick={deselectCard} onCardLoad={handleCardLoad}
        >
          { clickRoundBtn ?
            <RoundButton onClick={clickRoundBtn} label={getGameStatus(game)} /> :
            <PickCardButton disabled={loadingPack || !!packLoading || !pack || !pack.cards.length || !selectedCard} onClick={clickPickButton} />
          }
        </CardContainer>
        :
        <CardContainer
          label={selectedTab} lands={player.basics[selectedTab]} cardOptions={cardOptions}
          cards={getBoard(player.cards, selectedTab)}
          onClick={clickBoardCard(selectedTab)} onLandClick={onLandClick} />
      }

      { typeof timer === 'number' &&  <TimerStyle seconds={timer} /> }
    </GameLayoutWrapper>
  )
}