import type { ReactNode } from "react"
import type { ErrorAlert, ToastAlert, Defaults, AlertTheme } from "./alerts.d"
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "components/svgs/AlertIcons"


export const errorDefaults: Defaults<ErrorAlert> = {
  title: "Error",
  button: "OK",
  theme: "error",
  bgdClick: false,
}

export const toastDefaults: Defaults<ToastAlert> = {
  theme: "info",
  hideDelay: 15,
  disableClick: true,
}


export const colorClasses: { [theme in AlertTheme]: string } = {
  base:      'text-base-content bg-base-300',
  error:     'text-error-content bg-error',
  warning:   'text-warning-content bg-warning',
  info:      'text-info-content bg-info',
  success:   'text-success-content bg-success',
  primary:   'text-primary-content bg-primary',
  secondary: 'text-secondary-content bg-secondary',
}

export const buttonClasses: { [theme in AlertTheme]: string } = {
  base:      'text-base-300 bg-base-content hover:bg-base-content/60',
  error:     'btn-error text-error bg-error-content hover:bg-error-content/60',
  warning:   'btn-warning text-warning bg-warning-content hover:bg-warning-content/60',
  info:      'btn-info text-info bg-info-content hover:bg-info-content/60',
  success:   'btn-success text-success bg-success-content hover:bg-success-content/60',
  primary:   'btn-primary text-primary bg-primary-content hover:bg-primary-content/60',
  secondary: 'btn-secondary text-secondary bg-secondary-content hover:bg-secondary-content/60',
}

export const alertIcons: { [theme in AlertTheme]: (props: { className?: string }) => JSX.Element } = {
  base:      InfoIcon,
  error:     ErrorIcon,
  warning:   WarningIcon,
  info:      InfoIcon,
  success:   SuccessIcon,
  primary:   InfoIcon,
  secondary: InfoIcon,
}
