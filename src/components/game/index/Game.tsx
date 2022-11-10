import type { ServerProps, GameProps, BasicLands } from 'types/game'
import GameHeader from 'components/game/GameHeader/GameHeader'
import PlayerJoin from 'components/game/PlayerJoin/PlayerJoin'
import GameLayout from 'components/game/GameBody/GameLayout'
import LandsModal from 'components/game/LandsModal/LandsModal'
import HostModal from 'components/game/HostModal/HostModal'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import Loader from 'components/base/Loader'
import Footer from 'components/base/Footer'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import useGameController from 'components/game/index/game.controller'
import { enableDropping } from 'assets/constants'


export default function Game(props: ServerProps) {
  const {
    game, player, players, playerIdx, isConnected, loadingPack, loadingAll,
    holding, isReady, pack, landModal, hostModal, slots, loadingMessage,
    saveDeck, toggleLandModal, toggleHostModal, renamePlayer, setTitle,
    nextRound, pickCard, swapCard, setLands, setStatus
  } = useGameController(props)

  return (<>
    <SetPageTitle title={game?.name || ""} />

    <GameHeader
      game={game} players={players} playerIdx={playerIdx} holding={holding} saveDeck={saveDeck}
      openLands={toggleLandModal} openHost={toggleHostModal} renamePlayer={renamePlayer}
      dropPlayer={enableDropping && player?.id ? () => setStatus(player.id, 'leave') : null}
    />
    
    <BodyWrapperStyle>
      <Loader data={isConnected || game || 404} message={props.error || loadingMessage}>
        { !player ?
          <PlayerJoin slots={slots} players={players} selectPlayer={setStatus} /> :

          <GameLayout
            game={game as GameProps['options']}
            player={player}
            pack={pack} pickCard={pickCard} swapCard={swapCard}
            clickRoundBtn={isReady ? () => nextRound() : undefined}
            onLandClick={toggleLandModal || undefined}
            loadingPack={!!loadingPack}
          />
        }
      </Loader>
    </BodyWrapperStyle>

    <Footer />

    { !!loadingAll && <Overlay><Spinner /></Overlay> }

    {!!toggleLandModal &&
      <LandsModal
        isOpen={landModal} setOpen={toggleLandModal}
        basics={player?.basics as BasicLands} onSubmit={setLands}
        cards={player?.cards}
      /> }

    {!!toggleHostModal &&
      <HostModal
        isOpen={hostModal} setOpen={toggleHostModal}
        title={game?.name} setTitle={setTitle}
        players={players} renamePlayer={renamePlayer}
        hostId={game?.hostId || null} setStatus={setStatus}
    />}
  </>)
}