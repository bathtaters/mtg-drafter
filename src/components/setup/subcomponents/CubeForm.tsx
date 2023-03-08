import type { CubeFile, GameOptions } from "types/setup"
import type { SetFile } from "../services/cubeFile.controller"
import FilePreview from "./FilePreview"
import FileInput from "components/base/common/FormElements/FileInput"
import RangeInput from "components/base/common/FormElements/RangeInput"
import Spinner from "components/base/common/Spinner"
import { FieldWrapper, InputWrapper, PlayersLabel, PacksLabel, PackSizeLabel, HelpButton, TimerLabel } from "../styles/FormStyles" 
import { fileSettings, setupLimits } from "assets/constants"
import { timerLabels, uploadHelp } from "assets/strings"

type Props = {
  options: GameOptions,
  file: CubeFile | null,
  fileLoading: boolean,
  setFile: SetFile,
  setOption: {
    players: (value: string) => void,
    timer: (value: string) => void,
    packs: (value: string) => void,
    packSize: (value: string) => void,
  }
}

export default function CubeForm({ options, setOption, file, fileLoading, setFile }: Props) {
  return (
      <InputWrapper>
        <FieldWrapper label="Options">
          <RangeInput caption={<PlayersLabel />}  value={options.players}  setValue={setOption.players}  {...setupLimits.players}  />
          <RangeInput caption={<PacksLabel />}    value={options.packs}    setValue={setOption.packs}    {...setupLimits.packs}    />
          <RangeInput caption={<PackSizeLabel />} value={options.packSize} setValue={setOption.packSize} {...setupLimits.packSize} />
          <RangeInput caption={<TimerLabel />}    value={options.timer}    setValue={setOption.timer}    {...setupLimits.timer}  
            keys={timerLabels} boxClass="w-16" />
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