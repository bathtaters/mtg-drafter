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


export function useTimerStore(initTimer?: number | null, initOffset?: number | null) {
  const [ timer, setTimer ] = useState<number>()
  
  const timerStore = useRef<number | undefined | 'standby'>(initTimer == null || initOffset == null ? undefined : initTimer - initOffset)
  // null = nothing in storage, standby = run upon receiving value, # = stored timer value

  const resetTimer = useCallback(() => setTimer(timerStore.current = undefined), [])

  const startTimer = useCallback(() => {
    // Place in standby mode
    if (typeof timerStore.current !== 'number') {
      timerStore.current = 'standby'

    // Start timer
    } else {
      setTimer(timerStore.current + Date.now())
      timerStore.current = undefined
    }
  }, [])


  const storeTimer = useCallback((timer?: number | null, offset?: number | null) => {
    if (timer == null || offset == null) return resetTimer()

    // Store value & disable timer
    if (timerStore.current !== 'standby' && timer > offset) {
      timerStore.current = timer - offset
      setTimer(undefined)

    // Start timer
    } else {
      setTimer(timer - offset + Date.now())
      timerStore.current = undefined
    }
  }, [])

  return { timer, startTimer, resetTimer, storeTimer }
}


export function useLoadElements(onLoadAll?: () => void, elementCount?: number, skip = false, depends: any[] = []) {
  const [ loadCount, setLoadCount ] = useState(elementCount)

  
  const handleElementLoad = useCallback(() => setLoadCount((loadCount) => {
    loadCount === 1 && onLoadAll && onLoadAll()
    return loadCount ? loadCount - 1 : loadCount
  }), [onLoadAll, ...depends])

  useEffect(() => {
    if (typeof elementCount !== 'number') return setLoadCount(undefined)

    const remainingCount = skip ? 0 : elementCount
    setLoadCount(remainingCount)
  }, [elementCount, ...depends])

  return [ loadCount, handleElementLoad ] as [ number | undefined, () => void ]
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