import type { Dispatch, SetStateAction } from "react"
import type { BasicPlayer } from "types/game"
import type { GameLog } from "../log.controller"
import LogFilter from "./LogFilter"
import { ToolbarWrapper, FilterDropdown, SettingsDropdown, SettingToggle, SettingAction, LogoutLabel } from "./LogToolbarStyles"
import { logOptionLabels } from "assets/strings"
import { gameActionList, otherList, playerActionList } from "types/logs"

type Props = {
  gameLog: GameLog,
  players: BasicPlayer[],
  gameEnded: boolean,
  logout?: () => void,
  sidebarVisible?: boolean,
  setSidebar?: Dispatch<SetStateAction<boolean>>,
}

export default function LogToolbar({ gameLog, players, gameEnded, logout, sidebarVisible, setSidebar }: Props) {
  return (
    <ToolbarWrapper>
      <SettingsDropdown>
        {Object.keys(gameLog.options).map((key) => (key !== 'hidePrivate' || gameEnded) && (!logout || key !== 'hideWatchers') &&
          <SettingToggle key={key} label={logOptionLabels[key]} value={!gameLog.options[key]} setValue={(val) => gameLog.setOptions((opt) => ({ ...opt, [key]: !val }))} />
        )}
        { setSidebar && <SettingToggle label={logOptionLabels.showSidebar} value={sidebarVisible ?? false} setValue={setSidebar} /> }
        { logout && <SettingAction label={<LogoutLabel />} onClick={logout} /> }
      </SettingsDropdown>

      <FilterDropdown>
        <LogFilter label="Actions" buttons={playerActionList} baseList={gameLog.allActions} selected={gameLog.actions} setSelected={gameLog.setActions} invert={true} hideAll={true} />
        <LogFilter label=" "       buttons={gameActionList}   baseList={gameLog.allActions} selected={gameLog.actions} setSelected={gameLog.setActions} invert={true} offset={playerActionList.length}  />
        <LogFilter label="Players" buttons={players}          baseList={gameLog.allPlayers} selected={gameLog.players} setSelected={gameLog.setPlayers} hideAll={true} />
        <LogFilter label=""        buttons={otherList}        baseList={gameLog.allPlayers} selected={gameLog.players} setSelected={gameLog.setPlayers} invert={true}  />
      </FilterDropdown>
    </ToolbarWrapper>
  )
}
