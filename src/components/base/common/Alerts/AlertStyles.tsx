import type { ReactNode } from "react"
import type { ErrorAlert, ErrorButton, AlertTheme } from "./alerts.d"
import Router from "next/router"
import ModalWrapper from "../Modal"
import { colorClasses, buttonClasses, alertIcons } from "./alert.constants"


// ERROR

export function ErrorModalWrapper({ alert, children, closeModal }: { alert: Required<ErrorAlert>, children: ReactNode, closeModal: () => void }) {
  const Icon = alertIcons[alert.theme]
  return (
    <ModalWrapper
      title={
        <div className="flex items-center gap-2">
          <Icon className="w-12 h-12" />
          <span>{alert.title}</span>
        </div>
      }
      setOpen={alert.bgdClick ? closeModal : undefined} isOpen={true}
      buttons={errorButton(alert.button, alert.theme, closeModal)}
      className={`${colorClasses[alert.theme]} shadow-lg shadow-black`}
    >
      {children}
    </ModalWrapper>
  )
}


export const errorButton = (label: ErrorButton, theme: AlertTheme, close: () => void): ReactNode[] => {
  if (label === 'None') return []

  return [
    <button type="button" className={`btn shadow-sm shadow-black ${buttonClasses[theme]}`} onClick={label === 'Refresh' ? Router.reload : close} key={label}>
      {label === 'Refresh' ? '⟳' : label}
    </button>
  ]
}


// TOAST


export function ToastContainer({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none p-4 overflow-hidden flex flex-col-reverse gap-4 items-end">
      {children}
    </div>
  )
}

export function ToastStyle({ children, theme, onClick }: { children: ReactNode, theme: AlertTheme, onClick?: () => void }) {

  const Icon = alertIcons[theme]
  return (
    <div className={`alert justify-start min-w-[50%] w-auto pointer-events-auto cursor-pointer opacity-75 flex-shrink flex-grow-0 ${colorClasses[theme]}`} onClick={onClick}>
      <Icon />
      <span>{children}</span>
    </div>
  )
}