import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type IntersectionChildProps, useIntersection } from "./hooks"
import { debounce, debounceGroup } from "components/base/services/common.services"

const INIT_DATA = {}, INIT_PREV = [] as any[]

/**
 * React Hook to dynamically fetch paginated data from an API.
 * 
 * This requires you to write a function to do the fetching.
 * (NOTE That handleFetch should be wrapped in useCallback if created inside a React component)
 * 
 * @param handleFetch - Function that accepts page and other parameters, fetchs and returns data from API.
 * ```ts
 * async (query: string, params: { offset: number, size: number, isPreview: boolean }) => {
 *  data?: Entry[],
 *  total: number,
 *  offset?: number,
 *  error?: string,
 * }
 * ```
 *  - `query` - Pre-formatted query string
 *  - `params` - Data from query string (Plus `isPreview`)
 *    - `offset` - Start index in Database
 *    - `size` - Number of entries/rows to return
 *    - `isPreview` - True if data will only be temporaryily displayed while full queries are loaded.
 *  - `result` - Info to pass back to Hook
 *    - `data` - Data to append to cache
 *    - `total` - Total number of entries in database
 *    - `offset` - Index of first entry in data
 *    - `error` - Description of error, if there was one
 * 
 * @param options - Base options to allow Dynamic fetching options
 * ```ts
 * {
 *  filter?: (entry: Entry) => boolean,
 *  initalEnabled?: boolean,
 *  initialData?: Entry[] | Record<number, Entry>,
 *  initialPreview?: Entry[] | undefined,
 *  initialTotal?: number,
 *  minSize?: number,
 *  maxSize?: number,
 *  debounceMs?: number,
 *  scrollMarginPxls?: number,
 * }
 * ```
 * - `filter` - Function to determine if a row should be visible (true)
 * - `initalEnabled/Data/Preview/Total` - Initial value of the respective items
 *    - *NOTE:* Any object/array values (i.e. `initialData`/`initialPreview`) should be **Memoized** to avoid excessive re-renders.
 *    - `Enabled` - True = hook is active, False = no actual fetched are performed
 *    - `Data` - Cache of all combined `data` responses (Ass an object with numeric keys)
 *    - `Preview` - Cache of preview data (`undefined` = no preview)
 *    - `Total` - Total number of entries in database
 * - `minSize/maxSize` - Minimum/Maximum number of entries to ask for in a single request
 * - `debounceMs` - Number of milliseonds worth of requests to bundle into a single request.
 * - `scrollMarginPxls` - Number of pixels an Element should be above/below the root to trigger a preload.
 * 
 * @returns All values/functions returned to User
 * ```ts
 * {
 *   entries: ({
 *     index: number, (Should be used as `key` attribute if required)
 *     entry?: Entry,
 *     childProps?: IntersectionChildProps<HTMLElement>,
 *     isFirst: boolean,
 *     isLoading: boolean
 *   } | null)[] | null,
 *   total: number,
 *   reset: boolean, 
 *   fetch: (params?: Params) => void,
 *   forceFetch: (options: { offset: number, size: number, isPreview: boolean } & Record<string,any>) => Params,
 *   enabled: boolean,
 *   setEnabled: (enable: boolean) => void,
 *   error: string,
 *   setError: (msg: string) => void,
 *   scrollParentRef: Ref,
 *   scrollItemProps: (index: number) => Ref,
 * }
 * ```
 *  - `entries` - List with data used to build components
 *     - `key` - Generic key for usign .map (= index)
 *     - `index` - Index value from database
 *     - `entry` - User `Entry` data
 *     - `childProps` - Spread this within a child component to force loading that specific offset
 *        whe it becomes visible (Will change to `undefined` once the entry has been cached)
 *     - `isFirst` - True if entry is the top-most entry
 *     - `isLoading` - True if entry is still loading (If `entry` is provided & this is True, `entry` is a Preview)
 *   -  `total` - Total count of entries (Used to generate placeholders)
 *   -  `fetchAll` - Fill out all remaining data, returning it as a list.
 *   -  `reset` - Function to clear cache and begin reload process
 *   -  `fetch` - Trigger a manual fetch with specific params (Calls to this will be automatically debounced)
 *   -  `forceFetch` - Same as above, excpet this is NOT debounced and it will return the actual data.
 *   -  `enabled` - True/False if fetching new data is enabled/disabled
 *   -  `setEnabled` - Sets value of `enabled`
 *   -  `error` - Error message, if there is currently an error
 *   -  `setError` - Sets value of `error` (Set to `undefined` to clear error)
 *   -  `scrollParentRef` - React 'ref' that should be passed to immediate parent of item list (Must be IMMEDIATE parent!)
 *   -  `scrollItemProps` - Function to generate a React 'ref' based off the index value
 *        (Should be called using 'index' from every immediate child of `scrollParentRef`representing an entry)
 */
