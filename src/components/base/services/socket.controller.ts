import io, { Socket } from 'socket.io-client'
import { useState, useEffect, useRef, useCallback, EffectCallback, DependencyList } from 'react'
import { debugSockets } from 'assets/constants'
import exponentialRetry from './retrier'

const INC_DELAY = 5
const MAX_DELAY = 10 ** 6


export default function useSocket<S extends Socket = Socket>(
  path: string, endpoint: string,
  onConnect: (socket: S) => ReturnType<EffectCallback>,
  dependencies: DependencyList = [],
  autoReconnect: boolean = true,
) {
  const socket = useRef<S | null>(null)
  const destructor = useRef<ReturnType<EffectCallback>>()
  const [ isConnected, setConnected ] = useState<boolean>(false)


  const connectListener = useCallback(() => {
    debugSockets && console.debug(`Socket ${socket.current?.connected ? 'connected' : 'disconnected'} at ${path} ${socket.current?.id || ''}`)
    setConnected(socket.current?.connected || false)
  }, [])


  const disconnectFromSocket = useCallback(() => {
    if (!socket.current) return setConnected(false)
      
    if (destructor.current) destructor.current()
    socket.current.off('disconnect', attemptReconnect)
    socket.current.disconnect()
    socket.current.off('connect', connectListener)
    socket.current.off('disconnect', connectListener)
    socket.current = null
    destructor.current = undefined
  }, [])


  const connectToSocket = useCallback(async () => {
    const res = await fetch(endpoint)
    disconnectFromSocket()
  
    socket.current = io({ path }).on('connect', connectListener).on('disconnect', connectListener) as S
  
    if (res.status !== 200 || !socket.current) {
      debugSockets && console.error('Error connecting sockets',res.statusText,res.status)
      disconnectFromSocket()
      throw new Error('Unable to establish connection to server')
    }

    destructor.current = onConnect(socket.current)
    if (autoReconnect) socket.current.on('disconnect', attemptReconnect)
    connectListener()
  }, [])


  const attemptReconnect = useCallback(() => {
    debugSockets && console.debug('Attempting sockets reconnect...')
    return exponentialRetry(connectToSocket, MAX_DELAY, INC_DELAY)().catch(() => {
      disconnectFromSocket()
      debugSockets && console.debug('Multiple sockets reconnection attempts failed.')
      throw new Error('Unable to re-establish connection to server')
    })
  }, [])


  useEffect(() => {
    if (typeof window !== 'undefined') connectToSocket()
    return disconnectFromSocket
  }, [connectToSocket, disconnectFromSocket, ...dependencies])

  return { isConnected, socket: socket.current }
}