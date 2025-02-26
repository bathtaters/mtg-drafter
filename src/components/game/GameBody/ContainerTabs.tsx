import { type PlayerFull, TabLabels } from 'types/game'
import { TabsWrapper, TabStyle } from './GameBodyStyles'
import { getBoard } from '../shared/game.utils'
import { cardCounter } from 'assets/strings'

type Props<Tabs extends string> = {
  tabs: Record<string, Tabs>,
  selectedTab: Tabs,
  selectTab: (tab: Tabs) => void,
  hideTabs?: Tabs[],
  badges?: Partial<Record<Tabs, string>>,
}

export const getTabBadges = (player?: PlayerFull, packCount?: number) => player && ({
  pack: packCount?.toString(),
  main: cardCounter(getBoard(player.cards, TabLabels.main).length, player.basics[TabLabels.main]),
  side: cardCounter(getBoard(player.cards, TabLabels.side).length, player.basics[TabLabels.side]),
})

export default function ContainerTabs<Tabs extends string>({ tabs, selectedTab, selectTab, hideTabs, badges }: Props<Tabs>) {
  const visibleTabs = !hideTabs ? Object.values(tabs) : Object.values(tabs).filter((tab) => !hideTabs.includes(tab))
  
  return (
    <TabsWrapper>
      {visibleTabs.map((label) => 
        <TabStyle
          key={label} label={label}
          isSelected={selectedTab === label}
          onClick={() => selectTab(label)}
          badge={badges?.[label]}
        />
      )}
    </TabsWrapper>
  )
}
