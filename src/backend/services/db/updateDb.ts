import type { DbTables } from 'types/global'
import { Prisma } from '@prisma/client'
import prisma from '../../libs/db'
import Batcher from '../../libs/Batcher'
import { createMultiUpdate } from 'backend/utils/db/db.utils'


/** Modify every entry in a given table.
 * 1) Set which field(s) will be used to ID the updates in `whereKeys`.
 * 2) Set which fields should be updated in `updateKeys`.
 * 3) Optionally set which fields should be included in `modifier` input in `selectKeys`.
 * 4) Define `modifier` function to run on each entry.
 *    `updateKeys` from the result are pushed to the DB, or the entry will be skipped if *null* is returned */
export async function customDbModify<Table extends DbTables, T extends Awaited<ReturnType<(typeof prisma)[Table]['findFirstOrThrow']>>>(table: Table, whereKeys: Extract<keyof T, string>[], updateKeys: Extract<keyof T, string>[], modifier: (entry: Partial<T>) => Partial<T> | null, selectKeys: Extract<keyof T, string>[] | null = null, enableLog = false, dbBatchSize = 5000) {
  let count = 0, skip = 0
  const tableName = modelMap[table.toLowerCase() as Lowercase<Prisma.ModelName>]
  
  const multiUpdate = createMultiUpdate<Partial<T>>(tableName, whereKeys, updateKeys, prisma)
  const batch = new Batcher(dbBatchSize, (data: Partial<T>[]) => multiUpdate(data).then((c) => { count += c }))
  
  const total = await prisma[table as 'card'].count()
  enableLog && console.log('Running custom modify function on', total, `${table} entries.`)
  enableLog && console.time('Custom modify')
  
  const select = !selectKeys ? undefined :
    Object.fromEntries([...whereKeys, ...updateKeys, ...selectKeys].map((key) => [key, true]))

  while (skip < total) {
    const entries = await prisma[table as 'card'].findMany({ select, skip, take: dbBatchSize }) as T[]
    if (!entries.length) break

    entries.forEach((entry) => {
      const updated = modifier({ ...entry })
      if (updated && !updateKeys.every((key) => updated[key] === entry[key]))
        batch.add({ ...entry, ...updated })
    })

    skip += entries.length
  }
  await batch.finish()

  enableLog && console.timeEnd('Custom modify')
  enableLog && console.log(`Modified '${updateKeys.join("', '")}' for`, count, `entries out of`, skip, `in '${tableName}'.`)
}


const modelMap = Object.keys(Prisma.ModelName).reduce(
    (prev, curr) => ({ ...prev, [curr.toLowerCase()]: curr }),
    {} as { [M in Prisma.ModelName as Lowercase<M>]: M },
  )