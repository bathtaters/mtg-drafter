
export const throttle = (delay: number) => {
  let pause: boolean

  return (callback: () => void) => {
    if (pause) return;
    
    pause = true
    callback()
    setTimeout(() => { pause = false }, delay)
  };
}

export function debounce<A extends [] = []>(callback: (...args: A) => void, delay = 500) {
  let timeout: NodeJS.Timeout

  return (...args: A) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
