import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { fetcher } from '../../core/services/fetch.services'
import Loader from '../../components/base/Loader'
import Footer from '../../components/base/Footer'
import GameLayout from '../../components/game/GameLayout'
import GameHeader from '../../components/game/GameHeader'
import { BodyWrapperStyle, SetPageTitle } from '../../components/base/AppStyles'
import { Game } from '../../models/Game'

const Game: NextPage = () => {
  const router = useRouter()
  const { url } = router.query
  const { data, error } = useSWR(`/api/game/${url}/full`, fetcher<Game>)
  const sessId = '1a'
  const playerIdx = data && typeof data !== 'number' ? data.players.findIndex(({ sessionId }) => sessionId === sessId) : -1

  return (<>
    <SetPageTitle title={typeof data !== 'number' && data?.name ? data.name : "New Game"} />
    <GameHeader data={data} playerIdx={playerIdx} />
    
    <BodyWrapperStyle>
      <Loader data={data} error={error} message={!url || Array.isArray(url) ? `Invalid URL: ${url}` : playerIdx === -1 ? 'Player not found' : undefined}>
        <GameLayout data={data as Game} playerIdx={playerIdx} />
      </Loader>
    </BodyWrapperStyle>

    <Footer />
  </>)
}

export default Game
