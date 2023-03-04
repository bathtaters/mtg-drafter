import { parse } from 'jsonstream'
import { get } from 'https'

/**
 * Fetch a large JSON from a URL and parse it entry by entry.
 * @param url - Fetch URL
 * @param onData - Called after each entry is parsed
 * @param options
 * @returns Resolves to count of entries parsed on suceess or rejects to error message on failure
 */
export default function fetchJson<JSONEntry = any>(url: string, onData: FetchCB<JSONEntry>, { jsonPath, limit, maxThreads = 500 }: FetchOptions = {}): Promise<number> {
  if (maxThreads < 0) throw new Error('maxThreads must be a non-negative integer')

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
        
        // Get new entry
        let count = 0, threads = 0, isClosed = false
        jsonPipe.on('data', async (entry: JSONEntry) => {
          if (++threads === maxThreads && maxThreads) jsonPipe.pause()

          await onData(entry, count, jsonPipe.destroy)

          if (++count === limit && limit) return jsonPipe.destroy()
          if (threads-- === maxThreads && maxThreads) jsonPipe.resume()
          if (isClosed && !threads) resolve(count)
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
  /*** XPath for JSON, see https://goessner.net/articles/JsonPath/index.html#e2 */
  jsonPath?: string,
  /** Only process first N entries (<1 = no limit) */
  limit?: number,
  /** Limit concurrent processing to N threads (0 = no limit, <0 = error) */
  maxThreads?: number,
}

type FetchCB<JSONEntry = any> = (entry: JSONEntry, count: number, abortSignal: () => void) => Promise<any> | any