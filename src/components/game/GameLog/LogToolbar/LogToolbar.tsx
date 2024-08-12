import type { BasicPlayer, LogOptions } from "types/game"
import type { GameLog } from "../log.controller"
import LogFilter from "./LogFilter"
import { ToolbarWrapper, FilterDropdown, SettingsDropdown, SettingToggle } from "./LogToolbarStyles"
import { gameActionList, otherList, playerActionList } from "../log.utils"
import { logOptionLabels } from "assets/strings"

type Props = { log: GameLog, players: BasicPlayer[], gameEnded: boolean }

export default function LogToolbar({ log, players, gameEnded }: Props) {
  return (
    <ToolbarWrapper>
      <SettingsDropdown>
        {Object.keys(log.options).map((key) => (key !== 'hidePrivate' || gameEnded) &&
          <SettingToggle key={key} label={logOptionLabels[key]} value={!log.options[key]} setValue={(val) => log.setOptions((opt) => ({ ...opt, [key]: !val }))} />
        )}
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
