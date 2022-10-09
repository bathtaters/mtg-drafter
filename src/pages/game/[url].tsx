import type { GetServerSidePropsContext, NextPage, InferGetServerSidePropsType } from 'next'
import type { ServerProps, GameProps } from 'components/game/services/game'
import type { BasicLands } from 'types/definitions'
import GameHeader from 'components/game/GameHeader'
import GameLayout from 'components/game/GameLayout'
import Footer from 'components/base/Footer'
import Loader from 'components/base/Loader'
import LandsModal from 'components/game/subcomponents/LandsModal'
import HostModal from 'components/game/subcomponents/HostModal'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import { serverSideHandler } from 'backend/controllers/getGame.controller'
import useGameController from 'components/game/services/game.controller'


const Game: NextPage<ServerProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    game, player, players, playerIdx, isConnected, loadingPack,
    holding, isReady, pack, landModal, hostModal,
    toggleLandModal, toggleHostModal,
    nextRound, pickCard, swapCard, setLands
  } = useGameController(props)

  return (<>
    <SetPageTitle title={game?.name || ""} />
    <GameHeader game={game} players={players} playerIdx={playerIdx} holding={holding} openLands={toggleLandModal} openHost={toggleHostModal} />
    
    <BodyWrapperStyle>
      <Loader data={isConnected} message={props.error}>
        <GameLayout
          game={game as GameProps['options']}
          player={player as GameProps['player']}
          pack={pack} pickCard={pickCard} swapCard={swapCard}
          clickRoundBtn={isReady ? () => nextRound() : undefined}
          loadingPack={loadingPack}
        />
      </Loader>
    </BodyWrapperStyle>

    <Footer />

    {!!toggleLandModal && <LandsModal isOpen={landModal} setOpen={toggleLandModal} basics={player?.basics as BasicLands} onSubmit={setLands} /> }

    {!!toggleHostModal && <HostModal isOpen={hostModal} setOpen={toggleHostModal} />}
  </>)
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => serverSideHandler(ctx).then((props) => ({ props }))

export default Game