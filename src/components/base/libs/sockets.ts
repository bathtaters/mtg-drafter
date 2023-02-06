import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import { useState, useEffect, useRef, useCallback, EffectCallback, DependencyList } from 'react'
import { debugSockets } from 'assets/constants'
import { appendIfNotInList } from '../services/common.services'

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
  const emitQueue = useRef([] as Parameters<S['emit']>[])
  const destructor = useRef<ReturnType<EffectCallback>>()
  const [ isConnected, setConnected ] = useState<boolean>(false)


  const updateIsConnected = useCallback(async () => {
    setConnected((c) => {
      if (debugSockets && c === !socket.current?.connected) console.debug(`Socket connected at ${path} ${socket.current?.id || ''}`)
      return !!socket.current?.connected
    })

    if (socket.current?.connected) {
      if (debugSockets && emitQueue.current.length) console.debug(`Emptying emitter queue of ${emitQueue.current.length} items.`)
      while (emitQueue.current.length) {
        const args = emitQueue.current.shift()
        args && socket.current.emit.apply(socket.current, args)
        await new Promise((res) => setTimeout(res, Math.random() * 100)) // avoid overloading server after crash
      }
    }
  }, [path])


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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, endpoint, path, disconnectFromSocket, updateIsConnected])


  const emitOrQueue = useCallback((...args: Parameters<S['emit']>) => {
    if (socket.current?.connected) {
      socket.current.emit.apply(socket.current, args)
      return
    }
    if (appendIfNotInList(emitQueue.current, args) === -1 && debugSockets) console.debug(`Cancelled duplicate emit: ${args.filter((a) => typeof a !== 'function').join(', ')}`)
  }, [])


  useEffect(() => {
    if (typeof window !== 'undefined') connectToSocket()
    return disconnectFromSocket
  }, [connectToSocket, disconnectFromSocket])

  return { isConnected, socket: socket.current, emit: emitOrQueue, reconnect: connectToSocket }
}