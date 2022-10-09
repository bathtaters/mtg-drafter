import FilePreview from "./subcomponents/FilePreview"
import FileInput from "components/base/common/FileInput"
import RangeInput from "components/base/common/RangeInput"
import Spinner from "components/base/common/Spinner"
import Overlay from "components/base/common/Overlay"
import { FormWrapper, FieldWrapper, InputWrapper, FormTitle, SubmitButton, ErrorText } from "./SetupStyles" 
import useSetupController from "./services/setup.controller"
import { fileType } from "./services/setup.utils"


export default function SetupForm() {
  const { options, file, fileLoading, setFile, submitForm, gameLoading, error, setName, setPlayers, setPacks, setPackSize } = useSetupController()

  return (
    <FormWrapper onSubmit={submitForm}>
      <FormTitle placeholder="New Draft" value={options.name} setValue={setName} />

      <InputWrapper>
        <FieldWrapper label="Options">
          <RangeInput label="Players"   min={1} max={12} value={options.players}  setValue={setPlayers}  />
          <RangeInput label="Packs"     min={1} max={5}  value={options.packs}    setValue={setPacks}    />
          <RangeInput label="Pack Size" min={1} max={20} value={options.packSize} setValue={setPackSize} />
        </FieldWrapper>

        <FieldWrapper label="Cube File">
          {fileLoading ? <Spinner /> :
          file ?
            <FilePreview file={file} clearFile={() => setFile(null)} />
            :
            <FileInput fileMimeType={fileType} helperText="DROP HERE" setFile={setFile} />
          }
        </FieldWrapper>
      </InputWrapper>
      
      <ErrorText>{error}</ErrorText>
      <SubmitButton disabled={!file}>Start Draft</SubmitButton>

      <Overlay hide={!gameLoading}><Spinner /></Overlay>
    </FormWrapper>
  )
}