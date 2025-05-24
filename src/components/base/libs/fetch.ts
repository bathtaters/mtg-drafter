export type FetchResponse<T = any> = { status: number, data?: T, error?: any }
export type PageRes<T = any> = { [dataArrayKey: string]: T[] } & { total: number, offset?: number, size?: number }

export const fetcher = <T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<FetchResponse<T>> =>
  fetch(input, init).then((res) =>
    res.json().then((data: T) => ({ status: res.status, data }))
      .catch((error) => ({ status: res.status, error: String(error) }))
)

export const post = <T = any>(url: string, data: any): Promise<FetchResponse<T>> => 
  fetcher(url, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(data) })

export const upload = <T = any>(url: RequestInfo | URL, file: File, name: string = 'file'): Promise<FetchResponse<T>> => {
  const data = new FormData()
  data.append(name, file)
  return fetcher(url, { method: 'POST', body: data })
}


/** Fetch from a url that accepts offset & size query params,
 *  and returns { [key]: [...data], total: number }.
 *  Returns the complete data array or an HTTP Status Code if there was error. */
export async function paginatedFetcher<T = any>(url: string, { size = 100, key = 'data', params = {}, timeoutMs = 10 }: PaginatedOptions = {}) {
  let collected = [] as T[]
  
  for (let total = size, offset = 0; offset < total; ) {
    const res = await fetcher<PageRes<T>>(`${url}?${objToQuery({ size, offset, ...params })}`)

    if (res.status === 204) break

    else if (res.status >= 400 || res.error || res.data?.total == null)
      return res.status

    else if (!res.data[key]?.length) break

    total = res.data.total
    offset += res.data[key].length
    collected = collected.concat(res.data[key])

    if (timeoutMs) await new Promise((res) => setTimeout(res, timeoutMs)) // Sleep
  }
  return collected
}

type PaginatedOptions = { size?: number, key?: string, params?: Record<string, any>, timeoutMs?: number }


// *** --- UTILITIES --- *** //

const anyToString = (value: any): string | null => value == null ? null :
  typeof value?.toJSON === 'function' ? value.toJSON() :
  (typeof value !== 'object' || value instanceof RegExp) &&
    typeof value?.toString === 'function' ? value.toString() : JSON.stringify(value)

/** Convert a parameter object to a url query string. */
export const objToQuery = (params: any) => {
  let query: Record<string, string> = {}
  for (const key in params) {
      const val = anyToString(params[key])
      if (val != null) query[key] = val
  }
  return new URLSearchParams(query).toString()
}