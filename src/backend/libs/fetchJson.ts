import type { FilterOptions } from 'stream-json/filters/FilterBase'
import { get } from 'https'
import { parser } from 'stream-json'
import { pick } from 'stream-json/filters/Pick'
import { streamArray } from 'stream-json/streamers/StreamArray'
import { streamObject } from 'stream-json/streamers/StreamObject'

/**
 * Fetch a large JSON from a URL and parse it entry by entry.
 * @param url - Fetch URL
 * @param onData - Called after each entry is parsed.
 * @param options
 * @returns Resolves to count of entries parsed on success or rejects to error message on failure
 */
export default function fetchJson<JSONEntry = any>(url: string, onData: FetchCB<JSONEntry>, { jsonPath, isArray, limit, maxThreads = 500 }: FetchOptions = {}): Promise<number> {
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
        let jsonPipe = res.pipe(parser())

        // Apply JSONPath filter if provided
        if (jsonPath) {
          jsonPipe = jsonPipe.pipe(pick({ filter: jsonPath }))
        }
        jsonPipe = isArray ? jsonPipe.pipe(streamArray()) : jsonPipe.pipe(streamObject())

        // Consume entries
        let count = 0, threads = 0, isClosed = false
        jsonPipe.on('data', async ({ value, key }:{ value: JSONEntry, key: number | string }) => {
          if (++threads === maxThreads && maxThreads) jsonPipe.pause()

          await onData(value, key, count, jsonPipe.destroy)

          if (++count === limit && limit) return jsonPipe.destroy()
          if (threads-- === maxThreads && maxThreads) jsonPipe.resume()
          if (isClosed && !threads) resolve(count)
        })

        // Handle close/error
        jsonPipe.on('close', () => { isClosed = true; if (!threads) resolve(count); })
        jsonPipe.on('end', () => { isClosed = true; if (!threads) resolve(count); })
        jsonPipe.on('drain', () => { isClosed = true; if (!threads) resolve(count); })

        jsonPipe.on('error', (err) => reject(err))

      // Handle more errors
      } catch (err) {
        res.resume()
        reject(err)
      }
    }).on('error', (err) => reject(err))
  })
}


// TYPES

interface FetchOptions {
  /** Path/Filter to select data. Can be string/regex to match to a dot-delimited JSONPath.
   *  See options.filter here for more: https://github.com/uhop/stream-json/wiki/FilterBase#constructoroptions */
  jsonPath?: FilterOptions['filter'],
  /** Assumes that the top-level (or jsonPath) is an array and streams entries one-by-one (FetchCB.key: number).
   *  By default this will assume an Object and stream each top-level property as an entry (FetchCB.key: string). */
  isArray?: boolean,
  /** Only process first N entries (<1 = no limit) */
  limit?: number,
  /** Limit concurrent processing to N threads (0 = no limit, <0 = error) */
  maxThreads?: number,
}

type FetchCB<JSONEntry = any> = (value: JSONEntry, key: number | string, count: number, abortSignal: () => void) => Promise<any> | any