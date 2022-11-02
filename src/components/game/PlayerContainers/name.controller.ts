import { ChangeEventHandler, useCallback, useEffect, useState } from "react"

export type RenameProps = { name: string, onSubmit: (newName: string) => void, charLimit?: { minLength?: number, maxLength?: number } }

export default function useRenameController({ name, onSubmit, charLimit = {} }: RenameProps) {
  const [ value, setVal ] = useState(name || 'Player')
  const [ isEditing, setEditing ] = useState(false)
  
  useEffect(() => { name && setVal(name) }, [name])

  const handleSubmit = () => {
    if (value.length < (charLimit.minLength || 1) || (charLimit.maxLength && value.length > charLimit.maxLength))
      return;
    onSubmit && onSubmit(value)
    setEditing(false)
  }

  const handleCancel = useCallback(() => {
    name && setVal(name)
    setEditing(false)
  }, [name])

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
    setVal(charLimit.maxLength ? ev.currentTarget.value.slice(0, charLimit.maxLength) : ev.currentTarget.value)
  }, [charLimit.maxLength])
  
  const enableEdit = useCallback(() => setEditing(true), [])

  return {
    value, isEditing, charLimit,
    canSave: value.length >= (charLimit.minLength || 1),
    handleChange, handleSubmit, handleCancel, enableEdit,
  }
}