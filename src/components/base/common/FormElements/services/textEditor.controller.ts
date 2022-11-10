import { ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useState } from "react"

export type EditorProps = {
  value: string,
  onSubmit: (value: string) => void,
  minLength?: number,
  maxLength?: number,
}

export default function useTextEditor({ value, onSubmit, minLength, maxLength }: EditorProps) {
  const [ text, setText ] = useState(value || 'Player')
  const [ isEditing, setEditing ] = useState(false)
  
  useEffect(() => { value && setText(value) }, [value])

  const handleSubmit = () => {
    if (text.length < (minLength || 1) || (maxLength && text.length > maxLength))
      return;
    onSubmit && onSubmit(text)
    setEditing(false)
  }

  const handleCancel = useCallback(() => {
    value && setText(value)
    setEditing(false)
  }, [value])

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
    setText(maxLength ? ev.currentTarget.value.slice(0, maxLength) : ev.currentTarget.value)
  }, [maxLength])
  
  const enableEdit = useCallback(() => setEditing(true), [])

  const handleKeypress: KeyboardEventHandler = (e) => {
    e.preventDefault()
    switch (e.key) {
      case 'Esc':
      case 'Escape': return handleCancel()
      case 'Enter': return handleSubmit()
    }
  }

  return {
    text, isEditing, charLimit: { minLength, maxLength },
    canSave: text.length >= (minLength || 1),
    handleChange, handleKeypress,
    handleSubmit, handleCancel, enableEdit,
  }
}
