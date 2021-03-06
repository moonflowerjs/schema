import compiler from "./schema/compiler";
import { ErrorLikeEntity } from "./schema/errors";
import FunctionType, { FunctionParameters } from "./schema/FunctionType";
import { MergeSchemaParameters, SchemaParameters, SchemaResolveType, SchemaReturnType, SchemaValidatorFunction } from "./schema/io";
import { Enum } from "./schema/utils";
import { either as eitherSchema, merge as mergeSchemas } from './schema/logic';
import Validator, { ProxyWrappedValidator } from "./Validator";
import { enumValue } from './schema/validations';


interface SchemaType {
  <S>(
    schema: S,
    opts?:
      | ErrorLikeEntity<SchemaParameters<S>>
      | {
          error?: ErrorLikeEntity<SchemaParameters<S>>;
          strict?: boolean;
        },
  ): ProxyWrappedValidator<Validator<SchemaValidatorFunction<S>>>;

  either<A>(
    ...candidates: [A]
  ): ProxyWrappedValidator<
    Validator<FunctionType<SchemaReturnType<A>, SchemaParameters<A>>>
  >;
  either<A, B>(
    ...candidates: [A, B]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<A> | SchemaReturnType<B>,
        MergeSchemaParameters<SchemaParameters<A> | SchemaParameters<B>>
      >
    >
  >;
  either<A, B, C>(
    ...candidates: [A, B, C]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<A> | SchemaReturnType<B> | SchemaReturnType<C>,
        MergeSchemaParameters<
          SchemaParameters<A> | SchemaParameters<B> | SchemaParameters<C>
        >
      >
    >
  >;
  either<A, B, C, D>(
    ...candidates: [A, B, C, D]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        | SchemaReturnType<A>
        | SchemaReturnType<B>
        | SchemaReturnType<C>
        | SchemaReturnType<D>,
        MergeSchemaParameters<
          | SchemaParameters<A>
          | SchemaParameters<B>
          | SchemaParameters<C>
          | SchemaParameters<D>
        >
      >
    >
  >;
  either<A, B, C, D, E>(
    ...candidates: [A, B, C, D, E]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        | SchemaReturnType<A>
        | SchemaReturnType<B>
        | SchemaReturnType<C>
        | SchemaReturnType<D>
        | SchemaReturnType<E>,
        MergeSchemaParameters<
          | SchemaParameters<A>
          | SchemaParameters<B>
          | SchemaParameters<C>
          | SchemaParameters<D>
          | SchemaParameters<E>
        >
      >
    >
  >;
  either<A, B, C, D, E, F>(
    ...candidates: [A, B, C, D, E, F]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        | SchemaReturnType<A>
        | SchemaReturnType<B>
        | SchemaReturnType<C>
        | SchemaReturnType<D>
        | SchemaReturnType<E>
        | SchemaReturnType<F>,
        MergeSchemaParameters<
          | SchemaParameters<A>
          | SchemaParameters<B>
          | SchemaParameters<C>
          | SchemaParameters<D>
          | SchemaParameters<E>
          | SchemaParameters<F>
        >
      >
    >
  >;
  either<A, B, C, D, E, F, G>(
    ...candidates: [A, B, C, D, E, F, G]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        | SchemaReturnType<A>
        | SchemaReturnType<B>
        | SchemaReturnType<C>
        | SchemaReturnType<D>
        | SchemaReturnType<E>
        | SchemaReturnType<F>
        | SchemaReturnType<G>,
        MergeSchemaParameters<
          | SchemaParameters<A>
          | SchemaParameters<B>
          | SchemaParameters<C>
          | SchemaParameters<D>
          | SchemaParameters<E>
          | SchemaParameters<F>
          | SchemaParameters<G>
        >
      >
    >
  >;
  either<A, B, C, D, E, F, G, H>(
    ...candidates: [A, B, C, D, E, F, G, H]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        | SchemaReturnType<A>
        | SchemaReturnType<B>
        | SchemaReturnType<C>
        | SchemaReturnType<D>
        | SchemaReturnType<E>
        | SchemaReturnType<F>
        | SchemaReturnType<G>
        | SchemaReturnType<H>,
        MergeSchemaParameters<
          | SchemaParameters<A>
          | SchemaParameters<B>
          | SchemaParameters<C>
          | SchemaParameters<D>
          | SchemaParameters<E>
          | SchemaParameters<F>
          | SchemaParameters<G>
          | SchemaParameters<H>
        >
      >
    >
  >;
  either<A, S>(
    ...candidates: [A, ...S[]]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<A> | SchemaReturnType<S>,
        MergeSchemaParameters<SchemaParameters<A | S>>
      >
    >
  >;

  merge<A>(
    ...args: [A]
  ): ProxyWrappedValidator<
    Validator<FunctionType<SchemaReturnType<A>, SchemaParameters<A>>>
  >;
  merge<A, B>(
    ...args: [A, B]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<A & B, SchemaResolveType<A> & SchemaResolveType<B>>,
        MergeSchemaParameters<SchemaParameters<A> & SchemaParameters<B>>
      >
    >
  >;
  merge<A, B, C>(
    ...args: [A, B, C]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<
          A & B & C,
          SchemaResolveType<A> & SchemaResolveType<B> & SchemaResolveType<C>
        >,
        MergeSchemaParameters<
          SchemaParameters<A> & SchemaParameters<B> & SchemaParameters<C>
        >
      >
    >
  >;
  merge<A, B, C, D>(
    ...args: [A, B, C, D]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<
          A & B & C & D,
          SchemaResolveType<A> &
            SchemaResolveType<B> &
            SchemaResolveType<C> &
            SchemaResolveType<D>
        >,
        MergeSchemaParameters<
          SchemaParameters<A> &
            SchemaParameters<B> &
            SchemaParameters<C> &
            SchemaParameters<D>
        >
      >
    >
  >;
  merge<A, B, C, D, E>(
    ...args: [A, B, C, D, E]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<
          A & B & C & D & E,
          SchemaResolveType<A> &
            SchemaResolveType<B> &
            SchemaResolveType<C> &
            SchemaResolveType<D> &
            SchemaResolveType<E>
        >,
        MergeSchemaParameters<
          SchemaParameters<A> &
            SchemaParameters<B> &
            SchemaParameters<C> &
            SchemaParameters<D> &
            SchemaParameters<E>
        >
      >
    >
  >;
  merge<A, B, C, D, E, F>(
    ...args: [A, B, C, D, E, F]
  ): ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<
          A & B & C & D & E & F,
          SchemaResolveType<A> &
            SchemaResolveType<B> &
            SchemaResolveType<C> &
            SchemaResolveType<D> &
            SchemaResolveType<E> &
            SchemaResolveType<F>
        >,
        MergeSchemaParameters<
          SchemaParameters<A> &
            SchemaParameters<B> &
            SchemaParameters<C> &
            SchemaParameters<D> &
            SchemaParameters<E> &
            SchemaParameters<F>
        >
      >
    >
  >;
  // merge<A, B, C, D, E, F, G>(
  //   ...args: [A, B, C, D, E, F, G]
  // ): ProxyWrappedValidator<
  //   Validator<
  //     FunctionType<
  //       SchemaReturnType<
  //         A & B & C & D & E & F & G,
  //         SchemaResolveType<A> &
  //           SchemaResolveType<B> &
  //           SchemaResolveType<C> &
  //           SchemaResolveType<D> &
  //           SchemaResolveType<E> &
  //           SchemaResolveType<F> &
  //           SchemaResolveType<G>
  //       >,
  //       MergeSchemaParameters<
  //         SchemaParameters<A> &
  //           SchemaParameters<B> &
  //           SchemaParameters<C> &
  //           SchemaParameters<D> &
  //           SchemaParameters<E> &
  //           SchemaParameters<F> &
  //           SchemaParameters<G>
  //       >
  //     >
  //   >
  // >;
  // merge<A, B, C, D, E, F, G, H>(
  //   ...args: [A, B, C, D, E, F, G, H]
  // ): ProxyWrappedValidator<
  //   Validator<
  //     FunctionType<
  //       SchemaReturnType<
  //         A & B & C & D & E & F & G & H,
  //         SchemaResolveType<A> &
  //           SchemaResolveType<B> &
  //           SchemaResolveType<C> &
  //           SchemaResolveType<D> &
  //           SchemaResolveType<E> &
  //           SchemaResolveType<F> &
  //           SchemaResolveType<G> &
  //           SchemaResolveType<H>
  //       >,
  //       MergeSchemaParameters<
  //         SchemaParameters<A> &
  //           SchemaParameters<B> &
  //           SchemaParameters<C> &
  //           SchemaParameters<D> &
  //           SchemaParameters<E> &
  //           SchemaParameters<F> &
  //           SchemaParameters<G> &
  //           SchemaParameters<H>
  //       >
  //     >
  //   >
  // >;
  merge(
    ...args: [unknown, ...unknown[]]
  ): ProxyWrappedValidator<Validator<FunctionType>>;

  enum<E extends Enum<E>, P extends FunctionParameters = [E[keyof E]]>(
    value: E,
    error?: ErrorLikeEntity<P>,
  ): ProxyWrappedValidator<Validator<FunctionType<E[keyof E], P>>>;
}


function schema<S>(
  schema: S,
  opts?:
    | ErrorLikeEntity<SchemaParameters<S>>
    | {
        error?: ErrorLikeEntity<SchemaParameters<S>>;
        strict?: boolean;
      },
): ProxyWrappedValidator<Validator<SchemaValidatorFunction<S>>> {
  let error: ErrorLikeEntity<SchemaParameters<S>> | undefined;
  let strict: boolean | undefined;

  if (opts) {
    if (typeof opts === 'object' && !(opts instanceof Error)) {
      error = opts.error;
      strict = opts.strict;
    } else {
      error = opts;
    }
  }

  return new Validator(compiler(schema, { error, strict })).wrapWithProxy();
}
schema.either = function <A, S>(
  ...candidates: [A, ...S[]]
): ProxyWrappedValidator<
  Validator<
    FunctionType<
      SchemaReturnType<A> | SchemaReturnType<S>,
      MergeSchemaParameters<SchemaParameters<A | S>>
    >
  >
> {
  return (new Validator(
    eitherSchema(...(candidates as [unknown])),
  ).wrapWithProxy() as unknown) as ProxyWrappedValidator<
    Validator<
      FunctionType<
        SchemaReturnType<A> | SchemaReturnType<S>,
        MergeSchemaParameters<SchemaParameters<A | S>>
      >
    >
  >;
};

schema.merge = function (
  ...args: [unknown, ...unknown[]]
): ProxyWrappedValidator<Validator<FunctionType>> {
  return new Validator(
    mergeSchemas(...(args as [unknown])),
  ).wrapWithProxy() as ProxyWrappedValidator<Validator<FunctionType>>;
};

schema.enum = function <
  E extends Enum<E>,
  P extends FunctionParameters = [E[keyof E]]
>(
  value: E,
  error?: ErrorLikeEntity<P>,
): ProxyWrappedValidator<Validator<FunctionType<E[keyof E], P>>> {
  return new Validator(enumValue(value, error)).wrapWithProxy();
};

const Schema: SchemaType = schema;

export default Schema;