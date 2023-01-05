import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import { sortKeys } from "components/base/services/cardSort.services"
import cardZoomLevels, { matchWidth } from "./cardZoomLevels"
import { throttle } from "components/base/services/common.services"

const remToPixel = (rem: string) => parseFloat(rem) * parseFloat(typeof window !== 'undefined' ? window.getComputedStyle(document.documentElement).fontSize : '16px')

const widthOffsetPx = (remToPixel('1rem') + remToPixel('0.5rem')) * 2 // Total padding around card

export const zoomToPixels = (zoom: number) => {
  const rem = (cardZoomLevels[zoom] || '').match(matchWidth)
  return rem?.[1] ? remToPixel(rem[1]) + widthOffsetPx : undefined
}


const throttledWarn = throttle(1000 * 10)
export const warn = (message: string, notify: AlertsReturn['newToast']) => throttledWarn(() => notify({ message, theme: 'warning' }))


export const sortList = sortKeys.map((k) => k.charAt(0).toUpperCase() + k.slice(1))