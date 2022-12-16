import useTextEditor, { EditorProps } from "./services/textEditor.controller"
import { EditWrapper, StaticWrapper, TextBox, EditButton } from "./styles/TextEditorStyles"

export type Props = EditorProps & { className?: string }

export default function TextEditor(props: Props) {
  const { text, isEditing, canSave, charLimit, handleSubmit, handleCancel, handleChange, handleKeypress, enableEdit } = useTextEditor(props)

  return isEditing ?
    <EditWrapper>
      <TextBox value={text} onChange={handleChange} onKeyUp={handleKeypress} className={props.className} {...charLimit} />
      <EditButton value="✕" className="btn-error"   onClick={handleCancel} />
      <EditButton value="✓" className="btn-success" onClick={handleSubmit} disabled={!canSave} />
    </EditWrapper> :
    <StaticWrapper onClick={enableEdit}>{text}</StaticWrapper>
}