import { Game, PackFull, type PlayerFull, TabLabels } from 'types/game'
import { GameCard } from '@prisma/client'
import { TabsWrapper, TabStyle } from './GameBodyStyles'
import { getBoard } from '../shared/game.utils'
import { cardCounter } from 'assets/strings'

type Props = {
  packCount?: number,
  player: PlayerFull,
  selectedTab: TabLabels,
  selectTab: (tab: TabLabels) => void,
  hidePack?: boolean,
}

export const allLabels = Object.values(TabLabels)
export const labelsMinusPack = allLabels.slice(1)

export default function ContainerTabs({ packCount, player, selectedTab, selectTab, hidePack }: Props) {
  const tabs = hidePack ? labelsMinusPack : allLabels
  
  return (
    <TabsWrapper>
      {tabs.map((label) => 
        <TabStyle
          key={label} label={label}
          isSelected={selectedTab === label}
          onClick={() => selectTab(label)}
          count={cardCounter(label === 'pack' ? packCount : getBoard(player.cards, label).length, player.basics[label])}
        />
      )}
    </TabsWrapper>
  )
}
