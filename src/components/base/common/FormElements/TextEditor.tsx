import useTextEditor, { EditorProps } from "./services/textEditor.controller"
import { EditWrapper, StaticWrapper, TextBox, EditButton } from "./styles/TextEditorStyles"

export default function TextEditor(props: EditorProps & { className?: string }) {
  const { text, isEditing, canSave, charLimit, handleSubmit, handleCancel, handleChange, enableEdit } = useTextEditor(props)

  return isEditing ?
    <EditWrapper>
      <TextBox value={text} onChange={handleChange} className={props.className} {...charLimit} />
      <EditButton value="✕" className="btn-error"   onClick={handleCancel} />
      <EditButton value="✓" className="btn-success" onClick={handleSubmit} disabled={!canSave} />
    </EditWrapper> :
    <StaticWrapper onClick={enableEdit}>{text}</StaticWrapper>
}

export type Props = EditorProps