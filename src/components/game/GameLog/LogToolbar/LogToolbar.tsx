import type { Dispatch, SetStateAction } from "react"
import type { BasicPlayer } from "types/game"
import type { GameLog } from "../log.controller"
import LogFilter from "./LogFilter"
import { ToolbarWrapper, FilterDropdown, SettingsDropdown, SettingToggle, SettingAction, LogoutLabel } from "./LogToolbarStyles"
import { logOptionLabels } from "assets/strings"
import { gameActionList, otherList, playerActionList } from "types/logs"

type Props = {
  log: GameLog,
  players: BasicPlayer[],
  gameEnded: boolean,
  logout?: () => void,
  sidebarVisible?: boolean,
  setSidebar?: Dispatch<SetStateAction<boolean>>,
}

export default function LogToolbar({ log, players, gameEnded, logout, sidebarVisible, setSidebar }: Props) {
  return (
    <ToolbarWrapper>
      <SettingsDropdown>
        {Object.keys(log.options).map((key) => (key !== 'hidePrivate' || gameEnded) && (!logout || key !== 'hideWatchers') &&
          <SettingToggle key={key} label={logOptionLabels[key]} value={!log.options[key]} setValue={(val) => log.setOptions((opt) => ({ ...opt, [key]: !val }))} />
        )}
        { setSidebar && <SettingToggle label={logOptionLabels.showSidebar} value={sidebarVisible ?? false} setValue={setSidebar} /> }
        { logout && <SettingAction label={<LogoutLabel />} onClick={logout} /> }
      </SettingsDropdown>

      <FilterDropdown>
        <LogFilter label="Actions" buttons={playerActionList} baseList={log.allActions} selected={log.actions} setSelected={log.setActions} invert={true} hideAll={true} />
        <LogFilter label=" "       buttons={gameActionList}   baseList={log.allActions} selected={log.actions} setSelected={log.setActions} invert={true} offset={playerActionList.length}  />
        <LogFilter label="Players" buttons={players}          baseList={log.allPlayers} selected={log.players} setSelected={log.setPlayers} hideAll={true} />
        <LogFilter label=""        buttons={otherList}        baseList={log.allPlayers} selected={log.players} setSelected={log.setPlayers} invert={true}  />
      </FilterDropdown>
    </ToolbarWrapper>
  )
}
