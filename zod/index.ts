/**
 * Minimal shim for the “zod” library.
 * It preserves the fluent API used in the codebase but performs NO runtime validation.
 */

type AnyShape = Record<string, unknown>

class ZodStub<T = unknown> {
  // Fluent-API placeholders
  min() {
    return this
  }
  max() {
    return this
  }
  nonempty() {
    return this
  }
  email() {
    return this
  }
  optional() {
    return this as unknown as ZodStub<T | undefined>
  }
  refine() {
    return this
  }
  array() {
    return this as unknown as ZodStub<T[]>
  }
  // Parsing no-op
  parse(data: unknown) {
    return data as T
  }
  safeParse(data: unknown) {
    return { success: true as const, data: data as T }
  }
}

function string() {
  return new ZodStub<string>()
}
function number() {
  return new ZodStub<number>()
}
function boolean() {
  return new ZodStub<boolean>()
}
function object<S extends AnyShape>(_shape: S) {
  return new ZodStub<{ [K in keyof S]: unknown }>()
}
function literal<L extends string | number | boolean>(_l: L) {
  return new ZodStub<L>()
}
function enumeration<const V extends readonly [string, ...string[]]>(_vals: V) {
  type Union = V[number]
  return new ZodStub<Union>()
}
function union<const T extends readonly unknown[]>(_schemas: T) {
  return new ZodStub<T[number]>()
}

/* “z” namespace mirror */
export const z = {
  string,
  number,
  boolean,
  object,
  literal,
  enum: enumeration,
  union,
}

/* Commonly-referenced helpers */
export type infer<_T> = any
export enum ZodFirstPartyTypeKind {
  Stub = "Stub",
}

/* Default export (`import * as z from "zod"`)    This matches Zod’s actual default, which is the same namespace. */
export default z
