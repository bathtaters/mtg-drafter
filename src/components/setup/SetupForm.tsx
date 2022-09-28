import { useState, useCallback } from "react"
import { FormWrapper, FieldWrapper, InputWrapper, FormTitle, SubmitButton } from "./SetupStyles" 
import RangeInput from "./subcomponents/RangeInput"
import FileInput from "./subcomponents/FileInput"
import FilePreview from "./subcomponents/FilePreview"

const defaultOptions = { players: "8", packs: "3", packSize: "15" }


export default function SetupForm() {
  const [ options, setOptions ] = useState(defaultOptions)
  const [ textFile, setFile ] = useState<File | null>(null)

  const setPlayers  = useCallback((value: string) => setOptions((curr) => ({ ...curr, players: value  })), [setOptions])
  const setPacks    = useCallback((value: string) => setOptions((curr) => ({ ...curr, packs: value    })), [setOptions])
  const setPackSize = useCallback((value: string) => setOptions((curr) => ({ ...curr, packSize: value })), [setOptions])

  return (
    <FormWrapper>
      <FormTitle placeholder="New Draft" />

      <InputWrapper>
        <FieldWrapper label="Options">
          <RangeInput label="Players"   min={1} max={12} value={options.players}  setValue={setPlayers}  />
          <RangeInput label="Packs"     min={1} max={5}  value={options.packs}    setValue={setPacks}    />
          <RangeInput label="Pack Size" min={1} max={20} value={options.packSize} setValue={setPackSize} />
        </FieldWrapper>

        <FieldWrapper label="Cube File">
          {textFile ?
            <FilePreview file={textFile} clearFile={() => setFile(null)} />
            :
            <FileInput helperText="DROP HERE" setFile={setFile} />
          }
        </FieldWrapper>
      </InputWrapper>

      <SubmitButton>Start Draft</SubmitButton>
    </FormWrapper>
  )
}