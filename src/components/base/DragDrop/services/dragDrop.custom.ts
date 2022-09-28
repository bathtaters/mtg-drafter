// Run class optimization
export const optimizeClassSwapping = true as const
// Class keys to combine
export const combineKeys = [ 'enabled', 'disabled', 'drop', 'illegal' ] as const
// Output key for common classes
export const COMMON_CLS = 'common' as const

// Default classes
export const classDefault = Object.freeze({
  border: {
    baseWeight: 'border',
    baseColor: 'border-transparent',
    baseStyle: 'border-solid',
    disabledColor: '',
    disabledStyle: '',
    dropColor: '',
    dropStyle: '',
    illegalColor: '',
    illegalStyle: '', 
  },
  bg: {
    baseColor: 'bg-transparent',
    disabledColor: '',
    hoverColor: 'bg-secondary/20',
    illegalColor: '',
  },
  additional: {
    enabled: [] as string[],
    disabled: [] as string[],
    drag: ['cursor-move','hover:bg-neutral-content','hover:bg-opacity-20'],
    drop: [] as string[],
    illegal: [] as string[],
  },
})

// INTERNAL TYPES

export type ClassPrefix = "base" | "disabled" | "drop" | "illegal" | "hover"

export type ClassObject = typeof classDefault.additional
export type ClassObjectExt = ClassObject & { [COMMON_CLS]: string[] }
export type ClassObjectStr = { [Key in keyof ClassObjectExt as Exclude<Key, "drag">]: string }

export type BorderClasses = typeof classDefault.border
export type BgClasses = typeof classDefault.bg
export type OtherClasses = { [Key in keyof ClassObject]: string[] | string }