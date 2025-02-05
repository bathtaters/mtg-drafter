import { useCallback, useEffect, useMemo, useState } from "react"
import { type IntersectionChildProps, useIntersection } from "./hooks"
import { debounce, debounceGroup } from "components/base/services/common.services"


export function useDynamicScrollFetcher<Entry, Params extends FetchParams = FetchParams>(
  handleFetch: FetchHandler<Entry, Params>,
  {
    filter,
    initalEnabled = true, initialData = {}, initialPreview = [], initialTotal,
    minSize = 0, maxSize = 1000, debounceMs = 500, 
    scrollThreshold = 1, scrollMarginPxls = 200,
  }: DynamicFetcherOptions<Entry> = {},
) {
  const [ entries, setEntries ] = useState(Array.isArray(initialData) ? arrayToObject(initialData) : initialData)
  const [ preview, setPreview ] = useState<Entry[] | undefined>(initialPreview)
  const [ total,   setTotal   ] = useState(initialTotal)
  const [ error,   setError   ] = useState<string>()
  const [ enabled, setEnabled ] = useState(initalEnabled)
  const [ cursor,  setCursor  ] = useState({ first: 0, next: 0 })


  const forceFetch = useCallback(async ({ offset, size, isPreview, ...params }: Params = {} as Params) => {

    // Build query
    let query: Record<string, string> = { size: (size ?? minSize).toString() }
    if (offset != null) query.offset = offset.toString()
    for (const key in params) {
      const val = anyToString((params as any)[key])
      if (val != null) query[key] = val
    }
    const queryString = new URLSearchParams(query).toString()

    // Fetch data & error check
    let res: FetchResponse<Entry> | undefined = undefined
    try {
      res = await handleFetch(queryString, { offset, size, isPreview, ...params } as Params)
    } catch (err: any) {
      if (err?.message) return setError(err?.message)
      else throw new Error(err.message)
    }

    // Update state, handle missing properties
    if (!res) return;
    if (res.error) setError(error)
    if (!('total' in res)) return;
    
    const total = res.total
    if (total) setTotal(total)
    if (!res.data) return;

    // Add data to cache
    const newData = [...res.data]
    if (isPreview) return setPreview((prev) => prev && newData)

    const resOffset = res.offset ?? offset ?? Math.max(0, total - newData.length)
    setEntries((log) => {
      log = { ...log }
      for (let i = 0; i < newData.length; i++) log[i + resOffset] = newData[i]
      return log
    })

    // Move cursor
    setCursor(({ first, next }) => ({
      first: Math.max(resOffset + newData.length - 1, first),
      next: Math.max(total - resOffset, next),
    }))
  }, [handleFetch, minSize])


  // eslint-disable-next-line react-hooks/exhaustive-deps -- Debounce function
  const groupFetch = useCallback(
    debounceGroup<number>((offsets) => enabled && !error && forceFetch(listToParams(offsets, total, minSize, maxSize) as Params), debounceMs),
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
    setTotal(initialTotal)
    setPreview(initialPreview)
    setError(undefined)
    setCursor({ first: 0, next: 0 })
    if (resetCache) setEntries(Array.isArray(initialData) ? arrayToObject(initialData) : initialData)
  }, [])


  // Dynamic loading controller
  const { parentRef, childProps } = useIntersection(
    (index) => groupFetch(index),
    { threshold: scrollThreshold, rootMargin: `${scrollMarginPxls ?? 0}px 0px ${scrollMarginPxls ?? 0}px 0px` },
    [groupFetch, total, entries, filter, cursor, preview],
  )


  // Get count of loaded + unfiltered
  const displayCount = useMemo(() => Object.keys(entries).reduce((count, idx) => +(!filter || filter(entries[idx])) + count, 0), [entries, filter])

  // Clear preview data if it is unused
  useEffect(() => { if (preview && displayCount > preview.length) setPreview(undefined) }, [preview, displayCount])
  
  // Main array of loaded/filtered data
  const entryData = useMemo((): (EntryData<Entry> | null)[] | null =>
    total == null ? null : Array.from({ length: total }).map((_, idx) => {
      const index = total - idx - 1 // in reverse order to maintain constant indexes if items are added

      if (!entries[index]) {
        const previewEntry = preview?.[idx - cursor.next + displayCount]
        
        /* Not loaded... */
        if (!previewEntry) return {
          index, key: index,
          childProps: childProps(index),
          isFirst: cursor.first === index,
          isLoading: true,
        }
        
        /* Preview... */
        return {
          index, key: index,
          entry: previewEntry,
          childProps: childProps(index),
          isFirst: cursor.first === index,
          isLoading: true,
        }
      }

      /* Filtered */
      if (filter && !filter(entries[index])) return null

      /* Regular entry */
      return {
        index, key: index,
        entry: entries[index],
        isFirst: cursor.first === index,
        isLoading: false,
      }
    }),
    [total, entries, preview, cursor, filter, childProps]
  )

  return {
    entries: entryData,
    total, reset, 
    fetch, forceFetch,
    enabled, setEnabled,
    error,   setError,
    scrollParentRef: parentRef,
    scrollItemProps: childProps
  }
}



// *** --- UTILITIES --- *** //

const arrayToObject = <T>(arr: T[]) => Object.fromEntries(arr.map((v,i) => [i,v]))

const anyToString = (value: any): string | null => value == null ? null : typeof value?.toString === 'function' ? value.toString() : JSON.stringify(value)

/** Logic for which objects to load */
const listToParams = (indexList: number[], total: number | undefined, minSize: number, maxSize: number): Pick<FetchParams, 'offset'|'size'> => {
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
    else if (indexList[0] >= indexList[indexList.length - 1]) // AKA Moving downa
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
  scrollThreshold?: number,
  scrollMarginPxls?: number,
}

export type FetchParams = Record<string, any> & { offset?: number, size?: number, isPreview?: boolean }
export type FetchResponse<Data> = { data?: Data[], total: number, offset?: number, error?: string } | { error: string }
export type EntryData<Entry> = { key: number, index: number, entry?: Entry, childProps?: IntersectionChildProps<HTMLElement>, isFirst: boolean, isLoading: boolean }
export type FetchHandler<Entry, Params extends FetchParams> = (queryString: string, params: Params) => Promise<FetchResponse<Entry> | undefined>