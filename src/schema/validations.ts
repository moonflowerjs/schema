import { ErrorLikeEntity, toError } from "./errors";
import FunctionType, { FunctionParameters } from "./FunctionType";
import { Enum, Typeof } from "./utils";

export function type<
  T extends keyof Typeof,
  P extends FunctionParameters = [Typeof[T]]
>(type: T, error?: ErrorLikeEntity<P>): FunctionType<Typeof[T], P> {
  return (...args: P): Typeof[T] => {
    if (typeof args[0] !== type || args[0] === null) {
      throw toError(error || `Expect value to be "${type}"`, ...args);
    }

    return args[0] as Typeof[T];
  };
}

export function enumValue<
  E extends Enum<E>,
  P extends FunctionParameters = [E[keyof E]]
>(value: E, error?: ErrorLikeEntity<P>): FunctionType<E[keyof E], P> {
  const values = new Set<E[keyof E]>(
    Object.keys(value)
      .filter((key) => isNaN(Number(key)))
      .map((key) => value[key as keyof E]),
  );

  return (...args: P): E[keyof E] => {
    if (!values.has(args[0] as E[keyof E])) {
      throw toError(error || 'Unknown enum value', ...args);
    }

    return args[0] as E[keyof E];
  };
}
