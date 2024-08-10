import errors from 'assets/errors'
import { ErrorIcon } from 'components/svgs/AlertIcons'

export default function ErrorMessage({ code, message }: { code?: number, message?: string }) {
  return (<section>
    <h2 className="text-error flex flex-row items-center mb-4">
      <ErrorIcon className="text-error w-12 h-12 mr-2" />
      Error{code && ` [${code}]`}
    </h2>
    
    <h3>
      <span className="font-semibold">{message || (code && code in errors ? errors[code] : errors[0])}.</span>
    </h3>
  </section>)
}
