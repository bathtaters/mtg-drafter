import type { MouseEventHandler } from 'react'
import type { Game, GameProps, PartialGame, PickCard, PlayerFull, SwapCard } from 'types/game'
import type { AlertsReturn } from 'components/base/common/Alerts/alerts.hook'
import CardContainer from "../CardContainer/CardContainer"
import CardToolbar from '../CardToolbar/CardToolbar'
import { PickCardButton, RoundButton, GameBodyWrapper, GameBodyHeader, TimerStyle } from './GameBodyStyles'
import { EmptyStyle } from 'components/base/styles/AppStyles'
import usePickController from "./pick.controller"
import ContainerTabs from './ContainerTabs'
import { getBoard, getGameStatus } from '../shared/game.utils'

type Props = {
  game: Game | PartialGame,
  player: PlayerFull,
  pack?: GameProps['packs'][number],
  playerTimer?: number,
  roundOver?: boolean,
  pickCard: PickCard,
  swapCard: SwapCard,
  clickRoundBtn?: () => void,
  onLandClick?: MouseEventHandler,
  clickReload?: () => void,
  onPackLoad?: () => void,
  loadingPack: boolean,
  notify: AlertsReturn['newToast'],
}

export default function GameBody({ game, player, pack, playerTimer, roundOver, clickRoundBtn, onLandClick, pickCard, swapCard, clickReload, onPackLoad, loadingPack, notify }: Props) {

  const {
    autopickCard, selectedCard, deselectCard, clickPickButton, clickPackCard, clickBoardCard,
    cardOptions, setCardOptions, selectedTab, selectTab, hidePack, timer, packLoading, handleCardLoad
  } = usePickController(pickCard, swapCard, notify, pack, game, player, playerTimer, onPackLoad)
  
  if (!('round' in game) || game.round < 1 || !player) return (
    <GameBodyWrapper>
      { clickRoundBtn && <RoundButton onClick={clickRoundBtn} label="start" /> }
      <EmptyStyle>{'round' in game ? "Waiting for draft to start." : "Loading game..."}</EmptyStyle>
    </GameBodyWrapper>
  )

  return (
    <GameBodyWrapper>
      <GameBodyHeader>
        <ContainerTabs pack={pack?.cards} player={player} selectedTab={selectedTab} selectTab={selectTab} hidePack={hidePack} />

        <CardToolbar setCardOptions={setCardOptions} clickReload={clickReload} notify={notify} />
      </GameBodyHeader>

      {selectedTab === 'pack' ?
        <CardContainer
          loading={loadingPack ? -1 : packLoading || undefined}
          label="pack"
          cards={roundOver ? 'roundEnd' : pack?.cards}
          cardOptions={cardOptions}
          paused={!!game.pause}
          selectedId={selectedCard}
          highlightId={autopickCard}
          onClick={clickPackCard}
          onBgdClick={deselectCard}
          onCardLoad={handleCardLoad}
        >
          { clickRoundBtn ?
            <RoundButton onClick={clickRoundBtn} label={getGameStatus(game)} /> :
            <PickCardButton
              disabled={loadingPack || !!packLoading || !pack || !!game.pause || roundOver || !selectedCard}
              isEmpty={!roundOver && pack && !pack.cards.length}
              onClick={clickPickButton}
            />
          }
        </CardContainer>
        :
        <CardContainer
          label={selectedTab}
          cards={getBoard(player.cards, selectedTab)}
          lands={player.basics[selectedTab]}
          cardOptions={cardOptions}
          onClick={clickBoardCard(selectedTab)}
          onLandClick={onLandClick}
        />
      }

      { typeof timer === 'number' &&  <TimerStyle seconds={timer} paused={!!game.pause} /> }
    </GameBodyWrapper>
  )
}