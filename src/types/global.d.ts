// -- TYPESCRIPT FIX -- \\

export declare global {
    // Fix Object return types
    interface ObjectConstructor {
      keys<T>(o: T): T extends object ? (keyof T)[] :
        T extends number ? [] :
        T extends Array<any> | string ? string[] :
        never,
  
      fromEntries<K extends string|number|symbol, V>(entries: Array<[K, V]>): Record<K,V>,
    }
}
