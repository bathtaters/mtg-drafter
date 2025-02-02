export type FetchResponse<T = any> = { status: number, data?: T, error?: any }

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