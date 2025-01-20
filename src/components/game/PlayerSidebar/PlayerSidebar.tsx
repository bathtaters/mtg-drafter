import type { Dispatch, ReactNode, SetStateAction } from "react"
import type { GameProps } from "types/game"
import { PlayerContainerSmall } from "../PlayerContainers/PlayerContainers"
import { Arrow, PlayerListWrapper, SidebarContainer, SidebarDrawerStyle, SidebarButton } from "./PlayerSidebarStyles"
import usePlayerSidebar, { getPlayerColor } from "./playersidebar.controller"


type Props = {
  game?: GameProps['options'],
  players: GameProps['players'],
  playerIdx: number,
  holding: number[],
  packSize: number,
  isOpen: boolean,
  setOpen?: Dispatch<SetStateAction<boolean>>,
  children?: ReactNode
}


export default function PlayerSidebar({ game, players, playerIdx, holding, packSize, isOpen, setOpen, children }: Props) {

  const { oppIdx, hideStats, passRight } = usePlayerSidebar(game, players, playerIdx)

  if (!game) return <div>{children}</div>

  return (
    <SidebarDrawerStyle isOpen={isOpen} overlayClick={setOpen && (() => setOpen(false))}
        sidebarContent={
            <SidebarContainer isOpen={isOpen} button={playerIdx < 0 ? undefined :
                <SidebarButton hide={players.length < 4} active={isOpen} onClick={setOpen && (() => setOpen((show) => !show))} />
            }>
                <Arrow isDown={passRight} />

                <PlayerListWrapper title="Pick Order">
                    { players.map((play, idx) =>

                        <PlayerContainerSmall
                            player={play} key={String(play.id)}
                            isHost={'hostId' in game ? game.hostId === play.id : false}
                            color={getPlayerColor(idx, playerIdx, oppIdx, game)}
                            holding={holding[idx]}
                            packSize={packSize}
                            hideStats={hideStats}
                            className="flex-shrink-0"
                        />
                        
                    )}
                </PlayerListWrapper>
            </SidebarContainer>
        }
    >
        {children}
    </SidebarDrawerStyle>
  )
}