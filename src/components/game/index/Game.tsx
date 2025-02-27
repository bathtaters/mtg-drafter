import type { Game, ServerProps, BasicLands, PartialGame } from 'types/game'
import GameHeader from 'components/game/GameHeader/GameHeader'
import PlayerJoin from 'components/game/PlayerJoin/PlayerJoin'
import GameBody from 'components/game/GameBody/GameBody'
import PlayerSidebar from '../PlayerSidebar/PlayerSidebar'
import LandsModal from 'components/game/LandsModal/LandsModal'
import HostModal from 'components/game/HostModal/HostModal'
import GameLogModal from 'components/game/GameLog/GameLogModal'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import Loader from 'components/base/Loader'
import Footer from 'components/base/Footer'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import useGameController from 'components/game/index/game.controller'
import { gameIsEnded } from '../shared/game.utils'
import { banMsg } from 'assets/strings'


export default function Game(props: ServerProps) {
  const {
    game, player, players, playerIdx, isConnected, loadingPack, loadingAll, maxPackSize, isBanned, isHost,
    holding, canAdvance, pack, packs, sidebarVisible, landModal, hostModal, logModal, slots, gameLog, timer, 
    saveDeck, setSidebar, toggleLandModal, toggleHostModal, toggleLogModal, renamePlayer, setOptions,
    nextRound, pauseGame, pickCard, swapCard, setLands, setStatus, setWatchPw, dropWatcher, banSession, dropPlayer,
    reload, startTimer, newError, newToast, ErrorComponent, ToastComponent,
  } = useGameController(props)

  return (<>
    <SetPageTitle title={game?.name || ""} />

    <PlayerSidebar
      game={game} players={players} playerIdx={playerIdx} isHost={isHost} holding={holding} packSize={maxPackSize}
      isOpen={sidebarVisible} setOpen={setSidebar}
    >
      <GameHeader
        game={game} players={players} playerIdx={playerIdx} isHost={isHost} holding={holding} packSize={maxPackSize} isConnected={isConnected}
        openLands={toggleLandModal} openHost={toggleHostModal} renamePlayer={renamePlayer} dropPlayer={dropPlayer}
        saveDeck={saveDeck} notify={newToast}
      />
      
      <BodyWrapperStyle>
        <Loader data={game || 404} message={props.error || (isBanned && banMsg)}>
          { !player && !isHost ?
            <PlayerJoin title="Pick a Seat:" slots={slots} players={players} selectPlayer={setStatus} game={game} /> :
            
            <GameBody
              game={game as Game|PartialGame}
              player={player} players={players} isHost={isHost} playerTimer={timer}
              roundOver={player?.pick != null && player.pick > maxPackSize}
              pack={pack} packs={packs} pickCard={pickCard} swapCard={swapCard}
              clickRoundBtn={canAdvance ? () => nextRound() : undefined}
              onLandClick={toggleLandModal}
              clickReload={reload}
              onPackLoad={startTimer}
              loadingPack={!!loadingPack}
              notify={newToast}
            />
          }
          {isHost && !player && !!slots.length &&
            <PlayerJoin title="Join Game As:" slots={slots} players={players} selectPlayer={setStatus} game={game} />
          }
        </Loader>
      </BodyWrapperStyle>

      <Footer />
    </PlayerSidebar>

    { (!!loadingAll || !isConnected) && <Overlay ><Spinner caption={!loadingAll ?  'Reconnecting' : 'Loading'} /></Overlay> }

    {!!toggleLogModal &&
      <GameLogModal
        isOpen={logModal} setOpen={toggleLogModal}
        gameLog={gameLog} players={players} packs={packs} gameEnded={gameIsEnded(game)}
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
        game={game} setOptions={setOptions} pauseGame={pauseGame} 
        players={players} renamePlayer={renamePlayer} setStatus={setStatus}
        setWatchPw={setWatchPw} dropWatcher={dropWatcher} banSession={banSession}
        setLog={toggleLogModal} notify={newToast}
    />}

    <ErrorComponent />
    <ToastComponent />
  </>)
}