import io, { Socket } from 'socket.io-client'
import { useState, useEffect, useRef, useCallback, EffectCallback } from 'react'

export default function useSocket<S extends Socket = Socket>(path: string, endpoint: string, onConnect: (socket: S) => ReturnType<EffectCallback>) {
  const socket = useRef<S | null>(null)
  const [ isConnected, setConnected ] = useState<boolean>(false)

  const setConnectListener = useCallback(() => {
    console.log('Socket connected?', socket.current?.connected, path)
    setConnected(socket.current?.connected || false)
  }, [socket.current])

  useEffect(() => {
    let destructor: ReturnType<EffectCallback>

    fetch(endpoint).then((res) => {
      if (res.status !== 200) {
        console.error('Error connecting sockets',res.statusText,res.status)
        return
      }

      if (socket.current) socket.current.disconnect()
      socket.current = io({ path }) as S
      console.log('Connecting to socket at', socket.current.io.opts.path)

      socket.current.on('connect', setConnectListener)
      socket.current.on('disconnect', setConnectListener)

      destructor = onConnect(socket.current)
    })
    
    return () => {
      if (!socket.current) return setConnected(false)
      socket.current.off('connect', setConnectListener)
      socket.current.off('disconnect', setConnectListener)

      if (destructor) destructor()
      socket.current.disconnect()
      socket.current = null
      setConnected(false)
    }
  }, [])

  return { isConnected, socket: socket.current }
}