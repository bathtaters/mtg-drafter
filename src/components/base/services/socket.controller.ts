import io, { Socket } from 'socket.io-client'
import { useState, useEffect, useRef, useCallback, EffectCallback, MutableRefObject } from 'react'
import { debugSockets } from 'assets/constants'

export default function useSocket<S extends Socket = Socket>(path: string, endpoint: string, onConnect: (socket: S) => ReturnType<EffectCallback>) {
  const socket = useRef<S | null>(null)
  const destructor = useRef<ReturnType<EffectCallback>>()
  const [ isConnected, setConnected ] = useState<boolean>(false)


  const connectListener = useCallback(() => {
    debugSockets && console.debug(`Socket ${socket.current?.connected ? 'connected' : 'disconnected'} at ${path} ${socket.current?.id || ''}`)
    setConnected(socket.current?.connected || false)
  }, [socket.current?.connected])


  const disconnectFromSocket = () => {
    if (!socket.current) return setConnected(false)
      
    if (destructor.current) destructor.current()
    socket.current.disconnect()
    socket.current.off('connect', connectListener)
    socket.current.off('disconnect', connectListener)
    socket.current = null
    destructor.current = undefined
  }


  const connectToSocket = async () => {
    const res = await fetch(endpoint)
    disconnectFromSocket()
  
    socket.current = io({ path }).on('connect', connectListener).on('disconnect', connectListener) as S
  
    if (res.status !== 200) {
      console.error('Error connecting sockets',res.statusText,res.status)
      disconnectFromSocket()
      return
    }
    
    if (socket.current) destructor.current = onConnect(socket.current)
  }


  useEffect(() => {
    if (typeof window !== 'undefined') connectToSocket()
    return disconnectFromSocket
  }, [])

  return { isConnected, socket: socket.current, reconnect: connectToSocket }
}