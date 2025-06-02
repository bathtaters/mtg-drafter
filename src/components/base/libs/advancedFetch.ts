import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { objToQuery } from "./fetch";
import {
  debounce,
  debounceGroup,
} from "components/base/services/common.services";

const INIT_DATA = {},
  INIT_PREV = [] as any[];

/**
 * React Hook to generate debounced fetch functions for a paginated API endpoint.
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
 *
 * @returns All values/functions returned to User
 * ```ts
 * {
 *   entries: ({
 *     index: number, (Should be used as `key` attribute if required)
 *     entry?: Entry,
 *     isFirst: boolean,
 *     isLoading: boolean
 *   } | null)[] | null,
 *   total: number,
 *   reset: boolean,
 *   fetch: (params?: Params) => void,
 *   forceFetch: (options: { offset: number, size: number, isPreview: boolean } & Record<string,any>) => Params,
 *   intersectFetch: IntersectionHandler,
 *   enabled: boolean,
 *   setEnabled: (enable: boolean) => void,
 *   error: string,
 *   setError: (msg: string) => void,
 * }
 * ```
 *  - `entries` - List with data used to build components
 *     - `key` - Generic key for usign .map (= index)
 *     - `index` - Index value from database
 *     - `entry` - User `Entry` data
 *     - `isFirst` - True if entry is the top-most entry
 *     - `isLoading` - True if entry is still loading (If `entry` is provided & this is True, `entry` is a Preview)
 *   -  `total` - Total count of entries (Used to generate placeholders)
 *   -  `fetchAll` - Fill out all remaining data, returning it as a list.
 *   -  `reset` - Function to clear cache and begin reload process
 *   -  `fetch` - Trigger a manual fetch with specific params (Calls to this will be automatically debounced)
 *   -  `forceFetch` - Same as above, excpet this is NOT debounced and it will return the actual data.
 *   -  `intersectFetch` - Fetch function that cab be passed to the ***useIntersection*** hook as the `handleIntersect` parameter.
 *   -  `enabled` - True/False if fetching new data is enabled/disabled
 *   -  `setEnabled` - Sets value of `enabled`
 *   -  `error` - Error message, if there is currently an error
 *   -  `setError` - Sets value of `error` (Set to `undefined` to clear error)
 */
export default function useAdvancedFetch<
  Entry,
  Params extends FetchParams = FetchParams,
