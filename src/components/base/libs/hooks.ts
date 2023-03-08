import { DependencyList, useCallback, useEffect, useRef, useState, useReducer, useMemo, MouseEventHandler } from 'react'
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


type TimerStore = 'standby' /* run upon reciving timer */ | 'active' /* timer is running */ | number /* stored value */ | undefined /* empty */

export function useTimerStore(initTimer?: number | null, initOffset?: number | null) {
  const [ timer, setTimer ] = useState<number>()
  
  const timerStore = useRef<TimerStore>(initTimer == null || initOffset == null ? undefined : initTimer - initOffset)

  const resetTimer = useCallback(() => setTimer(timerStore.current = undefined), [])

  const startTimer = useCallback(() => {
    // Start timer
    if (typeof timerStore.current === 'number') {
      setTimer(timerStore.current + Date.now())
      timerStore.current = 'active'
      
    // Place in standby mode
    } else if (!timerStore.current) {
      timerStore.current = 'standby'
    }
  }, [])


  const storeTimer = useCallback((timer?: number | null, offset?: number | null) => {
    if (timer == null || offset == null) return resetTimer()
    
    setTimer((clock) => {
      // Store value & disable timer
      if (typeof timerStore.current !== 'string' && (clock == undefined || clock >= Date.now()) && timer > offset) {
        timerStore.current = timer - offset
        return undefined
  
      // Start/Update timer
      } else {
        timerStore.current = 'active'
        return timer - offset + Date.now()
      }
    })
  }, [resetTimer])

  return { timer, startTimer, resetTimer, storeTimer }
}


export function useLoadElements(onLoadAll?: () => void, elementCount?: number, skip = false, depends: any[] = []) {
  const [ loadCount, setLoadCount ] = useState(elementCount)
  
  const handleElementLoad = useCallback(() => setLoadCount((loadCount) => loadCount ? loadCount - 1 : loadCount), [])

  useEffect(() => {
    if (loadCount === 0) {
      setLoadCount(undefined)
      onLoadAll && onLoadAll()
    }
  }, [loadCount, onLoadAll])

  useEffect(() => {
    if (typeof elementCount !== 'number') return setLoadCount(undefined)
    
    if (!skip) return setLoadCount(elementCount)

    onLoadAll && onLoadAll()
    setLoadCount(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    const handleEvent = (isFocused: boolean) => {
      const now = new Date().getTime()
      if (now - timestamp.current >= minimumDelay) onFocus(isFocused)
      timestamp.current = now
    }
    
    const handleFocus = () => handleEvent(true)
    const handleBlur  = () => handleEvent(false)

    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur",  handleBlur)
    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur",  handleBlur)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}


const simpleReducer = <T>(state: T, action: { type: keyof T, value: T[keyof T] }): T =>
  ({ ...state, [action.type]: action.value })

export function useSimpleReducer<T extends {}>(initialValue: T) {
  const [ state, updateState ] = useReducer(simpleReducer<T>, { ...initialValue })

  const updaters = useMemo(() => 
    Object.keys(initialValue)
      .reduce((updaters, type) => ({
        ...updaters, [type]: (value: T[keyof T]) => updateState({ type, value })
      }),
      {} as { [K in keyof T]: (value: T[K]) => void }
    ),
  [initialValue])
  
  return [ state, updaters ] as [ T, typeof updaters ]
}


export function useTouchDevice() {
  const [ isTouchDevice, setIsTouchDevice ] = useState(false)
  useEffect(() => {
    setIsTouchDevice(typeof window !== 'undefined' && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0))
  }, [])
  return isTouchDevice
}