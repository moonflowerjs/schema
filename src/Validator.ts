import { ErrorLikeEntity } from "./schema/errors";
import FunctionType, { FunctionParameters } from "./schema/FunctionType";
import { isPromiseLike, MaybeAsync, ResolvedValue } from "./schema/utils";
import { equals } from "./schema/validation";

export type ProxyWrappedValidator<
  V extends { validator: FunctionType },
  F extends FunctionType = V["validator"]
> = Omit<V, "validator" | "proxy"> & { validator: F } & F;

interface ValidatorConstructor<
  V extends Validator<F>,
  F extends FunctionType = V['validator']
> {
  new (validator: F): V;
}

export default class Validator<ValidatorFn extends FunctionType> {
  public readonly validator: ValidatorFn;

  public constructor(validator: ValidatorFn) {
    this.validator = validator;
  }

  public wrapWithProxy(): ProxyWrappedValidator<this> {
    return new Proxy(this.validator, {
      get: (
        target: unknown,
        propertyKey: string
      ): this[keyof this] | ValidatorFn[keyof ValidatorFn] =>
        propertyKey in this
          ? this[propertyKey as keyof this]
          : this.validator[propertyKey as keyof ValidatorFn],
    }) as ProxyWrappedValidator<this>;
  }

  public equals<T extends ResolvedValue<ReturnType<ValidatorFn>>>(
    expectedValue: T,
    error?: ErrorLikeEntity<[ResolvedValue<ReturnType<ValidatorFn>>]>
  ): ProxyWrappedValidator<this, FunctionType<T, Parameters<ValidatorFn>>> {
    return this.transform(equals(expectedValue, error));
  }

  public transform<
    T,
    V extends Validator<
      FunctionType<MaybeAsync<ReturnType<ValidatorFn>, T>, Parameters<ValidatorFn>>
    >
  >(
    fn: FunctionType<T, [ResolvedValue<ReturnType<ValidatorFn>>]>,
    constructor: ValidatorConstructor<V> = this
      .constructor as ValidatorConstructor<V>
  ): ProxyWrappedValidator<V> {
    const { validator } = this;

    return new constructor(((...args): T | PromiseLike<T> => {
      const res = validator(...args);

      if (!isPromiseLike(res)) {
        return fn(res);
      }

      return res.then((ret) =>
        fn(ret as ResolvedValue<ReturnType<ValidatorFn>>)
      ) as PromiseLike<T>;
    }) as FunctionType<MaybeAsync<ReturnType<ValidatorFn>, T>, Parameters<ValidatorFn>>).wrapWithProxy();
  }
}
