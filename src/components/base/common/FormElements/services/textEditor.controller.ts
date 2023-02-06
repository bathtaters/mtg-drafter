import type { ChangeEventHandler, KeyboardEventHandler } from "react"
import { useCallback, useEffect, useState } from "react"

const DEFAULT_TEXT = 'Player'

export type EditorProps = {
  isEditing?: boolean,
  setEditing?: (isEditing: boolean) => void,
  value: string,
  onSubmit: (value: string) => void,
  minLength?: number,
  maxLength?: number,
}

export default function useTextEditor({ value, onSubmit, minLength, maxLength, isEditing, setEditing }: EditorProps) {
  const [ text, setText ] = useState(value || DEFAULT_TEXT)
  const [ isEditingLocal, setEditingLocal ] = useState(isEditing || false)
  
  useEffect(() => { value && setText(value) }, [value])

  useEffect(() => { if (typeof isEditing === 'boolean') setEditingLocal(isEditing) }, [isEditing])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateAllEditing = useCallback(
    !setEditing ? setEditingLocal : (editing: boolean) => { setEditingLocal(editing); setEditing(editing) },
    [setEditing]
  )

  const handleSubmit = () => {
    if (text.length < (minLength || 1) || (maxLength && text.length > maxLength))
      return;
    onSubmit && onSubmit(text)
    updateAllEditing(false)
  }

  const handleCancel = useCallback(() => {
    value && setText(value)
    updateAllEditing(false)
  }, [value, updateAllEditing])

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
    setText(maxLength ? ev.currentTarget.value.slice(0, maxLength) : ev.currentTarget.value)
  }, [maxLength])
  
  const enableEdit = useCallback(() => updateAllEditing(true), [updateAllEditing])

  const handleKeypress: KeyboardEventHandler = (e) => {
    e.preventDefault()
    switch (e.key) {
      case 'Esc':
      case 'Escape': return handleCancel()
      case 'Enter': return handleSubmit()
    }
  }

  return {
    text, isEditing: isEditingLocal,
    charLimit: { minLength, maxLength },
    canSave: text.length >= (minLength || 1),
    handleChange, handleKeypress,
    handleSubmit, handleCancel, enableEdit,
  }
}
