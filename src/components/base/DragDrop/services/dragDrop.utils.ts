import { COMMON_CLS, combineKeys } from "./dragDrop.custom";

// ---- Class Helpers ---- \\

// Create a deep copy of obj & inner arrays (depth of 2)
// if OnlyKeys exists, filter to only include these keys
function copyArrObj<T extends { [key: string]: any }, KeyList extends keyof T>(obj: T, onlyKeys: Readonly<Array<keyof T>>): Pick<T, KeyList> {
  if (!onlyKeys) onlyKeys = Object.keys(obj) as unknown as Array<keyof T>;
  let copy: Partial<T> = {};
  for (const key of onlyKeys) {
    if (!(key in obj)) continue;
    copy[key] = (Array.isArray(obj[key]) ? [...obj[key]] : obj[key]) as T[keyof T];
  }
  return copy as Pick<T, KeyList>; 
}

// Convert Object of string arrays to object of joined strings
const CLASS_SEP = ' '
const flattenArrays = <T extends { [key: string]: string[] }>(stringArrays: T) => {
  let result = {} as { [key: string]: string };
  (Object.keys(stringArrays) as Array<keyof T>).forEach((k) => { result[k as string] = stringArrays[k].join(CLASS_SEP) })
  return result as { [key in keyof T]: string }
}

// Append entry (COMMON_CLS) w/ elements common to all 3 'combineKeys'
const compareKeys = combineKeys.slice(1);
export function extractMatches<C extends { [key: string]: string[] }>(classes: C, optimizeClassSwapping: boolean) {
  if (!optimizeClassSwapping) return flattenArrays({
    [COMMON_CLS]: [] as string[],
    ...classes,
  });

  let indexes, copy = copyArrObj<typeof classes, typeof combineKeys[number]>(classes, combineKeys);
  let result = {
    ...classes,
    [COMMON_CLS]: [] as string[],
    [combineKeys[0]]: [] as string[],
  };
  
  for (const entry of copy[combineKeys[0]] as string[]) {
    
    // Find & record matches from other entries
    indexes = {} as { [key: string]: number };
    for (const key of compareKeys) {
      if (!result[key]) break
      const nextIdx = result[key].indexOf(entry); 
      if (nextIdx === -1) break;
      indexes[key] = nextIdx;
    }

    // No matches found
    if (Object.keys(indexes).length !== compareKeys.length)
      result[combineKeys[0]].push(entry); 
    
    // All entries match
    else {
      result[COMMON_CLS].push(entry);
      Object.entries(indexes).forEach(([key, idx]) => result[key].splice(idx,1));
    }
  }

  return flattenArrays(result)
}