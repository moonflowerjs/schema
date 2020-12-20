import { FunctionParameters } from './FunctionType';
import { ObjectProperty } from './utils';

export type ErrorLikeEntity<P extends FunctionParameters = never> =
  | string
  | Error
  | ((...args: P) => string | Error);

export type ObjectPath = ObjectProperty[];

export interface PathError {
  path: ObjectPath;
  error: Error;
}

export class ValidationError extends TypeError {
  public errors?: PathError[];

  constructor(message: string, errors?: PathError[]) {
    super(message);

    this.errors = errors;
  }

  public toJSON?(): Record<string, unknown> {
    return {
      message: this.message,
      errors: this.errors?.map(({ path, error }) => ({
        path,
        error: ValidationError.prototype.toJSON?.apply(error) || error,
      })),
    };
  }
}


ValidationError.prototype.name = 'ValidationError';

export function toError<P extends FunctionParameters>(
  error: ErrorLikeEntity<P>,
  ...args: P
): ValidationError {
  if (typeof error === 'string') {
    return new ValidationError(error);
  }

  if (typeof error === 'function') {
    return toError(error(...args));
  }

  return error;
}

export function createValidationError<P extends FunctionParameters>(
  errors: PathError[],
  error: ErrorLikeEntity<P> | null | undefined,
  ...args: P
): ValidationError {
  if (!error) {
    if (errors[0]) {
      const { path, error: err } = errors[0];
      const message = String((err && err.message) || err);

      error = path ? `${path.join('.')}: ${message}` : message;
    } else {
      error = 'Unknown Validation Error';
    }
  }

  const err: ValidationError = toError(error, ...args);
  err.errors = errors;

  return err;
}
