import { DependencyList, useCallback, useEffect, useRef, useState, MouseEventHandler } from 'react'
import { hoverAfterClickDelay } from "assets/constants"

const remaining = (end?: number|null, roundTo = 1, current = Date.now()) =>
  end && end > current ? Math.round((end - current) / roundTo) : undefined

export function useTimer(endTime?: number|null, onEnd = () => {}, tickMs = 1000) {
  const timer = useRef<NodeJS.Timer>()
  const stop = useCallback(() => { clearInterval(timer.current); timer.current = undefined }, [])

  const [ countdown, setCountdown ] = useState(remaining(endTime, tickMs))

  const update = useCallback((end?: number|null) => {
    const rem = remaining(end, tickMs)
    setCountdown(rem)

    if (typeof rem !== 'number' && typeof end === 'number') onEnd()
    return typeof rem === 'number'
  }, [onEnd, tickMs])

  useEffect(() => {
    if (update(endTime)) timer.current = setInterval(() => update(endTime) || stop(), tickMs / 2)
    else stop()
    return stop
  }, [update, stop, endTime, tickMs])

  return countdown
}


export enum HoverAction { Leave = 0, Enter = 1, Click = 2, FirstClick = 3 }

export function useHoverClick<Key extends number|string = string>(handleAction: (action: HoverAction, key?: Key) => void): (key?: Key) => MouseEventHandler {
  const wasClicked = useRef(false)
  const disableHover = useRef(false)

  return useCallback((key) => (ev) => {
    ev.stopPropagation()
  
    switch (ev.type) {
      case 'mouseenter':
        disableHover.current !== true && handleAction(HoverAction.Enter, key)
        break
      case 'mouseleave':
        if (disableHover.current === true) break
        handleAction(HoverAction.Leave, key)
        wasClicked.current = false
        break
      case 'click':
        disableHover.current = true
        setTimeout(() => disableHover.current = false, hoverAfterClickDelay)
      default:
        handleAction(wasClicked.current ? HoverAction.Click : HoverAction.FirstClick, key)
        wasClicked.current = true
    }
  }, [handleAction])
}


export function useFocusEffect(onFocus: (isFocused: boolean) => void, dependencies?: DependencyList, minimumDelay: number = 0) {
  const timestamp = useRef(new Date().getTime())
  const handleEvent = (isFocused: boolean) => {
    const now = new Date().getTime()
    if (now - timestamp.current >= minimumDelay) onFocus(isFocused)
    timestamp.current = now
  }

  useEffect(() => {
    const handleFocus = () => handleEvent(true)
    const handleBlur  = () => handleEvent(false)

    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur",  handleBlur)
    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur",  handleBlur)
    }
  }, dependencies)
}


export function useTouchDevice() {
  const [ isTouchDevice, setIsTouchDevice ] = useState(false)
  useEffect(() => {
    setIsTouchDevice(typeof window !== 'undefined' && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0))
  }, [])
  return isTouchDevice
}