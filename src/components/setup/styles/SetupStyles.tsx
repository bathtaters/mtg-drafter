import type { ReactNode, FormEventHandler } from "react"
import { DraftType, draftTypes } from "types/setup.d"
import Tabs, { Props as TabProps } from "components/base/common/Tabs"
import { ErrorIcon } from "components/svgs/AlertIcons"


export const FormWrapper = ({ onSubmit, children }: { onSubmit?: FormEventHandler, children: ReactNode }) => (
  <div className="flex flex-col h-full justify-center items-center w-full max-w-3xl m-auto">
    <form className="bg-base-300 p-6 form-control gap-6 w-full" onSubmit={onSubmit}>{children}</form>
  </div>
)

export const TypeTabs = (props: Pick<TabProps<DraftType>,"selected"|"setSelected">) => (
  <Tabs {...props} tabs={draftTypes} className="tabs-boxed bg-opacity-0 justify-center gap-2" tabClass="tab-lg tab-secondary" />
)

export const SubmitButton = ({ disabled, children }: { disabled?: boolean, children: ReactNode }) => (
  <button type="submit" disabled={disabled} className="btn btn-secondary btn-lg m-4 text-2xl">{children}</button>
)

export const FormTitle = ({ placeholder, value, setValue }: { placeholder: string, value?: string, setValue?: (value: string) => void }) => (
  <div className="w-full flex justify-center font-serif">
    <input
      type="text" placeholder={placeholder}
      className="input input-secondary input-bordered input-lg w-full max-w-lg text-3xl font-semibold text-center"
      value={setValue ? value : undefined}
      defaultValue={setValue ? undefined : value}
      onChange={setValue ? (ev) => setValue(ev.target.value) : undefined}
      required={true}
    />
  </div>
)

export const ErrorText = ({ children }: { children?: ReactNode }) => children ? (
  <div className="alert alert-error shadow-lg"><div>
    <ErrorIcon className="stroke-current flex-shrink-0 h-6 w-6" />
    <span>{children}</span>
  </div></div>
) : <span />
