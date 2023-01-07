import type { CardSet } from "@prisma/client"
import type { GameOptions } from "types/setup"
import { Fragment } from "react"
import RangeInput from "components/base/common/FormElements/RangeInput"
import { FieldWrapper, InputWrapper, PlayersLabel, PackButton, PackButtonWrapper, PacksWrapper, PackSelector } from "../styles/FormStyles" 
import { spliceInPlace } from "components/base/services/common.services"
import { setupLimits } from "assets/constants"

type Props = {
  setList: CardSet[]
  options: GameOptions,
  setPlayers: (value: string) => void,
  setPackList: (value: string[]) => void,
}

export default function BoosterForm({ setList, options, setPlayers, setPackList }: Props) {
  const setPack = (idx: number) => (code: string) => setPackList(spliceInPlace(options.packList,idx,1,code))
  const addPack = options.packList.length < setupLimits.packs.max && (() => setPackList(options.packList.concat(options.packList[options.packList.length - 1] || setList[0].code)))
  const rmvPack = options.packList.length > setupLimits.packs.min && (() => setPackList(options.packList.slice(0,options.packList.length - 1)))

  return (
      <InputWrapper>
        <FieldWrapper label="Options">
          <RangeInput caption={<PlayersLabel />}  value={options.players}  setValue={setPlayers}  {...setupLimits.players}  />
        </FieldWrapper>

        <FieldWrapper label="Packs">
          <PacksWrapper>
            {options.packList.map((setCode,idx) => (

              <PackSelector selected={setCode} setSelected={setPack(idx)}>
                {setList.map(({ name, code }) => <Fragment key={code}>{name}</Fragment>)}
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