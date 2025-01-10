import type { ServerProps } from 'types/game'
import GameLogHeader from 'components/game/GameLog/GameLogHeader'
import GameLogWatch from 'components/game/GameLog/GameLogWatch'
import PlayerSidebar from '../PlayerSidebar/PlayerSidebar'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import Loader from 'components/base/Loader'
import Footer from 'components/base/Footer'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import useBasicGameController from './basic.controller'


export default function Watch(props: ServerProps) {
  const {
    game, players, sessionId, maxPackSize, holding, gameLog, sidebarVisible, setSidebar, loadingAll, setLoadingAll, reload,
  } = useBasicGameController(props)

  return (<>
    <SetPageTitle title={game?.name || ""} />

    <PlayerSidebar
      game={game} players={players} holding={holding} packSize={maxPackSize} playerIdx={-1}
      isOpen={sidebarVisible} setOpen={setSidebar || true}
    >
      <GameLogHeader game={game} />
      
      <BodyWrapperStyle>
        <Loader data={game || 404} message={props.error}>
          <GameLogWatch
            game={game}
            players={players}
            log={gameLog}
            sessionId={sessionId}
            gameEnded={true}
            reload={reload}
            setLoading={setLoadingAll}
            sidebarVisible={sidebarVisible}
            setSidebar={setSidebar}
          />
        </Loader>
      </BodyWrapperStyle>
    </PlayerSidebar>

    <Footer />

    { !!loadingAll && <Overlay ><Spinner caption={loadingAll ? 'Loading...' : 'Reconnecting...'} /></Overlay> }
  </>)
}