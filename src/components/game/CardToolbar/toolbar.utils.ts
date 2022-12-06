import { sortKeys } from "components/base/services/cardSort.services"
import cardZoomLevels, { matchWidth } from "./cardZoomLevels"

const remToPixel = (rem: string) => parseFloat(rem) * parseFloat(typeof window !== 'undefined' ? window.getComputedStyle(document.documentElement).fontSize : '16px')

const widthOffsetPx = (remToPixel('1rem') + remToPixel('0.5rem')) * 2 // Total padding around card

export const zoomToPixels = (zoom: number) => {
  const rem = (cardZoomLevels[zoom] || '').match(matchWidth)
  return rem?.[1] ? remToPixel(rem[1]) + widthOffsetPx : undefined
}

export const throttle = (delay: number) => {
  let pause: boolean

  return (callback: () => void) => {
    if (pause) return;
    
    pause = true
    callback()
    setTimeout(() => { pause = false }, delay)
  };
}


const throttledWarn = throttle(1000 * 10)
export const warn = (msg: string) => throttledWarn(() => console.warn(msg))


export const sortList = sortKeys.map((k) => k.charAt(0).toUpperCase() + k.slice(1))