import type { ServerProps } from 'types/game'
import GameLogHeader from 'components/game/GameLog/GameLogHeader'
import GameLogWatch from 'components/game/GameLog/GameLogWatch'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import Loader from 'components/base/Loader'
import Footer from 'components/base/Footer'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import useBasicGameController from './basic.controller'


export default function Watch(props: ServerProps) {
  const {
    game, players, sessionId, maxPackSize, holding, gameLog, loadingAll, setLoadingAll, reload,
  } = useBasicGameController(props)

  return (<>
    <SetPageTitle title={game?.name || ""} />

    <GameLogHeader game={game} players={players} holding={holding} packSize={maxPackSize} />
    
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
        />
      </Loader>
    </BodyWrapperStyle>

    <Footer />

    { !!loadingAll && <Overlay ><Spinner caption={loadingAll ? 'Loading...' : 'Reconnecting...'} /></Overlay> }
  </>)
}