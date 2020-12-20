import { ErrorLikeEntity, toError } from "./errors";
import FunctionType, { FunctionParameters } from "./FunctionType";

export function equals<T, P extends FunctionParameters = [T]>(
  expectedValue: T,
  error?: ErrorLikeEntity<P>,
): FunctionType<T, P> {
  return (...args: P): T => {
    if (args[0] !== expectedValue) {
      throw toError(error || `Expect value to equal "${expectedValue}"`, ...args);
    }

    return args[0] as T;
  };
}