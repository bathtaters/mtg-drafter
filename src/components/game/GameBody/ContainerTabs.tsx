import type { GameCard } from '@prisma/client'
import type { PlayerFull } from 'types/game.d'
import { TabLabels } from 'types/game.d'
import { TabsWrapper, TabStyle } from './GameLayoutStyles'
import { getBoard } from '../shared/game.utils'
import { cardCounter } from 'assets/strings'

type Props = {
  pack?: GameCard[],
  player: PlayerFull,
  selectedTab: TabLabels,
  selectTab: (tab: TabLabels) => void,
  hidePack?: boolean,
}


export default function ContainerTabs({ pack, player, selectedTab, selectTab, hidePack }: Props) {
  const tabs = hidePack ? TabLabels.slice(1) : TabLabels

  return (
    <TabsWrapper>
      {tabs.map((label) =>
        <TabStyle
          key={label} label={label}
          isSelected={selectedTab === label}
          onClick={() => selectTab(label)}
          count={cardCounter(label === 'pack' ? pack?.length : getBoard(player.cards, label).length, player.basics[label])}
        />
      )}
    </TabsWrapper>
  )
}
