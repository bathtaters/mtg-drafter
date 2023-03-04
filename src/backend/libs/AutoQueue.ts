// BASE CLASS
class Queue<I = any> {
  /* Adapted from Blindman67 answer here: https://codereview.stackexchange.com/a/255758 */
  private _head?: ListItem<I>
  private _tail?: ListItem<I>

  protected _enqueue(item: I) {
    const newTail: ListItem<I> = { item }
    if (this._head) this._tail = this._tail!.next = newTail
    else this._tail = this._head = newTail
  }
  protected _dequeue() {
    const oldHead = this._head
    if (oldHead) this._head = oldHead.next
    return oldHead?.item
  }
  protected _peek() { return this._head?.item }
}

/** A job queue that will automatically execute jobs sequentially */
export default class AutoQueue<Arg = any, Ret = any> extends Queue<AutoQueueItem<Arg, Ret>> {
  /* Adapted from Exodus 4D answer here: https://stackoverflow.com/a/63208885 */
  private _pendingPromise: boolean
  private _promiseAll: Promise<void>
  private _resolveAll?: () => void

  /** Create new job queue */
  constructor() {
    super()
    this._pendingPromise = false
    this._promiseAll = Promise.resolve()
  }

  /** Promise that will resolve when queue empties */
  get promise() { return this._promiseAll }

  /**
   * Add a job to the queue and begin executing jobs
   * @param job - Function to execute when reached in queue
   * @param arg - Argument list to use with this job
   * @returns Resolves upon job completion, rejects if job throws/rejects
   */
  add(job: (arg: Arg) => Promise<Ret> | Ret, arg: Arg) {
    if (!this._resolveAll) this._promiseAll = new Promise((res) => { this._resolveAll = res })

    return new Promise((resolve, reject) => {
      this._enqueue({ job, arg, resolve, reject })
      this.run()
    })
  }

  /**
   * Begin running jobs in queue
   * @returns Resolves to true if job was successfully dequeued or false if queue is empty or currently running
   */
  private async run() {
    if (this._pendingPromise) return false

    const next = this._dequeue()

    if (!next) {
      if (this._resolveAll) this._resolveAll()
      return false
    }

    try {
      this._pendingPromise = true

      let result = await next.job(next.arg)

      this._pendingPromise = false
      next.resolve(result)

    } catch (e) {
      this._pendingPromise = false
      next.reject(e)

    } finally {
      this.run()
    }

    return true
  }
}


// TYPES

type ListItem<I> = { item: I, next?: ListItem<I> }

interface AutoQueueItem<A, R> {
  arg: A,
  job: (arg: A) => Promise<R> | R,
  resolve: (result: R) => void,
  reject: (reason?: any) => void
}