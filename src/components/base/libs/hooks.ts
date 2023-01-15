import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'

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