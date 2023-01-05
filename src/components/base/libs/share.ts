type ShareResult = "copy" | "share" | "error" | "unavailable"

export const canShare = () => typeof window === 'undefined' ? false : Boolean(window.navigator.share || window.navigator.clipboard?.writeText)

export default async function browserShare(text: string, url: string, title: string): Promise<ShareResult> {
  if (window.navigator.share)
    return window.navigator.share({ title, url, text }).catch(() => true).then((isErr) => isErr ? 'error' : 'share')

  else if (window.navigator.clipboard?.writeText)
    return window.navigator.clipboard.writeText(url).then(() => 'copy')

  return 'unavailable'
}
