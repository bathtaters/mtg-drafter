type ShareResult = "copy" | "share" | "error" | "unavailable"

const mobileAgentRegex = /android|iPad|iPhone|iPod/i
export const isMobileDevice = () => {
  const userAgent: string = navigator.userAgent || navigator.vendor || (window as any).opera
  return mobileAgentRegex.test(userAgent)
}

export const canShare = () => typeof window === 'undefined' ? false : Boolean(window.navigator.share || window.navigator.clipboard?.writeText)

export default async function browserShare(text: string, url: string, title: string): Promise<ShareResult> {
  if (window.navigator.share && (isMobileDevice() || !window.navigator.clipboard?.writeText))
    return window.navigator.share({ title, url, text }).catch(() => true).then((isErr) => isErr ? 'error' : 'share')

  else if (window.navigator.clipboard?.writeText)
    return window.navigator.clipboard.writeText(url).then(() => 'copy')

  return 'unavailable'
}
