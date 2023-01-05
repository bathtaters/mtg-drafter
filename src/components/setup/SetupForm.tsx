import FilePreview from "./subcomponents/FilePreview"
import FileInput from "components/base/common/FormElements/FileInput"
import RangeInput from "components/base/common/FormElements/RangeInput"
import Spinner from "components/base/common/Spinner"
import Overlay from "components/base/common/Overlay"
import { FormWrapper, FieldWrapper, InputWrapper, FormTitle, SubmitButton, ErrorText, PlayersLabel, PacksLabel, PackSizeLabel, HelpButton } from "./styles/SetupStyles" 
import useSetupController from "./services/setup.controller"
import { fileSettings, setupLimits } from "assets/constants"
import { uploadHelp } from "assets/strings"


export default function SetupForm() {
  const { options, file, fileLoading, setFile, submitForm, gameLoading, error, setName, setPlayers, setPacks, setPackSize } = useSetupController()

  return (
    <FormWrapper onSubmit={submitForm}>
      <FormTitle placeholder="Enter Title" value={options.name} setValue={setName} />

      <InputWrapper>
        <FieldWrapper label="Options">
          <RangeInput caption={<PlayersLabel />}  value={options.players}  setValue={setPlayers}  {...setupLimits.players}  />
          <RangeInput caption={<PacksLabel />}    value={options.packs}    setValue={setPacks}    {...setupLimits.packs}    />
          <RangeInput caption={<PackSizeLabel />} value={options.packSize} setValue={setPackSize} {...setupLimits.packSize} />
        </FieldWrapper>

        <FieldWrapper label="Cube File">
          { !file && !fileLoading && <HelpButton tip={uploadHelp} /> }
          {fileLoading ? <Spinner /> :
          file ?
            <FilePreview file={file} clearFile={() => setFile(null)} />
            :
            <FileInput fileMimeType={fileSettings.type} helperText="DROP HERE" setFile={setFile} />
          }
        </FieldWrapper>
      </InputWrapper>
      
      <ErrorText>{error}</ErrorText>
      <SubmitButton disabled={!file || !options.name}>Start Draft ▶</SubmitButton>

      <Overlay hide={!gameLoading}><Spinner /></Overlay>
    </FormWrapper>
  )
}