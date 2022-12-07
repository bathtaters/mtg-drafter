import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import { useState, useEffect, useRef, useCallback, EffectCallback, DependencyList } from 'react'
import { debugSockets } from 'assets/constants'

const options: Partial<SocketOptions & ManagerOptions> = {
  // transports: ["websocket", "polling"], // Causes handleUpgrade error
  reconnectionDelayMax: 10 * 1000,
  reconnectionAttempts: 10,
}

export default function useSocket<S extends Socket = Socket>(
  path: string, endpoint: string,
  onConnect: (socket: S) => ReturnType<EffectCallback>,
  dependencies: DependencyList = [],
  onFail?: (error: { message: string, code?: number }) => void,
) {
  const socket = useRef<S | null>(null)
  const destructor = useRef<ReturnType<EffectCallback>>()
  const [ isConnected, setConnected ] = useState<boolean>(false)


  const updateIsConnected = useCallback(() => {
    setConnected((c) => {
      if (debugSockets && c === !socket.current?.connected) console.debug(`Socket connected at ${path} ${socket.current?.id || ''}`)
      return !!socket.current?.connected
    })
  }, [debugSockets])


  const disconnectFromSocket = useCallback(() => {
    if (!socket.current) return setConnected(false)
      
    if (destructor.current) destructor.current()
    socket.current.disconnect()
    socket.current.io.off()
    socket.current.off()
    socket.current = null
    destructor.current = undefined
  }, [])


  const connectToSocket = useCallback(async () => {
    const res = await fetch(endpoint)
    disconnectFromSocket()
  
    socket.current = io({ path, ...options }).on('connect', updateIsConnected).on('disconnect', updateIsConnected) as S

    onFail && socket.current.io.on('reconnect_failed', () => onFail({ message: 'Unable to re-establish connection to server' }))
  
    if (res.status !== 200 || !socket.current) {
      debugSockets && console.error('Error connecting sockets',res.statusText,res.status)
      disconnectFromSocket()
      onFail && onFail({ message: 'Unable to establish connection to server', code: res.status })
    }

    destructor.current = onConnect(socket.current)
    updateIsConnected()
  }, dependencies)


  useEffect(() => {
    if (typeof window !== 'undefined') connectToSocket()
    return disconnectFromSocket
  }, [connectToSocket, disconnectFromSocket])

  return { isConnected, socket: socket.current, reconnect: connectToSocket }
}