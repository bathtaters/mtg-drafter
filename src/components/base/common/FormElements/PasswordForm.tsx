import type { ChangeEvent, FormEvent } from "react"
import { useState } from "react"
import { BoxBtnWrapper, ButtonStyle, FormWrapper, LabelStyle, MessageStyle, PasswordStyle, Spacer } from "./styles/PasswordFormStyles"


export default function PasswordForm(
    { label="Enter Password", btnLabel="Submit", emptyBtn, message="", id="password", placeholder="", fullPage, heightClass, isCreate, onSubmit, disabled }:
    { label?: string, btnLabel?: string, emptyBtn?: string, message?: string, id?: string, placeholder?: string, fullPage?: boolean, heightClass?: string, isCreate?: boolean, onSubmit?: (password: string) => Promise<void> | void, disabled?: boolean }
) {
    const [password, setPassword] = useState("")

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit && onSubmit(password)
        setPassword("")
    }

    const elemClass = heightClass ? `${heightClass} min-h-0` : ""
    return (
        <FormWrapper full={fullPage} onSubmit={handleSubmit}>
            <LabelStyle htmlFor={id} full={fullPage}>{label}</LabelStyle>
            { fullPage && <Spacer /> }
            <BoxBtnWrapper full={fullPage}>
                <PasswordStyle id={id} name={id} value={password} placeholder={placeholder} onChange={handleChange} className={elemClass} autoComplete={isCreate ? 'new-password' : 'current-password'} />
                { fullPage && <MessageStyle>{message}</MessageStyle> }
                <ButtonStyle type="submit" className={elemClass} disabled={disabled && !password}>{password || !emptyBtn ? btnLabel : emptyBtn}</ButtonStyle>
            </BoxBtnWrapper>
            { !fullPage && <MessageStyle>{message}</MessageStyle> }
        </FormWrapper>
    )
}