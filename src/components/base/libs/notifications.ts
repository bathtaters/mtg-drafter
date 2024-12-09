import { useState, useEffect, useCallback } from 'react'

export type Notifier = (title: string, options?: NotificationOptions) => Promise<Notification | null>
export type Permission = NotificationPermission | null

// Default notification timeout value if requireInteraction = false
const defaultNotifTimeout = 6000

/**
 * Send popup notifications using browser's built-in Notification API
 * @returns {object} { canSend, send, current }
 *      - canSend: Function to check if user can send notification (If parameter is TRUE, will ask user for permission if needed, but then return FALSE bc this is async).
 *      - send: Function to send a notification.
 *      - current?: Current notification (If one is visible).
 */
export default function useNotification() {
    const [current, setNotification] = useState<Notification>()

    useEffect(() => {
        if (window?.Notification?.permission === 'default')
            Notification.requestPermission()
    }, [])

    const canSend = useCallback((requestPermission = false) => {
        if (requestPermission && window?.Notification?.permission === 'default')
            Notification.requestPermission()
        return window?.Notification?.permission === 'granted'
    }, [])

    const send = useCallback<Notifier>(async (title, options) => {
        if (current) return null // Can only show 1 at a time

        let perm = window?.Notification?.permission

        if (perm === 'default') perm = await Notification.requestPermission()

        if (perm === 'granted') {
            let timeout: NodeJS.Timeout | null = null
            const handleClose = (err?: any) => {
                setNotification(undefined)
                timeout && clearTimeout(timeout)
                err && console.error(err)
            }

            const notif = new Notification(title, options)

            notif.addEventListener('show', () => setNotification(notif))
            notif.addEventListener('click', () => handleClose())
            notif.addEventListener('close', () => handleClose())
            notif.addEventListener('error', handleClose)
            if (!options?.requireInteraction)
                timeout = setTimeout(() => setNotification(undefined), defaultNotifTimeout)
            return notif
        }
        return null
    }, [current])

    return { send, current, canSend }
}




