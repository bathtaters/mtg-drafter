import { ReactNode } from 'react'

const ErrorMessage = ({ code, message }: { code: number, message: string }) => (
  <h3><span className="font-semibold">Error [{code}]:</span>{" " + message}</h3>
)

const GenericError = (code: number) => <ErrorMessage code={code} message="Unknown error code." />

const errorCodes: { [code: number]: ReactNode } = {
  404: <ErrorMessage code={404} message="Page not found." />
}

const TextWrapper = ({children}:{children: ReactNode}) => <div>{children}</div>

export default function Loader({ data, error, message, children }: { data?: any, error: any, message?: string, children: ReactNode }) {

  if (error)   return (<TextWrapper>Error: {error.message}</TextWrapper>)
  if (!data) return (<TextWrapper>Loading...</TextWrapper>)
  if (typeof data === 'number') return (<TextWrapper>{data in errorCodes ? errorCodes[data] : GenericError(data)}</TextWrapper>)
  if (message) return (<TextWrapper>{message}</TextWrapper>)

  return <>{children}</>
}
