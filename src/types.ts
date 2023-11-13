/**
 * Null 或者 Undefined 或者 T
 */
export type Nullable<T> = T | null | undefined
/**
 * 非 Null 类型
 */
export type NonNullable<T> = T extends null | undefined ? never : T
/**
 * 数组<T> 或者 T
 */
export type Arrayable<T> = T | T[]
/**
 * 键为字符串, 值为 Any 的对象
 */
export type Obj = Record<string, any>
/**
 * 键为字符串, 值为 T 的对象
 */
export type ObjT<T> = Record<string, T>
/**
 * Function
 */
export type Fn<T = void> = () => T
/**
 * 任意函数
 */
export type AnyFn<T = any> = (...args: any[]) => T
/**
 * Promise, or maybe not
 */
export type Awaitable<T> = T | PromiseLike<T>
