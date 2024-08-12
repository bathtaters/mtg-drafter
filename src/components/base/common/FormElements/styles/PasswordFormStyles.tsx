import type { HTMLProps } from "react"

export const FormWrapper = (props: HTMLProps<HTMLFormElement>) => (
    <form className="w-full h-full flex flex-col justify-center items-center gap-2 p-8 form-control" {...props} />
)

export const LabelStyle = (props: HTMLProps<HTMLLabelElement>) => (
    <label className="label justify-center label-text text-lg" {...props} />
)

export const PasswordStyle = (props: HTMLProps<HTMLInputElement>) => (
    <input type="password" className="input input-primary input-bordered w-full max-w-xs" {...props} />
)

export const ButtonStyle = (props: HTMLProps<HTMLButtonElement>) => (
    <button className="btn btn-primary" {...props as any} />
)

export const MessageStyle = (props: HTMLProps<HTMLDivElement>) => (
    props.children ? <div className="badge badge-error" {...props} /> :
    <div />
)