>(
  handleFetch: FetchHandler<Entry, Params>,
  {
    filter,
    initalEnabled = true,
    initialData = INIT_DATA,
    initialPreview = INIT_PREV,
    initialTotal,
    minSize = 0,
    maxSize = 1000,
    debounceMs = 500,
  }: AdvancedFetchOptions<Entry> = {}
) {
  const isFirstLoad = useRef(true);
  const [rawData, setRawData] = useState(
    Array.isArray(initialData) ? arrayToObject(initialData) : initialData
  );
  const [preview, setPreview] = useState<Entry[] | undefined>(initialPreview);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState<string>();
  const [enabled, setEnabled] = useState(initalEnabled);
  const [cursor, setCursor] = useState(0);

  const forceFetch = useCallback(
    async ({ offset, size, isPreview, ...params }: Params = {} as Params) => {
      // Ignore queries asking for no data, or preview requests beyond the first one
      if (size === 0 || (isPreview && !isFirstLoad.current)) return [];

      // Build query
      const queryString = objToQuery({
        offset,
        size: size ?? minSize,
        ...params,
      });

      // Fetch data & error check
      let res: FetchResponse<Entry> | undefined = undefined;
      try {
        res = await handleFetch(queryString, {
          offset,
          size,
          isPreview,
          ...params,
        } as Params);
      } catch (err: any) {
        if (err?.message) {
          setError(err?.message);
          return [];
        } else throw new Error(err.message);
      }

      // Update state, handle missing properties
      if (!res) {
        setTotal((total) => total ?? 0);
        return [];
      }
      if (res.error) setError(res.error);
      if (!("total" in res)) return [];

      const total = res.total;
      if (total != null) setTotal(total);
      if (!res.data) return [];

      // Add data to cache
      const newData = [...res.data];
      if (isPreview) {
        isFirstLoad.current = false;
        setPreview((prev) => prev && newData);
        return newData;
      }

      const resOffset =
        res.offset ?? offset ?? Math.max(0, total - newData.length);
      setRawData((log) => {
        log = { ...log };
        for (let i = 0; i < newData.length; i++)
          log[i + resOffset] = newData[i];
        return log;
      });

      // Move cursor
      setCursor((prev) => Math.max(total - resOffset, prev));
      return newData;
    },
    [handleFetch, minSize]
  );

  const hasError = !!error;

  const intersectFetch = useMemo(
    () =>
      !enabled || hasError
        ? () => {}
        : debounceGroup<number>(
            (offsets) =>
              forceFetch(
                listToParams(offsets, cursor, total, minSize, maxSize) as Params
              ),
            debounceMs
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filter required below for IntersectionObserver to work
    [
      cursor,
      total,
      enabled,
      hasError,
      forceFetch,
      minSize,
      maxSize,
      debounceMs,
      filter,
    ]
  );

  const fetch = useMemo(
    () =>
      !enabled || hasError
        ? () => {}
        : debounce(
            (params: Params = {} as Params) => forceFetch(params),
            debounceMs
          ),
    [enabled, hasError, forceFetch, debounceMs]
  );

  const reset = useCallback(
    (resetCache = false) => {
      isFirstLoad.current = true;
      setTotal(initialTotal);
      setPreview(initialPreview);
      setError(undefined);
      setCursor(0);
      if (resetCache)
        setRawData(
          Array.isArray(initialData) ? arrayToObject(initialData) : initialData
        );
    },
    [initialTotal, initialData, initialPreview]
  );

  // Reset 'firstLoad' state whenever the filter changes
  useEffect(() => {
    isFirstLoad.current = true;
  }, [filter]);

  // Generate main array of loaded/filtered data
  const entries = useMemo(() => {
    if (total == null) return null;

    // Get count of loaded + unfiltered
    const displayCount = Object.keys(rawData).reduce(
      (count, idx) => +(!filter || filter(rawData[idx])) + count,
      0
    );

    // Clear preview data if it is unused
    if (preview?.length && displayCount && preview.length <= displayCount) {
      isFirstLoad.current = false;
      setPreview(undefined);
    }

    let firstEntry = true;
    return Array.from({ length: total }).map((_, idx) => {
      const index = total - idx - 1; // in reverse order to maintain constant indexes if items are added
      const isLoading = !rawData[index];
      const entry = isLoading
        ? preview?.[idx - cursor + displayCount]
        : rawData[index];
      const isFiltered =
        !isLoading && Boolean(filter && !filter(rawData[index]));

      const isFirst = firstEntry && !isFiltered;
      if (isFirst) firstEntry = false; // Flip after first entry

      return { index, entry, isFirst, isLoading, isFiltered };
    });
  }, [rawData, total, preview, cursor, filter]);

  const fetchAll = async (
    extraParams: Omit<Params, "offset" | "isPreview"> = {} as Params
  ) => {
    if (total == null) return [];

    let list: Entry[] = [];
    for (let idx = 0; idx < total; idx++) {
      if (rawData[idx]) {
        list.push(rawData[idx]);
        continue;
      }

      // Download missing data
      const newData = await forceFetch({
        size: maxSize,
        ...extraParams,
        offset: idx,
      } as Params);
      for (const end = idx + newData.length; idx < end; idx++) {
        list.push(newData[idx]);
      }
    }

    return list;
  };

  return {
    entries,
    total,
    fetch,
    forceFetch,
    reset,
    fetchAll,
    intersectFetch,
    enabled,
    setEnabled,
    error,
    setError,
  };
}

// *** --- UTILITIES --- *** //

const arrayToObject = <T>(arr: T[]) =>
  Object.fromEntries(arr.map((v, i) => [i, v]));

/** Logic for which objects to load -- NOTE: indexList starts with most recently 'seen' index */
const listToParams = (
  indexList: number[],
  cursor: number,
  total: number | undefined,
  minSize: number,
  maxSize: number
): Pick<FetchParams, "offset" | "size"> => {
  if (!indexList.length || cursor === total) return { offset: 0, size: 0 };
  cursor = total == null ? 0 : total - cursor - 1;

  let offset = cursor ? Math.min(cursor, indexList[0]) : indexList[0];
  let end = offset;
  for (const num of indexList) {
    if (cursor && num > cursor) continue; // don't reload already loaded data

    // Find min/max, stopping early if max size is reached
    if (num < offset) {
      offset = num;
      if (end - offset >= maxSize) return { offset, size: maxSize };
    } else if (num > end) {
      end = num;
      if (end - offset >= maxSize)
        return { offset: end - maxSize, size: maxSize };
    }
  }
  if (offset === cursor) return { offset: 0, size: 0 };

  let size = end - offset + 1;
  // Resize range based on screen location & scroll direction
  if (size < minSize) {
    if (end - minSize <= 0) offset = 0;
    else if (total == null) offset = Math.max(end - minSize + 1, 0);
    else if (offset + minSize > total) offset = total - minSize;
    else if (indexList[0] < indexList[indexList.length - 1])
      // AKA Moving down
      offset = Math.max(end - minSize + 1, 0);
    // If Moving up, keep offset
    size = minSize;
  }

  return { offset, size };
};

// *** --- TYPES --- *** //

export type AdvancedFetchOptions<Entry> = {
  filter?: (entry: Entry) => boolean;
  initalEnabled?: boolean;
  initialData?: Entry[] | Record<number, Entry>;
  initialPreview?: Entry[] | undefined;
  initialTotal?: number;
  minSize?: number;
  maxSize?: number;
  debounceMs?: number;
};

export type FetchParams = Record<string, any> & {
  offset?: number;
  size?: number;
  isPreview?: boolean;
};
export type FetchResponse<Data> =
  | { data?: Data[]; total: number; offset?: number; error?: string }
  | { error: string };
export type EntryData<Entry> = {
  index: number;
  entry?: Entry;
  isFirst: boolean;
  isLoading: boolean;
  isFiltered: boolean;
};
export type FetchHandler<Entry, Params extends FetchParams> = (
  queryString: string,
  params: Params
) => Promise<FetchResponse<Entry> | undefined>;
