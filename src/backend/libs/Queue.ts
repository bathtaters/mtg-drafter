
class Queue<I = any> {
  _items: I[]

  constructor()    { this._items = [] }
  _enqueue(item: I) { this._items.push(item) }
  _dequeue()        { return this._items.shift() }
  get size()       { return this._items.length }
}


interface AutoQueueItem<A, R> {
  arg: A,
  action: (arg: A) => Promise<R> | R,
  resolve: (result: R) => void,
  reject: (reason?: any) => void
}


export default class AutoQueue<Arg = any, Ret = any> extends Queue<AutoQueueItem<Arg, Ret>> {
  _pendingPromise: boolean
  _promiseAll: Promise<void>
  _resolveAll?: () => void

  constructor() {
    super()
    this._pendingPromise = false
    this._promiseAll = Promise.resolve()
  }

  get promise() { return this._promiseAll }

  enqueue(action: (arg: Arg) => Promise<Ret> | Ret, arg: Arg) {
    if (!this._resolveAll) this._promiseAll = new Promise((res) => { this._resolveAll = res })

    return new Promise((resolve, reject) => {
      this._enqueue({ action, arg, resolve, reject })
      this.dequeue()
    })
  }

  async dequeue() {
    if (this._pendingPromise) return false

    const next = this._dequeue()

    if (!next) {
      if (this._resolveAll) this._resolveAll()
      return false
    }

    try {
      this._pendingPromise = true

      let result = await next.action(next.arg)

      this._pendingPromise = false
      next.resolve(result)
    } catch (e) {
      this._pendingPromise = false
      next.reject(e)
    } finally {
      this.dequeue()
    }

    return true
  }
}