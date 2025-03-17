import type { ReactNode } from 'react'
import type { BasicController } from '../index/basic.controller'
import { WatcherTabs } from 'types/game'
import GameLog from 'components/game/GameLog/GameLog'
import PackViewer from '../PackViewer/PackViewer'
import LogToolbar from '../GameLog/LogToolbar/LogToolbar'
import CardToolbar from '../CardToolbar/CardToolbar'
import ContainerTabs from '../GameBody/ContainerTabs'
import PasswordForm from 'components/base/common/FormElements/PasswordForm'
import { WatchBodyHeader, WatchBodyWrapper, TabToolbarWrapper, WatchGameLogWrapper, ErrorContainer } from './WatchBodyStyles'
import useWatchController, { type Props as LogWatchProps } from './watch.controller'

export type Props = Pick<BasicController, "players"|"packs"|"newToast"> & LogWatchProps & { children?: ReactNode }

export default function WatchBody({ children, ...props }: Props) {
  
  const {
    pickInfo, packViewData,
    watchDisabled, authed, message, login, logout,
    selectedTab, selectTab, cardOptions, setCardOptions,
  } = useWatchController(props)

  return (
    <WatchBodyWrapper className={cardOptions.width}>
      <WatchBodyHeader hide={!authed}>
        <ContainerTabs tabs={WatcherTabs} selectedTab={selectedTab} selectTab={selectTab} hideTabs={props.isHost && children ? [] : [WatcherTabs.join]} />

        { selectedTab === WatcherTabs.cards ?
          <CardToolbar setCardOptions={setCardOptions} clickReload={props.reload} notify={props.newToast} />
          :
          <TabToolbarWrapper clickReload={props.reload}>
            <LogToolbar {...props} gameEnded={true} logout={logout} />
          </TabToolbarWrapper>
        }
      </WatchBodyHeader>
      
      {/* Body */}
      { !authed ?
        <WatchGameLogWrapper>{
          watchDisabled ?
            <ErrorContainer text="Observing this game has been disabled by the host." /> :
            <PasswordForm label="Enter Password" message={message} onSubmit={login} fullPage={true} />
        }</WatchGameLogWrapper>

        : selectedTab === WatcherTabs.log ?
        <WatchGameLogWrapper><GameLog {...props} /></WatchGameLogWrapper>

        : selectedTab === WatcherTabs.cards ?
        <PackViewer data={packViewData} cardOptions={cardOptions} pickInfo={pickInfo} {...props}  />

        : /* selectedTab === join */
        <WatchGameLogWrapper>{children}</WatchGameLogWrapper>
      }
    </WatchBodyWrapper>
  )
}
