import { DependencyList, useEffect, useRef } from 'react'

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