export function useDynamicScrollFetcher<Entry, Params extends FetchParams = FetchParams>(
  handleFetch: FetchHandler<Entry, Params>,
  {
    filter,
    initalEnabled = true, initialData = INIT_DATA, initialPreview = INIT_PREV, initialTotal,
    minSize = 0, maxSize = 1000, debounceMs = 500, 
    scrollMarginPxls = 200,
  }: DynamicFetcherOptions<Entry> = {},
) {
  const isFirstLoad = useRef(true)
  const [ entries, setEntries ] = useState(Array.isArray(initialData) ? arrayToObject(initialData) : initialData)
  const [ preview, setPreview ] = useState<Entry[] | undefined>(initialPreview)
  const [ total,   setTotal   ] = useState(initialTotal)
  const [ error,   setError   ] = useState<string>()
  const [ enabled, setEnabled ] = useState(initalEnabled)
  const [ cursor,  setCursor  ] = useState(0)


  const forceFetch = useCallback(async ({ offset, size, isPreview, ...params }: Params = {} as Params) => {

    // Build query
    const queryString = objToQuery({ offset, size: size ?? minSize, ...params })

    // Fetch data & error check
    let res: FetchResponse<Entry> | undefined = undefined
    try {
      res = await handleFetch(queryString, { offset, size, isPreview, ...params } as Params)
    } catch (err: any) {
      if (err?.message) { setError(err?.message); return [] }
      else throw new Error(err.message)
    }

    // Update state, handle missing properties
    if (!res) {
      setTotal((total) => total ?? 0)
      return []
    }
    if (res.error) setError(res.error)
    if (!('total' in res)) return []
    
    const total = res.total
    if (total != null) setTotal(total)
    if (!res.data) return []

    // Add data to cache
    const newData = [...res.data]
    if (isPreview) {
      setPreview((prev) => prev && newData)
      return newData
    }

    const resOffset = res.offset ?? offset ?? Math.max(0, total - newData.length)
    setEntries((log) => {
      log = { ...log }
      for (let i = 0; i < newData.length; i++) log[i + resOffset] = newData[i]
      return log
    })

    // Move cursor
    setCursor((prev) => Math.max(total - resOffset, prev))
    return newData
  }, [handleFetch, minSize])


  // eslint-disable-next-line react-hooks/exhaustive-deps -- Debounce function
  const groupFetch = useCallback(
    debounceGroup<number>((offsets) => enabled && !error &&
      forceFetch(listToParams(offsets, total, minSize, maxSize, isFirstLoad.current) as Params)
    , debounceMs),
    [total, enabled, !error, forceFetch, debounceMs]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps -- Debounce function
  const nonPreviewFetch = useCallback(
    debounce((params: Params = {} as Params) => enabled && !error && forceFetch(params), debounceMs),
    [enabled, !error, forceFetch, debounceMs]
  )
  
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Debounce function
  const previewFetch = useCallback(
    debounce((params: Params = {} as Params) => enabled && !error && !!preview && forceFetch(params), debounceMs),
    [enabled, !error, !preview, forceFetch, debounceMs]
  )


  const fetch = useCallback(
    (params: Params = {} as Params) => params.isPreview ? previewFetch(params) : nonPreviewFetch(params),
    [previewFetch, nonPreviewFetch]
  )


  const reset = useCallback((resetCache = false) => {
    isFirstLoad.current = true
    setTotal(initialTotal)
    setPreview(initialPreview)
    setError(undefined)
    setCursor(0)
    if (resetCache) setEntries(Array.isArray(initialData) ? arrayToObject(initialData) : initialData)
  }, [initialTotal, initialData, initialPreview])


  // Dynamic loading controller
  const { parentRef, childProps } = useIntersection(
    (index) => groupFetch(index),
    { threshold: 1, rootMargin: `${scrollMarginPxls ?? 0}px 0px ${scrollMarginPxls ?? 0}px 0px` },
    [groupFetch, total, entries, filter, cursor, preview],
  )


  // Get count of loaded + unfiltered
  const displayCount = useMemo(() => Object.keys(entries).reduce((count, idx) => +(!filter || filter(entries[idx])) + count, 0), [entries, filter])
  
  // Clear preview data if it is unused
  const previewCount = preview?.length
  useEffect(() => {
    if (previewCount && displayCount && previewCount <= displayCount) {
      isFirstLoad.current = false
      setPreview(undefined)
    }
  }, [previewCount, displayCount])

  // Reset 'firstLoad' state whenever the filter changes
  useEffect(() => { isFirstLoad.current = true }, [filter])
  
  // Main array of loaded/filtered data
  const entryData = useMemo((): (EntryData<Entry> | null)[] | null => {
      if (total == null) return null
      
      const data =  Array.from({ length: total }).map((_, idx) => {
        const index = total - idx - 1 // in reverse order to maintain constant indexes if items are added

        if (!entries[index]) {
          const previewEntry = preview?.[idx - cursor + displayCount]
          
          /* Not loaded... */
          if (!previewEntry) return {
            index,
            childProps: childProps(index),
            isFirst: false,
            isLoading: true,
          }
          
          /* Preview... */
          return {
            index,
            entry: previewEntry,
            childProps: childProps(index),
            isFirst: false,
            isLoading: true,
          }
        }

        /* Filtered */
        if (filter && !filter(entries[index])) return null

        /* Regular entry */
        return {
          index,
          entry: entries[index],
          isFirst: false,
          isLoading: false,
        }
      })

      // Set isFirst on the first non-null entry
      const last = data.find((entry) => entry)
      if (last) last.isFirst = true
      
      return data
    },
    [total, entries, preview, cursor, displayCount, filter, childProps],
  )

  const fetchAll = async (extraParams: Omit<Params, 'offset'|'isPreview'> = {} as Params) => {
    if (total == null) return []
    
    let list: Entry[] = []
    for (let idx = 0; idx < total; idx++) {
      if (entries[idx]) {
        list.push(entries[idx])
        continue
      }

      // Download missing data
      const newData = await forceFetch({ size: maxSize, ...extraParams, offset: idx } as Params)
      for (const end = idx + newData.length; idx < end; idx++) {
        list.push(newData[idx])
      }
    }

    return list
  }

  return {
    entries: entryData,
    total, fetchAll, reset, 
    fetch, forceFetch,
    enabled, setEnabled,
    error,   setError,
    scrollParentRef: parentRef,
    scrollItemProps: childProps
  }
}



// *** --- UTILITIES --- *** //

const arrayToObject = <T>(arr: T[]) => Object.fromEntries(arr.map((v,i) => [i,v]))

const anyToString = (value: any): string | null => value == null ? null :
  typeof value?.toJSON === 'function' ? value.toJSON() :
  (typeof value !== 'object' || value instanceof RegExp) &&
    typeof value?.toString === 'function' ? value.toString() : JSON.stringify(value)

export const objToQuery = (params: any) => {
  let query: Record<string, string> = {}
  for (const key in params) {
      const val = anyToString(params[key])
      if (val != null) query[key] = val
  }
  return new URLSearchParams(query).toString()
}

/** Logic for which objects to load -- NOTE: indexList starts with most recently 'seen' index */
const listToParams = (indexList: number[], total: number | undefined, minSize: number, maxSize: number, isReverseOrder?: boolean): Pick<FetchParams, 'offset'|'size'> => {
  if (!indexList.length) return { offset: 0, size: 0 }

  let offset = indexList[0], end = indexList[0]
  for (const num of indexList) {
    // Find min/max, stopping early if max size is reached
    if (num < offset) {
      offset = num
      if (end - offset > maxSize)
        return { offset, size: maxSize }
      
    } else if (num > end) {
      end = num
      if (end - offset > maxSize)
        return { offset: end - maxSize, size: maxSize }
    }
  }
  
  let size = end - offset + 1
  // Resize range based on screen location & scroll direction
  if (size < minSize) {
    if (end - minSize <= 0) offset = 0
    else if (total == null) offset = Math.max(end - minSize + 1, 0)
    else if (offset + minSize > total) offset = total - minSize
    else if (indexList[0] < indexList[indexList.length - 1] || isReverseOrder) // AKA Moving down
      offset = Math.max(end - minSize + 1, 0)
    // If Moving up, keep offset
    size = minSize
  }

  return { offset, size }
}


// *** --- TYPES --- *** //

export type DynamicFetcherOptions<Entry> = {
  filter?: (entry: Entry) => boolean,
  initalEnabled?: boolean,
  initialData?: Entry[] | Record<number, Entry>,
  initialPreview?: Entry[] | undefined,
  initialTotal?: number,
  minSize?: number,
  maxSize?: number,
  debounceMs?: number,
  scrollMarginPxls?: number,
}

export type FetchParams = Record<string, any> & { offset?: number, size?: number, isPreview?: boolean }
export type FetchResponse<Data> = { data?: Data[], total: number, offset?: number, error?: string } | { error: string }
export type EntryData<Entry> = { index: number, entry?: Entry, childProps?: IntersectionChildProps<HTMLElement>, isFirst: boolean, isLoading: boolean }
export type FetchHandler<Entry, Params extends FetchParams> = (queryString: string, params: Params) => Promise<FetchResponse<Entry> | undefined>

type HookReturn<Entry, Params> = {
  entries: ({
    key: number,
    index: number,
    entry?: Entry,
    childProps?: IntersectionChildProps<HTMLElement>,
    isFirst: boolean,
    isLoading: boolean
  } | null)[] | null,
  total: number,
  reset: boolean, 
  fetch: (params?: Params) => void,
  forceFetch: (options: { offset: number, size: number, isPreview: boolean } & Record<string,any>) => Params,
  enabled: boolean,
  setEnabled: (enable: boolean) => void,
  error: string,
  setError: (msg: string) => void,
  scrollParentRef: any,
  scrollItemProps: any[],
}