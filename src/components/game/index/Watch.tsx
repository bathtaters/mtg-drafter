import { type ServerProps, WatcherTabs } from 'types/game'
import GameLogHeader from 'components/game/GameLog/GameLogHeader'
import GameLogWatch from 'components/game/GameLog/GameLogWatch'
import PackViewer from '../PackViewer/PackViewer'
import ContainerTabs from '../GameBody/ContainerTabs'
import LogToolbar from '../GameLog/LogToolbar/LogToolbar'
import CardToolbar from '../CardToolbar/CardToolbar'
import PlayerSidebar from '../PlayerSidebar/PlayerSidebar'
import Overlay from 'components/base/common/Overlay'
import Spinner from 'components/base/common/Spinner'
import Loader from 'components/base/Loader'
import Footer from 'components/base/Footer'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import { GameBodyHeader, GameBodyWrapper } from '../GameBody/GameBodyStyles'
import { TabToolbarWrapper } from '../GameLog/LogToolbar/LogToolbarStyles'
import useBasicGameController from './basic.controller'
import useLogWatch from '../GameLog/logWatch.controller'
import { useTabController } from '../GameBody/pick.controller'
import { banMsg } from 'assets/strings'


export default function Watch(props: ServerProps) {
  const {
    game, players, packs, maxPackSize, holding, gameLog, isBanned,
    sidebarVisible, setSidebar, loadingAll, newToast, ...basicProps
  } = useBasicGameController(props)
  
  const {
    selectedTab, selectTab, cardOptions, setCardOptions, pickInfo
  } = useTabController<WatcherTabs>(WatcherTabs.log, game, players, false)

  const watchProps = useLogWatch({ gameLog, game, sidebarVisible, setSidebar, ...basicProps })

  return (<>
    <SetPageTitle title={game?.name || ""} />

    <PlayerSidebar
      game={game} players={players} isHost={false} holding={holding} packSize={maxPackSize} playerIdx={-1}
      isOpen={sidebarVisible} setOpen={setSidebar || true}
    >
      <GameLogHeader game={game} />
      
      <BodyWrapperStyle>
        <Loader data={game || 404} message={props.error || (isBanned && banMsg)}>
          <GameBodyWrapper className={cardOptions.width}>
              <GameBodyHeader>
                <ContainerTabs tabs={WatcherTabs} selectedTab={selectedTab} selectTab={selectTab} hideTabs={[WatcherTabs.join]} />

                { selectedTab === WatcherTabs.pack ?
                  <CardToolbar setCardOptions={setCardOptions} clickReload={basicProps.reload} notify={newToast} />
                  :
                  <TabToolbarWrapper clickReload={basicProps.reload}>
                    <LogToolbar log={gameLog} players={players} gameEnded={true} logout={watchProps.logout} sidebarVisible={sidebarVisible} setSidebar={setSidebar} />
                  </TabToolbarWrapper>
                }
              </GameBodyHeader>
            
              { selectedTab === WatcherTabs.pack ?
                <PackViewer packs={packs} cardOptions={cardOptions} players={players} game={game} pickInfo={pickInfo} />
                :
                <GameLogWatch players={players} packs={packs} log={gameLog} disabled={!game?.watchKey} {...watchProps} />
              }
            </GameBodyWrapper>
        </Loader>
      </BodyWrapperStyle>
      
      <Footer />
    </PlayerSidebar>


    { !!loadingAll && <Overlay ><Spinner caption={loadingAll ? 'Loading...' : 'Reconnecting...'} /></Overlay> }
  </>)
}