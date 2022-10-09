import type { ReactNode } from "react"

type Props = { className?: string, hide?: boolean, children: ReactNode }

export default function Overlay({ className = '', hide, children }: Props) {
  if (hide) return null
  return (
    <div className={`modal modal-open ${className}`}>
      {children}
    </div>
  )
}