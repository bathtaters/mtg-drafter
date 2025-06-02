import useTextEditor, { EditorProps } from "./services/textEditor.controller";
import {
  EditWrapper,
  StaticWrapper,
  TextBox,
  EditButton,
} from "./styles/TextEditorStyles";

export type Props = EditorProps & { className?: string };

export default function TextEditor(props: Props) {
  const {
    text,
    isEditing,
    canSave,
    charLimit,
    handleSubmit,
    handleCancel,
    handleChange,
    handleKeypress,
    enableEdit,
  } = useTextEditor(props);

  return isEditing ? (
    <EditWrapper>
      {props.btnLeft ? (
        <>
          <EditButton
            value="✓"
            className="btn-success join-item"
            onClick={handleSubmit}
            disabled={!canSave}
          />
          <EditButton
            value="✕"
            className="btn-error join-item"
            onClick={handleCancel}
          />
        </>
      ) : null}
      <TextBox
        value={text}
        onChange={handleChange}
        onKeyUp={handleKeypress}
        className={props.className}
        {...charLimit}
      />
      {props.btnLeft ? null : (
        <>
          <EditButton
            value="✕"
            className="btn-error join-item"
            onClick={handleCancel}
          />
          <EditButton
            value="✓"
            className="btn-success join-item"
            onClick={handleSubmit}
            disabled={!canSave}
          />
        </>
      )}
    </EditWrapper>
  ) : (
    <StaticWrapper onClick={enableEdit}>{text}</StaticWrapper>
  );
}
