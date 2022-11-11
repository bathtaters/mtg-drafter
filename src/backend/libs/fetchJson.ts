import { parse } from 'jsonstream'
import { get } from 'https'

export default function fetchJson<Data = any>(url: string, onData: FetchCB<Data>, { jsonPath, limit, maxThreads = 750 }: FetchOptions = {}): Promise<number> {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      try {
        // Check for response errors
        const contentType = res.headers['content-type']
        if (res.statusCode !== 200)
            throw new Error(`Request Failed.\nStatus Code: ${res.statusCode}`)
        if (!contentType || !/^application\/json/.test(contentType))
            throw new Error(`Invalid content-type.\nExpected JSON but received ${contentType || '[Content Type Missing]'}`)
        
        // Setup pipe
        res.setEncoding('utf8')
        const jsonPipe = res.pipe(parse(jsonPath)) as NodeJS.ReadStream
        
        // Get new data
        let count = 0, threads = 0, isClosed = false
        jsonPipe.on('data', (data: Data) => {
          if (++threads === maxThreads && maxThreads) jsonPipe.pause()

          onData(data, count, jsonPipe.destroy).then(() => {
              if (threads-- === maxThreads && maxThreads) jsonPipe.resume()
              if (isClosed && !threads) resolve(count)
          })

          if (++count === limit && limit) return jsonPipe.destroy()
        });

        // Handle close/error
        jsonPipe.on('close', () => { isClosed = true; if (!threads) resolve(count) })
        jsonPipe.on('end',   () => { isClosed = true; if (!threads) resolve(count) })
        jsonPipe.on('drain', () => { isClosed = true; if (!threads) resolve(count) })
        
        jsonPipe.on('error', (err) => reject(err))

      // Handle more errors
      } catch(err) {
        res.resume()
        reject(err)
      }
    }).on('error', (err) => reject(err))
  })
}


// TYPES

interface FetchOptions {
  jsonPath?: string,
  limit?: number,
  maxThreads?: number,
}

type FetchCB<Data = any> = (data: Data, count: number, abortSignal: () => void) => Promise<void>