import type { ChangeEvent, FormEvent } from "react"
import { useState } from "react"
import { ButtonStyle, FormWrapper, LabelStyle, MessageStyle, PasswordStyle } from "./styles/PasswordFormStyles"


export default function PasswordForm(
    { label="Enter Password", btnLabel="Submit", message="", onSubmit, id="password" }:
    { label?: string, btnLabel?: string, message?: string, id?: string, onSubmit?: (password: string) => Promise<void> | void }
) {
    const [password, setPassword] = useState("")

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit && onSubmit(password)
        setPassword("")
    }

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <LabelStyle htmlFor={id}>{label}</LabelStyle>
            <div />
            <PasswordStyle id={id} value={password} onChange={handleChange} />
            <MessageStyle>{message}</MessageStyle>
            <ButtonStyle type="submit">{btnLabel}</ButtonStyle>
        </FormWrapper>
    )
}