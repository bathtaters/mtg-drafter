import type { Player } from "@prisma/client"
import type { LogOptions } from "types/game"
import type { GameLog } from "../log.controller"
import LogFilter from "./LogFilter"
import { ToolbarWrapper, FilterDropdown, SettingsDropdown, SettingToggle } from "./LogToolbarStyles"
import { gameActionList, otherList, playerActionList } from "../log.utils"
import { logOptionLabels } from "assets/strings"

type Props = { log: GameLog, players: Player[] }

export default function LogToolbar({ log, players }: Props) {
  return (
    <ToolbarWrapper>
      <SettingsDropdown>
        {(Object.keys(log.options) as Array<keyof LogOptions>).map((key) =>
          <SettingToggle key={key} label={logOptionLabels[key]} value={!log.options[key]} setValue={(val) => log.setOptions((opt) => ({ ...opt, [key]: !val }))} />
        )}
      </SettingsDropdown>

      <FilterDropdown>
        <LogFilter label="Actions" buttons={playerActionList} baseList={log.actionBase} selected={log.actions} setSelected={log.setActions} invert={true} hideAll={true} />
        <LogFilter label=" "       buttons={gameActionList}   baseList={log.actionBase} selected={log.actions} setSelected={log.setActions} invert={true} offset={playerActionList.length}  />
        <LogFilter label="Players" buttons={players}          baseList={log.playerBase} selected={log.players} setSelected={log.setPlayers} hideAll={true} />
        <LogFilter label=""        buttons={otherList}        baseList={log.playerBase} selected={log.players} setSelected={log.setPlayers} invert={true}  />
      </FilterDropdown>
    </ToolbarWrapper>
  )
}
