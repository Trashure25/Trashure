/* lib/zod.ts
 * Ultra-light stub so the project doesn’t need the full “zod” library at runtime.
 * The fluent API methods simply chain and return the same builder object.
 * `.parse()` is a no-op that returns its argument.
 * Only the pieces currently referenced in the codebase are included.
 */

type AnyShape = Record<string, unknown>

class ZodStub<T = unknown> {
  min() {
    return this as unknown as ZodStub<T>
  }
  max() {
    return this as unknown as ZodStub<T>
  }
  nonempty() {
    return this as unknown as ZodStub<T>
  }
  email() {
    return this as unknown as ZodStub<T>
  }
  optional() {
    return this as unknown as ZodStub<T | undefined>
  }
  refine() {
    return this as unknown as ZodStub<T>
  }
  parse(data: T) {
    return data
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

/* Named exports expected by existing code */
export const z = { string, number, boolean, object, literal, enum: enumeration }

/* Utility re-exports so `z.infer<typeof schema>` compiles. They return `any`. */
export type infer<_T> = any

/* Empty enum so code that referenced it won't crash */
export enum ZodFirstPartyTypeKind {}
