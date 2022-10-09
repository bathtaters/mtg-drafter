export default function batchCallback<Data = any>(flushCount: number, callback: (data: Data[]) => void | Promise<void>) {
  let buffer: Data[] = []

  const append = async (data: Data) => {
    buffer.push(data)
    if (buffer.length >= flushCount) {
      const oldData = [...buffer]
      buffer = []
      if (oldData.length) await callback(oldData)
    }
  }
  
  const flush = async () => {
    const oldData = [...buffer]
    buffer = []
    if (oldData.length) await callback(oldData)
  }

  return {
    append, flush,
    run: async (dataArray: Data[]) => {
      for (const data of dataArray) { await append(data) }
      await flush()
    }
  }
}
