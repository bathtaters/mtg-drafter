import type { GameOptions, BoosterBasic } from "types/setup"
import { Fragment } from "react"
import RangeInput from "components/base/common/FormElements/RangeInput"
import ToggleSwitch from "components/base/common/FormElements/ToggleSwitch"
import { FieldWrapper, InputWrapper, PlayersLabel, PackButton, PackButtonWrapper, PacksWrapper, PackSelector, TimerLabel, BasicsLabel } from "../styles/FormStyles" 
import { hideBoosterNames, setupLimits } from "assets/constants"
import { timerLabels } from "assets/strings"
import { getBoosterCode } from "backend/services/setup/sets.services"
import { hyphenToTitle } from "components/base/services/common.services"

type Props = {
  setList: BoosterBasic[]
  options: GameOptions,
  setOption: {
    players: (value: string) => void,
    timer: (value: string) => void,
    packList: (value: string[]) => void,
    basics: (value: boolean) => void,
  }
  setPack: (idx: number) => (code: string) => void,
  addPack: false | (() => void),
  rmvPack: false | (() => void),
}

export default function BoosterForm({ setList, options, setOption, setPack, addPack, rmvPack }: Props) {
  return (
      <InputWrapper>
        <FieldWrapper label="Options">
          <RangeInput caption={<PlayersLabel />}  value={options.players}  setValue={setOption.players}  {...setupLimits.players}  />
          <RangeInput caption={<TimerLabel />}    value={options.timer}    setValue={setOption.timer}    {...setupLimits.timer}  
            keys={timerLabels} boxClass="w-16" />
          <ToggleSwitch label={<BasicsLabel />}   value={options.basics}   setValue={setOption.basics} />
        </FieldWrapper>

        <FieldWrapper label="Packs">
          <PacksWrapper>
            {options.packList.map((boosterCode,idx) => (

              <PackSelector key={idx} selected={boosterCode} setSelected={setPack(idx)}>
                {setList.map(({ set, boosterType }) =>
                  <Fragment key={getBoosterCode(set, boosterType)}>
                    {set.name}{
                      boosterType && hideBoosterNames.includes(boosterType) ? '' : ` (${hyphenToTitle(boosterType)} Pack)`
                    }
                  </Fragment>
                )}
              </PackSelector>
            ))}

            <PackButtonWrapper>
              {addPack && <PackButton onClick={addPack}>+</PackButton>}
              {rmvPack && <PackButton onClick={rmvPack}>-</PackButton>}
            </PackButtonWrapper>
            
          </PacksWrapper>
        </FieldWrapper>
      </InputWrapper>
  )
}