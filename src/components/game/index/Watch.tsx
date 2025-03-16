import type { ServerProps } from 'types/game'
import WatchBody from '../WatchBody/WatchBody'
import WatchHeader from '../WatchBody/WatchHeader'
import PlayerSidebar from '../PlayerSidebar/PlayerSidebar'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import Loader from 'components/base/Loader'
import Footer from 'components/base/Footer'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import useBasicGameController from './basic.controller'
import { banMsg } from 'assets/strings'


export default function Watch(props: ServerProps) {
  const {
    game, players, sidebarVisible, setSidebar,
    maxPackSize, holding, isBanned, loadingAll, ...basicProps
  } = useBasicGameController(props)

  return (<>
    <SetPageTitle title={game?.name || ""} />

    <PlayerSidebar
      game={game} players={players} forceShow={true} holding={holding} packSize={maxPackSize} playerIdx={-1}
      isOpen={sidebarVisible} setOpen={setSidebar || true}
    >
      <WatchHeader game={game} />
      
      <BodyWrapperStyle>
        <Loader data={game || 404} message={props.error || (isBanned && banMsg)}>
          <WatchBody game={game} players={players} setSidebar={setSidebar} {...basicProps} />
        </Loader>
      </BodyWrapperStyle>
      
      <Footer />
    </PlayerSidebar>


    { !!loadingAll && <Overlay ><Spinner caption={loadingAll ? 'Loading...' : 'Reconnecting...'} /></Overlay> }
  </>)
}
