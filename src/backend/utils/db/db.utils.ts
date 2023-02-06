import type { Prisma, PrismaClient, PrismaPromise } from '@prisma/client'

const sleepOnFail = 1000 * 10

const addQuotes = /[^a-z0-9]/ // Not tested w/ numbers yet

const catchSql = (err: any) => {
  console.error('Encountered error, pausing before continue',err)
  return new Promise((res) => { setTimeout(() => res(0), sleepOnFail) })
}

type KeyArr<T> = (keyof T & string)[]
type Obj = { [key: string]: any }

export function createMultiUpdate<T extends Obj>(tableName: Prisma.ModelName, whereKeys: KeyArr<T>, updateKeys: KeyArr<T>): (updateObj: T[], prisma: PrismaClient) => PrismaPromise<number>
export function createMultiUpdate<T extends Obj>(tableName: Prisma.ModelName, whereKeys: KeyArr<T>, updateKeys: KeyArr<T>, prisma: PrismaClient): (updateObj: T[]) => PrismaPromise<number>
export function createMultiUpdate<T extends Obj>(tableName: Prisma.ModelName, whereKeys: KeyArr<T>, updateKeys: KeyArr<T>, prisma?: PrismaClient) {
  checkInjection([tableName, ...whereKeys, ...updateKeys], 'updateImages')

  let
    table  = addQuotes.test(tableName) ? `"${tableName}"` : tableName,
    wheres  = whereKeys.map((whereKey)   => addQuotes.test(whereKey)  ? `"${whereKey}"`  : whereKey),
    updates = updateKeys.map((updateKey) => addQuotes.test(updateKey) ? `"${updateKey}"` : updateKey)

  const cmd = (updateObj: T[]) => `UPDATE ${table} SET ${

    // Each UpdateKey
    updates.map((update, u) => `${update} = (CASE ${

      // Each Object
      updateObj.map((obj, i) => `WHEN ${

        // Each WhereKey
        wheres.map((where, w) => obj[whereKeys[w]] != null &&
          `${where}${typeof obj[whereKeys[w]] === 'string' ? '::STRING' : ''} = $${1 + i + w * updateObj.length}`
        ).filter(Boolean).join(' AND ')

      } THEN ${ 
        
        // UpdateValue
        obj[updateKeys[u]] == null ? 'NULL' : `$${
          1 + i + (wheres.length + u) * updateObj.length
        }`
      }`).join(' ')

    } END)`).join(', ')

  // WhereKey[0] only
  } WHERE ${wheres[0]} IN (${

    // Each Object
    updateObj.map((obj,i) => obj[whereKeys[0]] != null && `$${1 + i}`).filter(Boolean).join(',')
  })`

  const args = (updateObj: T[]) => whereKeys.concat(updateKeys).flatMap(
    (key) => updateObj.map((obj) => obj[key] == null ? 'NULL' : obj[key])
  )

  

  return prisma ? (updateObj: T[]) => prisma.$executeRawUnsafe(cmd(updateObj), ...args(updateObj)).catch(catchSql) :
    (updateObj: T[], prisma: PrismaClient) => prisma.$executeRawUnsafe(cmd(updateObj), ...args(updateObj)).catch(catchSql)
}


export function createMultiUpsert<T extends Obj>(tableName: Prisma.ModelName, updateKeys: KeyArr<T>): (updateObj: T[], prisma: PrismaClient) => PrismaPromise<number>
export function createMultiUpsert<T extends Obj>(tableName: Prisma.ModelName, updateKeys: KeyArr<T>, prisma: PrismaClient): (updateObj: T[]) => PrismaPromise<number>
export function createMultiUpsert<T extends Obj>(tableName: Prisma.ModelName, updateKeys: KeyArr<T>, prisma?: PrismaClient) {
  checkInjection([tableName, ...updateKeys], tableName)

  const table  = addQuotes.test(tableName) ? `"${tableName}"` : tableName,
    updates = updateKeys.map((updateKey) => addQuotes.test(updateKey) ? `"${updateKey}"` : updateKey)
    
  const cmd = (updateObj: T[]) => `UPSERT INTO ${table} (${updates.join(', ')}) VALUES ${
    updateObj.map((obj, i) => 
      `(${updates.map((_, j) =>
          obj[updateKeys[j]] == null ? 'NULL' : `$${1 + j + i * updates.length}`
        ).join(', ')})`
    ).join(', ')
  }`

  const args = (updateObj: T[]) => updateObj.flatMap(
    (obj) => updateKeys.map((key) => obj[key] == null ? 'NULL' : obj[key])
  )

  return prisma ? (updateObj: T[]) => prisma.$executeRawUnsafe(cmd(updateObj), ...args(updateObj)).catch(catchSql) :
    (updateObj: T[], prisma: PrismaClient) => prisma.$executeRawUnsafe(cmd(updateObj), ...args(updateObj)).catch(catchSql)
}


