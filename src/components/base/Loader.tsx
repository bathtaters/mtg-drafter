import type { ReactNode } from 'react'
import ErrorMessage from './styles/ErrorMessage'

type Props = { data?: any, error?: any, message?: ReactNode, children: ReactNode }

const TextWrapper = ({children}: {children: ReactNode}) => <div className="py-4 px-6">{children}</div>

export default function Loader({ data, error, message, children }: Props) {

  if (error)   return (<TextWrapper><ErrorMessage code={error.code} message={error.message || error} /></TextWrapper>)
  if (data == null) return (<TextWrapper>Connecting...</TextWrapper>)
  if (typeof data === 'number') return (<TextWrapper><ErrorMessage code={data} /></TextWrapper>)
  if (message) return (<TextWrapper>{message}</TextWrapper>)

  return <>{children}</>
}
