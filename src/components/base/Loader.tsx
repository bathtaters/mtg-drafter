import type { ReactNode } from 'react'
import errorMap, { GenericError } from './services/error.map'

type Props = { data?: any, error?: any, message?: string, children: ReactNode }

const TextWrapper = ({children}: {children: ReactNode}) => <div>{children}</div>

export default function Loader({ data, error, message, children }: Props) {

  if (error)   return (<TextWrapper>Error: {error.message}</TextWrapper>)
  if (!data) return (<TextWrapper>Loading...</TextWrapper>)
  if (typeof data === 'number') return (<TextWrapper>{data in errorMap ? errorMap[data] : GenericError(data)}</TextWrapper>)
  if (message) return (<TextWrapper>{message}</TextWrapper>)

  return <>{children}</>
}
