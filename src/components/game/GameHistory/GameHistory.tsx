import type { GameHistoryServerSideProps } from "types/game"
import GameHeaderBase from "../GameHeader/GameHeaderBase"
import Footer from 'components/base/Footer'
import Loader from 'components/base/Loader'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import { GameSelectContainer, GameHistoryWrapper, GameButton } from "./GameHistoryStyles"
import { NoGames } from "assets/strings"
import { gameURL } from "assets/urls"


export default function GameHistory({ games, error }: GameHistoryServerSideProps) {
  return (<>
    <SetPageTitle title="My Games" />

    <GameHeaderBase label="My Games" rightChild="Local User Game History" />
    
    <BodyWrapperStyle>
      <Loader data={games || 404} message={error}>
        <GameSelectContainer>
          {games?.length ? 
            <GameHistoryWrapper>
              { games.map(({ id, name, player, url, hostId }) => 
                <GameButton
                  key={id}
                  game={name}
                  player={player?.name}
                  isHost={hostId === player?.id}
                  link={gameURL(url)}
                />
              ) }
            </GameHistoryWrapper>
            :
            <NoGames />
          }
        </GameSelectContainer>
      </Loader>
    </BodyWrapperStyle>

    <Footer />
  </>)
}