import type { ReactNode, HTMLProps } from "react"

export const PreviewContainer = ({ children }: { children: ReactNode }) => (
  <div className="flex-grow flex flex-col justify-center items-center gap-8 rounded-lg py-8">{children}</div>
)

export const PreviewWrapper = ({ label, children }: { label: string, children: ReactNode }) => (
  <div className="text-lg -mb-4 text-secondary">
    <div className="w-full text-center">{label}</div>
    {children}
  </div>
)

export const PreviewResult = ({ children }: { children: ReactNode }) => (
  <div className="w-full text-center text-xs text-secondary-focus italic">{children}</div>
)

export const PreviewError = ({ error }: { error?: string }) => (
  <div className="w-full text-center text-xs text-error italic">Error Uploading: {error || 'Unknown Error'}</div>
)

export const NotFoundList = ({ list }: { list?: string[] }) => !list?.length ? null :
  <div className="">Cards not found: {list.join(', ')}</div>

export const ClearButton = ({ label, type, ...props }: HTMLProps<HTMLButtonElement>) => (
  <button type="button" className="block w-1/2 btn btn-secondary btn-sm" {...props}>{label}</button>
)
