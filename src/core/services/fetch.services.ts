export const fetcher = <T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T | number> =>
  fetch(input, init).then((res) => res.status === 200 ? res.json() : res.status)