import { ReactNode } from 'react'

export const ErrorMessage = ({ code, message }: { code: number, message: string }) => (
  <h3><span className="font-semibold">Error [{code}]:</span>{" " + message}</h3>
)

export const GenericError = (code: number) => <ErrorMessage code={code} message="Unknown error code." />

const errorMap: { [code: number]: ReactNode } = {
  404: <ErrorMessage code={404} message="Page not found." />
}

export default errorMap