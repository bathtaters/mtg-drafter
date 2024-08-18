import type { HTMLProps, ReactNode } from "react"

export const FormWrapper = ({ full, ...props}: HTMLProps<HTMLFormElement> & { full?: boolean }) => (
    <form className={`w-full h-full flex flex-col ${full ? "items-center p-2" : ""} form-control`} {...props} />
)

export const LabelStyle = ({ full, ...props}: HTMLProps<HTMLLabelElement> & { full?: boolean }) => (
    <label className={`label label-text ${full ? "justify-center text-lg" : ""}`} {...props} />
)

export const BoxBtnWrapper = ({ full, children }: { full?: boolean, children?: ReactNode }) => (
    <div className={full ? "w-full max-w-sm flex flex-col gap-1 items-center" : "join w-full mb-2"}>
        {children}
    </div>
)

export const PasswordStyle = (props: HTMLProps<HTMLInputElement>) => (
    <input type="password" className="join-item grow input input-secondary input-bordered" {...props} />
)

export const ButtonStyle = (props: HTMLProps<HTMLButtonElement>) => (
    <button className="join-item btn btn-secondary" {...props as any} />
)

export const MessageStyle = (props: HTMLProps<HTMLDivElement>) => (
    props.children ? <div className="badge badge-error m-1" {...props} /> :
    <Spacer />
)

export const Spacer = () => <div className="h-5" />