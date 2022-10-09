import type { CubeFile } from "../services/setup"
import { PreviewContainer, PreviewWrapper, PreviewResult, PreviewError, NotFoundList, ClearButton } from "../styles/FilePreviewStyles"
import TextPad from "components/svgs/TextPad"

type Props = { file: CubeFile, clearFile: () => void }

const resultText = ({ accepted = [], rejected = [] }: Required<CubeFile>['data']) =>
  `Found ${accepted.length} of ${accepted.length + rejected.length} cards`


export default function FilePreview({ file, clearFile }: Props) {
  return (
    <PreviewContainer>
      <PreviewWrapper label={file.name}>
        {'error' in file ? <PreviewError error={file.error} /> :
        !!file.data && (
          <PreviewResult>
            <span>{resultText(file.data)}</span>
            <NotFoundList list={file.data.rejected} />
          </PreviewResult>
        )}
      </PreviewWrapper>

      <TextPad className="object-cover w-16 h-16 p-1 rounded-full bg-secondary fill-secondary-content" />

      <ClearButton label="Clear" onClick={clearFile} />
    </PreviewContainer>
  )
}