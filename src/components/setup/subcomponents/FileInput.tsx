import { NativeTypes } from "react-dnd-html5-backend"
import TextPad from "../../svgs/TextPad"
import DragBlock from "../../base/DragDrop/DragBlock"
import { useCallback } from "react"
import { DropHandler, DropTester } from "../../base/DragDrop/services/dragBlock.controller"

const fileType = "text/plain" as const

export default function FileInput({ helperText, setFile }: { helperText?: string, setFile?: (file: File) => void }) {
  const dropCheck = useCallback<DropTester>((_, item: any) => item.items.length ? item.items[0].type === fileType : null, [])
  const onDrop = useCallback<DropHandler>((item: any) => setFile && item.files?.[0] && setFile(item.files[0]), [setFile])

  return (
    <DragBlock
      className="flex-grow flex flex-col justify-center items-center gap-8 rounded-lg py-8"
      type={NativeTypes.FILE} item="FileBox" draggable={false}
      dropCheck={dropCheck}
      onDrop={onDrop}
    >

      {helperText && <div className="text-lg -mb-4 text-secondary">{helperText}</div>}

      <TextPad className="object-cover w-16 h-16 p-1 rounded-full bg-secondary fill-secondary-content" />

      <label className="block w-5/6">
        <span className="sr-only">Choose File</span>

        <input type="file"
          className="block w-full text-sm text-secondary bg-secondary-content rounded-xl file:btn file:btn-secondary file:mr-4"
          accept={fileType} required={true}
          onChange={setFile ? (ev) => ev.target.files?.[0] && setFile(ev.target.files[0]) : undefined}
        />
        
      </label>

    </DragBlock>
  )
}