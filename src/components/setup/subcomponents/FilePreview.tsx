import TextPad from "../../svgs/TextPad"

export default function FilePreview({ file, clearFile }: { file: File, clearFile: () => void }) {
  return (
    <div className="flex-grow flex flex-col justify-center items-center gap-8 rounded-lg py-8">
      <div className="text-lg -mb-4 text-secondary">

        <div className="w-full text-center">{file.name}</div>

        <div className="w-full text-center text-xs text-secondary-focus italic">{file.size} bytes</div>

      </div>

      <TextPad className="object-cover w-16 h-16 p-1 rounded-full bg-secondary fill-secondary-content" />

      <button type="button" className="block w-1/2 btn btn-secondary btn-sm" onClick={clearFile}>
        Clear
      </button>

    </div>
  )
}