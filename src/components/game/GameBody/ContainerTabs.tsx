import type { PlayerFull } from 'types/game.d'
import { GameCard, TabLabels } from '@prisma/client'
import { TabsWrapper, TabStyle } from './GameLayoutStyles'
import { getBoard } from '../shared/game.utils'
import { cardCounter } from 'assets/strings'
import { HoverAction, useHoverClick } from 'components/base/libs/hooks'

type Props = {
  pack?: GameCard[],
  player: PlayerFull,
  selectedTab: TabLabels,
  selectTab: (tab: TabLabels) => void,
  hidePack?: boolean,
}

const allLabels = Object.values(TabLabels)
const labelsMinusPack = allLabels.slice(1)

export default function ContainerTabs({ pack, player, selectedTab, selectTab, hidePack }: Props) {
  const tabs = hidePack ? labelsMinusPack : allLabels

  const mouseHandler = useHoverClick<TabLabels>((state, label) => state && label && selectTab(label))
  
  return (
    <TabsWrapper>
      {tabs.map((label) =>
        <TabStyle
          key={label} label={label}
          isSelected={selectedTab === label}
          onClick={mouseHandler(label)}
          count={cardCounter(label === 'pack' ? pack?.length : getBoard(player.cards, label).length, player.basics[label])}
        />
      )}
    </TabsWrapper>
  )
}
