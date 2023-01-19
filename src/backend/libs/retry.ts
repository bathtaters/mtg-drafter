import { retryDefaults } from "assets/constants"

// Options
export type RetryOptions = {
  maxRetries?: number,
  delay?: number,
  errCodes?: (string|number)[],
  onRetry?: (count: number) => void,
  logRetry?: (...errMsg: any[]) => void,
}

// Strings
const
  msgRetry = (count: number, code: any) => `Retrying (attempt: ${count}) after ${JSON.stringify(code)} error:`,
  msgMaxRetry = (count: number) => `Exceeded maximum retries (${count}), throwing error.`,
  msgErrCode = (code: any) => `Error code ${JSON.stringify(code)} not in retry codes, throwing error.`


/** Retry [callback] [maxRetries (default: 5)] times (returning result of [callback]), 
 * (optional) insert increasing delay between each attempt (ms = delay * 2^attempt), 
 * (optional) only retry if error.code matches [errCodes] (always retries if missing error code or [errCodes]), 
 * (optional) log each retry to [logRetry] (skip if missing). */

export default async function retry<CB extends () => Promise<any>>(
  callback: CB,
  { maxRetries = 5, delay, errCodes, logRetry }: RetryOptions = retryDefaults
): Promise<Awaited<ReturnType<CB>>> {

  let count = 0
  while (true) {

    // Attempt (await to unwrap Prisma Promises)
    try { return await callback() }

    catch (err: any) {
      if (
        // Exceeds maxRetries
        ++count > maxRetries ||

        // Caught error not in errCodes
        (errCodes && err.code != null && !errCodes.includes(err.code))
      ) {
        // Log & throw
        logRetry && logRetry(count > maxRetries ? msgMaxRetry(maxRetries) : msgErrCode(err.code))
        throw err
      }

      // Retry
      logRetry && logRetry(msgRetry(count, err.code), err)
    }
    if (delay) await new Promise((res) => setTimeout(res, delay * 2 ** count))
  }
}