// FILL IN VALS TO TEXT (For debug output)
// const sql = (text: string, vals: any[]) => {
//   for (let i=vals.length; i > 0; i--) { text = text.replaceAll(`$${i}`, JSON.stringify(vals[i-1])) }
//   return text
// }

// Injection Checking

const illegalKeyRegex = /[^a-zA-Z0-9_]/
const illegalKeyList = [
  "ADD", "EXTERNAL", "PROCEDURE", "ALL", "FETCH", "PUBLIC", "ALTER", "FILE", "RAISERROR", "AND", "FILLFACTOR", "READ", "ANY", "FOR", "READTEXT", "AS", "FOREIGN",
  "RECONFIGURE", "ASC", "FREETEXT", "REFERENCES", "AUTHORIZATION", "FREETEXTTABLE", "REPLICATION", "BACKUP", "FROM", "RESTORE", "BEGIN", "FULL", "RESTRICT", "BETWEEN",
  "FUNCTION", "RETURN", "BREAK", "GOTO", "REVERT", "BROWSE", "GRANT", "REVOKE", "BULK", "GROUP", "RIGHT", "BY", "HAVING", "ROLLBACK", "CASCADE", "HOLDLOCK", "ROWCOUNT",
  "CASE", "IDENTITY", "ROWGUIDCOL", "CHECK", "IDENTITY_INSERT", "RULE", "CHECKPOINT", "IDENTITYCOL", "SAVE", "CLOSE", "IF", "SCHEMA", "CLUSTERED", "IN", "SECURITYAUDIT",
  "COALESCE", "INDEX", "SELECT", "COLLATE", "INNER", "SEMANTICKEYPHRASETABLE", "COLUMN", "INSERT", "SEMANTICSIMILARITYDETAILSTABLE", "COMMIT", "INTERSECT",
  "SEMANTICSIMILARITYTABLE", "COMPUTE", "INTO", "SESSION_USER", "CONSTRAINT", "IS", "SET", "CONTAINS", "JOIN", "SETUSER", "CONTAINSTABLE", "KEY", "SHUTDOWN", "CONTINUE",
  "KILL", "SOME", "CONVERT", "LEFT", "STATISTICS", "CREATE", "LIKE", "SYSTEM_USER", "CROSS", "LINENO", "TABLE", "CURRENT", "LOAD", "TABLESAMPLE", "CURRENT_DATE", "MERGE",
  "TEXTSIZE", "CURRENT_TIME", "NATIONAL", "THEN", "CURRENT_TIMESTAMP", "NOCHECK", "TO", "CURRENT_USER", "NONCLUSTERED", "TOP", "CURSOR", "NOT", "TRAN", "DATABASE", "NULL",
  "TRANSACTION", "DBCC", "NULLIF", "TRIGGER", "DEALLOCATE", "OF", "TRUNCATE", "DECLARE", "OFF", "TRY_CONVERT", "DEFAULT", "OFFSETS", "TSEQUAL", "DELETE", "ON", "UNION",
  "DENY", "OPEN", "UNIQUE", "DESC", "OPENDATASOURCE", "UNPIVOT", "DISK", "OPENQUERY", "UPDATE", "DISTINCT", "OPENROWSET", "UPDATETEXT", "DISTRIBUTED", "OPENXML", "USE",
  "DOUBLE", "OPTION", "USER", "DROP", "OR", "VALUES", "DUMP", "ORDER", "VARYING", "ELSE", "OUTER", "VIEW", "END", "OVER", "WAITFOR", "ERRLVL", "PERCENT", "WHEN", "ESCAPE",
  "PIVOT", "WHERE", "EXCEPT", "PLAN", "WHILE", "EXEC", "PRECISION", "WITH", "EXECUTE", "PRIMARY", "WITHIN GROUP", "EXISTS", "PRINT", "WRITETEXT", "EXIT", "PROC"
]

const injectionErr = (val: any, isReserved: boolean, table: string) => new Error(`${table ? `Column in ${table}` : 'Table name'} ${
  isReserved ? 'is a reserved keyword:' : typeof val === 'string' ? 
    'contains non-alphanumeric characters:' : `is not a string: <${typeof val}>`
  } ${val}`)

export const checkInjection = (val: any, tableName = '') => {
  if (!val) return;
  if (Array.isArray(val)) return val.forEach((v) => exports.checkInjection(v, tableName))
  if (typeof val === 'object') Object.keys(val).forEach((v) => exports.checkInjection(v, tableName))
  else if (typeof val !== 'string' || illegalKeyRegex.test(val)) throw injectionErr(val, false, tableName)
  else if (illegalKeyList.includes(val.toUpperCase())) throw injectionErr(val, true, tableName)
  return false;
}