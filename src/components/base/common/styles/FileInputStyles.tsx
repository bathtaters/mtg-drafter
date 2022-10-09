import type { ReactNode, HTMLProps } from "react"

export const InputWrapper = ({ label, children }: { label: string, children: ReactNode }) => (
  <label className="block w-5/6">
    <span className="sr-only">{label}</span>
    {children}
  </label>
)

export const InputElem = (props: HTMLProps<HTMLInputElement>) => (
  <input type="file"
    className="block w-full text-sm text-secondary bg-secondary-content rounded-xl file:btn file:btn-secondary file:mr-4"
    {...props}
  />
)

export const HelperText = ({ text }: { text?: string }) => text ?  <div className="text-lg -mb-4 text-secondary">{text}</div> : null

export const fileWrapperClass = "flex-grow flex flex-col justify-center items-center gap-8 rounded-lg py-8"
export const textPadClass = "object-cover w-16 h-16 p-1 rounded-full bg-secondary fill-secondary-content"
