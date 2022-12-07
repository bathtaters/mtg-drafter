
export default function exponentialRetry(
  asyncAction: () => Promise<void>,
  maximumDelay: number = 10 ** 5,
  incrementMultiplier: number = 10,
  initialDelay: number = 10
) {

  let nextDelay = initialDelay, lastAttempt = 0
  const init = () => { nextDelay = initialDelay, lastAttempt = 0 }
  
  const attempt = async () => {
    if (nextDelay > maximumDelay) throw new Error('Maximum delay reached')

    const delay = lastAttempt + (nextDelay *= incrementMultiplier) - (lastAttempt = Date.now())
    if (delay > 0) await new Promise<void>((res) => setTimeout(res, delay))

    try { await asyncAction() }
    catch (err) { await attempt() }
  }

  return () => { init(); return attempt() }
}
