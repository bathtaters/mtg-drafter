import type { HTMLProps } from "react"

export const StaticWrapper = (props: HTMLProps<HTMLDivElement>) => <div className="h-8 px-2 py-0.5 whitespace-nowrap text-ellipsis" {...props} />

export const EditWrapper = (props: HTMLProps<HTMLDivElement>) => <div className="input-group h-8 w-auto" {...props} />

export const EditButton = (props: HTMLProps<HTMLInputElement>) => (
  <input type="button" {...props} className={`btn btn-square ${props.className || ''} btn-xs h-auto`} />
)

export const TextBox = (props: HTMLProps<HTMLInputElement>) => (
  <input type="text" autoFocus={true} onFocus={(ev) => ev.target.select()}
    {...props} className={`input h-auto p-2 w-full ${props.className || ''}`} />
)
