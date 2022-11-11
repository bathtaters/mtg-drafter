import { Prisma, PrismaClient, PrismaPromise } from '@prisma/client'

const sleepOnFail = 1000 * 10

const addQuotes = /[^a-z0-9]/ // Not tested w/ numbers yet

const catchSql = (err: any) => {
  console.error('Encountered error, pausing before continue',err)
  return new Promise((res) => { setTimeout(() => res(0), sleepOnFail) })
}

export function createMultiUpdate<T extends { [key: string]: any }>(tableName: Prisma.ModelName, whereKey: keyof T & string, updateKey: keyof T & string): (updateObj: T[], prisma: PrismaClient) => PrismaPromise<number>
export function createMultiUpdate<T extends { [key: string]: any }>(tableName: Prisma.ModelName, whereKey: keyof T & string, updateKey: keyof T & string, prisma: PrismaClient): (updateObj: T[]) => PrismaPromise<number>
export function createMultiUpdate<T extends { [key: string]: any }>(tableName: Prisma.ModelName, whereKey: keyof T & string, updateKey: keyof T & string, prisma?: PrismaClient) {
  checkInjection([tableName, whereKey, updateKey], 'updateImages')

  let
    table  = addQuotes.test(tableName) ? `"${tableName}"` : tableName,
    where  = addQuotes.test(whereKey)  ? `"${whereKey}"`  : whereKey,
    update = addQuotes.test(updateKey) ? `"${updateKey}"` : updateKey

  const cmd = (updateObj: T[]) => 
    `UPDATE ${table} SET ${update} = (CASE ${
      updateObj.map((_,i) => `WHEN ${where} = $${i*2 + 1} THEN $${i*2 + 2}`).join(' ')
    } END) WHERE ${where} IN (${updateObj.map((_,i) => `$${i*2 + 1}`).join(',')})`

  const args = (updateObj: T[]) => updateObj.flatMap((val) => [val[whereKey], val[updateKey]])

  

  return prisma ? (updateObj: T[]) => prisma.$executeRawUnsafe(cmd(updateObj), ...args(updateObj)).catch(catchSql) :
    (updateObj: T[], prisma: PrismaClient) => prisma.$executeRawUnsafe(cmd(updateObj), ...args(updateObj)).catch(catchSql)
}



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