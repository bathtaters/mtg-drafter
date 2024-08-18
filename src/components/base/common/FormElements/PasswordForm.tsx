import type { ChangeEvent, FormEvent } from "react"
import { useState } from "react"
import { BoxBtnWrapper, ButtonStyle, FormWrapper, LabelStyle, MessageStyle, PasswordStyle, Spacer } from "./styles/PasswordFormStyles"


export default function PasswordForm(
    { label="Enter Password", fullPage, btnLabel="Submit", emptyBtn, message="", onSubmit, id="password", placeholder="" }:
    { label?: string, btnLabel?: string, emptyBtn?: string, message?: string, id?: string, placeholder?: string, fullPage?: boolean, onSubmit?: (password: string) => Promise<void> | void }
) {
    const [password, setPassword] = useState("")

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit && onSubmit(password)
        setPassword("")
    }

    return (
        <FormWrapper full={fullPage} onSubmit={handleSubmit}>
            <LabelStyle htmlFor={id} full={fullPage}>{label}</LabelStyle>
            { fullPage && <Spacer /> }
            <BoxBtnWrapper full={fullPage}>
                <PasswordStyle id={id} value={password} placeholder={placeholder} onChange={handleChange} />
                { fullPage && <MessageStyle>{message}</MessageStyle> }
                <ButtonStyle type="submit">{password || !emptyBtn ? btnLabel : emptyBtn}</ButtonStyle>
            </BoxBtnWrapper>
            { !fullPage && <MessageStyle>{message}</MessageStyle> }
        </FormWrapper>
    )
}