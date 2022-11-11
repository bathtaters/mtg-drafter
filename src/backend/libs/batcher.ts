import AutoQueue from "./Queue"

export default function batchCallback<Data = any>(flushCount: number, callback: (data: Data[]) => void | Promise<void>) {
  let buffer: Data[] = [], queue = new AutoQueue<Data[], void>()

  const append = async (data: Data) => {
    buffer.push(data)
    if (buffer.length >= flushCount) {
      const oldData = [...buffer]
      buffer = []
      if (oldData.length) await queue.enqueue(callback, oldData)
    }
  }
  
  const flush = async () => {
    const oldData = [...buffer]
    buffer = []
    if (oldData.length) await queue.enqueue(callback, oldData)
    await queue.promise
  }

  return {
    append, flush,
    run: async (dataArray: Data[]) => {
      for (const data of dataArray) { await append(data) }
      await flush()
    }
  }
}
