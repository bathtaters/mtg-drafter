import type { GameOptions, SetBasic } from "types/setup"
import { Fragment } from "react"
import RangeInput from "components/base/common/FormElements/RangeInput"
import ToggleSwitch from "components/base/common/FormElements/ToggleSwitch"
import { FieldWrapper, InputWrapper, PlayersLabel, PackButton, PackButtonWrapper, PacksWrapper, PackSelector, TimerLabel, BasicsLabel } from "../styles/FormStyles" 
import { spliceInPlace } from "components/base/services/common.services"
import { setupLimits } from "assets/constants"
import { timerLabels } from "assets/strings"

type Props = {
  setList: SetBasic[]
  options: GameOptions,
  setPlayers: (value: string) => void,
  setTimer: (value: string) => void,
  setPackList: (value: string[]) => void,
  setBasics: (value: boolean) => void,
}

export default function BoosterForm({ setList, options, setPlayers, setTimer, setPackList, setBasics }: Props) {
  const setPack = (idx: number) => (code: string) => setPackList(spliceInPlace(options.packList,idx,1,code))
  const addPack = options.packList.length < setupLimits.packs.max && (() => setPackList(options.packList.concat(options.packList[options.packList.length - 1] || setList[0].code)))
  const rmvPack = options.packList.length > setupLimits.packs.min && (() => setPackList(options.packList.slice(0,options.packList.length - 1)))

  return (
      <InputWrapper>
        <FieldWrapper label="Options">
          <RangeInput caption={<PlayersLabel />}  value={options.players}  setValue={setPlayers}  {...setupLimits.players}  />
          <RangeInput caption={<TimerLabel />}    value={options.timer}    setValue={setTimer}    {...setupLimits.timer}  
            keys={timerLabels} boxClass="w-16" />
          <ToggleSwitch label={<BasicsLabel />} value={options.includeBasics} setValue={setBasics} />
        </FieldWrapper>

        <FieldWrapper label="Packs">
          <PacksWrapper>
            {options.packList.map((setCode,idx) => (

              <PackSelector key={idx} selected={setCode} setSelected={setPack(idx)}>
                {setList.map(({ name, code, boosterType }) =>
                  <Fragment key={code}>{name}{boosterType !== 'default' ? ` (${boosterType})` : ''}</Fragment>
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