import type { ReactNode } from 'react'

export type AlertTheme = "base"|"error"|"warning"|"info"|"success"|"primary"|"secondary"
export type ErrorButton = "OK"|"Refresh"|"None"

export interface GenericAlert {
  id?: string,
  message: ReactNode,
  theme?: AlertTheme,
}

export interface ErrorAlert extends GenericAlert {
  title?: string,
  button?: ErrorButton,
  bgdClick?: boolean,
}

export interface ToastAlert extends GenericAlert {
  hideDelay?: number,
  disableClick?: boolean,
}


export type Defaults<Alert extends GenericAlert> = Omit<Required<Alert>, "message"|"id">