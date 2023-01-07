import type { CubeFile, GameOptions } from "types/setup"
import type { SetFile } from "../services/cubeFile.controller"
import FilePreview from "./FilePreview"
import FileInput from "components/base/common/FormElements/FileInput"
import RangeInput from "components/base/common/FormElements/RangeInput"
import Spinner from "components/base/common/Spinner"
import { FieldWrapper, InputWrapper, PlayersLabel, PacksLabel, PackSizeLabel, HelpButton } from "../styles/FormStyles" 
import { fileSettings, setupLimits } from "assets/constants"
import { uploadHelp } from "assets/strings"

type Props = {
  options: GameOptions,
  file: CubeFile | null,
  fileLoading: boolean,
  setFile: SetFile,
  setPlayers: (value: string) => void,
  setPacks: (value: string) => void,
  setPackSize: (value: string) => void,
}

export default function CubeForm({ options, file, fileLoading, setFile, setPlayers, setPacks, setPackSize }: Props) {
  return (
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
  )
}