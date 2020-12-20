import { ValidationError } from "./errors";
import FunctionType from "./FunctionType";
import { RemoveAsync } from "./io";

export type Primitive =
  | string
  | number
  | symbol
  | boolean
  | null
  | undefined
  | void
  | bigint;

export type ObjectProperty = string | number | symbol;

export type Typeof = {
  string: string;
  number: number;
  object: object; // eslint-disable-line @typescript-eslint/ban-types
  boolean: boolean;
  symbol: symbol;
  bigint: bigint;
  undefined: undefined;
};

// https://stackoverflow.com/a/50159864/518153
export type Enum<E> = Record<keyof E, string | number> & {
  [k: number]: string;
};

// 0 extends 1 & T will be true only if we pass any (and in the same situation we get Yes)
type IsAny<T, Yes, No> = 0 extends 1 & T ? Yes : No;

type EqualReformat<T> = T extends FunctionType
  ? [
      "$$FunctionType$$",
      EqualReformat<ReturnType<T>>,
      EqualReformat<Parameters<T>>
    ]
  : T extends object // eslint-disable-line @typescript-eslint/ban-types
  ? {
      [K in keyof T]: EqualReformat<T[K]>;
    }
  : // never is an error, so if any we want to throw an error
    IsAny<T, never, T>;

// if type1 is subtype of type2 and viceversa it means its the same type
// prettier-ignore
type IfEqual<T1, T2, Yes, No> = [T2] extends [T1] ? [T1] extends [T2] ? Yes : No : No;

type IfDeepEqual<T, R, Yes, No> = IfEqual<
  EqualReformat<T>,
  EqualReformat<R>,
  Yes,
  No
>;

/*

function (T, R, Yes) {
  if (T === any) {
    if (R === any) {
      return Yes
    } else {
      return T
    }
  } else {
    if (R === any) {
      return T
    } else {
      return Yes
    }
  }
}


function (T, R, Yes) {
  if (T === any && R === any) {
    return Yes
  } elseif (T === any && R !== any) {
    return T
  } elseif (T !== any && R === any)
      return T
  } elseif (T !== any && R !== any)
    return Yes
  }
}

*/

// return (1) if T is any and 2 otherwise
type IfElse<T, R, Yes> = IsAny<
  T,
  // (1) return Yes if R is any and T otherwise
  IsAny<R, Yes, T>,
  // (2) return T if Result is any and Yes otherwise
  IsAny<R, T, Yes>
>;

// prettier-ignore
// TODO: check if we need Yes = 'ok' extends T ? never : 'ok'>(
export function typeCheck<T, R, Yes = 'ok'>(
  ok: IfDeepEqual<
    T, 
    R, 
    IfElse<T, R, Yes>,
    T
  >,
): unknown {
  return ok;
}

export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return !!value && typeof (value as PromiseLike<unknown>).then === "function";
}

// resolve value form promise or just return value
export type ResolvedValue<T> =
  // do not escape T to [T] to support `number | Promise<string>`
  T extends PromiseLike<infer R> ? R : T;

export type IsAsync<S> = ResolvedValue<S> extends S
  ? unknown extends S
    ? unknown
    : false
  : RemoveAsync<S> extends never
  ? true
  : unknown;

export type MaybeAsync<T, V> = unknown extends IsAsync<T>
  ? PromiseLike<V> | V
  : true extends IsAsync<T>
  ? PromiseLike<V>
  : V;

export function isPrimitive(value: unknown): value is Primitive {
  return (
    (typeof value !== "object" && typeof value !== "function") || value === null
  );
}

export function deepConcat(): undefined;
export function deepConcat<A>(...values: [A]): A;
export function deepConcat<A, B>(...values: [A, B]): A & B;
export function deepConcat<A, B, C>(...values: [A, B, C]): A & B & C;
export function deepConcat<A, B, C, D>(...values: [A, B, C, D]): A & B & C & D;
export function deepConcat<A, B, C, D, E>(
  ...values: [A, B, C, D, E]
): A & B & C & D & E;
export function deepConcat<A, B, C, D, E, F>(
  ...values: [A, B, C, D, E, F]
): A & B & C & D & E & F;
export function deepConcat<A, B, C, D, E, F, G>(
  ...values: [A, B, C, D, E, F, G]
): A & B & C & D & E & F & G;
export function deepConcat<A, B, C, D, E, F, G, H>(
  ...values: [A, B, C, D, E, F, G, H]
): A & B & C & D & E & F & G & H;
export function deepConcat(...values: unknown[]): unknown {
  if (values.length < 2) {
    return values[0];
  }

  values = values.filter((value) => value !== undefined);
  if (values.length < 2) {
    return values[0];
  }

  let base = values[0];
  if (typeof base !== "object" || base === null) {
    for (let i = 1; i < values.length; i += 1) {
      if (values[i] !== base) {
        throw new ValidationError(`Type mismatch on validation concat`);
      }
    }

    return base;
  }

  const keys: Record<string, unknown[]> = {};
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];

    if (typeof value !== "object" || value === null) {
      throw new ValidationError(`Type mismatch on validation concat`);
    }

    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;

      const keyVal = value[key as keyof typeof value];
      if (keyVal === undefined) continue;

      if (!keys[key]) {
        keys[key] = [];
      }
      keys[key].push(keyVal);
    }
  }

  if (Array.isArray(base)) {
    base = [];
  } else {
    base = {};
  }

  for (const key in keys) {
    (base as Record<string, unknown>)[key] = deepConcat(
      ...(keys[key] as [unknown])
    );
  }

  return base;
}
