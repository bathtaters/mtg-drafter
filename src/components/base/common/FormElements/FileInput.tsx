import { useCallback, FormEvent } from "react"
import { NativeTypes } from "react-dnd-html5-backend"
import DragBlock, { DropHandler, DropTester } from "components/base/DragDrop/DragBlock"
import { HelperText, InputWrapper, InputElem, fileWrapperClass, textPadClass } from "./styles/FileInputStyles"
import TextPad from "components/svgs/TextPad"

type Props = { helperText?: string, fileMimeType?: string, setFile?: (file: File) => void }

export default function FileInput({ helperText, setFile, fileMimeType }: Props) {
  const dropCheck = useCallback<DropTester>((_, item: any) => item.items.length ? item.items[0].type === fileMimeType : null, [])
  const onDrop = useCallback<DropHandler>((item: any) => setFile && item.files?.[0] && setFile(item.files[0]), [setFile])

  const fileChangeHandler = !setFile ? undefined :
    (ev: FormEvent<HTMLInputElement>) => ev.currentTarget.files?.[0] && setFile(ev.currentTarget.files[0])

  return (
    <DragBlock
      className={fileWrapperClass}
      type={NativeTypes.FILE} item="FileBox" draggable={false}
      dropCheck={dropCheck}
      onDrop={onDrop}
    >
      <HelperText text={helperText} />

      <TextPad className={textPadClass} showArrow={true} />

      <InputWrapper label="Choose File">
        <InputElem accept={fileMimeType} required={true} onChange={fileChangeHandler} />
      </InputWrapper>

    </DragBlock>
  )
}