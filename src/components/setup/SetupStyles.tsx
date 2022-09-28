import Link from "next/link"

// WRAPPERS

export const FormWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col h-full justify-center items-center w-full max-w-3xl m-auto">
    <form className="bg-base-300 p-6 form-control gap-6 w-full">{children}</form>
  </div>
)

export const FieldWrapper = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <fieldset className="form-control w-full border border-secondary rounded-lg">
    <legend className="px-2"><h3>{label}</h3></legend>
    {children}
  </fieldset>
)

export const InputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 p-4 gap-8 sm:grid-cols-2">{children}</div>
)

// FORM ELEMENTS

export const FormTitle = ({ placeholder, value, setValue }: { placeholder: string, value?: string, setValue?: (value: string) => void }) => (
  <div className="w-full flex justify-center font-serif">
    <input
      type="text" placeholder={placeholder}
      className="input input-secondary input-bordered input-lg w-full max-w-lg text-3xl font-semibold text-center"
      value={setValue ? value : undefined}
      defaultValue={setValue ? undefined : value}
      onChange={setValue ? (ev) => setValue(ev.target.value) : undefined}
    />
  </div>
)

export const SubmitButton = ({ children }: { children: React.ReactNode }) => (
  <Link href="/game/test_game"><a className="btn btn-secondary btn-lg m-4 text-2xl">{children}</a></Link>
  // <button type="button" className="btn btn-secondary btn-lg m-4 text-2xl">{children}</button>
)