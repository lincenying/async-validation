/**
 * Null 或者 T
 */
export type Nullable<T> = T | null
/**
 * Undefined 或者 T
 */
export type UnfAble<T> = T | undefined
/**
 * 键为字符串, 值为 Any 的对象
 */
export type Obj = Record<string, any>

/**
 * 键为字符串, 值为 T 的对象
 */
export type ObjT<T> = Record<string, T>

export type AnyFn = (...args: any[]) => any;