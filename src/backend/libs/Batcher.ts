import AutoQueue from "./AutoQueue"

/** Batch multiple calls into a single call with an array of batched arguments */
export default class Batcher<Data = any> {
  private _buffer: Data[]
  private _queue = new AutoQueue<Data[], void>()
  private _ptr = 0
  private _size: number
  private _cb: Callback<Data>

  /**
   * Create new callback batcher
   * @param batchSize - Buffer size when it will be auto-flushed
   * @param callback - Callback to pass data buffer when it is flushed
   */  
  constructor (batchSize: number, callback: Callback<Data>) {
    this._size = batchSize
    this._cb = callback
    this._buffer = new Array<Data>(batchSize)
  }

  /** Run callback with current batch queue and reset batch queue */
  private async _flush() {
    const current = this._buffer.slice(0, this._ptr)
    this._ptr = 0
    if (current.length) await this._queue.add(this._cb, current)
  }

  /** Add item to batch queue and run callback if batchSize is reached */
  async add(data: Data) {
    this._buffer[this._ptr++] = data

    if (this._ptr >= this._size) await this._flush()
  }

  /** Run callback with current batch queue,
   *  then await all callbacks to complete */
  async finish() {
    await this._flush()
    await this._queue.promise
  }
}


// TYPES

type Callback<Data> = (data: Data[]) => void | Promise<void>