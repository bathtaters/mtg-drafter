export const fetcher = <T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T | number> =>
  fetch(input, init).then((res) => res.status === 200 ? res.json() : res.status)

export const post = <T = any>(url: string, data: any): Promise<T | number> => 
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(data) })
    .then((res) => res.status === 200 ? res.json() : res.status)

export const upload = <T = any>(url: RequestInfo | URL, file: File, name: string = 'file'): Promise<T | number> => {
  const data = new FormData()
  data.append(name, file)
  return fetcher(url, { method: 'POST', body: data })
}