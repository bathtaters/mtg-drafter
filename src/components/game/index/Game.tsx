import type { Game, ServerProps, BasicLands, PartialGame } from 'types/game'
import GameHeader from 'components/game/GameHeader/GameHeader'
import PlayerJoin from 'components/game/PlayerJoin/PlayerJoin'
import GameBody from 'components/game/GameBody/GameBody'
import LandsModal from 'components/game/LandsModal/LandsModal'
import HostModal from 'components/game/HostModal/HostModal'
import LogModal from '../LogModal/LogModal'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import Loader from 'components/base/Loader'
import Footer from 'components/base/Footer'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import useGameController from 'components/game/index/game.controller'
import { gameIsEnded, gameIsPaused } from '../shared/game.utils'


export default function Game(props: ServerProps) {
  const {
    game, player, players, playerIdx, isConnected, loadingPack, loadingAll, maxPackSize,
    holding, canAdvance, pack, landModal, hostModal, logModal, slots, gameLog, timer, 
    saveDeck, toggleLandModal, toggleHostModal, toggleLogModal, renamePlayer, setTitle,
    nextRound, pauseGame, pickCard, swapCard, setLands, setStatus, dropPlayer, reload, startTimer,
    newError, newToast, ErrorComponent, ToastComponent,
  } = useGameController(props)

  return (<>
    <SetPageTitle title={game?.name || ""} />

    <GameHeader
      game={game} players={players} playerIdx={playerIdx} holding={holding} packSize={maxPackSize} isConnected={isConnected} saveDeck={saveDeck}
      openLands={toggleLandModal} openHost={toggleHostModal} renamePlayer={renamePlayer} dropPlayer={dropPlayer} notify={newToast}
    />
    
    <BodyWrapperStyle>
      <Loader data={game || 404} message={props.error}>
        { !player ?
          <PlayerJoin slots={slots} players={players} selectPlayer={setStatus} /> :
          
          <GameBody
            game={game as Game|PartialGame}
            player={player} playerTimer={timer}
            roundOver={player.pick > maxPackSize}
            pack={pack} pickCard={pickCard} swapCard={swapCard}
            clickRoundBtn={canAdvance ? () => nextRound() : undefined}
            onLandClick={toggleLandModal}
            clickReload={reload}
            onPackLoad={startTimer}
            loadingPack={!!loadingPack}
            notify={newToast}
          />
        }
      </Loader>
    </BodyWrapperStyle>

    <Footer />

    { (!!loadingAll || !isConnected) && <Overlay ><Spinner caption={loadingAll ? 'Loading...' : 'Reconnecting...'} /></Overlay> }

    {!!toggleLogModal &&
      <LogModal
        isOpen={logModal} setOpen={toggleLogModal}
        log={gameLog} players={players} gameEnded={gameIsEnded(game)}
      /> }

    {!!toggleLandModal &&
      <LandsModal
        isOpen={landModal} setOpen={toggleLandModal}
        basics={player?.basics as BasicLands} onSubmit={setLands}
        cards={player?.cards} notify={newToast}
      /> }

    {!!toggleHostModal &&
      <HostModal
        isOpen={hostModal} setOpen={toggleHostModal}
        title={game?.name} setTitle={setTitle}
        paused={gameIsPaused(game)} pauseGame={pauseGame}
        players={players} renamePlayer={renamePlayer}
        hostId={(game as Game).hostId} setStatus={setStatus}
        setLog={toggleLogModal}
    />}

    <ErrorComponent />
    <ToastComponent />
  </>)
}