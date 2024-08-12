import type { ServerProps } from 'types/game'
import GameLogHeader from 'components/game/GameLog/GameLogHeader'
import GameLogPage from 'components/game/GameLog/GameLogWatch'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import Loader from 'components/base/Loader'
import Footer from 'components/base/Footer'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import useGameController from 'components/game/index/game.controller'


export default function Watch(props: ServerProps) {
  const {
    game, players, isConnected, loadingAll, maxPackSize, holding, gameLog, setLoadingAll,
  } = useGameController(props)

  return (<>
    <SetPageTitle title={game?.name || ""} />

    <GameLogHeader game={game} players={players} holding={holding} packSize={maxPackSize} />
    
    <BodyWrapperStyle>
      <Loader data={game || 404} message={props.error}>
        <GameLogPage log={gameLog} players={players} gameEnded={true} game={game} setLoading={setLoadingAll} />
      </Loader>
    </BodyWrapperStyle>

    <Footer />

    { (!!loadingAll || !isConnected) && <Overlay ><Spinner caption={loadingAll ? 'Loading...' : 'Reconnecting...'} /></Overlay> }
  </>)
}