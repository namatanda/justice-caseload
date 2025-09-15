
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Court
 * 
 */
export type Court = $Result.DefaultSelection<Prisma.$CourtPayload>
/**
 * Model Judge
 * 
 */
export type Judge = $Result.DefaultSelection<Prisma.$JudgePayload>
/**
 * Model CaseType
 * 
 */
export type CaseType = $Result.DefaultSelection<Prisma.$CaseTypePayload>
/**
 * Model Case
 * 
 */
export type Case = $Result.DefaultSelection<Prisma.$CasePayload>
/**
 * Model CaseActivity
 * 
 */
export type CaseActivity = $Result.DefaultSelection<Prisma.$CaseActivityPayload>
/**
 * Model CaseJudgeAssignment
 * 
 */
export type CaseJudgeAssignment = $Result.DefaultSelection<Prisma.$CaseJudgeAssignmentPayload>
/**
 * Model DailyImportBatch
 * 
 */
export type DailyImportBatch = $Result.DefaultSelection<Prisma.$DailyImportBatchPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ImportProgress
 * 
 */
export type ImportProgress = $Result.DefaultSelection<Prisma.$ImportProgressPayload>
/**
 * Model ImportErrorDetail
 * 
 */
export type ImportErrorDetail = $Result.DefaultSelection<Prisma.$ImportErrorDetailPayload>
/**
 * Model ImportSession
 * 
 */
export type ImportSession = $Result.DefaultSelection<Prisma.$ImportSessionPayload>
/**
 * Model ValidationResult
 * 
 */
export type ValidationResult = $Result.DefaultSelection<Prisma.$ValidationResultPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const CourtType: {
  SC: 'SC',
  ELC: 'ELC',
  ELRC: 'ELRC',
  KC: 'KC',
  SCC: 'SCC',
  COA: 'COA',
  MC: 'MC',
  HC: 'HC',
  TC: 'TC'
};

export type CourtType = (typeof CourtType)[keyof typeof CourtType]


export const CaseStatus: {
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED',
  PENDING: 'PENDING',
  TRANSFERRED: 'TRANSFERRED',
  DELETED: 'DELETED'
};

export type CaseStatus = (typeof CaseStatus)[keyof typeof CaseStatus]


export const CustodyStatus: {
  IN_CUSTODY: 'IN_CUSTODY',
  ON_BAIL: 'ON_BAIL',
  NOT_APPLICABLE: 'NOT_APPLICABLE'
};

export type CustodyStatus = (typeof CustodyStatus)[keyof typeof CustodyStatus]


export const ImportStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CLEANED: 'CLEANED'
};

export type ImportStatus = (typeof ImportStatus)[keyof typeof ImportStatus]


export const UserRole: {
  ADMIN: 'ADMIN',
  DATA_ENTRY: 'DATA_ENTRY',
  VIEWER: 'VIEWER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const ErrorSeverity: {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO'
};

export type ErrorSeverity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity]

}

export type CourtType = $Enums.CourtType

export const CourtType: typeof $Enums.CourtType

export type CaseStatus = $Enums.CaseStatus

export const CaseStatus: typeof $Enums.CaseStatus

export type CustodyStatus = $Enums.CustodyStatus

export const CustodyStatus: typeof $Enums.CustodyStatus

export type ImportStatus = $Enums.ImportStatus

export const ImportStatus: typeof $Enums.ImportStatus

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type ErrorSeverity = $Enums.ErrorSeverity

export const ErrorSeverity: typeof $Enums.ErrorSeverity

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Courts
 * const courts = await prisma.court.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Courts
   * const courts = await prisma.court.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.court`: Exposes CRUD operations for the **Court** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Courts
    * const courts = await prisma.court.findMany()
    * ```
    */
  get court(): Prisma.CourtDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.judge`: Exposes CRUD operations for the **Judge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Judges
    * const judges = await prisma.judge.findMany()
    * ```
    */
  get judge(): Prisma.JudgeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.caseType`: Exposes CRUD operations for the **CaseType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CaseTypes
    * const caseTypes = await prisma.caseType.findMany()
    * ```
    */
  get caseType(): Prisma.CaseTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.case`: Exposes CRUD operations for the **Case** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cases
    * const cases = await prisma.case.findMany()
    * ```
    */
  get case(): Prisma.CaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.caseActivity`: Exposes CRUD operations for the **CaseActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CaseActivities
    * const caseActivities = await prisma.caseActivity.findMany()
    * ```
    */
  get caseActivity(): Prisma.CaseActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.caseJudgeAssignment`: Exposes CRUD operations for the **CaseJudgeAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CaseJudgeAssignments
    * const caseJudgeAssignments = await prisma.caseJudgeAssignment.findMany()
    * ```
    */
  get caseJudgeAssignment(): Prisma.CaseJudgeAssignmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dailyImportBatch`: Exposes CRUD operations for the **DailyImportBatch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyImportBatches
    * const dailyImportBatches = await prisma.dailyImportBatch.findMany()
    * ```
    */
  get dailyImportBatch(): Prisma.DailyImportBatchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.importProgress`: Exposes CRUD operations for the **ImportProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImportProgresses
    * const importProgresses = await prisma.importProgress.findMany()
    * ```
    */
  get importProgress(): Prisma.ImportProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.importErrorDetail`: Exposes CRUD operations for the **ImportErrorDetail** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImportErrorDetails
    * const importErrorDetails = await prisma.importErrorDetail.findMany()
    * ```
    */
  get importErrorDetail(): Prisma.ImportErrorDetailDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.importSession`: Exposes CRUD operations for the **ImportSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImportSessions
    * const importSessions = await prisma.importSession.findMany()
    * ```
    */
  get importSession(): Prisma.ImportSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.validationResult`: Exposes CRUD operations for the **ValidationResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ValidationResults
    * const validationResults = await prisma.validationResult.findMany()
    * ```
    */
  get validationResult(): Prisma.ValidationResultDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.1
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Court: 'Court',
    Judge: 'Judge',
    CaseType: 'CaseType',
    Case: 'Case',
    CaseActivity: 'CaseActivity',
    CaseJudgeAssignment: 'CaseJudgeAssignment',
    DailyImportBatch: 'DailyImportBatch',
    User: 'User',
    ImportProgress: 'ImportProgress',
    ImportErrorDetail: 'ImportErrorDetail',
    ImportSession: 'ImportSession',
    ValidationResult: 'ValidationResult'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "court" | "judge" | "caseType" | "case" | "caseActivity" | "caseJudgeAssignment" | "dailyImportBatch" | "user" | "importProgress" | "importErrorDetail" | "importSession" | "validationResult"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Court: {
        payload: Prisma.$CourtPayload<ExtArgs>
        fields: Prisma.CourtFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourtFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourtFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>
          }
          findFirst: {
            args: Prisma.CourtFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourtFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>
          }
          findMany: {
            args: Prisma.CourtFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>[]
          }
          create: {
            args: Prisma.CourtCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>
          }
          createMany: {
            args: Prisma.CourtCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourtCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>[]
          }
          delete: {
            args: Prisma.CourtDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>
          }
          update: {
            args: Prisma.CourtUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>
          }
          deleteMany: {
            args: Prisma.CourtDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourtUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourtUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>[]
          }
          upsert: {
            args: Prisma.CourtUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourtPayload>
          }
          aggregate: {
            args: Prisma.CourtAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourt>
          }
          groupBy: {
            args: Prisma.CourtGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourtGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourtCountArgs<ExtArgs>
            result: $Utils.Optional<CourtCountAggregateOutputType> | number
          }
        }
      }
      Judge: {
        payload: Prisma.$JudgePayload<ExtArgs>
        fields: Prisma.JudgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JudgeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JudgeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>
          }
          findFirst: {
            args: Prisma.JudgeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JudgeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>
          }
          findMany: {
            args: Prisma.JudgeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>[]
          }
          create: {
            args: Prisma.JudgeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>
          }
          createMany: {
            args: Prisma.JudgeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JudgeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>[]
          }
          delete: {
            args: Prisma.JudgeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>
          }
          update: {
            args: Prisma.JudgeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>
          }
          deleteMany: {
            args: Prisma.JudgeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JudgeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JudgeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>[]
          }
          upsert: {
            args: Prisma.JudgeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JudgePayload>
          }
          aggregate: {
            args: Prisma.JudgeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJudge>
          }
          groupBy: {
            args: Prisma.JudgeGroupByArgs<ExtArgs>
            result: $Utils.Optional<JudgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.JudgeCountArgs<ExtArgs>
            result: $Utils.Optional<JudgeCountAggregateOutputType> | number
          }
        }
      }
      CaseType: {
        payload: Prisma.$CaseTypePayload<ExtArgs>
        fields: Prisma.CaseTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>
          }
          findFirst: {
            args: Prisma.CaseTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>
          }
          findMany: {
            args: Prisma.CaseTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>[]
          }
          create: {
            args: Prisma.CaseTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>
          }
          createMany: {
            args: Prisma.CaseTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>[]
          }
          delete: {
            args: Prisma.CaseTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>
          }
          update: {
            args: Prisma.CaseTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>
          }
          deleteMany: {
            args: Prisma.CaseTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CaseTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>[]
          }
          upsert: {
            args: Prisma.CaseTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseTypePayload>
          }
          aggregate: {
            args: Prisma.CaseTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCaseType>
          }
          groupBy: {
            args: Prisma.CaseTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseTypeCountArgs<ExtArgs>
            result: $Utils.Optional<CaseTypeCountAggregateOutputType> | number
          }
        }
      }
      Case: {
        payload: Prisma.$CasePayload<ExtArgs>
        fields: Prisma.CaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          findFirst: {
            args: Prisma.CaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          findMany: {
            args: Prisma.CaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          create: {
            args: Prisma.CaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          createMany: {
            args: Prisma.CaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          delete: {
            args: Prisma.CaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          update: {
            args: Prisma.CaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          deleteMany: {
            args: Prisma.CaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          upsert: {
            args: Prisma.CaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          aggregate: {
            args: Prisma.CaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCase>
          }
          groupBy: {
            args: Prisma.CaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseCountArgs<ExtArgs>
            result: $Utils.Optional<CaseCountAggregateOutputType> | number
          }
        }
      }
      CaseActivity: {
        payload: Prisma.$CaseActivityPayload<ExtArgs>
        fields: Prisma.CaseActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          findFirst: {
            args: Prisma.CaseActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          findMany: {
            args: Prisma.CaseActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>[]
          }
          create: {
            args: Prisma.CaseActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          createMany: {
            args: Prisma.CaseActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>[]
          }
          delete: {
            args: Prisma.CaseActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          update: {
            args: Prisma.CaseActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          deleteMany: {
            args: Prisma.CaseActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CaseActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>[]
          }
          upsert: {
            args: Prisma.CaseActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseActivityPayload>
          }
          aggregate: {
            args: Prisma.CaseActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCaseActivity>
          }
          groupBy: {
            args: Prisma.CaseActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseActivityCountArgs<ExtArgs>
            result: $Utils.Optional<CaseActivityCountAggregateOutputType> | number
          }
        }
      }
      CaseJudgeAssignment: {
        payload: Prisma.$CaseJudgeAssignmentPayload<ExtArgs>
        fields: Prisma.CaseJudgeAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseJudgeAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseJudgeAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>
          }
          findFirst: {
            args: Prisma.CaseJudgeAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseJudgeAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>
          }
          findMany: {
            args: Prisma.CaseJudgeAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>[]
          }
          create: {
            args: Prisma.CaseJudgeAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>
          }
          createMany: {
            args: Prisma.CaseJudgeAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseJudgeAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>[]
          }
          delete: {
            args: Prisma.CaseJudgeAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>
          }
          update: {
            args: Prisma.CaseJudgeAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.CaseJudgeAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseJudgeAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CaseJudgeAssignmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>[]
          }
          upsert: {
            args: Prisma.CaseJudgeAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJudgeAssignmentPayload>
          }
          aggregate: {
            args: Prisma.CaseJudgeAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCaseJudgeAssignment>
          }
          groupBy: {
            args: Prisma.CaseJudgeAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseJudgeAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseJudgeAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<CaseJudgeAssignmentCountAggregateOutputType> | number
          }
        }
      }
      DailyImportBatch: {
        payload: Prisma.$DailyImportBatchPayload<ExtArgs>
        fields: Prisma.DailyImportBatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyImportBatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyImportBatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>
          }
          findFirst: {
            args: Prisma.DailyImportBatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyImportBatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>
          }
          findMany: {
            args: Prisma.DailyImportBatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>[]
          }
          create: {
            args: Prisma.DailyImportBatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>
          }
          createMany: {
            args: Prisma.DailyImportBatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailyImportBatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>[]
          }
          delete: {
            args: Prisma.DailyImportBatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>
          }
          update: {
            args: Prisma.DailyImportBatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>
          }
          deleteMany: {
            args: Prisma.DailyImportBatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyImportBatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DailyImportBatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>[]
          }
          upsert: {
            args: Prisma.DailyImportBatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyImportBatchPayload>
          }
          aggregate: {
            args: Prisma.DailyImportBatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyImportBatch>
          }
          groupBy: {
            args: Prisma.DailyImportBatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyImportBatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyImportBatchCountArgs<ExtArgs>
            result: $Utils.Optional<DailyImportBatchCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ImportProgress: {
        payload: Prisma.$ImportProgressPayload<ExtArgs>
        fields: Prisma.ImportProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImportProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImportProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>
          }
          findFirst: {
            args: Prisma.ImportProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImportProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>
          }
          findMany: {
            args: Prisma.ImportProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>[]
          }
          create: {
            args: Prisma.ImportProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>
          }
          createMany: {
            args: Prisma.ImportProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImportProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>[]
          }
          delete: {
            args: Prisma.ImportProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>
          }
          update: {
            args: Prisma.ImportProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>
          }
          deleteMany: {
            args: Prisma.ImportProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImportProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImportProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>[]
          }
          upsert: {
            args: Prisma.ImportProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportProgressPayload>
          }
          aggregate: {
            args: Prisma.ImportProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImportProgress>
          }
          groupBy: {
            args: Prisma.ImportProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImportProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImportProgressCountArgs<ExtArgs>
            result: $Utils.Optional<ImportProgressCountAggregateOutputType> | number
          }
        }
      }
      ImportErrorDetail: {
        payload: Prisma.$ImportErrorDetailPayload<ExtArgs>
        fields: Prisma.ImportErrorDetailFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImportErrorDetailFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImportErrorDetailFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>
          }
          findFirst: {
            args: Prisma.ImportErrorDetailFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImportErrorDetailFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>
          }
          findMany: {
            args: Prisma.ImportErrorDetailFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>[]
          }
          create: {
            args: Prisma.ImportErrorDetailCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>
          }
          createMany: {
            args: Prisma.ImportErrorDetailCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImportErrorDetailCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>[]
          }
          delete: {
            args: Prisma.ImportErrorDetailDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>
          }
          update: {
            args: Prisma.ImportErrorDetailUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>
          }
          deleteMany: {
            args: Prisma.ImportErrorDetailDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImportErrorDetailUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImportErrorDetailUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>[]
          }
          upsert: {
            args: Prisma.ImportErrorDetailUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportErrorDetailPayload>
          }
          aggregate: {
            args: Prisma.ImportErrorDetailAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImportErrorDetail>
          }
          groupBy: {
            args: Prisma.ImportErrorDetailGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImportErrorDetailGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImportErrorDetailCountArgs<ExtArgs>
            result: $Utils.Optional<ImportErrorDetailCountAggregateOutputType> | number
          }
        }
      }
      ImportSession: {
        payload: Prisma.$ImportSessionPayload<ExtArgs>
        fields: Prisma.ImportSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImportSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImportSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>
          }
          findFirst: {
            args: Prisma.ImportSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImportSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>
          }
          findMany: {
            args: Prisma.ImportSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>[]
          }
          create: {
            args: Prisma.ImportSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>
          }
          createMany: {
            args: Prisma.ImportSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImportSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>[]
          }
          delete: {
            args: Prisma.ImportSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>
          }
          update: {
            args: Prisma.ImportSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>
          }
          deleteMany: {
            args: Prisma.ImportSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImportSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImportSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>[]
          }
          upsert: {
            args: Prisma.ImportSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSessionPayload>
          }
          aggregate: {
            args: Prisma.ImportSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImportSession>
          }
          groupBy: {
            args: Prisma.ImportSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImportSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImportSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ImportSessionCountAggregateOutputType> | number
          }
        }
      }
      ValidationResult: {
        payload: Prisma.$ValidationResultPayload<ExtArgs>
        fields: Prisma.ValidationResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ValidationResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ValidationResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>
          }
          findFirst: {
            args: Prisma.ValidationResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ValidationResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>
          }
          findMany: {
            args: Prisma.ValidationResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>[]
          }
          create: {
            args: Prisma.ValidationResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>
          }
          createMany: {
            args: Prisma.ValidationResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ValidationResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>[]
          }
          delete: {
            args: Prisma.ValidationResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>
          }
          update: {
            args: Prisma.ValidationResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>
          }
          deleteMany: {
            args: Prisma.ValidationResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ValidationResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ValidationResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>[]
          }
          upsert: {
            args: Prisma.ValidationResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationResultPayload>
          }
          aggregate: {
            args: Prisma.ValidationResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateValidationResult>
          }
          groupBy: {
            args: Prisma.ValidationResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<ValidationResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.ValidationResultCountArgs<ExtArgs>
            result: $Utils.Optional<ValidationResultCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    court?: CourtOmit
    judge?: JudgeOmit
    caseType?: CaseTypeOmit
    case?: CaseOmit
    caseActivity?: CaseActivityOmit
    caseJudgeAssignment?: CaseJudgeAssignmentOmit
    dailyImportBatch?: DailyImportBatchOmit
    user?: UserOmit
    importProgress?: ImportProgressOmit
    importErrorDetail?: ImportErrorDetailOmit
    importSession?: ImportSessionOmit
    validationResult?: ValidationResultOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CourtCountOutputType
   */

  export type CourtCountOutputType = {
    cases: number
  }

  export type CourtCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cases?: boolean | CourtCountOutputTypeCountCasesArgs
  }

  // Custom InputTypes
  /**
   * CourtCountOutputType without action
   */
  export type CourtCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourtCountOutputType
     */
    select?: CourtCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CourtCountOutputType without action
   */
  export type CourtCountOutputTypeCountCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
  }


  /**
   * Count Type JudgeCountOutputType
   */

  export type JudgeCountOutputType = {
    caseActivities: number
    caseAssignments: number
  }

  export type JudgeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caseActivities?: boolean | JudgeCountOutputTypeCountCaseActivitiesArgs
    caseAssignments?: boolean | JudgeCountOutputTypeCountCaseAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * JudgeCountOutputType without action
   */
  export type JudgeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JudgeCountOutputType
     */
    select?: JudgeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JudgeCountOutputType without action
   */
  export type JudgeCountOutputTypeCountCaseActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseActivityWhereInput
  }

  /**
   * JudgeCountOutputType without action
   */
  export type JudgeCountOutputTypeCountCaseAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseJudgeAssignmentWhereInput
  }


  /**
   * Count Type CaseTypeCountOutputType
   */

  export type CaseTypeCountOutputType = {
    cases: number
  }

  export type CaseTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cases?: boolean | CaseTypeCountOutputTypeCountCasesArgs
  }

  // Custom InputTypes
  /**
   * CaseTypeCountOutputType without action
   */
  export type CaseTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseTypeCountOutputType
     */
    select?: CaseTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CaseTypeCountOutputType without action
   */
  export type CaseTypeCountOutputTypeCountCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
  }


  /**
   * Count Type CaseCountOutputType
   */

  export type CaseCountOutputType = {
    activities: number
    judgeAssignments: number
  }

  export type CaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activities?: boolean | CaseCountOutputTypeCountActivitiesArgs
    judgeAssignments?: boolean | CaseCountOutputTypeCountJudgeAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseCountOutputType
     */
    select?: CaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseActivityWhereInput
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountJudgeAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseJudgeAssignmentWhereInput
  }


  /**
   * Count Type DailyImportBatchCountOutputType
   */

  export type DailyImportBatchCountOutputType = {
    activities: number
    progress: number
    errorDetails: number
  }

  export type DailyImportBatchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activities?: boolean | DailyImportBatchCountOutputTypeCountActivitiesArgs
    progress?: boolean | DailyImportBatchCountOutputTypeCountProgressArgs
    errorDetails?: boolean | DailyImportBatchCountOutputTypeCountErrorDetailsArgs
  }

  // Custom InputTypes
  /**
   * DailyImportBatchCountOutputType without action
   */
  export type DailyImportBatchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatchCountOutputType
     */
    select?: DailyImportBatchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DailyImportBatchCountOutputType without action
   */
  export type DailyImportBatchCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseActivityWhereInput
  }

  /**
   * DailyImportBatchCountOutputType without action
   */
  export type DailyImportBatchCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportProgressWhereInput
  }

  /**
   * DailyImportBatchCountOutputType without action
   */
  export type DailyImportBatchCountOutputTypeCountErrorDetailsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportErrorDetailWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    importBatches: number
    importSessions: number
    validationResults: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    importBatches?: boolean | UserCountOutputTypeCountImportBatchesArgs
    importSessions?: boolean | UserCountOutputTypeCountImportSessionsArgs
    validationResults?: boolean | UserCountOutputTypeCountValidationResultsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountImportBatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyImportBatchWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountImportSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountValidationResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ValidationResultWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Court
   */

  export type AggregateCourt = {
    _count: CourtCountAggregateOutputType | null
    _avg: CourtAvgAggregateOutputType | null
    _sum: CourtSumAggregateOutputType | null
    _min: CourtMinAggregateOutputType | null
    _max: CourtMaxAggregateOutputType | null
  }

  export type CourtAvgAggregateOutputType = {
    originalYear: number | null
  }

  export type CourtSumAggregateOutputType = {
    originalYear: number | null
  }

  export type CourtMinAggregateOutputType = {
    id: string | null
    courtName: string | null
    courtCode: string | null
    courtType: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    originalCode: string | null
    originalNumber: string | null
    originalYear: number | null
  }

  export type CourtMaxAggregateOutputType = {
    id: string | null
    courtName: string | null
    courtCode: string | null
    courtType: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    originalCode: string | null
    originalNumber: string | null
    originalYear: number | null
  }

  export type CourtCountAggregateOutputType = {
    id: number
    courtName: number
    courtCode: number
    courtType: number
    isActive: number
    createdAt: number
    updatedAt: number
    originalCode: number
    originalNumber: number
    originalYear: number
    _all: number
  }


  export type CourtAvgAggregateInputType = {
    originalYear?: true
  }

  export type CourtSumAggregateInputType = {
    originalYear?: true
  }

  export type CourtMinAggregateInputType = {
    id?: true
    courtName?: true
    courtCode?: true
    courtType?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    originalCode?: true
    originalNumber?: true
    originalYear?: true
  }

  export type CourtMaxAggregateInputType = {
    id?: true
    courtName?: true
    courtCode?: true
    courtType?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    originalCode?: true
    originalNumber?: true
    originalYear?: true
  }

  export type CourtCountAggregateInputType = {
    id?: true
    courtName?: true
    courtCode?: true
    courtType?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    originalCode?: true
    originalNumber?: true
    originalYear?: true
    _all?: true
  }

  export type CourtAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Court to aggregate.
     */
    where?: CourtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courts to fetch.
     */
    orderBy?: CourtOrderByWithRelationInput | CourtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Courts
    **/
    _count?: true | CourtCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CourtAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CourtSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourtMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourtMaxAggregateInputType
  }

  export type GetCourtAggregateType<T extends CourtAggregateArgs> = {
        [P in keyof T & keyof AggregateCourt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourt[P]>
      : GetScalarType<T[P], AggregateCourt[P]>
  }




  export type CourtGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourtWhereInput
    orderBy?: CourtOrderByWithAggregationInput | CourtOrderByWithAggregationInput[]
    by: CourtScalarFieldEnum[] | CourtScalarFieldEnum
    having?: CourtScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourtCountAggregateInputType | true
    _avg?: CourtAvgAggregateInputType
    _sum?: CourtSumAggregateInputType
    _min?: CourtMinAggregateInputType
    _max?: CourtMaxAggregateInputType
  }

  export type CourtGroupByOutputType = {
    id: string
    courtName: string
    courtCode: string
    courtType: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    originalCode: string | null
    originalNumber: string | null
    originalYear: number | null
    _count: CourtCountAggregateOutputType | null
    _avg: CourtAvgAggregateOutputType | null
    _sum: CourtSumAggregateOutputType | null
    _min: CourtMinAggregateOutputType | null
    _max: CourtMaxAggregateOutputType | null
  }

  type GetCourtGroupByPayload<T extends CourtGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourtGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourtGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourtGroupByOutputType[P]>
            : GetScalarType<T[P], CourtGroupByOutputType[P]>
        }
      >
    >


  export type CourtSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courtName?: boolean
    courtCode?: boolean
    courtType?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    originalCode?: boolean
    originalNumber?: boolean
    originalYear?: boolean
    cases?: boolean | Court$casesArgs<ExtArgs>
    _count?: boolean | CourtCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["court"]>

  export type CourtSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courtName?: boolean
    courtCode?: boolean
    courtType?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    originalCode?: boolean
    originalNumber?: boolean
    originalYear?: boolean
  }, ExtArgs["result"]["court"]>

  export type CourtSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courtName?: boolean
    courtCode?: boolean
    courtType?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    originalCode?: boolean
    originalNumber?: boolean
    originalYear?: boolean
  }, ExtArgs["result"]["court"]>

  export type CourtSelectScalar = {
    id?: boolean
    courtName?: boolean
    courtCode?: boolean
    courtType?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    originalCode?: boolean
    originalNumber?: boolean
    originalYear?: boolean
  }

  export type CourtOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "courtName" | "courtCode" | "courtType" | "isActive" | "createdAt" | "updatedAt" | "originalCode" | "originalNumber" | "originalYear", ExtArgs["result"]["court"]>
  export type CourtInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cases?: boolean | Court$casesArgs<ExtArgs>
    _count?: boolean | CourtCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CourtIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CourtIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CourtPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Court"
    objects: {
      cases: Prisma.$CasePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      courtName: string
      courtCode: string
      courtType: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      originalCode: string | null
      originalNumber: string | null
      originalYear: number | null
    }, ExtArgs["result"]["court"]>
    composites: {}
  }

  type CourtGetPayload<S extends boolean | null | undefined | CourtDefaultArgs> = $Result.GetResult<Prisma.$CourtPayload, S>

  type CourtCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourtFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourtCountAggregateInputType | true
    }

  export interface CourtDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Court'], meta: { name: 'Court' } }
    /**
     * Find zero or one Court that matches the filter.
     * @param {CourtFindUniqueArgs} args - Arguments to find a Court
     * @example
     * // Get one Court
     * const court = await prisma.court.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourtFindUniqueArgs>(args: SelectSubset<T, CourtFindUniqueArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Court that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourtFindUniqueOrThrowArgs} args - Arguments to find a Court
     * @example
     * // Get one Court
     * const court = await prisma.court.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourtFindUniqueOrThrowArgs>(args: SelectSubset<T, CourtFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Court that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourtFindFirstArgs} args - Arguments to find a Court
     * @example
     * // Get one Court
     * const court = await prisma.court.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourtFindFirstArgs>(args?: SelectSubset<T, CourtFindFirstArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Court that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourtFindFirstOrThrowArgs} args - Arguments to find a Court
     * @example
     * // Get one Court
     * const court = await prisma.court.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourtFindFirstOrThrowArgs>(args?: SelectSubset<T, CourtFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Courts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourtFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Courts
     * const courts = await prisma.court.findMany()
     * 
     * // Get first 10 Courts
     * const courts = await prisma.court.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courtWithIdOnly = await prisma.court.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourtFindManyArgs>(args?: SelectSubset<T, CourtFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Court.
     * @param {CourtCreateArgs} args - Arguments to create a Court.
     * @example
     * // Create one Court
     * const Court = await prisma.court.create({
     *   data: {
     *     // ... data to create a Court
     *   }
     * })
     * 
     */
    create<T extends CourtCreateArgs>(args: SelectSubset<T, CourtCreateArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Courts.
     * @param {CourtCreateManyArgs} args - Arguments to create many Courts.
     * @example
     * // Create many Courts
     * const court = await prisma.court.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourtCreateManyArgs>(args?: SelectSubset<T, CourtCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Courts and returns the data saved in the database.
     * @param {CourtCreateManyAndReturnArgs} args - Arguments to create many Courts.
     * @example
     * // Create many Courts
     * const court = await prisma.court.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Courts and only return the `id`
     * const courtWithIdOnly = await prisma.court.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourtCreateManyAndReturnArgs>(args?: SelectSubset<T, CourtCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Court.
     * @param {CourtDeleteArgs} args - Arguments to delete one Court.
     * @example
     * // Delete one Court
     * const Court = await prisma.court.delete({
     *   where: {
     *     // ... filter to delete one Court
     *   }
     * })
     * 
     */
    delete<T extends CourtDeleteArgs>(args: SelectSubset<T, CourtDeleteArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Court.
     * @param {CourtUpdateArgs} args - Arguments to update one Court.
     * @example
     * // Update one Court
     * const court = await prisma.court.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourtUpdateArgs>(args: SelectSubset<T, CourtUpdateArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Courts.
     * @param {CourtDeleteManyArgs} args - Arguments to filter Courts to delete.
     * @example
     * // Delete a few Courts
     * const { count } = await prisma.court.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourtDeleteManyArgs>(args?: SelectSubset<T, CourtDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourtUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Courts
     * const court = await prisma.court.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourtUpdateManyArgs>(args: SelectSubset<T, CourtUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courts and returns the data updated in the database.
     * @param {CourtUpdateManyAndReturnArgs} args - Arguments to update many Courts.
     * @example
     * // Update many Courts
     * const court = await prisma.court.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Courts and only return the `id`
     * const courtWithIdOnly = await prisma.court.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CourtUpdateManyAndReturnArgs>(args: SelectSubset<T, CourtUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Court.
     * @param {CourtUpsertArgs} args - Arguments to update or create a Court.
     * @example
     * // Update or create a Court
     * const court = await prisma.court.upsert({
     *   create: {
     *     // ... data to create a Court
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Court we want to update
     *   }
     * })
     */
    upsert<T extends CourtUpsertArgs>(args: SelectSubset<T, CourtUpsertArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Courts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourtCountArgs} args - Arguments to filter Courts to count.
     * @example
     * // Count the number of Courts
     * const count = await prisma.court.count({
     *   where: {
     *     // ... the filter for the Courts we want to count
     *   }
     * })
    **/
    count<T extends CourtCountArgs>(
      args?: Subset<T, CourtCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourtCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Court.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourtAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CourtAggregateArgs>(args: Subset<T, CourtAggregateArgs>): Prisma.PrismaPromise<GetCourtAggregateType<T>>

    /**
     * Group by Court.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourtGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CourtGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourtGroupByArgs['orderBy'] }
        : { orderBy?: CourtGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CourtGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourtGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Court model
   */
  readonly fields: CourtFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Court.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourtClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cases<T extends Court$casesArgs<ExtArgs> = {}>(args?: Subset<T, Court$casesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Court model
   */
  interface CourtFieldRefs {
    readonly id: FieldRef<"Court", 'String'>
    readonly courtName: FieldRef<"Court", 'String'>
    readonly courtCode: FieldRef<"Court", 'String'>
    readonly courtType: FieldRef<"Court", 'String'>
    readonly isActive: FieldRef<"Court", 'Boolean'>
    readonly createdAt: FieldRef<"Court", 'DateTime'>
    readonly updatedAt: FieldRef<"Court", 'DateTime'>
    readonly originalCode: FieldRef<"Court", 'String'>
    readonly originalNumber: FieldRef<"Court", 'String'>
    readonly originalYear: FieldRef<"Court", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Court findUnique
   */
  export type CourtFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * Filter, which Court to fetch.
     */
    where: CourtWhereUniqueInput
  }

  /**
   * Court findUniqueOrThrow
   */
  export type CourtFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * Filter, which Court to fetch.
     */
    where: CourtWhereUniqueInput
  }

  /**
   * Court findFirst
   */
  export type CourtFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * Filter, which Court to fetch.
     */
    where?: CourtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courts to fetch.
     */
    orderBy?: CourtOrderByWithRelationInput | CourtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courts.
     */
    cursor?: CourtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courts.
     */
    distinct?: CourtScalarFieldEnum | CourtScalarFieldEnum[]
  }

  /**
   * Court findFirstOrThrow
   */
  export type CourtFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * Filter, which Court to fetch.
     */
    where?: CourtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courts to fetch.
     */
    orderBy?: CourtOrderByWithRelationInput | CourtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courts.
     */
    cursor?: CourtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courts.
     */
    distinct?: CourtScalarFieldEnum | CourtScalarFieldEnum[]
  }

  /**
   * Court findMany
   */
  export type CourtFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * Filter, which Courts to fetch.
     */
    where?: CourtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courts to fetch.
     */
    orderBy?: CourtOrderByWithRelationInput | CourtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Courts.
     */
    cursor?: CourtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courts.
     */
    skip?: number
    distinct?: CourtScalarFieldEnum | CourtScalarFieldEnum[]
  }

  /**
   * Court create
   */
  export type CourtCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * The data needed to create a Court.
     */
    data: XOR<CourtCreateInput, CourtUncheckedCreateInput>
  }

  /**
   * Court createMany
   */
  export type CourtCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Courts.
     */
    data: CourtCreateManyInput | CourtCreateManyInput[]
  }

  /**
   * Court createManyAndReturn
   */
  export type CourtCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * The data used to create many Courts.
     */
    data: CourtCreateManyInput | CourtCreateManyInput[]
  }

  /**
   * Court update
   */
  export type CourtUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * The data needed to update a Court.
     */
    data: XOR<CourtUpdateInput, CourtUncheckedUpdateInput>
    /**
     * Choose, which Court to update.
     */
    where: CourtWhereUniqueInput
  }

  /**
   * Court updateMany
   */
  export type CourtUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Courts.
     */
    data: XOR<CourtUpdateManyMutationInput, CourtUncheckedUpdateManyInput>
    /**
     * Filter which Courts to update
     */
    where?: CourtWhereInput
    /**
     * Limit how many Courts to update.
     */
    limit?: number
  }

  /**
   * Court updateManyAndReturn
   */
  export type CourtUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * The data used to update Courts.
     */
    data: XOR<CourtUpdateManyMutationInput, CourtUncheckedUpdateManyInput>
    /**
     * Filter which Courts to update
     */
    where?: CourtWhereInput
    /**
     * Limit how many Courts to update.
     */
    limit?: number
  }

  /**
   * Court upsert
   */
  export type CourtUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * The filter to search for the Court to update in case it exists.
     */
    where: CourtWhereUniqueInput
    /**
     * In case the Court found by the `where` argument doesn't exist, create a new Court with this data.
     */
    create: XOR<CourtCreateInput, CourtUncheckedCreateInput>
    /**
     * In case the Court was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourtUpdateInput, CourtUncheckedUpdateInput>
  }

  /**
   * Court delete
   */
  export type CourtDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    /**
     * Filter which Court to delete.
     */
    where: CourtWhereUniqueInput
  }

  /**
   * Court deleteMany
   */
  export type CourtDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Courts to delete
     */
    where?: CourtWhereInput
    /**
     * Limit how many Courts to delete.
     */
    limit?: number
  }

  /**
   * Court.cases
   */
  export type Court$casesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    cursor?: CaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Court without action
   */
  export type CourtDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
  }


  /**
   * Model Judge
   */

  export type AggregateJudge = {
    _count: JudgeCountAggregateOutputType | null
    _min: JudgeMinAggregateOutputType | null
    _max: JudgeMaxAggregateOutputType | null
  }

  export type JudgeMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    firstName: string | null
    lastName: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JudgeMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    firstName: string | null
    lastName: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JudgeCountAggregateOutputType = {
    id: number
    fullName: number
    firstName: number
    lastName: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JudgeMinAggregateInputType = {
    id?: true
    fullName?: true
    firstName?: true
    lastName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JudgeMaxAggregateInputType = {
    id?: true
    fullName?: true
    firstName?: true
    lastName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JudgeCountAggregateInputType = {
    id?: true
    fullName?: true
    firstName?: true
    lastName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JudgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Judge to aggregate.
     */
    where?: JudgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Judges to fetch.
     */
    orderBy?: JudgeOrderByWithRelationInput | JudgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JudgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Judges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Judges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Judges
    **/
    _count?: true | JudgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JudgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JudgeMaxAggregateInputType
  }

  export type GetJudgeAggregateType<T extends JudgeAggregateArgs> = {
        [P in keyof T & keyof AggregateJudge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJudge[P]>
      : GetScalarType<T[P], AggregateJudge[P]>
  }




  export type JudgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JudgeWhereInput
    orderBy?: JudgeOrderByWithAggregationInput | JudgeOrderByWithAggregationInput[]
    by: JudgeScalarFieldEnum[] | JudgeScalarFieldEnum
    having?: JudgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JudgeCountAggregateInputType | true
    _min?: JudgeMinAggregateInputType
    _max?: JudgeMaxAggregateInputType
  }

  export type JudgeGroupByOutputType = {
    id: string
    fullName: string
    firstName: string
    lastName: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: JudgeCountAggregateOutputType | null
    _min: JudgeMinAggregateOutputType | null
    _max: JudgeMaxAggregateOutputType | null
  }

  type GetJudgeGroupByPayload<T extends JudgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JudgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JudgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JudgeGroupByOutputType[P]>
            : GetScalarType<T[P], JudgeGroupByOutputType[P]>
        }
      >
    >


  export type JudgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    caseActivities?: boolean | Judge$caseActivitiesArgs<ExtArgs>
    caseAssignments?: boolean | Judge$caseAssignmentsArgs<ExtArgs>
    _count?: boolean | JudgeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["judge"]>

  export type JudgeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["judge"]>

  export type JudgeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["judge"]>

  export type JudgeSelectScalar = {
    id?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JudgeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "firstName" | "lastName" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["judge"]>
  export type JudgeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caseActivities?: boolean | Judge$caseActivitiesArgs<ExtArgs>
    caseAssignments?: boolean | Judge$caseAssignmentsArgs<ExtArgs>
    _count?: boolean | JudgeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JudgeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type JudgeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $JudgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Judge"
    objects: {
      caseActivities: Prisma.$CaseActivityPayload<ExtArgs>[]
      caseAssignments: Prisma.$CaseJudgeAssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      firstName: string
      lastName: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["judge"]>
    composites: {}
  }

  type JudgeGetPayload<S extends boolean | null | undefined | JudgeDefaultArgs> = $Result.GetResult<Prisma.$JudgePayload, S>

  type JudgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JudgeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JudgeCountAggregateInputType | true
    }

  export interface JudgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Judge'], meta: { name: 'Judge' } }
    /**
     * Find zero or one Judge that matches the filter.
     * @param {JudgeFindUniqueArgs} args - Arguments to find a Judge
     * @example
     * // Get one Judge
     * const judge = await prisma.judge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JudgeFindUniqueArgs>(args: SelectSubset<T, JudgeFindUniqueArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Judge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JudgeFindUniqueOrThrowArgs} args - Arguments to find a Judge
     * @example
     * // Get one Judge
     * const judge = await prisma.judge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JudgeFindUniqueOrThrowArgs>(args: SelectSubset<T, JudgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Judge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JudgeFindFirstArgs} args - Arguments to find a Judge
     * @example
     * // Get one Judge
     * const judge = await prisma.judge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JudgeFindFirstArgs>(args?: SelectSubset<T, JudgeFindFirstArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Judge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JudgeFindFirstOrThrowArgs} args - Arguments to find a Judge
     * @example
     * // Get one Judge
     * const judge = await prisma.judge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JudgeFindFirstOrThrowArgs>(args?: SelectSubset<T, JudgeFindFirstOrThrowArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Judges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JudgeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Judges
     * const judges = await prisma.judge.findMany()
     * 
     * // Get first 10 Judges
     * const judges = await prisma.judge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const judgeWithIdOnly = await prisma.judge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JudgeFindManyArgs>(args?: SelectSubset<T, JudgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Judge.
     * @param {JudgeCreateArgs} args - Arguments to create a Judge.
     * @example
     * // Create one Judge
     * const Judge = await prisma.judge.create({
     *   data: {
     *     // ... data to create a Judge
     *   }
     * })
     * 
     */
    create<T extends JudgeCreateArgs>(args: SelectSubset<T, JudgeCreateArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Judges.
     * @param {JudgeCreateManyArgs} args - Arguments to create many Judges.
     * @example
     * // Create many Judges
     * const judge = await prisma.judge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JudgeCreateManyArgs>(args?: SelectSubset<T, JudgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Judges and returns the data saved in the database.
     * @param {JudgeCreateManyAndReturnArgs} args - Arguments to create many Judges.
     * @example
     * // Create many Judges
     * const judge = await prisma.judge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Judges and only return the `id`
     * const judgeWithIdOnly = await prisma.judge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JudgeCreateManyAndReturnArgs>(args?: SelectSubset<T, JudgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Judge.
     * @param {JudgeDeleteArgs} args - Arguments to delete one Judge.
     * @example
     * // Delete one Judge
     * const Judge = await prisma.judge.delete({
     *   where: {
     *     // ... filter to delete one Judge
     *   }
     * })
     * 
     */
    delete<T extends JudgeDeleteArgs>(args: SelectSubset<T, JudgeDeleteArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Judge.
     * @param {JudgeUpdateArgs} args - Arguments to update one Judge.
     * @example
     * // Update one Judge
     * const judge = await prisma.judge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JudgeUpdateArgs>(args: SelectSubset<T, JudgeUpdateArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Judges.
     * @param {JudgeDeleteManyArgs} args - Arguments to filter Judges to delete.
     * @example
     * // Delete a few Judges
     * const { count } = await prisma.judge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JudgeDeleteManyArgs>(args?: SelectSubset<T, JudgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Judges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JudgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Judges
     * const judge = await prisma.judge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JudgeUpdateManyArgs>(args: SelectSubset<T, JudgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Judges and returns the data updated in the database.
     * @param {JudgeUpdateManyAndReturnArgs} args - Arguments to update many Judges.
     * @example
     * // Update many Judges
     * const judge = await prisma.judge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Judges and only return the `id`
     * const judgeWithIdOnly = await prisma.judge.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JudgeUpdateManyAndReturnArgs>(args: SelectSubset<T, JudgeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Judge.
     * @param {JudgeUpsertArgs} args - Arguments to update or create a Judge.
     * @example
     * // Update or create a Judge
     * const judge = await prisma.judge.upsert({
     *   create: {
     *     // ... data to create a Judge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Judge we want to update
     *   }
     * })
     */
    upsert<T extends JudgeUpsertArgs>(args: SelectSubset<T, JudgeUpsertArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Judges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JudgeCountArgs} args - Arguments to filter Judges to count.
     * @example
     * // Count the number of Judges
     * const count = await prisma.judge.count({
     *   where: {
     *     // ... the filter for the Judges we want to count
     *   }
     * })
    **/
    count<T extends JudgeCountArgs>(
      args?: Subset<T, JudgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JudgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Judge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JudgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JudgeAggregateArgs>(args: Subset<T, JudgeAggregateArgs>): Prisma.PrismaPromise<GetJudgeAggregateType<T>>

    /**
     * Group by Judge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JudgeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JudgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JudgeGroupByArgs['orderBy'] }
        : { orderBy?: JudgeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JudgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJudgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Judge model
   */
  readonly fields: JudgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Judge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JudgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    caseActivities<T extends Judge$caseActivitiesArgs<ExtArgs> = {}>(args?: Subset<T, Judge$caseActivitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    caseAssignments<T extends Judge$caseAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Judge$caseAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Judge model
   */
  interface JudgeFieldRefs {
    readonly id: FieldRef<"Judge", 'String'>
    readonly fullName: FieldRef<"Judge", 'String'>
    readonly firstName: FieldRef<"Judge", 'String'>
    readonly lastName: FieldRef<"Judge", 'String'>
    readonly isActive: FieldRef<"Judge", 'Boolean'>
    readonly createdAt: FieldRef<"Judge", 'DateTime'>
    readonly updatedAt: FieldRef<"Judge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Judge findUnique
   */
  export type JudgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * Filter, which Judge to fetch.
     */
    where: JudgeWhereUniqueInput
  }

  /**
   * Judge findUniqueOrThrow
   */
  export type JudgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * Filter, which Judge to fetch.
     */
    where: JudgeWhereUniqueInput
  }

  /**
   * Judge findFirst
   */
  export type JudgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * Filter, which Judge to fetch.
     */
    where?: JudgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Judges to fetch.
     */
    orderBy?: JudgeOrderByWithRelationInput | JudgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Judges.
     */
    cursor?: JudgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Judges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Judges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Judges.
     */
    distinct?: JudgeScalarFieldEnum | JudgeScalarFieldEnum[]
  }

  /**
   * Judge findFirstOrThrow
   */
  export type JudgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * Filter, which Judge to fetch.
     */
    where?: JudgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Judges to fetch.
     */
    orderBy?: JudgeOrderByWithRelationInput | JudgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Judges.
     */
    cursor?: JudgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Judges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Judges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Judges.
     */
    distinct?: JudgeScalarFieldEnum | JudgeScalarFieldEnum[]
  }

  /**
   * Judge findMany
   */
  export type JudgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * Filter, which Judges to fetch.
     */
    where?: JudgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Judges to fetch.
     */
    orderBy?: JudgeOrderByWithRelationInput | JudgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Judges.
     */
    cursor?: JudgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Judges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Judges.
     */
    skip?: number
    distinct?: JudgeScalarFieldEnum | JudgeScalarFieldEnum[]
  }

  /**
   * Judge create
   */
  export type JudgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * The data needed to create a Judge.
     */
    data: XOR<JudgeCreateInput, JudgeUncheckedCreateInput>
  }

  /**
   * Judge createMany
   */
  export type JudgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Judges.
     */
    data: JudgeCreateManyInput | JudgeCreateManyInput[]
  }

  /**
   * Judge createManyAndReturn
   */
  export type JudgeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * The data used to create many Judges.
     */
    data: JudgeCreateManyInput | JudgeCreateManyInput[]
  }

  /**
   * Judge update
   */
  export type JudgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * The data needed to update a Judge.
     */
    data: XOR<JudgeUpdateInput, JudgeUncheckedUpdateInput>
    /**
     * Choose, which Judge to update.
     */
    where: JudgeWhereUniqueInput
  }

  /**
   * Judge updateMany
   */
  export type JudgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Judges.
     */
    data: XOR<JudgeUpdateManyMutationInput, JudgeUncheckedUpdateManyInput>
    /**
     * Filter which Judges to update
     */
    where?: JudgeWhereInput
    /**
     * Limit how many Judges to update.
     */
    limit?: number
  }

  /**
   * Judge updateManyAndReturn
   */
  export type JudgeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * The data used to update Judges.
     */
    data: XOR<JudgeUpdateManyMutationInput, JudgeUncheckedUpdateManyInput>
    /**
     * Filter which Judges to update
     */
    where?: JudgeWhereInput
    /**
     * Limit how many Judges to update.
     */
    limit?: number
  }

  /**
   * Judge upsert
   */
  export type JudgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * The filter to search for the Judge to update in case it exists.
     */
    where: JudgeWhereUniqueInput
    /**
     * In case the Judge found by the `where` argument doesn't exist, create a new Judge with this data.
     */
    create: XOR<JudgeCreateInput, JudgeUncheckedCreateInput>
    /**
     * In case the Judge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JudgeUpdateInput, JudgeUncheckedUpdateInput>
  }

  /**
   * Judge delete
   */
  export type JudgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
    /**
     * Filter which Judge to delete.
     */
    where: JudgeWhereUniqueInput
  }

  /**
   * Judge deleteMany
   */
  export type JudgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Judges to delete
     */
    where?: JudgeWhereInput
    /**
     * Limit how many Judges to delete.
     */
    limit?: number
  }

  /**
   * Judge.caseActivities
   */
  export type Judge$caseActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    where?: CaseActivityWhereInput
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    cursor?: CaseActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * Judge.caseAssignments
   */
  export type Judge$caseAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    where?: CaseJudgeAssignmentWhereInput
    orderBy?: CaseJudgeAssignmentOrderByWithRelationInput | CaseJudgeAssignmentOrderByWithRelationInput[]
    cursor?: CaseJudgeAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseJudgeAssignmentScalarFieldEnum | CaseJudgeAssignmentScalarFieldEnum[]
  }

  /**
   * Judge without action
   */
  export type JudgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Judge
     */
    select?: JudgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Judge
     */
    omit?: JudgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JudgeInclude<ExtArgs> | null
  }


  /**
   * Model CaseType
   */

  export type AggregateCaseType = {
    _count: CaseTypeCountAggregateOutputType | null
    _min: CaseTypeMinAggregateOutputType | null
    _max: CaseTypeMaxAggregateOutputType | null
  }

  export type CaseTypeMinAggregateOutputType = {
    id: string | null
    caseTypeName: string | null
    caseTypeCode: string | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type CaseTypeMaxAggregateOutputType = {
    id: string | null
    caseTypeName: string | null
    caseTypeCode: string | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type CaseTypeCountAggregateOutputType = {
    id: number
    caseTypeName: number
    caseTypeCode: number
    description: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type CaseTypeMinAggregateInputType = {
    id?: true
    caseTypeName?: true
    caseTypeCode?: true
    description?: true
    isActive?: true
    createdAt?: true
  }

  export type CaseTypeMaxAggregateInputType = {
    id?: true
    caseTypeName?: true
    caseTypeCode?: true
    description?: true
    isActive?: true
    createdAt?: true
  }

  export type CaseTypeCountAggregateInputType = {
    id?: true
    caseTypeName?: true
    caseTypeCode?: true
    description?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type CaseTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseType to aggregate.
     */
    where?: CaseTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseTypes to fetch.
     */
    orderBy?: CaseTypeOrderByWithRelationInput | CaseTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CaseTypes
    **/
    _count?: true | CaseTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseTypeMaxAggregateInputType
  }

  export type GetCaseTypeAggregateType<T extends CaseTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateCaseType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCaseType[P]>
      : GetScalarType<T[P], AggregateCaseType[P]>
  }




  export type CaseTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseTypeWhereInput
    orderBy?: CaseTypeOrderByWithAggregationInput | CaseTypeOrderByWithAggregationInput[]
    by: CaseTypeScalarFieldEnum[] | CaseTypeScalarFieldEnum
    having?: CaseTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseTypeCountAggregateInputType | true
    _min?: CaseTypeMinAggregateInputType
    _max?: CaseTypeMaxAggregateInputType
  }

  export type CaseTypeGroupByOutputType = {
    id: string
    caseTypeName: string
    caseTypeCode: string
    description: string | null
    isActive: boolean
    createdAt: Date
    _count: CaseTypeCountAggregateOutputType | null
    _min: CaseTypeMinAggregateOutputType | null
    _max: CaseTypeMaxAggregateOutputType | null
  }

  type GetCaseTypeGroupByPayload<T extends CaseTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseTypeGroupByOutputType[P]>
            : GetScalarType<T[P], CaseTypeGroupByOutputType[P]>
        }
      >
    >


  export type CaseTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseTypeName?: boolean
    caseTypeCode?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    cases?: boolean | CaseType$casesArgs<ExtArgs>
    _count?: boolean | CaseTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseType"]>

  export type CaseTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseTypeName?: boolean
    caseTypeCode?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["caseType"]>

  export type CaseTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseTypeName?: boolean
    caseTypeCode?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["caseType"]>

  export type CaseTypeSelectScalar = {
    id?: boolean
    caseTypeName?: boolean
    caseTypeCode?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type CaseTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseTypeName" | "caseTypeCode" | "description" | "isActive" | "createdAt", ExtArgs["result"]["caseType"]>
  export type CaseTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cases?: boolean | CaseType$casesArgs<ExtArgs>
    _count?: boolean | CaseTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CaseTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CaseTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CaseTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CaseType"
    objects: {
      cases: Prisma.$CasePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      caseTypeName: string
      caseTypeCode: string
      description: string | null
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["caseType"]>
    composites: {}
  }

  type CaseTypeGetPayload<S extends boolean | null | undefined | CaseTypeDefaultArgs> = $Result.GetResult<Prisma.$CaseTypePayload, S>

  type CaseTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseTypeCountAggregateInputType | true
    }

  export interface CaseTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CaseType'], meta: { name: 'CaseType' } }
    /**
     * Find zero or one CaseType that matches the filter.
     * @param {CaseTypeFindUniqueArgs} args - Arguments to find a CaseType
     * @example
     * // Get one CaseType
     * const caseType = await prisma.caseType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseTypeFindUniqueArgs>(args: SelectSubset<T, CaseTypeFindUniqueArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CaseType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseTypeFindUniqueOrThrowArgs} args - Arguments to find a CaseType
     * @example
     * // Get one CaseType
     * const caseType = await prisma.caseType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseTypeFindFirstArgs} args - Arguments to find a CaseType
     * @example
     * // Get one CaseType
     * const caseType = await prisma.caseType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseTypeFindFirstArgs>(args?: SelectSubset<T, CaseTypeFindFirstArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseTypeFindFirstOrThrowArgs} args - Arguments to find a CaseType
     * @example
     * // Get one CaseType
     * const caseType = await prisma.caseType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CaseTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CaseTypes
     * const caseTypes = await prisma.caseType.findMany()
     * 
     * // Get first 10 CaseTypes
     * const caseTypes = await prisma.caseType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseTypeWithIdOnly = await prisma.caseType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseTypeFindManyArgs>(args?: SelectSubset<T, CaseTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CaseType.
     * @param {CaseTypeCreateArgs} args - Arguments to create a CaseType.
     * @example
     * // Create one CaseType
     * const CaseType = await prisma.caseType.create({
     *   data: {
     *     // ... data to create a CaseType
     *   }
     * })
     * 
     */
    create<T extends CaseTypeCreateArgs>(args: SelectSubset<T, CaseTypeCreateArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CaseTypes.
     * @param {CaseTypeCreateManyArgs} args - Arguments to create many CaseTypes.
     * @example
     * // Create many CaseTypes
     * const caseType = await prisma.caseType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseTypeCreateManyArgs>(args?: SelectSubset<T, CaseTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CaseTypes and returns the data saved in the database.
     * @param {CaseTypeCreateManyAndReturnArgs} args - Arguments to create many CaseTypes.
     * @example
     * // Create many CaseTypes
     * const caseType = await prisma.caseType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CaseTypes and only return the `id`
     * const caseTypeWithIdOnly = await prisma.caseType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CaseType.
     * @param {CaseTypeDeleteArgs} args - Arguments to delete one CaseType.
     * @example
     * // Delete one CaseType
     * const CaseType = await prisma.caseType.delete({
     *   where: {
     *     // ... filter to delete one CaseType
     *   }
     * })
     * 
     */
    delete<T extends CaseTypeDeleteArgs>(args: SelectSubset<T, CaseTypeDeleteArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CaseType.
     * @param {CaseTypeUpdateArgs} args - Arguments to update one CaseType.
     * @example
     * // Update one CaseType
     * const caseType = await prisma.caseType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseTypeUpdateArgs>(args: SelectSubset<T, CaseTypeUpdateArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CaseTypes.
     * @param {CaseTypeDeleteManyArgs} args - Arguments to filter CaseTypes to delete.
     * @example
     * // Delete a few CaseTypes
     * const { count } = await prisma.caseType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseTypeDeleteManyArgs>(args?: SelectSubset<T, CaseTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CaseTypes
     * const caseType = await prisma.caseType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseTypeUpdateManyArgs>(args: SelectSubset<T, CaseTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseTypes and returns the data updated in the database.
     * @param {CaseTypeUpdateManyAndReturnArgs} args - Arguments to update many CaseTypes.
     * @example
     * // Update many CaseTypes
     * const caseType = await prisma.caseType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CaseTypes and only return the `id`
     * const caseTypeWithIdOnly = await prisma.caseType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CaseTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, CaseTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CaseType.
     * @param {CaseTypeUpsertArgs} args - Arguments to update or create a CaseType.
     * @example
     * // Update or create a CaseType
     * const caseType = await prisma.caseType.upsert({
     *   create: {
     *     // ... data to create a CaseType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CaseType we want to update
     *   }
     * })
     */
    upsert<T extends CaseTypeUpsertArgs>(args: SelectSubset<T, CaseTypeUpsertArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CaseTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseTypeCountArgs} args - Arguments to filter CaseTypes to count.
     * @example
     * // Count the number of CaseTypes
     * const count = await prisma.caseType.count({
     *   where: {
     *     // ... the filter for the CaseTypes we want to count
     *   }
     * })
    **/
    count<T extends CaseTypeCountArgs>(
      args?: Subset<T, CaseTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CaseType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseTypeAggregateArgs>(args: Subset<T, CaseTypeAggregateArgs>): Prisma.PrismaPromise<GetCaseTypeAggregateType<T>>

    /**
     * Group by CaseType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseTypeGroupByArgs['orderBy'] }
        : { orderBy?: CaseTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CaseType model
   */
  readonly fields: CaseTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CaseType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cases<T extends CaseType$casesArgs<ExtArgs> = {}>(args?: Subset<T, CaseType$casesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CaseType model
   */
  interface CaseTypeFieldRefs {
    readonly id: FieldRef<"CaseType", 'String'>
    readonly caseTypeName: FieldRef<"CaseType", 'String'>
    readonly caseTypeCode: FieldRef<"CaseType", 'String'>
    readonly description: FieldRef<"CaseType", 'String'>
    readonly isActive: FieldRef<"CaseType", 'Boolean'>
    readonly createdAt: FieldRef<"CaseType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CaseType findUnique
   */
  export type CaseTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * Filter, which CaseType to fetch.
     */
    where: CaseTypeWhereUniqueInput
  }

  /**
   * CaseType findUniqueOrThrow
   */
  export type CaseTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * Filter, which CaseType to fetch.
     */
    where: CaseTypeWhereUniqueInput
  }

  /**
   * CaseType findFirst
   */
  export type CaseTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * Filter, which CaseType to fetch.
     */
    where?: CaseTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseTypes to fetch.
     */
    orderBy?: CaseTypeOrderByWithRelationInput | CaseTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseTypes.
     */
    cursor?: CaseTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseTypes.
     */
    distinct?: CaseTypeScalarFieldEnum | CaseTypeScalarFieldEnum[]
  }

  /**
   * CaseType findFirstOrThrow
   */
  export type CaseTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * Filter, which CaseType to fetch.
     */
    where?: CaseTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseTypes to fetch.
     */
    orderBy?: CaseTypeOrderByWithRelationInput | CaseTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseTypes.
     */
    cursor?: CaseTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseTypes.
     */
    distinct?: CaseTypeScalarFieldEnum | CaseTypeScalarFieldEnum[]
  }

  /**
   * CaseType findMany
   */
  export type CaseTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * Filter, which CaseTypes to fetch.
     */
    where?: CaseTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseTypes to fetch.
     */
    orderBy?: CaseTypeOrderByWithRelationInput | CaseTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CaseTypes.
     */
    cursor?: CaseTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseTypes.
     */
    skip?: number
    distinct?: CaseTypeScalarFieldEnum | CaseTypeScalarFieldEnum[]
  }

  /**
   * CaseType create
   */
  export type CaseTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a CaseType.
     */
    data: XOR<CaseTypeCreateInput, CaseTypeUncheckedCreateInput>
  }

  /**
   * CaseType createMany
   */
  export type CaseTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CaseTypes.
     */
    data: CaseTypeCreateManyInput | CaseTypeCreateManyInput[]
  }

  /**
   * CaseType createManyAndReturn
   */
  export type CaseTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * The data used to create many CaseTypes.
     */
    data: CaseTypeCreateManyInput | CaseTypeCreateManyInput[]
  }

  /**
   * CaseType update
   */
  export type CaseTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a CaseType.
     */
    data: XOR<CaseTypeUpdateInput, CaseTypeUncheckedUpdateInput>
    /**
     * Choose, which CaseType to update.
     */
    where: CaseTypeWhereUniqueInput
  }

  /**
   * CaseType updateMany
   */
  export type CaseTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CaseTypes.
     */
    data: XOR<CaseTypeUpdateManyMutationInput, CaseTypeUncheckedUpdateManyInput>
    /**
     * Filter which CaseTypes to update
     */
    where?: CaseTypeWhereInput
    /**
     * Limit how many CaseTypes to update.
     */
    limit?: number
  }

  /**
   * CaseType updateManyAndReturn
   */
  export type CaseTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * The data used to update CaseTypes.
     */
    data: XOR<CaseTypeUpdateManyMutationInput, CaseTypeUncheckedUpdateManyInput>
    /**
     * Filter which CaseTypes to update
     */
    where?: CaseTypeWhereInput
    /**
     * Limit how many CaseTypes to update.
     */
    limit?: number
  }

  /**
   * CaseType upsert
   */
  export type CaseTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the CaseType to update in case it exists.
     */
    where: CaseTypeWhereUniqueInput
    /**
     * In case the CaseType found by the `where` argument doesn't exist, create a new CaseType with this data.
     */
    create: XOR<CaseTypeCreateInput, CaseTypeUncheckedCreateInput>
    /**
     * In case the CaseType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseTypeUpdateInput, CaseTypeUncheckedUpdateInput>
  }

  /**
   * CaseType delete
   */
  export type CaseTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
    /**
     * Filter which CaseType to delete.
     */
    where: CaseTypeWhereUniqueInput
  }

  /**
   * CaseType deleteMany
   */
  export type CaseTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseTypes to delete
     */
    where?: CaseTypeWhereInput
    /**
     * Limit how many CaseTypes to delete.
     */
    limit?: number
  }

  /**
   * CaseType.cases
   */
  export type CaseType$casesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    cursor?: CaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * CaseType without action
   */
  export type CaseTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseType
     */
    select?: CaseTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseType
     */
    omit?: CaseTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseTypeInclude<ExtArgs> | null
  }


  /**
   * Model Case
   */

  export type AggregateCase = {
    _count: CaseCountAggregateOutputType | null
    _avg: CaseAvgAggregateOutputType | null
    _sum: CaseSumAggregateOutputType | null
    _min: CaseMinAggregateOutputType | null
    _max: CaseMaxAggregateOutputType | null
  }

  export type CaseAvgAggregateOutputType = {
    originalYear: number | null
    totalActivities: number | null
    maleApplicant: number | null
    femaleApplicant: number | null
    organizationApplicant: number | null
    maleDefendant: number | null
    femaleDefendant: number | null
    organizationDefendant: number | null
  }

  export type CaseSumAggregateOutputType = {
    originalYear: number | null
    totalActivities: number | null
    maleApplicant: number | null
    femaleApplicant: number | null
    organizationApplicant: number | null
    maleDefendant: number | null
    femaleDefendant: number | null
    organizationDefendant: number | null
  }

  export type CaseMinAggregateOutputType = {
    id: string | null
    caseNumber: string | null
    courtName: string | null
    caseTypeId: string | null
    filedDate: Date | null
    originalCourtId: string | null
    originalCaseNumber: string | null
    originalYear: number | null
    status: string | null
    lastActivityDate: Date | null
    totalActivities: number | null
    hasLegalRepresentation: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    caseidType: string | null
    caseidNo: string | null
    maleApplicant: number | null
    femaleApplicant: number | null
    organizationApplicant: number | null
    maleDefendant: number | null
    femaleDefendant: number | null
    organizationDefendant: number | null
  }

  export type CaseMaxAggregateOutputType = {
    id: string | null
    caseNumber: string | null
    courtName: string | null
    caseTypeId: string | null
    filedDate: Date | null
    originalCourtId: string | null
    originalCaseNumber: string | null
    originalYear: number | null
    status: string | null
    lastActivityDate: Date | null
    totalActivities: number | null
    hasLegalRepresentation: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    caseidType: string | null
    caseidNo: string | null
    maleApplicant: number | null
    femaleApplicant: number | null
    organizationApplicant: number | null
    maleDefendant: number | null
    femaleDefendant: number | null
    organizationDefendant: number | null
  }

  export type CaseCountAggregateOutputType = {
    id: number
    caseNumber: number
    courtName: number
    caseTypeId: number
    filedDate: number
    originalCourtId: number
    originalCaseNumber: number
    originalYear: number
    parties: number
    status: number
    lastActivityDate: number
    totalActivities: number
    hasLegalRepresentation: number
    createdAt: number
    updatedAt: number
    caseidType: number
    caseidNo: number
    maleApplicant: number
    femaleApplicant: number
    organizationApplicant: number
    maleDefendant: number
    femaleDefendant: number
    organizationDefendant: number
    _all: number
  }


  export type CaseAvgAggregateInputType = {
    originalYear?: true
    totalActivities?: true
    maleApplicant?: true
    femaleApplicant?: true
    organizationApplicant?: true
    maleDefendant?: true
    femaleDefendant?: true
    organizationDefendant?: true
  }

  export type CaseSumAggregateInputType = {
    originalYear?: true
    totalActivities?: true
    maleApplicant?: true
    femaleApplicant?: true
    organizationApplicant?: true
    maleDefendant?: true
    femaleDefendant?: true
    organizationDefendant?: true
  }

  export type CaseMinAggregateInputType = {
    id?: true
    caseNumber?: true
    courtName?: true
    caseTypeId?: true
    filedDate?: true
    originalCourtId?: true
    originalCaseNumber?: true
    originalYear?: true
    status?: true
    lastActivityDate?: true
    totalActivities?: true
    hasLegalRepresentation?: true
    createdAt?: true
    updatedAt?: true
    caseidType?: true
    caseidNo?: true
    maleApplicant?: true
    femaleApplicant?: true
    organizationApplicant?: true
    maleDefendant?: true
    femaleDefendant?: true
    organizationDefendant?: true
  }

  export type CaseMaxAggregateInputType = {
    id?: true
    caseNumber?: true
    courtName?: true
    caseTypeId?: true
    filedDate?: true
    originalCourtId?: true
    originalCaseNumber?: true
    originalYear?: true
    status?: true
    lastActivityDate?: true
    totalActivities?: true
    hasLegalRepresentation?: true
    createdAt?: true
    updatedAt?: true
    caseidType?: true
    caseidNo?: true
    maleApplicant?: true
    femaleApplicant?: true
    organizationApplicant?: true
    maleDefendant?: true
    femaleDefendant?: true
    organizationDefendant?: true
  }

  export type CaseCountAggregateInputType = {
    id?: true
    caseNumber?: true
    courtName?: true
    caseTypeId?: true
    filedDate?: true
    originalCourtId?: true
    originalCaseNumber?: true
    originalYear?: true
    parties?: true
    status?: true
    lastActivityDate?: true
    totalActivities?: true
    hasLegalRepresentation?: true
    createdAt?: true
    updatedAt?: true
    caseidType?: true
    caseidNo?: true
    maleApplicant?: true
    femaleApplicant?: true
    organizationApplicant?: true
    maleDefendant?: true
    femaleDefendant?: true
    organizationDefendant?: true
    _all?: true
  }

  export type CaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Case to aggregate.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cases
    **/
    _count?: true | CaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseMaxAggregateInputType
  }

  export type GetCaseAggregateType<T extends CaseAggregateArgs> = {
        [P in keyof T & keyof AggregateCase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCase[P]>
      : GetScalarType<T[P], AggregateCase[P]>
  }




  export type CaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithAggregationInput | CaseOrderByWithAggregationInput[]
    by: CaseScalarFieldEnum[] | CaseScalarFieldEnum
    having?: CaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseCountAggregateInputType | true
    _avg?: CaseAvgAggregateInputType
    _sum?: CaseSumAggregateInputType
    _min?: CaseMinAggregateInputType
    _max?: CaseMaxAggregateInputType
  }

  export type CaseGroupByOutputType = {
    id: string
    caseNumber: string
    courtName: string
    caseTypeId: string
    filedDate: Date
    originalCourtId: string | null
    originalCaseNumber: string | null
    originalYear: number | null
    parties: JsonValue
    status: string
    lastActivityDate: Date | null
    totalActivities: number
    hasLegalRepresentation: boolean
    createdAt: Date
    updatedAt: Date
    caseidType: string | null
    caseidNo: string | null
    maleApplicant: number
    femaleApplicant: number
    organizationApplicant: number
    maleDefendant: number
    femaleDefendant: number
    organizationDefendant: number
    _count: CaseCountAggregateOutputType | null
    _avg: CaseAvgAggregateOutputType | null
    _sum: CaseSumAggregateOutputType | null
    _min: CaseMinAggregateOutputType | null
    _max: CaseMaxAggregateOutputType | null
  }

  type GetCaseGroupByPayload<T extends CaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseGroupByOutputType[P]>
            : GetScalarType<T[P], CaseGroupByOutputType[P]>
        }
      >
    >


  export type CaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseNumber?: boolean
    courtName?: boolean
    caseTypeId?: boolean
    filedDate?: boolean
    originalCourtId?: boolean
    originalCaseNumber?: boolean
    originalYear?: boolean
    parties?: boolean
    status?: boolean
    lastActivityDate?: boolean
    totalActivities?: boolean
    hasLegalRepresentation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    caseidType?: boolean
    caseidNo?: boolean
    maleApplicant?: boolean
    femaleApplicant?: boolean
    organizationApplicant?: boolean
    maleDefendant?: boolean
    femaleDefendant?: boolean
    organizationDefendant?: boolean
    caseType?: boolean | CaseTypeDefaultArgs<ExtArgs>
    originalCourt?: boolean | Case$originalCourtArgs<ExtArgs>
    activities?: boolean | Case$activitiesArgs<ExtArgs>
    judgeAssignments?: boolean | Case$judgeAssignmentsArgs<ExtArgs>
    _count?: boolean | CaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>

  export type CaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseNumber?: boolean
    courtName?: boolean
    caseTypeId?: boolean
    filedDate?: boolean
    originalCourtId?: boolean
    originalCaseNumber?: boolean
    originalYear?: boolean
    parties?: boolean
    status?: boolean
    lastActivityDate?: boolean
    totalActivities?: boolean
    hasLegalRepresentation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    caseidType?: boolean
    caseidNo?: boolean
    maleApplicant?: boolean
    femaleApplicant?: boolean
    organizationApplicant?: boolean
    maleDefendant?: boolean
    femaleDefendant?: boolean
    organizationDefendant?: boolean
    caseType?: boolean | CaseTypeDefaultArgs<ExtArgs>
    originalCourt?: boolean | Case$originalCourtArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>

  export type CaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseNumber?: boolean
    courtName?: boolean
    caseTypeId?: boolean
    filedDate?: boolean
    originalCourtId?: boolean
    originalCaseNumber?: boolean
    originalYear?: boolean
    parties?: boolean
    status?: boolean
    lastActivityDate?: boolean
    totalActivities?: boolean
    hasLegalRepresentation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    caseidType?: boolean
    caseidNo?: boolean
    maleApplicant?: boolean
    femaleApplicant?: boolean
    organizationApplicant?: boolean
    maleDefendant?: boolean
    femaleDefendant?: boolean
    organizationDefendant?: boolean
    caseType?: boolean | CaseTypeDefaultArgs<ExtArgs>
    originalCourt?: boolean | Case$originalCourtArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>

  export type CaseSelectScalar = {
    id?: boolean
    caseNumber?: boolean
    courtName?: boolean
    caseTypeId?: boolean
    filedDate?: boolean
    originalCourtId?: boolean
    originalCaseNumber?: boolean
    originalYear?: boolean
    parties?: boolean
    status?: boolean
    lastActivityDate?: boolean
    totalActivities?: boolean
    hasLegalRepresentation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    caseidType?: boolean
    caseidNo?: boolean
    maleApplicant?: boolean
    femaleApplicant?: boolean
    organizationApplicant?: boolean
    maleDefendant?: boolean
    femaleDefendant?: boolean
    organizationDefendant?: boolean
  }

  export type CaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseNumber" | "courtName" | "caseTypeId" | "filedDate" | "originalCourtId" | "originalCaseNumber" | "originalYear" | "parties" | "status" | "lastActivityDate" | "totalActivities" | "hasLegalRepresentation" | "createdAt" | "updatedAt" | "caseidType" | "caseidNo" | "maleApplicant" | "femaleApplicant" | "organizationApplicant" | "maleDefendant" | "femaleDefendant" | "organizationDefendant", ExtArgs["result"]["case"]>
  export type CaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caseType?: boolean | CaseTypeDefaultArgs<ExtArgs>
    originalCourt?: boolean | Case$originalCourtArgs<ExtArgs>
    activities?: boolean | Case$activitiesArgs<ExtArgs>
    judgeAssignments?: boolean | Case$judgeAssignmentsArgs<ExtArgs>
    _count?: boolean | CaseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caseType?: boolean | CaseTypeDefaultArgs<ExtArgs>
    originalCourt?: boolean | Case$originalCourtArgs<ExtArgs>
  }
  export type CaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caseType?: boolean | CaseTypeDefaultArgs<ExtArgs>
    originalCourt?: boolean | Case$originalCourtArgs<ExtArgs>
  }

  export type $CasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Case"
    objects: {
      caseType: Prisma.$CaseTypePayload<ExtArgs>
      originalCourt: Prisma.$CourtPayload<ExtArgs> | null
      activities: Prisma.$CaseActivityPayload<ExtArgs>[]
      judgeAssignments: Prisma.$CaseJudgeAssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      caseNumber: string
      courtName: string
      caseTypeId: string
      filedDate: Date
      originalCourtId: string | null
      originalCaseNumber: string | null
      originalYear: number | null
      parties: Prisma.JsonValue
      status: string
      lastActivityDate: Date | null
      totalActivities: number
      hasLegalRepresentation: boolean
      createdAt: Date
      updatedAt: Date
      caseidType: string | null
      caseidNo: string | null
      maleApplicant: number
      femaleApplicant: number
      organizationApplicant: number
      maleDefendant: number
      femaleDefendant: number
      organizationDefendant: number
    }, ExtArgs["result"]["case"]>
    composites: {}
  }

  type CaseGetPayload<S extends boolean | null | undefined | CaseDefaultArgs> = $Result.GetResult<Prisma.$CasePayload, S>

  type CaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseCountAggregateInputType | true
    }

  export interface CaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Case'], meta: { name: 'Case' } }
    /**
     * Find zero or one Case that matches the filter.
     * @param {CaseFindUniqueArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseFindUniqueArgs>(args: SelectSubset<T, CaseFindUniqueArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Case that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseFindUniqueOrThrowArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Case that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindFirstArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseFindFirstArgs>(args?: SelectSubset<T, CaseFindFirstArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Case that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindFirstOrThrowArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cases
     * const cases = await prisma.case.findMany()
     * 
     * // Get first 10 Cases
     * const cases = await prisma.case.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseWithIdOnly = await prisma.case.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseFindManyArgs>(args?: SelectSubset<T, CaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Case.
     * @param {CaseCreateArgs} args - Arguments to create a Case.
     * @example
     * // Create one Case
     * const Case = await prisma.case.create({
     *   data: {
     *     // ... data to create a Case
     *   }
     * })
     * 
     */
    create<T extends CaseCreateArgs>(args: SelectSubset<T, CaseCreateArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cases.
     * @param {CaseCreateManyArgs} args - Arguments to create many Cases.
     * @example
     * // Create many Cases
     * const case = await prisma.case.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseCreateManyArgs>(args?: SelectSubset<T, CaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cases and returns the data saved in the database.
     * @param {CaseCreateManyAndReturnArgs} args - Arguments to create many Cases.
     * @example
     * // Create many Cases
     * const case = await prisma.case.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cases and only return the `id`
     * const caseWithIdOnly = await prisma.case.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Case.
     * @param {CaseDeleteArgs} args - Arguments to delete one Case.
     * @example
     * // Delete one Case
     * const Case = await prisma.case.delete({
     *   where: {
     *     // ... filter to delete one Case
     *   }
     * })
     * 
     */
    delete<T extends CaseDeleteArgs>(args: SelectSubset<T, CaseDeleteArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Case.
     * @param {CaseUpdateArgs} args - Arguments to update one Case.
     * @example
     * // Update one Case
     * const case = await prisma.case.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseUpdateArgs>(args: SelectSubset<T, CaseUpdateArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cases.
     * @param {CaseDeleteManyArgs} args - Arguments to filter Cases to delete.
     * @example
     * // Delete a few Cases
     * const { count } = await prisma.case.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseDeleteManyArgs>(args?: SelectSubset<T, CaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cases
     * const case = await prisma.case.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseUpdateManyArgs>(args: SelectSubset<T, CaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cases and returns the data updated in the database.
     * @param {CaseUpdateManyAndReturnArgs} args - Arguments to update many Cases.
     * @example
     * // Update many Cases
     * const case = await prisma.case.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cases and only return the `id`
     * const caseWithIdOnly = await prisma.case.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CaseUpdateManyAndReturnArgs>(args: SelectSubset<T, CaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Case.
     * @param {CaseUpsertArgs} args - Arguments to update or create a Case.
     * @example
     * // Update or create a Case
     * const case = await prisma.case.upsert({
     *   create: {
     *     // ... data to create a Case
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Case we want to update
     *   }
     * })
     */
    upsert<T extends CaseUpsertArgs>(args: SelectSubset<T, CaseUpsertArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseCountArgs} args - Arguments to filter Cases to count.
     * @example
     * // Count the number of Cases
     * const count = await prisma.case.count({
     *   where: {
     *     // ... the filter for the Cases we want to count
     *   }
     * })
    **/
    count<T extends CaseCountArgs>(
      args?: Subset<T, CaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Case.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseAggregateArgs>(args: Subset<T, CaseAggregateArgs>): Prisma.PrismaPromise<GetCaseAggregateType<T>>

    /**
     * Group by Case.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseGroupByArgs['orderBy'] }
        : { orderBy?: CaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Case model
   */
  readonly fields: CaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Case.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    caseType<T extends CaseTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CaseTypeDefaultArgs<ExtArgs>>): Prisma__CaseTypeClient<$Result.GetResult<Prisma.$CaseTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    originalCourt<T extends Case$originalCourtArgs<ExtArgs> = {}>(args?: Subset<T, Case$originalCourtArgs<ExtArgs>>): Prisma__CourtClient<$Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    activities<T extends Case$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, Case$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    judgeAssignments<T extends Case$judgeAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Case$judgeAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Case model
   */
  interface CaseFieldRefs {
    readonly id: FieldRef<"Case", 'String'>
    readonly caseNumber: FieldRef<"Case", 'String'>
    readonly courtName: FieldRef<"Case", 'String'>
    readonly caseTypeId: FieldRef<"Case", 'String'>
    readonly filedDate: FieldRef<"Case", 'DateTime'>
    readonly originalCourtId: FieldRef<"Case", 'String'>
    readonly originalCaseNumber: FieldRef<"Case", 'String'>
    readonly originalYear: FieldRef<"Case", 'Int'>
    readonly parties: FieldRef<"Case", 'Json'>
    readonly status: FieldRef<"Case", 'String'>
    readonly lastActivityDate: FieldRef<"Case", 'DateTime'>
    readonly totalActivities: FieldRef<"Case", 'Int'>
    readonly hasLegalRepresentation: FieldRef<"Case", 'Boolean'>
    readonly createdAt: FieldRef<"Case", 'DateTime'>
    readonly updatedAt: FieldRef<"Case", 'DateTime'>
    readonly caseidType: FieldRef<"Case", 'String'>
    readonly caseidNo: FieldRef<"Case", 'String'>
    readonly maleApplicant: FieldRef<"Case", 'Int'>
    readonly femaleApplicant: FieldRef<"Case", 'Int'>
    readonly organizationApplicant: FieldRef<"Case", 'Int'>
    readonly maleDefendant: FieldRef<"Case", 'Int'>
    readonly femaleDefendant: FieldRef<"Case", 'Int'>
    readonly organizationDefendant: FieldRef<"Case", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Case findUnique
   */
  export type CaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case findUniqueOrThrow
   */
  export type CaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case findFirst
   */
  export type CaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cases.
     */
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case findFirstOrThrow
   */
  export type CaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cases.
     */
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case findMany
   */
  export type CaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Cases to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case create
   */
  export type CaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Case.
     */
    data: XOR<CaseCreateInput, CaseUncheckedCreateInput>
  }

  /**
   * Case createMany
   */
  export type CaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cases.
     */
    data: CaseCreateManyInput | CaseCreateManyInput[]
  }

  /**
   * Case createManyAndReturn
   */
  export type CaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * The data used to create many Cases.
     */
    data: CaseCreateManyInput | CaseCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Case update
   */
  export type CaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Case.
     */
    data: XOR<CaseUpdateInput, CaseUncheckedUpdateInput>
    /**
     * Choose, which Case to update.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case updateMany
   */
  export type CaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cases.
     */
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyInput>
    /**
     * Filter which Cases to update
     */
    where?: CaseWhereInput
    /**
     * Limit how many Cases to update.
     */
    limit?: number
  }

  /**
   * Case updateManyAndReturn
   */
  export type CaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * The data used to update Cases.
     */
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyInput>
    /**
     * Filter which Cases to update
     */
    where?: CaseWhereInput
    /**
     * Limit how many Cases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Case upsert
   */
  export type CaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Case to update in case it exists.
     */
    where: CaseWhereUniqueInput
    /**
     * In case the Case found by the `where` argument doesn't exist, create a new Case with this data.
     */
    create: XOR<CaseCreateInput, CaseUncheckedCreateInput>
    /**
     * In case the Case was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseUpdateInput, CaseUncheckedUpdateInput>
  }

  /**
   * Case delete
   */
  export type CaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter which Case to delete.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case deleteMany
   */
  export type CaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cases to delete
     */
    where?: CaseWhereInput
    /**
     * Limit how many Cases to delete.
     */
    limit?: number
  }

  /**
   * Case.originalCourt
   */
  export type Case$originalCourtArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Court
     */
    select?: CourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Court
     */
    omit?: CourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourtInclude<ExtArgs> | null
    where?: CourtWhereInput
  }

  /**
   * Case.activities
   */
  export type Case$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    where?: CaseActivityWhereInput
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    cursor?: CaseActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * Case.judgeAssignments
   */
  export type Case$judgeAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    where?: CaseJudgeAssignmentWhereInput
    orderBy?: CaseJudgeAssignmentOrderByWithRelationInput | CaseJudgeAssignmentOrderByWithRelationInput[]
    cursor?: CaseJudgeAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseJudgeAssignmentScalarFieldEnum | CaseJudgeAssignmentScalarFieldEnum[]
  }

  /**
   * Case without action
   */
  export type CaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
  }


  /**
   * Model CaseActivity
   */

  export type AggregateCaseActivity = {
    _count: CaseActivityCountAggregateOutputType | null
    _avg: CaseActivityAvgAggregateOutputType | null
    _sum: CaseActivitySumAggregateOutputType | null
    _min: CaseActivityMinAggregateOutputType | null
    _max: CaseActivityMaxAggregateOutputType | null
  }

  export type CaseActivityAvgAggregateOutputType = {
    applicantWitnesses: number | null
    defendantWitnesses: number | null
    custodyNumeric: number | null
  }

  export type CaseActivitySumAggregateOutputType = {
    applicantWitnesses: number | null
    defendantWitnesses: number | null
    custodyNumeric: number | null
  }

  export type CaseActivityMinAggregateOutputType = {
    id: string | null
    caseId: string | null
    activityDate: Date | null
    activityType: string | null
    outcome: string | null
    reasonForAdjournment: string | null
    nextHearingDate: Date | null
    primaryJudgeId: string | null
    hasLegalRepresentation: boolean | null
    applicantWitnesses: number | null
    defendantWitnesses: number | null
    custodyStatus: string | null
    details: string | null
    importBatchId: string | null
    createdAt: Date | null
    judge1: string | null
    judge2: string | null
    judge3: string | null
    judge4: string | null
    judge5: string | null
    judge6: string | null
    judge7: string | null
    comingFor: string | null
    legalRepString: string | null
    custodyNumeric: number | null
    otherDetails: string | null
  }

  export type CaseActivityMaxAggregateOutputType = {
    id: string | null
    caseId: string | null
    activityDate: Date | null
    activityType: string | null
    outcome: string | null
    reasonForAdjournment: string | null
    nextHearingDate: Date | null
    primaryJudgeId: string | null
    hasLegalRepresentation: boolean | null
    applicantWitnesses: number | null
    defendantWitnesses: number | null
    custodyStatus: string | null
    details: string | null
    importBatchId: string | null
    createdAt: Date | null
    judge1: string | null
    judge2: string | null
    judge3: string | null
    judge4: string | null
    judge5: string | null
    judge6: string | null
    judge7: string | null
    comingFor: string | null
    legalRepString: string | null
    custodyNumeric: number | null
    otherDetails: string | null
  }

  export type CaseActivityCountAggregateOutputType = {
    id: number
    caseId: number
    activityDate: number
    activityType: number
    outcome: number
    reasonForAdjournment: number
    nextHearingDate: number
    primaryJudgeId: number
    hasLegalRepresentation: number
    applicantWitnesses: number
    defendantWitnesses: number
    custodyStatus: number
    details: number
    importBatchId: number
    createdAt: number
    judge1: number
    judge2: number
    judge3: number
    judge4: number
    judge5: number
    judge6: number
    judge7: number
    comingFor: number
    legalRepString: number
    custodyNumeric: number
    otherDetails: number
    _all: number
  }


  export type CaseActivityAvgAggregateInputType = {
    applicantWitnesses?: true
    defendantWitnesses?: true
    custodyNumeric?: true
  }

  export type CaseActivitySumAggregateInputType = {
    applicantWitnesses?: true
    defendantWitnesses?: true
    custodyNumeric?: true
  }

  export type CaseActivityMinAggregateInputType = {
    id?: true
    caseId?: true
    activityDate?: true
    activityType?: true
    outcome?: true
    reasonForAdjournment?: true
    nextHearingDate?: true
    primaryJudgeId?: true
    hasLegalRepresentation?: true
    applicantWitnesses?: true
    defendantWitnesses?: true
    custodyStatus?: true
    details?: true
    importBatchId?: true
    createdAt?: true
    judge1?: true
    judge2?: true
    judge3?: true
    judge4?: true
    judge5?: true
    judge6?: true
    judge7?: true
    comingFor?: true
    legalRepString?: true
    custodyNumeric?: true
    otherDetails?: true
  }

  export type CaseActivityMaxAggregateInputType = {
    id?: true
    caseId?: true
    activityDate?: true
    activityType?: true
    outcome?: true
    reasonForAdjournment?: true
    nextHearingDate?: true
    primaryJudgeId?: true
    hasLegalRepresentation?: true
    applicantWitnesses?: true
    defendantWitnesses?: true
    custodyStatus?: true
    details?: true
    importBatchId?: true
    createdAt?: true
    judge1?: true
    judge2?: true
    judge3?: true
    judge4?: true
    judge5?: true
    judge6?: true
    judge7?: true
    comingFor?: true
    legalRepString?: true
    custodyNumeric?: true
    otherDetails?: true
  }

  export type CaseActivityCountAggregateInputType = {
    id?: true
    caseId?: true
    activityDate?: true
    activityType?: true
    outcome?: true
    reasonForAdjournment?: true
    nextHearingDate?: true
    primaryJudgeId?: true
    hasLegalRepresentation?: true
    applicantWitnesses?: true
    defendantWitnesses?: true
    custodyStatus?: true
    details?: true
    importBatchId?: true
    createdAt?: true
    judge1?: true
    judge2?: true
    judge3?: true
    judge4?: true
    judge5?: true
    judge6?: true
    judge7?: true
    comingFor?: true
    legalRepString?: true
    custodyNumeric?: true
    otherDetails?: true
    _all?: true
  }

  export type CaseActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseActivity to aggregate.
     */
    where?: CaseActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseActivities to fetch.
     */
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CaseActivities
    **/
    _count?: true | CaseActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CaseActivityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CaseActivitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseActivityMaxAggregateInputType
  }

  export type GetCaseActivityAggregateType<T extends CaseActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateCaseActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCaseActivity[P]>
      : GetScalarType<T[P], AggregateCaseActivity[P]>
  }




  export type CaseActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseActivityWhereInput
    orderBy?: CaseActivityOrderByWithAggregationInput | CaseActivityOrderByWithAggregationInput[]
    by: CaseActivityScalarFieldEnum[] | CaseActivityScalarFieldEnum
    having?: CaseActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseActivityCountAggregateInputType | true
    _avg?: CaseActivityAvgAggregateInputType
    _sum?: CaseActivitySumAggregateInputType
    _min?: CaseActivityMinAggregateInputType
    _max?: CaseActivityMaxAggregateInputType
  }

  export type CaseActivityGroupByOutputType = {
    id: string
    caseId: string
    activityDate: Date
    activityType: string
    outcome: string
    reasonForAdjournment: string | null
    nextHearingDate: Date | null
    primaryJudgeId: string
    hasLegalRepresentation: boolean
    applicantWitnesses: number
    defendantWitnesses: number
    custodyStatus: string
    details: string | null
    importBatchId: string
    createdAt: Date
    judge1: string | null
    judge2: string | null
    judge3: string | null
    judge4: string | null
    judge5: string | null
    judge6: string | null
    judge7: string | null
    comingFor: string | null
    legalRepString: string | null
    custodyNumeric: number | null
    otherDetails: string | null
    _count: CaseActivityCountAggregateOutputType | null
    _avg: CaseActivityAvgAggregateOutputType | null
    _sum: CaseActivitySumAggregateOutputType | null
    _min: CaseActivityMinAggregateOutputType | null
    _max: CaseActivityMaxAggregateOutputType | null
  }

  type GetCaseActivityGroupByPayload<T extends CaseActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseActivityGroupByOutputType[P]>
            : GetScalarType<T[P], CaseActivityGroupByOutputType[P]>
        }
      >
    >


  export type CaseActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    activityDate?: boolean
    activityType?: boolean
    outcome?: boolean
    reasonForAdjournment?: boolean
    nextHearingDate?: boolean
    primaryJudgeId?: boolean
    hasLegalRepresentation?: boolean
    applicantWitnesses?: boolean
    defendantWitnesses?: boolean
    custodyStatus?: boolean
    details?: boolean
    importBatchId?: boolean
    createdAt?: boolean
    judge1?: boolean
    judge2?: boolean
    judge3?: boolean
    judge4?: boolean
    judge5?: boolean
    judge6?: boolean
    judge7?: boolean
    comingFor?: boolean
    legalRepString?: boolean
    custodyNumeric?: boolean
    otherDetails?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    primaryJudge?: boolean | JudgeDefaultArgs<ExtArgs>
    importBatch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseActivity"]>

  export type CaseActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    activityDate?: boolean
    activityType?: boolean
    outcome?: boolean
    reasonForAdjournment?: boolean
    nextHearingDate?: boolean
    primaryJudgeId?: boolean
    hasLegalRepresentation?: boolean
    applicantWitnesses?: boolean
    defendantWitnesses?: boolean
    custodyStatus?: boolean
    details?: boolean
    importBatchId?: boolean
    createdAt?: boolean
    judge1?: boolean
    judge2?: boolean
    judge3?: boolean
    judge4?: boolean
    judge5?: boolean
    judge6?: boolean
    judge7?: boolean
    comingFor?: boolean
    legalRepString?: boolean
    custodyNumeric?: boolean
    otherDetails?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    primaryJudge?: boolean | JudgeDefaultArgs<ExtArgs>
    importBatch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseActivity"]>

  export type CaseActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    activityDate?: boolean
    activityType?: boolean
    outcome?: boolean
    reasonForAdjournment?: boolean
    nextHearingDate?: boolean
    primaryJudgeId?: boolean
    hasLegalRepresentation?: boolean
    applicantWitnesses?: boolean
    defendantWitnesses?: boolean
    custodyStatus?: boolean
    details?: boolean
    importBatchId?: boolean
    createdAt?: boolean
    judge1?: boolean
    judge2?: boolean
    judge3?: boolean
    judge4?: boolean
    judge5?: boolean
    judge6?: boolean
    judge7?: boolean
    comingFor?: boolean
    legalRepString?: boolean
    custodyNumeric?: boolean
    otherDetails?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    primaryJudge?: boolean | JudgeDefaultArgs<ExtArgs>
    importBatch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseActivity"]>

  export type CaseActivitySelectScalar = {
    id?: boolean
    caseId?: boolean
    activityDate?: boolean
    activityType?: boolean
    outcome?: boolean
    reasonForAdjournment?: boolean
    nextHearingDate?: boolean
    primaryJudgeId?: boolean
    hasLegalRepresentation?: boolean
    applicantWitnesses?: boolean
    defendantWitnesses?: boolean
    custodyStatus?: boolean
    details?: boolean
    importBatchId?: boolean
    createdAt?: boolean
    judge1?: boolean
    judge2?: boolean
    judge3?: boolean
    judge4?: boolean
    judge5?: boolean
    judge6?: boolean
    judge7?: boolean
    comingFor?: boolean
    legalRepString?: boolean
    custodyNumeric?: boolean
    otherDetails?: boolean
  }

  export type CaseActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseId" | "activityDate" | "activityType" | "outcome" | "reasonForAdjournment" | "nextHearingDate" | "primaryJudgeId" | "hasLegalRepresentation" | "applicantWitnesses" | "defendantWitnesses" | "custodyStatus" | "details" | "importBatchId" | "createdAt" | "judge1" | "judge2" | "judge3" | "judge4" | "judge5" | "judge6" | "judge7" | "comingFor" | "legalRepString" | "custodyNumeric" | "otherDetails", ExtArgs["result"]["caseActivity"]>
  export type CaseActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    primaryJudge?: boolean | JudgeDefaultArgs<ExtArgs>
    importBatch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }
  export type CaseActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    primaryJudge?: boolean | JudgeDefaultArgs<ExtArgs>
    importBatch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }
  export type CaseActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    primaryJudge?: boolean | JudgeDefaultArgs<ExtArgs>
    importBatch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }

  export type $CaseActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CaseActivity"
    objects: {
      case: Prisma.$CasePayload<ExtArgs>
      primaryJudge: Prisma.$JudgePayload<ExtArgs>
      importBatch: Prisma.$DailyImportBatchPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      caseId: string
      activityDate: Date
      activityType: string
      outcome: string
      reasonForAdjournment: string | null
      nextHearingDate: Date | null
      primaryJudgeId: string
      hasLegalRepresentation: boolean
      applicantWitnesses: number
      defendantWitnesses: number
      custodyStatus: string
      details: string | null
      importBatchId: string
      createdAt: Date
      judge1: string | null
      judge2: string | null
      judge3: string | null
      judge4: string | null
      judge5: string | null
      judge6: string | null
      judge7: string | null
      comingFor: string | null
      legalRepString: string | null
      custodyNumeric: number | null
      otherDetails: string | null
    }, ExtArgs["result"]["caseActivity"]>
    composites: {}
  }

  type CaseActivityGetPayload<S extends boolean | null | undefined | CaseActivityDefaultArgs> = $Result.GetResult<Prisma.$CaseActivityPayload, S>

  type CaseActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseActivityCountAggregateInputType | true
    }

  export interface CaseActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CaseActivity'], meta: { name: 'CaseActivity' } }
    /**
     * Find zero or one CaseActivity that matches the filter.
     * @param {CaseActivityFindUniqueArgs} args - Arguments to find a CaseActivity
     * @example
     * // Get one CaseActivity
     * const caseActivity = await prisma.caseActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseActivityFindUniqueArgs>(args: SelectSubset<T, CaseActivityFindUniqueArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CaseActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseActivityFindUniqueOrThrowArgs} args - Arguments to find a CaseActivity
     * @example
     * // Get one CaseActivity
     * const caseActivity = await prisma.caseActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityFindFirstArgs} args - Arguments to find a CaseActivity
     * @example
     * // Get one CaseActivity
     * const caseActivity = await prisma.caseActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseActivityFindFirstArgs>(args?: SelectSubset<T, CaseActivityFindFirstArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityFindFirstOrThrowArgs} args - Arguments to find a CaseActivity
     * @example
     * // Get one CaseActivity
     * const caseActivity = await prisma.caseActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CaseActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CaseActivities
     * const caseActivities = await prisma.caseActivity.findMany()
     * 
     * // Get first 10 CaseActivities
     * const caseActivities = await prisma.caseActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseActivityWithIdOnly = await prisma.caseActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseActivityFindManyArgs>(args?: SelectSubset<T, CaseActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CaseActivity.
     * @param {CaseActivityCreateArgs} args - Arguments to create a CaseActivity.
     * @example
     * // Create one CaseActivity
     * const CaseActivity = await prisma.caseActivity.create({
     *   data: {
     *     // ... data to create a CaseActivity
     *   }
     * })
     * 
     */
    create<T extends CaseActivityCreateArgs>(args: SelectSubset<T, CaseActivityCreateArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CaseActivities.
     * @param {CaseActivityCreateManyArgs} args - Arguments to create many CaseActivities.
     * @example
     * // Create many CaseActivities
     * const caseActivity = await prisma.caseActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseActivityCreateManyArgs>(args?: SelectSubset<T, CaseActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CaseActivities and returns the data saved in the database.
     * @param {CaseActivityCreateManyAndReturnArgs} args - Arguments to create many CaseActivities.
     * @example
     * // Create many CaseActivities
     * const caseActivity = await prisma.caseActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CaseActivities and only return the `id`
     * const caseActivityWithIdOnly = await prisma.caseActivity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CaseActivity.
     * @param {CaseActivityDeleteArgs} args - Arguments to delete one CaseActivity.
     * @example
     * // Delete one CaseActivity
     * const CaseActivity = await prisma.caseActivity.delete({
     *   where: {
     *     // ... filter to delete one CaseActivity
     *   }
     * })
     * 
     */
    delete<T extends CaseActivityDeleteArgs>(args: SelectSubset<T, CaseActivityDeleteArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CaseActivity.
     * @param {CaseActivityUpdateArgs} args - Arguments to update one CaseActivity.
     * @example
     * // Update one CaseActivity
     * const caseActivity = await prisma.caseActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseActivityUpdateArgs>(args: SelectSubset<T, CaseActivityUpdateArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CaseActivities.
     * @param {CaseActivityDeleteManyArgs} args - Arguments to filter CaseActivities to delete.
     * @example
     * // Delete a few CaseActivities
     * const { count } = await prisma.caseActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseActivityDeleteManyArgs>(args?: SelectSubset<T, CaseActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CaseActivities
     * const caseActivity = await prisma.caseActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseActivityUpdateManyArgs>(args: SelectSubset<T, CaseActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseActivities and returns the data updated in the database.
     * @param {CaseActivityUpdateManyAndReturnArgs} args - Arguments to update many CaseActivities.
     * @example
     * // Update many CaseActivities
     * const caseActivity = await prisma.caseActivity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CaseActivities and only return the `id`
     * const caseActivityWithIdOnly = await prisma.caseActivity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CaseActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, CaseActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CaseActivity.
     * @param {CaseActivityUpsertArgs} args - Arguments to update or create a CaseActivity.
     * @example
     * // Update or create a CaseActivity
     * const caseActivity = await prisma.caseActivity.upsert({
     *   create: {
     *     // ... data to create a CaseActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CaseActivity we want to update
     *   }
     * })
     */
    upsert<T extends CaseActivityUpsertArgs>(args: SelectSubset<T, CaseActivityUpsertArgs<ExtArgs>>): Prisma__CaseActivityClient<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CaseActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityCountArgs} args - Arguments to filter CaseActivities to count.
     * @example
     * // Count the number of CaseActivities
     * const count = await prisma.caseActivity.count({
     *   where: {
     *     // ... the filter for the CaseActivities we want to count
     *   }
     * })
    **/
    count<T extends CaseActivityCountArgs>(
      args?: Subset<T, CaseActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CaseActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseActivityAggregateArgs>(args: Subset<T, CaseActivityAggregateArgs>): Prisma.PrismaPromise<GetCaseActivityAggregateType<T>>

    /**
     * Group by CaseActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseActivityGroupByArgs['orderBy'] }
        : { orderBy?: CaseActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CaseActivity model
   */
  readonly fields: CaseActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CaseActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends CaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CaseDefaultArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    primaryJudge<T extends JudgeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JudgeDefaultArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    importBatch<T extends DailyImportBatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DailyImportBatchDefaultArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CaseActivity model
   */
  interface CaseActivityFieldRefs {
    readonly id: FieldRef<"CaseActivity", 'String'>
    readonly caseId: FieldRef<"CaseActivity", 'String'>
    readonly activityDate: FieldRef<"CaseActivity", 'DateTime'>
    readonly activityType: FieldRef<"CaseActivity", 'String'>
    readonly outcome: FieldRef<"CaseActivity", 'String'>
    readonly reasonForAdjournment: FieldRef<"CaseActivity", 'String'>
    readonly nextHearingDate: FieldRef<"CaseActivity", 'DateTime'>
    readonly primaryJudgeId: FieldRef<"CaseActivity", 'String'>
    readonly hasLegalRepresentation: FieldRef<"CaseActivity", 'Boolean'>
    readonly applicantWitnesses: FieldRef<"CaseActivity", 'Int'>
    readonly defendantWitnesses: FieldRef<"CaseActivity", 'Int'>
    readonly custodyStatus: FieldRef<"CaseActivity", 'String'>
    readonly details: FieldRef<"CaseActivity", 'String'>
    readonly importBatchId: FieldRef<"CaseActivity", 'String'>
    readonly createdAt: FieldRef<"CaseActivity", 'DateTime'>
    readonly judge1: FieldRef<"CaseActivity", 'String'>
    readonly judge2: FieldRef<"CaseActivity", 'String'>
    readonly judge3: FieldRef<"CaseActivity", 'String'>
    readonly judge4: FieldRef<"CaseActivity", 'String'>
    readonly judge5: FieldRef<"CaseActivity", 'String'>
    readonly judge6: FieldRef<"CaseActivity", 'String'>
    readonly judge7: FieldRef<"CaseActivity", 'String'>
    readonly comingFor: FieldRef<"CaseActivity", 'String'>
    readonly legalRepString: FieldRef<"CaseActivity", 'String'>
    readonly custodyNumeric: FieldRef<"CaseActivity", 'Int'>
    readonly otherDetails: FieldRef<"CaseActivity", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CaseActivity findUnique
   */
  export type CaseActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivity to fetch.
     */
    where: CaseActivityWhereUniqueInput
  }

  /**
   * CaseActivity findUniqueOrThrow
   */
  export type CaseActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivity to fetch.
     */
    where: CaseActivityWhereUniqueInput
  }

  /**
   * CaseActivity findFirst
   */
  export type CaseActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivity to fetch.
     */
    where?: CaseActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseActivities to fetch.
     */
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseActivities.
     */
    cursor?: CaseActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseActivities.
     */
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * CaseActivity findFirstOrThrow
   */
  export type CaseActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivity to fetch.
     */
    where?: CaseActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseActivities to fetch.
     */
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseActivities.
     */
    cursor?: CaseActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseActivities.
     */
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * CaseActivity findMany
   */
  export type CaseActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter, which CaseActivities to fetch.
     */
    where?: CaseActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseActivities to fetch.
     */
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CaseActivities.
     */
    cursor?: CaseActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseActivities.
     */
    skip?: number
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * CaseActivity create
   */
  export type CaseActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a CaseActivity.
     */
    data: XOR<CaseActivityCreateInput, CaseActivityUncheckedCreateInput>
  }

  /**
   * CaseActivity createMany
   */
  export type CaseActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CaseActivities.
     */
    data: CaseActivityCreateManyInput | CaseActivityCreateManyInput[]
  }

  /**
   * CaseActivity createManyAndReturn
   */
  export type CaseActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * The data used to create many CaseActivities.
     */
    data: CaseActivityCreateManyInput | CaseActivityCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseActivity update
   */
  export type CaseActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a CaseActivity.
     */
    data: XOR<CaseActivityUpdateInput, CaseActivityUncheckedUpdateInput>
    /**
     * Choose, which CaseActivity to update.
     */
    where: CaseActivityWhereUniqueInput
  }

  /**
   * CaseActivity updateMany
   */
  export type CaseActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CaseActivities.
     */
    data: XOR<CaseActivityUpdateManyMutationInput, CaseActivityUncheckedUpdateManyInput>
    /**
     * Filter which CaseActivities to update
     */
    where?: CaseActivityWhereInput
    /**
     * Limit how many CaseActivities to update.
     */
    limit?: number
  }

  /**
   * CaseActivity updateManyAndReturn
   */
  export type CaseActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * The data used to update CaseActivities.
     */
    data: XOR<CaseActivityUpdateManyMutationInput, CaseActivityUncheckedUpdateManyInput>
    /**
     * Filter which CaseActivities to update
     */
    where?: CaseActivityWhereInput
    /**
     * Limit how many CaseActivities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseActivity upsert
   */
  export type CaseActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the CaseActivity to update in case it exists.
     */
    where: CaseActivityWhereUniqueInput
    /**
     * In case the CaseActivity found by the `where` argument doesn't exist, create a new CaseActivity with this data.
     */
    create: XOR<CaseActivityCreateInput, CaseActivityUncheckedCreateInput>
    /**
     * In case the CaseActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseActivityUpdateInput, CaseActivityUncheckedUpdateInput>
  }

  /**
   * CaseActivity delete
   */
  export type CaseActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    /**
     * Filter which CaseActivity to delete.
     */
    where: CaseActivityWhereUniqueInput
  }

  /**
   * CaseActivity deleteMany
   */
  export type CaseActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseActivities to delete
     */
    where?: CaseActivityWhereInput
    /**
     * Limit how many CaseActivities to delete.
     */
    limit?: number
  }

  /**
   * CaseActivity without action
   */
  export type CaseActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
  }


  /**
   * Model CaseJudgeAssignment
   */

  export type AggregateCaseJudgeAssignment = {
    _count: CaseJudgeAssignmentCountAggregateOutputType | null
    _min: CaseJudgeAssignmentMinAggregateOutputType | null
    _max: CaseJudgeAssignmentMaxAggregateOutputType | null
  }

  export type CaseJudgeAssignmentMinAggregateOutputType = {
    caseId: string | null
    judgeId: string | null
    assignedAt: Date | null
    isPrimary: boolean | null
  }

  export type CaseJudgeAssignmentMaxAggregateOutputType = {
    caseId: string | null
    judgeId: string | null
    assignedAt: Date | null
    isPrimary: boolean | null
  }

  export type CaseJudgeAssignmentCountAggregateOutputType = {
    caseId: number
    judgeId: number
    assignedAt: number
    isPrimary: number
    _all: number
  }


  export type CaseJudgeAssignmentMinAggregateInputType = {
    caseId?: true
    judgeId?: true
    assignedAt?: true
    isPrimary?: true
  }

  export type CaseJudgeAssignmentMaxAggregateInputType = {
    caseId?: true
    judgeId?: true
    assignedAt?: true
    isPrimary?: true
  }

  export type CaseJudgeAssignmentCountAggregateInputType = {
    caseId?: true
    judgeId?: true
    assignedAt?: true
    isPrimary?: true
    _all?: true
  }

  export type CaseJudgeAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseJudgeAssignment to aggregate.
     */
    where?: CaseJudgeAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseJudgeAssignments to fetch.
     */
    orderBy?: CaseJudgeAssignmentOrderByWithRelationInput | CaseJudgeAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseJudgeAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseJudgeAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseJudgeAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CaseJudgeAssignments
    **/
    _count?: true | CaseJudgeAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseJudgeAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseJudgeAssignmentMaxAggregateInputType
  }

  export type GetCaseJudgeAssignmentAggregateType<T extends CaseJudgeAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateCaseJudgeAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCaseJudgeAssignment[P]>
      : GetScalarType<T[P], AggregateCaseJudgeAssignment[P]>
  }




  export type CaseJudgeAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseJudgeAssignmentWhereInput
    orderBy?: CaseJudgeAssignmentOrderByWithAggregationInput | CaseJudgeAssignmentOrderByWithAggregationInput[]
    by: CaseJudgeAssignmentScalarFieldEnum[] | CaseJudgeAssignmentScalarFieldEnum
    having?: CaseJudgeAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseJudgeAssignmentCountAggregateInputType | true
    _min?: CaseJudgeAssignmentMinAggregateInputType
    _max?: CaseJudgeAssignmentMaxAggregateInputType
  }

  export type CaseJudgeAssignmentGroupByOutputType = {
    caseId: string
    judgeId: string
    assignedAt: Date
    isPrimary: boolean
    _count: CaseJudgeAssignmentCountAggregateOutputType | null
    _min: CaseJudgeAssignmentMinAggregateOutputType | null
    _max: CaseJudgeAssignmentMaxAggregateOutputType | null
  }

  type GetCaseJudgeAssignmentGroupByPayload<T extends CaseJudgeAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseJudgeAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseJudgeAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseJudgeAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], CaseJudgeAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type CaseJudgeAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    caseId?: boolean
    judgeId?: boolean
    assignedAt?: boolean
    isPrimary?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    judge?: boolean | JudgeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseJudgeAssignment"]>

  export type CaseJudgeAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    caseId?: boolean
    judgeId?: boolean
    assignedAt?: boolean
    isPrimary?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    judge?: boolean | JudgeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseJudgeAssignment"]>

  export type CaseJudgeAssignmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    caseId?: boolean
    judgeId?: boolean
    assignedAt?: boolean
    isPrimary?: boolean
    case?: boolean | CaseDefaultArgs<ExtArgs>
    judge?: boolean | JudgeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseJudgeAssignment"]>

  export type CaseJudgeAssignmentSelectScalar = {
    caseId?: boolean
    judgeId?: boolean
    assignedAt?: boolean
    isPrimary?: boolean
  }

  export type CaseJudgeAssignmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"caseId" | "judgeId" | "assignedAt" | "isPrimary", ExtArgs["result"]["caseJudgeAssignment"]>
  export type CaseJudgeAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    judge?: boolean | JudgeDefaultArgs<ExtArgs>
  }
  export type CaseJudgeAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    judge?: boolean | JudgeDefaultArgs<ExtArgs>
  }
  export type CaseJudgeAssignmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | CaseDefaultArgs<ExtArgs>
    judge?: boolean | JudgeDefaultArgs<ExtArgs>
  }

  export type $CaseJudgeAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CaseJudgeAssignment"
    objects: {
      case: Prisma.$CasePayload<ExtArgs>
      judge: Prisma.$JudgePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      caseId: string
      judgeId: string
      assignedAt: Date
      isPrimary: boolean
    }, ExtArgs["result"]["caseJudgeAssignment"]>
    composites: {}
  }

  type CaseJudgeAssignmentGetPayload<S extends boolean | null | undefined | CaseJudgeAssignmentDefaultArgs> = $Result.GetResult<Prisma.$CaseJudgeAssignmentPayload, S>

  type CaseJudgeAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseJudgeAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseJudgeAssignmentCountAggregateInputType | true
    }

  export interface CaseJudgeAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CaseJudgeAssignment'], meta: { name: 'CaseJudgeAssignment' } }
    /**
     * Find zero or one CaseJudgeAssignment that matches the filter.
     * @param {CaseJudgeAssignmentFindUniqueArgs} args - Arguments to find a CaseJudgeAssignment
     * @example
     * // Get one CaseJudgeAssignment
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseJudgeAssignmentFindUniqueArgs>(args: SelectSubset<T, CaseJudgeAssignmentFindUniqueArgs<ExtArgs>>): Prisma__CaseJudgeAssignmentClient<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CaseJudgeAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseJudgeAssignmentFindUniqueOrThrowArgs} args - Arguments to find a CaseJudgeAssignment
     * @example
     * // Get one CaseJudgeAssignment
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseJudgeAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseJudgeAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseJudgeAssignmentClient<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseJudgeAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJudgeAssignmentFindFirstArgs} args - Arguments to find a CaseJudgeAssignment
     * @example
     * // Get one CaseJudgeAssignment
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseJudgeAssignmentFindFirstArgs>(args?: SelectSubset<T, CaseJudgeAssignmentFindFirstArgs<ExtArgs>>): Prisma__CaseJudgeAssignmentClient<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseJudgeAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJudgeAssignmentFindFirstOrThrowArgs} args - Arguments to find a CaseJudgeAssignment
     * @example
     * // Get one CaseJudgeAssignment
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseJudgeAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseJudgeAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseJudgeAssignmentClient<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CaseJudgeAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJudgeAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CaseJudgeAssignments
     * const caseJudgeAssignments = await prisma.caseJudgeAssignment.findMany()
     * 
     * // Get first 10 CaseJudgeAssignments
     * const caseJudgeAssignments = await prisma.caseJudgeAssignment.findMany({ take: 10 })
     * 
     * // Only select the `caseId`
     * const caseJudgeAssignmentWithCaseIdOnly = await prisma.caseJudgeAssignment.findMany({ select: { caseId: true } })
     * 
     */
    findMany<T extends CaseJudgeAssignmentFindManyArgs>(args?: SelectSubset<T, CaseJudgeAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CaseJudgeAssignment.
     * @param {CaseJudgeAssignmentCreateArgs} args - Arguments to create a CaseJudgeAssignment.
     * @example
     * // Create one CaseJudgeAssignment
     * const CaseJudgeAssignment = await prisma.caseJudgeAssignment.create({
     *   data: {
     *     // ... data to create a CaseJudgeAssignment
     *   }
     * })
     * 
     */
    create<T extends CaseJudgeAssignmentCreateArgs>(args: SelectSubset<T, CaseJudgeAssignmentCreateArgs<ExtArgs>>): Prisma__CaseJudgeAssignmentClient<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CaseJudgeAssignments.
     * @param {CaseJudgeAssignmentCreateManyArgs} args - Arguments to create many CaseJudgeAssignments.
     * @example
     * // Create many CaseJudgeAssignments
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseJudgeAssignmentCreateManyArgs>(args?: SelectSubset<T, CaseJudgeAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CaseJudgeAssignments and returns the data saved in the database.
     * @param {CaseJudgeAssignmentCreateManyAndReturnArgs} args - Arguments to create many CaseJudgeAssignments.
     * @example
     * // Create many CaseJudgeAssignments
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CaseJudgeAssignments and only return the `caseId`
     * const caseJudgeAssignmentWithCaseIdOnly = await prisma.caseJudgeAssignment.createManyAndReturn({
     *   select: { caseId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseJudgeAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseJudgeAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CaseJudgeAssignment.
     * @param {CaseJudgeAssignmentDeleteArgs} args - Arguments to delete one CaseJudgeAssignment.
     * @example
     * // Delete one CaseJudgeAssignment
     * const CaseJudgeAssignment = await prisma.caseJudgeAssignment.delete({
     *   where: {
     *     // ... filter to delete one CaseJudgeAssignment
     *   }
     * })
     * 
     */
    delete<T extends CaseJudgeAssignmentDeleteArgs>(args: SelectSubset<T, CaseJudgeAssignmentDeleteArgs<ExtArgs>>): Prisma__CaseJudgeAssignmentClient<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CaseJudgeAssignment.
     * @param {CaseJudgeAssignmentUpdateArgs} args - Arguments to update one CaseJudgeAssignment.
     * @example
     * // Update one CaseJudgeAssignment
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseJudgeAssignmentUpdateArgs>(args: SelectSubset<T, CaseJudgeAssignmentUpdateArgs<ExtArgs>>): Prisma__CaseJudgeAssignmentClient<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CaseJudgeAssignments.
     * @param {CaseJudgeAssignmentDeleteManyArgs} args - Arguments to filter CaseJudgeAssignments to delete.
     * @example
     * // Delete a few CaseJudgeAssignments
     * const { count } = await prisma.caseJudgeAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseJudgeAssignmentDeleteManyArgs>(args?: SelectSubset<T, CaseJudgeAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseJudgeAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJudgeAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CaseJudgeAssignments
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseJudgeAssignmentUpdateManyArgs>(args: SelectSubset<T, CaseJudgeAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseJudgeAssignments and returns the data updated in the database.
     * @param {CaseJudgeAssignmentUpdateManyAndReturnArgs} args - Arguments to update many CaseJudgeAssignments.
     * @example
     * // Update many CaseJudgeAssignments
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CaseJudgeAssignments and only return the `caseId`
     * const caseJudgeAssignmentWithCaseIdOnly = await prisma.caseJudgeAssignment.updateManyAndReturn({
     *   select: { caseId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CaseJudgeAssignmentUpdateManyAndReturnArgs>(args: SelectSubset<T, CaseJudgeAssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CaseJudgeAssignment.
     * @param {CaseJudgeAssignmentUpsertArgs} args - Arguments to update or create a CaseJudgeAssignment.
     * @example
     * // Update or create a CaseJudgeAssignment
     * const caseJudgeAssignment = await prisma.caseJudgeAssignment.upsert({
     *   create: {
     *     // ... data to create a CaseJudgeAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CaseJudgeAssignment we want to update
     *   }
     * })
     */
    upsert<T extends CaseJudgeAssignmentUpsertArgs>(args: SelectSubset<T, CaseJudgeAssignmentUpsertArgs<ExtArgs>>): Prisma__CaseJudgeAssignmentClient<$Result.GetResult<Prisma.$CaseJudgeAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CaseJudgeAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJudgeAssignmentCountArgs} args - Arguments to filter CaseJudgeAssignments to count.
     * @example
     * // Count the number of CaseJudgeAssignments
     * const count = await prisma.caseJudgeAssignment.count({
     *   where: {
     *     // ... the filter for the CaseJudgeAssignments we want to count
     *   }
     * })
    **/
    count<T extends CaseJudgeAssignmentCountArgs>(
      args?: Subset<T, CaseJudgeAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseJudgeAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CaseJudgeAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJudgeAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseJudgeAssignmentAggregateArgs>(args: Subset<T, CaseJudgeAssignmentAggregateArgs>): Prisma.PrismaPromise<GetCaseJudgeAssignmentAggregateType<T>>

    /**
     * Group by CaseJudgeAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJudgeAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseJudgeAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseJudgeAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: CaseJudgeAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseJudgeAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseJudgeAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CaseJudgeAssignment model
   */
  readonly fields: CaseJudgeAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CaseJudgeAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseJudgeAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends CaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CaseDefaultArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    judge<T extends JudgeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JudgeDefaultArgs<ExtArgs>>): Prisma__JudgeClient<$Result.GetResult<Prisma.$JudgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CaseJudgeAssignment model
   */
  interface CaseJudgeAssignmentFieldRefs {
    readonly caseId: FieldRef<"CaseJudgeAssignment", 'String'>
    readonly judgeId: FieldRef<"CaseJudgeAssignment", 'String'>
    readonly assignedAt: FieldRef<"CaseJudgeAssignment", 'DateTime'>
    readonly isPrimary: FieldRef<"CaseJudgeAssignment", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * CaseJudgeAssignment findUnique
   */
  export type CaseJudgeAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which CaseJudgeAssignment to fetch.
     */
    where: CaseJudgeAssignmentWhereUniqueInput
  }

  /**
   * CaseJudgeAssignment findUniqueOrThrow
   */
  export type CaseJudgeAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which CaseJudgeAssignment to fetch.
     */
    where: CaseJudgeAssignmentWhereUniqueInput
  }

  /**
   * CaseJudgeAssignment findFirst
   */
  export type CaseJudgeAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which CaseJudgeAssignment to fetch.
     */
    where?: CaseJudgeAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseJudgeAssignments to fetch.
     */
    orderBy?: CaseJudgeAssignmentOrderByWithRelationInput | CaseJudgeAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseJudgeAssignments.
     */
    cursor?: CaseJudgeAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseJudgeAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseJudgeAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseJudgeAssignments.
     */
    distinct?: CaseJudgeAssignmentScalarFieldEnum | CaseJudgeAssignmentScalarFieldEnum[]
  }

  /**
   * CaseJudgeAssignment findFirstOrThrow
   */
  export type CaseJudgeAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which CaseJudgeAssignment to fetch.
     */
    where?: CaseJudgeAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseJudgeAssignments to fetch.
     */
    orderBy?: CaseJudgeAssignmentOrderByWithRelationInput | CaseJudgeAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseJudgeAssignments.
     */
    cursor?: CaseJudgeAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseJudgeAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseJudgeAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseJudgeAssignments.
     */
    distinct?: CaseJudgeAssignmentScalarFieldEnum | CaseJudgeAssignmentScalarFieldEnum[]
  }

  /**
   * CaseJudgeAssignment findMany
   */
  export type CaseJudgeAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which CaseJudgeAssignments to fetch.
     */
    where?: CaseJudgeAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseJudgeAssignments to fetch.
     */
    orderBy?: CaseJudgeAssignmentOrderByWithRelationInput | CaseJudgeAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CaseJudgeAssignments.
     */
    cursor?: CaseJudgeAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseJudgeAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseJudgeAssignments.
     */
    skip?: number
    distinct?: CaseJudgeAssignmentScalarFieldEnum | CaseJudgeAssignmentScalarFieldEnum[]
  }

  /**
   * CaseJudgeAssignment create
   */
  export type CaseJudgeAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a CaseJudgeAssignment.
     */
    data: XOR<CaseJudgeAssignmentCreateInput, CaseJudgeAssignmentUncheckedCreateInput>
  }

  /**
   * CaseJudgeAssignment createMany
   */
  export type CaseJudgeAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CaseJudgeAssignments.
     */
    data: CaseJudgeAssignmentCreateManyInput | CaseJudgeAssignmentCreateManyInput[]
  }

  /**
   * CaseJudgeAssignment createManyAndReturn
   */
  export type CaseJudgeAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * The data used to create many CaseJudgeAssignments.
     */
    data: CaseJudgeAssignmentCreateManyInput | CaseJudgeAssignmentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseJudgeAssignment update
   */
  export type CaseJudgeAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a CaseJudgeAssignment.
     */
    data: XOR<CaseJudgeAssignmentUpdateInput, CaseJudgeAssignmentUncheckedUpdateInput>
    /**
     * Choose, which CaseJudgeAssignment to update.
     */
    where: CaseJudgeAssignmentWhereUniqueInput
  }

  /**
   * CaseJudgeAssignment updateMany
   */
  export type CaseJudgeAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CaseJudgeAssignments.
     */
    data: XOR<CaseJudgeAssignmentUpdateManyMutationInput, CaseJudgeAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which CaseJudgeAssignments to update
     */
    where?: CaseJudgeAssignmentWhereInput
    /**
     * Limit how many CaseJudgeAssignments to update.
     */
    limit?: number
  }

  /**
   * CaseJudgeAssignment updateManyAndReturn
   */
  export type CaseJudgeAssignmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * The data used to update CaseJudgeAssignments.
     */
    data: XOR<CaseJudgeAssignmentUpdateManyMutationInput, CaseJudgeAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which CaseJudgeAssignments to update
     */
    where?: CaseJudgeAssignmentWhereInput
    /**
     * Limit how many CaseJudgeAssignments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseJudgeAssignment upsert
   */
  export type CaseJudgeAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the CaseJudgeAssignment to update in case it exists.
     */
    where: CaseJudgeAssignmentWhereUniqueInput
    /**
     * In case the CaseJudgeAssignment found by the `where` argument doesn't exist, create a new CaseJudgeAssignment with this data.
     */
    create: XOR<CaseJudgeAssignmentCreateInput, CaseJudgeAssignmentUncheckedCreateInput>
    /**
     * In case the CaseJudgeAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseJudgeAssignmentUpdateInput, CaseJudgeAssignmentUncheckedUpdateInput>
  }

  /**
   * CaseJudgeAssignment delete
   */
  export type CaseJudgeAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
    /**
     * Filter which CaseJudgeAssignment to delete.
     */
    where: CaseJudgeAssignmentWhereUniqueInput
  }

  /**
   * CaseJudgeAssignment deleteMany
   */
  export type CaseJudgeAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseJudgeAssignments to delete
     */
    where?: CaseJudgeAssignmentWhereInput
    /**
     * Limit how many CaseJudgeAssignments to delete.
     */
    limit?: number
  }

  /**
   * CaseJudgeAssignment without action
   */
  export type CaseJudgeAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJudgeAssignment
     */
    select?: CaseJudgeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJudgeAssignment
     */
    omit?: CaseJudgeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJudgeAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model DailyImportBatch
   */

  export type AggregateDailyImportBatch = {
    _count: DailyImportBatchCountAggregateOutputType | null
    _avg: DailyImportBatchAvgAggregateOutputType | null
    _sum: DailyImportBatchSumAggregateOutputType | null
    _min: DailyImportBatchMinAggregateOutputType | null
    _max: DailyImportBatchMaxAggregateOutputType | null
  }

  export type DailyImportBatchAvgAggregateOutputType = {
    fileSize: number | null
    totalRecords: number | null
    successfulRecords: number | null
    failedRecords: number | null
  }

  export type DailyImportBatchSumAggregateOutputType = {
    fileSize: number | null
    totalRecords: number | null
    successfulRecords: number | null
    failedRecords: number | null
  }

  export type DailyImportBatchMinAggregateOutputType = {
    id: string | null
    importDate: Date | null
    filename: string | null
    fileSize: number | null
    fileChecksum: string | null
    totalRecords: number | null
    successfulRecords: number | null
    failedRecords: number | null
    status: string | null
    estimatedCompletionTime: Date | null
    processingStartTime: Date | null
    createdAt: Date | null
    completedAt: Date | null
    createdBy: string | null
  }

  export type DailyImportBatchMaxAggregateOutputType = {
    id: string | null
    importDate: Date | null
    filename: string | null
    fileSize: number | null
    fileChecksum: string | null
    totalRecords: number | null
    successfulRecords: number | null
    failedRecords: number | null
    status: string | null
    estimatedCompletionTime: Date | null
    processingStartTime: Date | null
    createdAt: Date | null
    completedAt: Date | null
    createdBy: string | null
  }

  export type DailyImportBatchCountAggregateOutputType = {
    id: number
    importDate: number
    filename: number
    fileSize: number
    fileChecksum: number
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: number
    status: number
    estimatedCompletionTime: number
    processingStartTime: number
    userConfig: number
    validationWarnings: number
    createdAt: number
    completedAt: number
    createdBy: number
    _all: number
  }


  export type DailyImportBatchAvgAggregateInputType = {
    fileSize?: true
    totalRecords?: true
    successfulRecords?: true
    failedRecords?: true
  }

  export type DailyImportBatchSumAggregateInputType = {
    fileSize?: true
    totalRecords?: true
    successfulRecords?: true
    failedRecords?: true
  }

  export type DailyImportBatchMinAggregateInputType = {
    id?: true
    importDate?: true
    filename?: true
    fileSize?: true
    fileChecksum?: true
    totalRecords?: true
    successfulRecords?: true
    failedRecords?: true
    status?: true
    estimatedCompletionTime?: true
    processingStartTime?: true
    createdAt?: true
    completedAt?: true
    createdBy?: true
  }

  export type DailyImportBatchMaxAggregateInputType = {
    id?: true
    importDate?: true
    filename?: true
    fileSize?: true
    fileChecksum?: true
    totalRecords?: true
    successfulRecords?: true
    failedRecords?: true
    status?: true
    estimatedCompletionTime?: true
    processingStartTime?: true
    createdAt?: true
    completedAt?: true
    createdBy?: true
  }

  export type DailyImportBatchCountAggregateInputType = {
    id?: true
    importDate?: true
    filename?: true
    fileSize?: true
    fileChecksum?: true
    totalRecords?: true
    successfulRecords?: true
    failedRecords?: true
    errorLogs?: true
    status?: true
    estimatedCompletionTime?: true
    processingStartTime?: true
    userConfig?: true
    validationWarnings?: true
    createdAt?: true
    completedAt?: true
    createdBy?: true
    _all?: true
  }

  export type DailyImportBatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyImportBatch to aggregate.
     */
    where?: DailyImportBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyImportBatches to fetch.
     */
    orderBy?: DailyImportBatchOrderByWithRelationInput | DailyImportBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyImportBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyImportBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyImportBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyImportBatches
    **/
    _count?: true | DailyImportBatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailyImportBatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailyImportBatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyImportBatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyImportBatchMaxAggregateInputType
  }

  export type GetDailyImportBatchAggregateType<T extends DailyImportBatchAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyImportBatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyImportBatch[P]>
      : GetScalarType<T[P], AggregateDailyImportBatch[P]>
  }




  export type DailyImportBatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyImportBatchWhereInput
    orderBy?: DailyImportBatchOrderByWithAggregationInput | DailyImportBatchOrderByWithAggregationInput[]
    by: DailyImportBatchScalarFieldEnum[] | DailyImportBatchScalarFieldEnum
    having?: DailyImportBatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyImportBatchCountAggregateInputType | true
    _avg?: DailyImportBatchAvgAggregateInputType
    _sum?: DailyImportBatchSumAggregateInputType
    _min?: DailyImportBatchMinAggregateInputType
    _max?: DailyImportBatchMaxAggregateInputType
  }

  export type DailyImportBatchGroupByOutputType = {
    id: string
    importDate: Date
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonValue
    status: string
    estimatedCompletionTime: Date | null
    processingStartTime: Date | null
    userConfig: JsonValue
    validationWarnings: JsonValue
    createdAt: Date
    completedAt: Date | null
    createdBy: string
    _count: DailyImportBatchCountAggregateOutputType | null
    _avg: DailyImportBatchAvgAggregateOutputType | null
    _sum: DailyImportBatchSumAggregateOutputType | null
    _min: DailyImportBatchMinAggregateOutputType | null
    _max: DailyImportBatchMaxAggregateOutputType | null
  }

  type GetDailyImportBatchGroupByPayload<T extends DailyImportBatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyImportBatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyImportBatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyImportBatchGroupByOutputType[P]>
            : GetScalarType<T[P], DailyImportBatchGroupByOutputType[P]>
        }
      >
    >


  export type DailyImportBatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    importDate?: boolean
    filename?: boolean
    fileSize?: boolean
    fileChecksum?: boolean
    totalRecords?: boolean
    successfulRecords?: boolean
    failedRecords?: boolean
    errorLogs?: boolean
    status?: boolean
    estimatedCompletionTime?: boolean
    processingStartTime?: boolean
    userConfig?: boolean
    validationWarnings?: boolean
    createdAt?: boolean
    completedAt?: boolean
    createdBy?: boolean
    activities?: boolean | DailyImportBatch$activitiesArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    progress?: boolean | DailyImportBatch$progressArgs<ExtArgs>
    errorDetails?: boolean | DailyImportBatch$errorDetailsArgs<ExtArgs>
    _count?: boolean | DailyImportBatchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyImportBatch"]>

  export type DailyImportBatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    importDate?: boolean
    filename?: boolean
    fileSize?: boolean
    fileChecksum?: boolean
    totalRecords?: boolean
    successfulRecords?: boolean
    failedRecords?: boolean
    errorLogs?: boolean
    status?: boolean
    estimatedCompletionTime?: boolean
    processingStartTime?: boolean
    userConfig?: boolean
    validationWarnings?: boolean
    createdAt?: boolean
    completedAt?: boolean
    createdBy?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyImportBatch"]>

  export type DailyImportBatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    importDate?: boolean
    filename?: boolean
    fileSize?: boolean
    fileChecksum?: boolean
    totalRecords?: boolean
    successfulRecords?: boolean
    failedRecords?: boolean
    errorLogs?: boolean
    status?: boolean
    estimatedCompletionTime?: boolean
    processingStartTime?: boolean
    userConfig?: boolean
    validationWarnings?: boolean
    createdAt?: boolean
    completedAt?: boolean
    createdBy?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyImportBatch"]>

  export type DailyImportBatchSelectScalar = {
    id?: boolean
    importDate?: boolean
    filename?: boolean
    fileSize?: boolean
    fileChecksum?: boolean
    totalRecords?: boolean
    successfulRecords?: boolean
    failedRecords?: boolean
    errorLogs?: boolean
    status?: boolean
    estimatedCompletionTime?: boolean
    processingStartTime?: boolean
    userConfig?: boolean
    validationWarnings?: boolean
    createdAt?: boolean
    completedAt?: boolean
    createdBy?: boolean
  }

  export type DailyImportBatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "importDate" | "filename" | "fileSize" | "fileChecksum" | "totalRecords" | "successfulRecords" | "failedRecords" | "errorLogs" | "status" | "estimatedCompletionTime" | "processingStartTime" | "userConfig" | "validationWarnings" | "createdAt" | "completedAt" | "createdBy", ExtArgs["result"]["dailyImportBatch"]>
  export type DailyImportBatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activities?: boolean | DailyImportBatch$activitiesArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    progress?: boolean | DailyImportBatch$progressArgs<ExtArgs>
    errorDetails?: boolean | DailyImportBatch$errorDetailsArgs<ExtArgs>
    _count?: boolean | DailyImportBatchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DailyImportBatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DailyImportBatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DailyImportBatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyImportBatch"
    objects: {
      activities: Prisma.$CaseActivityPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
      progress: Prisma.$ImportProgressPayload<ExtArgs>[]
      errorDetails: Prisma.$ImportErrorDetailPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      importDate: Date
      filename: string
      fileSize: number
      fileChecksum: string
      totalRecords: number
      successfulRecords: number
      failedRecords: number
      errorLogs: Prisma.JsonValue
      status: string
      estimatedCompletionTime: Date | null
      processingStartTime: Date | null
      userConfig: Prisma.JsonValue
      validationWarnings: Prisma.JsonValue
      createdAt: Date
      completedAt: Date | null
      createdBy: string
    }, ExtArgs["result"]["dailyImportBatch"]>
    composites: {}
  }

  type DailyImportBatchGetPayload<S extends boolean | null | undefined | DailyImportBatchDefaultArgs> = $Result.GetResult<Prisma.$DailyImportBatchPayload, S>

  type DailyImportBatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailyImportBatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailyImportBatchCountAggregateInputType | true
    }

  export interface DailyImportBatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyImportBatch'], meta: { name: 'DailyImportBatch' } }
    /**
     * Find zero or one DailyImportBatch that matches the filter.
     * @param {DailyImportBatchFindUniqueArgs} args - Arguments to find a DailyImportBatch
     * @example
     * // Get one DailyImportBatch
     * const dailyImportBatch = await prisma.dailyImportBatch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyImportBatchFindUniqueArgs>(args: SelectSubset<T, DailyImportBatchFindUniqueArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailyImportBatch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailyImportBatchFindUniqueOrThrowArgs} args - Arguments to find a DailyImportBatch
     * @example
     * // Get one DailyImportBatch
     * const dailyImportBatch = await prisma.dailyImportBatch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyImportBatchFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyImportBatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyImportBatch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyImportBatchFindFirstArgs} args - Arguments to find a DailyImportBatch
     * @example
     * // Get one DailyImportBatch
     * const dailyImportBatch = await prisma.dailyImportBatch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyImportBatchFindFirstArgs>(args?: SelectSubset<T, DailyImportBatchFindFirstArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyImportBatch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyImportBatchFindFirstOrThrowArgs} args - Arguments to find a DailyImportBatch
     * @example
     * // Get one DailyImportBatch
     * const dailyImportBatch = await prisma.dailyImportBatch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyImportBatchFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyImportBatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailyImportBatches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyImportBatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyImportBatches
     * const dailyImportBatches = await prisma.dailyImportBatch.findMany()
     * 
     * // Get first 10 DailyImportBatches
     * const dailyImportBatches = await prisma.dailyImportBatch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyImportBatchWithIdOnly = await prisma.dailyImportBatch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyImportBatchFindManyArgs>(args?: SelectSubset<T, DailyImportBatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailyImportBatch.
     * @param {DailyImportBatchCreateArgs} args - Arguments to create a DailyImportBatch.
     * @example
     * // Create one DailyImportBatch
     * const DailyImportBatch = await prisma.dailyImportBatch.create({
     *   data: {
     *     // ... data to create a DailyImportBatch
     *   }
     * })
     * 
     */
    create<T extends DailyImportBatchCreateArgs>(args: SelectSubset<T, DailyImportBatchCreateArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailyImportBatches.
     * @param {DailyImportBatchCreateManyArgs} args - Arguments to create many DailyImportBatches.
     * @example
     * // Create many DailyImportBatches
     * const dailyImportBatch = await prisma.dailyImportBatch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyImportBatchCreateManyArgs>(args?: SelectSubset<T, DailyImportBatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailyImportBatches and returns the data saved in the database.
     * @param {DailyImportBatchCreateManyAndReturnArgs} args - Arguments to create many DailyImportBatches.
     * @example
     * // Create many DailyImportBatches
     * const dailyImportBatch = await prisma.dailyImportBatch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailyImportBatches and only return the `id`
     * const dailyImportBatchWithIdOnly = await prisma.dailyImportBatch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailyImportBatchCreateManyAndReturnArgs>(args?: SelectSubset<T, DailyImportBatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DailyImportBatch.
     * @param {DailyImportBatchDeleteArgs} args - Arguments to delete one DailyImportBatch.
     * @example
     * // Delete one DailyImportBatch
     * const DailyImportBatch = await prisma.dailyImportBatch.delete({
     *   where: {
     *     // ... filter to delete one DailyImportBatch
     *   }
     * })
     * 
     */
    delete<T extends DailyImportBatchDeleteArgs>(args: SelectSubset<T, DailyImportBatchDeleteArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailyImportBatch.
     * @param {DailyImportBatchUpdateArgs} args - Arguments to update one DailyImportBatch.
     * @example
     * // Update one DailyImportBatch
     * const dailyImportBatch = await prisma.dailyImportBatch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyImportBatchUpdateArgs>(args: SelectSubset<T, DailyImportBatchUpdateArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailyImportBatches.
     * @param {DailyImportBatchDeleteManyArgs} args - Arguments to filter DailyImportBatches to delete.
     * @example
     * // Delete a few DailyImportBatches
     * const { count } = await prisma.dailyImportBatch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyImportBatchDeleteManyArgs>(args?: SelectSubset<T, DailyImportBatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyImportBatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyImportBatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyImportBatches
     * const dailyImportBatch = await prisma.dailyImportBatch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyImportBatchUpdateManyArgs>(args: SelectSubset<T, DailyImportBatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyImportBatches and returns the data updated in the database.
     * @param {DailyImportBatchUpdateManyAndReturnArgs} args - Arguments to update many DailyImportBatches.
     * @example
     * // Update many DailyImportBatches
     * const dailyImportBatch = await prisma.dailyImportBatch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DailyImportBatches and only return the `id`
     * const dailyImportBatchWithIdOnly = await prisma.dailyImportBatch.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DailyImportBatchUpdateManyAndReturnArgs>(args: SelectSubset<T, DailyImportBatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DailyImportBatch.
     * @param {DailyImportBatchUpsertArgs} args - Arguments to update or create a DailyImportBatch.
     * @example
     * // Update or create a DailyImportBatch
     * const dailyImportBatch = await prisma.dailyImportBatch.upsert({
     *   create: {
     *     // ... data to create a DailyImportBatch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyImportBatch we want to update
     *   }
     * })
     */
    upsert<T extends DailyImportBatchUpsertArgs>(args: SelectSubset<T, DailyImportBatchUpsertArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailyImportBatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyImportBatchCountArgs} args - Arguments to filter DailyImportBatches to count.
     * @example
     * // Count the number of DailyImportBatches
     * const count = await prisma.dailyImportBatch.count({
     *   where: {
     *     // ... the filter for the DailyImportBatches we want to count
     *   }
     * })
    **/
    count<T extends DailyImportBatchCountArgs>(
      args?: Subset<T, DailyImportBatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyImportBatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyImportBatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyImportBatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DailyImportBatchAggregateArgs>(args: Subset<T, DailyImportBatchAggregateArgs>): Prisma.PrismaPromise<GetDailyImportBatchAggregateType<T>>

    /**
     * Group by DailyImportBatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyImportBatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DailyImportBatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyImportBatchGroupByArgs['orderBy'] }
        : { orderBy?: DailyImportBatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailyImportBatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyImportBatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyImportBatch model
   */
  readonly fields: DailyImportBatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyImportBatch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyImportBatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    activities<T extends DailyImportBatch$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, DailyImportBatch$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    progress<T extends DailyImportBatch$progressArgs<ExtArgs> = {}>(args?: Subset<T, DailyImportBatch$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    errorDetails<T extends DailyImportBatch$errorDetailsArgs<ExtArgs> = {}>(args?: Subset<T, DailyImportBatch$errorDetailsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailyImportBatch model
   */
  interface DailyImportBatchFieldRefs {
    readonly id: FieldRef<"DailyImportBatch", 'String'>
    readonly importDate: FieldRef<"DailyImportBatch", 'DateTime'>
    readonly filename: FieldRef<"DailyImportBatch", 'String'>
    readonly fileSize: FieldRef<"DailyImportBatch", 'Int'>
    readonly fileChecksum: FieldRef<"DailyImportBatch", 'String'>
    readonly totalRecords: FieldRef<"DailyImportBatch", 'Int'>
    readonly successfulRecords: FieldRef<"DailyImportBatch", 'Int'>
    readonly failedRecords: FieldRef<"DailyImportBatch", 'Int'>
    readonly errorLogs: FieldRef<"DailyImportBatch", 'Json'>
    readonly status: FieldRef<"DailyImportBatch", 'String'>
    readonly estimatedCompletionTime: FieldRef<"DailyImportBatch", 'DateTime'>
    readonly processingStartTime: FieldRef<"DailyImportBatch", 'DateTime'>
    readonly userConfig: FieldRef<"DailyImportBatch", 'Json'>
    readonly validationWarnings: FieldRef<"DailyImportBatch", 'Json'>
    readonly createdAt: FieldRef<"DailyImportBatch", 'DateTime'>
    readonly completedAt: FieldRef<"DailyImportBatch", 'DateTime'>
    readonly createdBy: FieldRef<"DailyImportBatch", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DailyImportBatch findUnique
   */
  export type DailyImportBatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * Filter, which DailyImportBatch to fetch.
     */
    where: DailyImportBatchWhereUniqueInput
  }

  /**
   * DailyImportBatch findUniqueOrThrow
   */
  export type DailyImportBatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * Filter, which DailyImportBatch to fetch.
     */
    where: DailyImportBatchWhereUniqueInput
  }

  /**
   * DailyImportBatch findFirst
   */
  export type DailyImportBatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * Filter, which DailyImportBatch to fetch.
     */
    where?: DailyImportBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyImportBatches to fetch.
     */
    orderBy?: DailyImportBatchOrderByWithRelationInput | DailyImportBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyImportBatches.
     */
    cursor?: DailyImportBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyImportBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyImportBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyImportBatches.
     */
    distinct?: DailyImportBatchScalarFieldEnum | DailyImportBatchScalarFieldEnum[]
  }

  /**
   * DailyImportBatch findFirstOrThrow
   */
  export type DailyImportBatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * Filter, which DailyImportBatch to fetch.
     */
    where?: DailyImportBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyImportBatches to fetch.
     */
    orderBy?: DailyImportBatchOrderByWithRelationInput | DailyImportBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyImportBatches.
     */
    cursor?: DailyImportBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyImportBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyImportBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyImportBatches.
     */
    distinct?: DailyImportBatchScalarFieldEnum | DailyImportBatchScalarFieldEnum[]
  }

  /**
   * DailyImportBatch findMany
   */
  export type DailyImportBatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * Filter, which DailyImportBatches to fetch.
     */
    where?: DailyImportBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyImportBatches to fetch.
     */
    orderBy?: DailyImportBatchOrderByWithRelationInput | DailyImportBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyImportBatches.
     */
    cursor?: DailyImportBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyImportBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyImportBatches.
     */
    skip?: number
    distinct?: DailyImportBatchScalarFieldEnum | DailyImportBatchScalarFieldEnum[]
  }

  /**
   * DailyImportBatch create
   */
  export type DailyImportBatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * The data needed to create a DailyImportBatch.
     */
    data: XOR<DailyImportBatchCreateInput, DailyImportBatchUncheckedCreateInput>
  }

  /**
   * DailyImportBatch createMany
   */
  export type DailyImportBatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyImportBatches.
     */
    data: DailyImportBatchCreateManyInput | DailyImportBatchCreateManyInput[]
  }

  /**
   * DailyImportBatch createManyAndReturn
   */
  export type DailyImportBatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * The data used to create many DailyImportBatches.
     */
    data: DailyImportBatchCreateManyInput | DailyImportBatchCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyImportBatch update
   */
  export type DailyImportBatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * The data needed to update a DailyImportBatch.
     */
    data: XOR<DailyImportBatchUpdateInput, DailyImportBatchUncheckedUpdateInput>
    /**
     * Choose, which DailyImportBatch to update.
     */
    where: DailyImportBatchWhereUniqueInput
  }

  /**
   * DailyImportBatch updateMany
   */
  export type DailyImportBatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyImportBatches.
     */
    data: XOR<DailyImportBatchUpdateManyMutationInput, DailyImportBatchUncheckedUpdateManyInput>
    /**
     * Filter which DailyImportBatches to update
     */
    where?: DailyImportBatchWhereInput
    /**
     * Limit how many DailyImportBatches to update.
     */
    limit?: number
  }

  /**
   * DailyImportBatch updateManyAndReturn
   */
  export type DailyImportBatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * The data used to update DailyImportBatches.
     */
    data: XOR<DailyImportBatchUpdateManyMutationInput, DailyImportBatchUncheckedUpdateManyInput>
    /**
     * Filter which DailyImportBatches to update
     */
    where?: DailyImportBatchWhereInput
    /**
     * Limit how many DailyImportBatches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyImportBatch upsert
   */
  export type DailyImportBatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * The filter to search for the DailyImportBatch to update in case it exists.
     */
    where: DailyImportBatchWhereUniqueInput
    /**
     * In case the DailyImportBatch found by the `where` argument doesn't exist, create a new DailyImportBatch with this data.
     */
    create: XOR<DailyImportBatchCreateInput, DailyImportBatchUncheckedCreateInput>
    /**
     * In case the DailyImportBatch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyImportBatchUpdateInput, DailyImportBatchUncheckedUpdateInput>
  }

  /**
   * DailyImportBatch delete
   */
  export type DailyImportBatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    /**
     * Filter which DailyImportBatch to delete.
     */
    where: DailyImportBatchWhereUniqueInput
  }

  /**
   * DailyImportBatch deleteMany
   */
  export type DailyImportBatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyImportBatches to delete
     */
    where?: DailyImportBatchWhereInput
    /**
     * Limit how many DailyImportBatches to delete.
     */
    limit?: number
  }

  /**
   * DailyImportBatch.activities
   */
  export type DailyImportBatch$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseActivity
     */
    select?: CaseActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseActivity
     */
    omit?: CaseActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseActivityInclude<ExtArgs> | null
    where?: CaseActivityWhereInput
    orderBy?: CaseActivityOrderByWithRelationInput | CaseActivityOrderByWithRelationInput[]
    cursor?: CaseActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseActivityScalarFieldEnum | CaseActivityScalarFieldEnum[]
  }

  /**
   * DailyImportBatch.progress
   */
  export type DailyImportBatch$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    where?: ImportProgressWhereInput
    orderBy?: ImportProgressOrderByWithRelationInput | ImportProgressOrderByWithRelationInput[]
    cursor?: ImportProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImportProgressScalarFieldEnum | ImportProgressScalarFieldEnum[]
  }

  /**
   * DailyImportBatch.errorDetails
   */
  export type DailyImportBatch$errorDetailsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    where?: ImportErrorDetailWhereInput
    orderBy?: ImportErrorDetailOrderByWithRelationInput | ImportErrorDetailOrderByWithRelationInput[]
    cursor?: ImportErrorDetailWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImportErrorDetailScalarFieldEnum | ImportErrorDetailScalarFieldEnum[]
  }

  /**
   * DailyImportBatch without action
   */
  export type DailyImportBatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    role: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    role: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    role: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string
    role: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    importBatches?: boolean | User$importBatchesArgs<ExtArgs>
    importSessions?: boolean | User$importSessionsArgs<ExtArgs>
    validationResults?: boolean | User$validationResultsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "role" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    importBatches?: boolean | User$importBatchesArgs<ExtArgs>
    importSessions?: boolean | User$importSessionsArgs<ExtArgs>
    validationResults?: boolean | User$validationResultsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      importBatches: Prisma.$DailyImportBatchPayload<ExtArgs>[]
      importSessions: Prisma.$ImportSessionPayload<ExtArgs>[]
      validationResults: Prisma.$ValidationResultPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
      role: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    importBatches<T extends User$importBatchesArgs<ExtArgs> = {}>(args?: Subset<T, User$importBatchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    importSessions<T extends User$importSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$importSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    validationResults<T extends User$validationResultsArgs<ExtArgs> = {}>(args?: Subset<T, User$validationResultsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.importBatches
   */
  export type User$importBatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyImportBatch
     */
    select?: DailyImportBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyImportBatch
     */
    omit?: DailyImportBatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyImportBatchInclude<ExtArgs> | null
    where?: DailyImportBatchWhereInput
    orderBy?: DailyImportBatchOrderByWithRelationInput | DailyImportBatchOrderByWithRelationInput[]
    cursor?: DailyImportBatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DailyImportBatchScalarFieldEnum | DailyImportBatchScalarFieldEnum[]
  }

  /**
   * User.importSessions
   */
  export type User$importSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    where?: ImportSessionWhereInput
    orderBy?: ImportSessionOrderByWithRelationInput | ImportSessionOrderByWithRelationInput[]
    cursor?: ImportSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImportSessionScalarFieldEnum | ImportSessionScalarFieldEnum[]
  }

  /**
   * User.validationResults
   */
  export type User$validationResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    where?: ValidationResultWhereInput
    orderBy?: ValidationResultOrderByWithRelationInput | ValidationResultOrderByWithRelationInput[]
    cursor?: ValidationResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ValidationResultScalarFieldEnum | ValidationResultScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ImportProgress
   */

  export type AggregateImportProgress = {
    _count: ImportProgressCountAggregateOutputType | null
    _avg: ImportProgressAvgAggregateOutputType | null
    _sum: ImportProgressSumAggregateOutputType | null
    _min: ImportProgressMinAggregateOutputType | null
    _max: ImportProgressMaxAggregateOutputType | null
  }

  export type ImportProgressAvgAggregateOutputType = {
    progressPercentage: number | null
    recordsProcessed: number | null
    totalRecords: number | null
    errorsCount: number | null
    warningsCount: number | null
  }

  export type ImportProgressSumAggregateOutputType = {
    progressPercentage: number | null
    recordsProcessed: number | null
    totalRecords: number | null
    errorsCount: number | null
    warningsCount: number | null
  }

  export type ImportProgressMinAggregateOutputType = {
    id: string | null
    batchId: string | null
    progressPercentage: number | null
    currentStep: string | null
    message: string | null
    recordsProcessed: number | null
    totalRecords: number | null
    errorsCount: number | null
    warningsCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImportProgressMaxAggregateOutputType = {
    id: string | null
    batchId: string | null
    progressPercentage: number | null
    currentStep: string | null
    message: string | null
    recordsProcessed: number | null
    totalRecords: number | null
    errorsCount: number | null
    warningsCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImportProgressCountAggregateOutputType = {
    id: number
    batchId: number
    progressPercentage: number
    currentStep: number
    message: number
    recordsProcessed: number
    totalRecords: number
    errorsCount: number
    warningsCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ImportProgressAvgAggregateInputType = {
    progressPercentage?: true
    recordsProcessed?: true
    totalRecords?: true
    errorsCount?: true
    warningsCount?: true
  }

  export type ImportProgressSumAggregateInputType = {
    progressPercentage?: true
    recordsProcessed?: true
    totalRecords?: true
    errorsCount?: true
    warningsCount?: true
  }

  export type ImportProgressMinAggregateInputType = {
    id?: true
    batchId?: true
    progressPercentage?: true
    currentStep?: true
    message?: true
    recordsProcessed?: true
    totalRecords?: true
    errorsCount?: true
    warningsCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImportProgressMaxAggregateInputType = {
    id?: true
    batchId?: true
    progressPercentage?: true
    currentStep?: true
    message?: true
    recordsProcessed?: true
    totalRecords?: true
    errorsCount?: true
    warningsCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImportProgressCountAggregateInputType = {
    id?: true
    batchId?: true
    progressPercentage?: true
    currentStep?: true
    message?: true
    recordsProcessed?: true
    totalRecords?: true
    errorsCount?: true
    warningsCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImportProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportProgress to aggregate.
     */
    where?: ImportProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportProgresses to fetch.
     */
    orderBy?: ImportProgressOrderByWithRelationInput | ImportProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImportProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImportProgresses
    **/
    _count?: true | ImportProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImportProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImportProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImportProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImportProgressMaxAggregateInputType
  }

  export type GetImportProgressAggregateType<T extends ImportProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateImportProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImportProgress[P]>
      : GetScalarType<T[P], AggregateImportProgress[P]>
  }




  export type ImportProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportProgressWhereInput
    orderBy?: ImportProgressOrderByWithAggregationInput | ImportProgressOrderByWithAggregationInput[]
    by: ImportProgressScalarFieldEnum[] | ImportProgressScalarFieldEnum
    having?: ImportProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImportProgressCountAggregateInputType | true
    _avg?: ImportProgressAvgAggregateInputType
    _sum?: ImportProgressSumAggregateInputType
    _min?: ImportProgressMinAggregateInputType
    _max?: ImportProgressMaxAggregateInputType
  }

  export type ImportProgressGroupByOutputType = {
    id: string
    batchId: string
    progressPercentage: number | null
    currentStep: string | null
    message: string | null
    recordsProcessed: number
    totalRecords: number
    errorsCount: number
    warningsCount: number
    createdAt: Date
    updatedAt: Date
    _count: ImportProgressCountAggregateOutputType | null
    _avg: ImportProgressAvgAggregateOutputType | null
    _sum: ImportProgressSumAggregateOutputType | null
    _min: ImportProgressMinAggregateOutputType | null
    _max: ImportProgressMaxAggregateOutputType | null
  }

  type GetImportProgressGroupByPayload<T extends ImportProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImportProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImportProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImportProgressGroupByOutputType[P]>
            : GetScalarType<T[P], ImportProgressGroupByOutputType[P]>
        }
      >
    >


  export type ImportProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    progressPercentage?: boolean
    currentStep?: boolean
    message?: boolean
    recordsProcessed?: boolean
    totalRecords?: boolean
    errorsCount?: boolean
    warningsCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importProgress"]>

  export type ImportProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    progressPercentage?: boolean
    currentStep?: boolean
    message?: boolean
    recordsProcessed?: boolean
    totalRecords?: boolean
    errorsCount?: boolean
    warningsCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importProgress"]>

  export type ImportProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    progressPercentage?: boolean
    currentStep?: boolean
    message?: boolean
    recordsProcessed?: boolean
    totalRecords?: boolean
    errorsCount?: boolean
    warningsCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importProgress"]>

  export type ImportProgressSelectScalar = {
    id?: boolean
    batchId?: boolean
    progressPercentage?: boolean
    currentStep?: boolean
    message?: boolean
    recordsProcessed?: boolean
    totalRecords?: boolean
    errorsCount?: boolean
    warningsCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ImportProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "batchId" | "progressPercentage" | "currentStep" | "message" | "recordsProcessed" | "totalRecords" | "errorsCount" | "warningsCount" | "createdAt" | "updatedAt", ExtArgs["result"]["importProgress"]>
  export type ImportProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }
  export type ImportProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }
  export type ImportProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }

  export type $ImportProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImportProgress"
    objects: {
      batch: Prisma.$DailyImportBatchPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      batchId: string
      progressPercentage: number | null
      currentStep: string | null
      message: string | null
      recordsProcessed: number
      totalRecords: number
      errorsCount: number
      warningsCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["importProgress"]>
    composites: {}
  }

  type ImportProgressGetPayload<S extends boolean | null | undefined | ImportProgressDefaultArgs> = $Result.GetResult<Prisma.$ImportProgressPayload, S>

  type ImportProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImportProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImportProgressCountAggregateInputType | true
    }

  export interface ImportProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImportProgress'], meta: { name: 'ImportProgress' } }
    /**
     * Find zero or one ImportProgress that matches the filter.
     * @param {ImportProgressFindUniqueArgs} args - Arguments to find a ImportProgress
     * @example
     * // Get one ImportProgress
     * const importProgress = await prisma.importProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImportProgressFindUniqueArgs>(args: SelectSubset<T, ImportProgressFindUniqueArgs<ExtArgs>>): Prisma__ImportProgressClient<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImportProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImportProgressFindUniqueOrThrowArgs} args - Arguments to find a ImportProgress
     * @example
     * // Get one ImportProgress
     * const importProgress = await prisma.importProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImportProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, ImportProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImportProgressClient<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportProgressFindFirstArgs} args - Arguments to find a ImportProgress
     * @example
     * // Get one ImportProgress
     * const importProgress = await prisma.importProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImportProgressFindFirstArgs>(args?: SelectSubset<T, ImportProgressFindFirstArgs<ExtArgs>>): Prisma__ImportProgressClient<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportProgressFindFirstOrThrowArgs} args - Arguments to find a ImportProgress
     * @example
     * // Get one ImportProgress
     * const importProgress = await prisma.importProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImportProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, ImportProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImportProgressClient<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImportProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImportProgresses
     * const importProgresses = await prisma.importProgress.findMany()
     * 
     * // Get first 10 ImportProgresses
     * const importProgresses = await prisma.importProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const importProgressWithIdOnly = await prisma.importProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImportProgressFindManyArgs>(args?: SelectSubset<T, ImportProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImportProgress.
     * @param {ImportProgressCreateArgs} args - Arguments to create a ImportProgress.
     * @example
     * // Create one ImportProgress
     * const ImportProgress = await prisma.importProgress.create({
     *   data: {
     *     // ... data to create a ImportProgress
     *   }
     * })
     * 
     */
    create<T extends ImportProgressCreateArgs>(args: SelectSubset<T, ImportProgressCreateArgs<ExtArgs>>): Prisma__ImportProgressClient<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImportProgresses.
     * @param {ImportProgressCreateManyArgs} args - Arguments to create many ImportProgresses.
     * @example
     * // Create many ImportProgresses
     * const importProgress = await prisma.importProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImportProgressCreateManyArgs>(args?: SelectSubset<T, ImportProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImportProgresses and returns the data saved in the database.
     * @param {ImportProgressCreateManyAndReturnArgs} args - Arguments to create many ImportProgresses.
     * @example
     * // Create many ImportProgresses
     * const importProgress = await prisma.importProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImportProgresses and only return the `id`
     * const importProgressWithIdOnly = await prisma.importProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImportProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, ImportProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImportProgress.
     * @param {ImportProgressDeleteArgs} args - Arguments to delete one ImportProgress.
     * @example
     * // Delete one ImportProgress
     * const ImportProgress = await prisma.importProgress.delete({
     *   where: {
     *     // ... filter to delete one ImportProgress
     *   }
     * })
     * 
     */
    delete<T extends ImportProgressDeleteArgs>(args: SelectSubset<T, ImportProgressDeleteArgs<ExtArgs>>): Prisma__ImportProgressClient<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImportProgress.
     * @param {ImportProgressUpdateArgs} args - Arguments to update one ImportProgress.
     * @example
     * // Update one ImportProgress
     * const importProgress = await prisma.importProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImportProgressUpdateArgs>(args: SelectSubset<T, ImportProgressUpdateArgs<ExtArgs>>): Prisma__ImportProgressClient<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImportProgresses.
     * @param {ImportProgressDeleteManyArgs} args - Arguments to filter ImportProgresses to delete.
     * @example
     * // Delete a few ImportProgresses
     * const { count } = await prisma.importProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImportProgressDeleteManyArgs>(args?: SelectSubset<T, ImportProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImportProgresses
     * const importProgress = await prisma.importProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImportProgressUpdateManyArgs>(args: SelectSubset<T, ImportProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportProgresses and returns the data updated in the database.
     * @param {ImportProgressUpdateManyAndReturnArgs} args - Arguments to update many ImportProgresses.
     * @example
     * // Update many ImportProgresses
     * const importProgress = await prisma.importProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImportProgresses and only return the `id`
     * const importProgressWithIdOnly = await prisma.importProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImportProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, ImportProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImportProgress.
     * @param {ImportProgressUpsertArgs} args - Arguments to update or create a ImportProgress.
     * @example
     * // Update or create a ImportProgress
     * const importProgress = await prisma.importProgress.upsert({
     *   create: {
     *     // ... data to create a ImportProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImportProgress we want to update
     *   }
     * })
     */
    upsert<T extends ImportProgressUpsertArgs>(args: SelectSubset<T, ImportProgressUpsertArgs<ExtArgs>>): Prisma__ImportProgressClient<$Result.GetResult<Prisma.$ImportProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImportProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportProgressCountArgs} args - Arguments to filter ImportProgresses to count.
     * @example
     * // Count the number of ImportProgresses
     * const count = await prisma.importProgress.count({
     *   where: {
     *     // ... the filter for the ImportProgresses we want to count
     *   }
     * })
    **/
    count<T extends ImportProgressCountArgs>(
      args?: Subset<T, ImportProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImportProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImportProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImportProgressAggregateArgs>(args: Subset<T, ImportProgressAggregateArgs>): Prisma.PrismaPromise<GetImportProgressAggregateType<T>>

    /**
     * Group by ImportProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImportProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImportProgressGroupByArgs['orderBy'] }
        : { orderBy?: ImportProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImportProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImportProgress model
   */
  readonly fields: ImportProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImportProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImportProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    batch<T extends DailyImportBatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DailyImportBatchDefaultArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ImportProgress model
   */
  interface ImportProgressFieldRefs {
    readonly id: FieldRef<"ImportProgress", 'String'>
    readonly batchId: FieldRef<"ImportProgress", 'String'>
    readonly progressPercentage: FieldRef<"ImportProgress", 'Int'>
    readonly currentStep: FieldRef<"ImportProgress", 'String'>
    readonly message: FieldRef<"ImportProgress", 'String'>
    readonly recordsProcessed: FieldRef<"ImportProgress", 'Int'>
    readonly totalRecords: FieldRef<"ImportProgress", 'Int'>
    readonly errorsCount: FieldRef<"ImportProgress", 'Int'>
    readonly warningsCount: FieldRef<"ImportProgress", 'Int'>
    readonly createdAt: FieldRef<"ImportProgress", 'DateTime'>
    readonly updatedAt: FieldRef<"ImportProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImportProgress findUnique
   */
  export type ImportProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * Filter, which ImportProgress to fetch.
     */
    where: ImportProgressWhereUniqueInput
  }

  /**
   * ImportProgress findUniqueOrThrow
   */
  export type ImportProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * Filter, which ImportProgress to fetch.
     */
    where: ImportProgressWhereUniqueInput
  }

  /**
   * ImportProgress findFirst
   */
  export type ImportProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * Filter, which ImportProgress to fetch.
     */
    where?: ImportProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportProgresses to fetch.
     */
    orderBy?: ImportProgressOrderByWithRelationInput | ImportProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportProgresses.
     */
    cursor?: ImportProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportProgresses.
     */
    distinct?: ImportProgressScalarFieldEnum | ImportProgressScalarFieldEnum[]
  }

  /**
   * ImportProgress findFirstOrThrow
   */
  export type ImportProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * Filter, which ImportProgress to fetch.
     */
    where?: ImportProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportProgresses to fetch.
     */
    orderBy?: ImportProgressOrderByWithRelationInput | ImportProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportProgresses.
     */
    cursor?: ImportProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportProgresses.
     */
    distinct?: ImportProgressScalarFieldEnum | ImportProgressScalarFieldEnum[]
  }

  /**
   * ImportProgress findMany
   */
  export type ImportProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * Filter, which ImportProgresses to fetch.
     */
    where?: ImportProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportProgresses to fetch.
     */
    orderBy?: ImportProgressOrderByWithRelationInput | ImportProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImportProgresses.
     */
    cursor?: ImportProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportProgresses.
     */
    skip?: number
    distinct?: ImportProgressScalarFieldEnum | ImportProgressScalarFieldEnum[]
  }

  /**
   * ImportProgress create
   */
  export type ImportProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a ImportProgress.
     */
    data: XOR<ImportProgressCreateInput, ImportProgressUncheckedCreateInput>
  }

  /**
   * ImportProgress createMany
   */
  export type ImportProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImportProgresses.
     */
    data: ImportProgressCreateManyInput | ImportProgressCreateManyInput[]
  }

  /**
   * ImportProgress createManyAndReturn
   */
  export type ImportProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * The data used to create many ImportProgresses.
     */
    data: ImportProgressCreateManyInput | ImportProgressCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportProgress update
   */
  export type ImportProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a ImportProgress.
     */
    data: XOR<ImportProgressUpdateInput, ImportProgressUncheckedUpdateInput>
    /**
     * Choose, which ImportProgress to update.
     */
    where: ImportProgressWhereUniqueInput
  }

  /**
   * ImportProgress updateMany
   */
  export type ImportProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImportProgresses.
     */
    data: XOR<ImportProgressUpdateManyMutationInput, ImportProgressUncheckedUpdateManyInput>
    /**
     * Filter which ImportProgresses to update
     */
    where?: ImportProgressWhereInput
    /**
     * Limit how many ImportProgresses to update.
     */
    limit?: number
  }

  /**
   * ImportProgress updateManyAndReturn
   */
  export type ImportProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * The data used to update ImportProgresses.
     */
    data: XOR<ImportProgressUpdateManyMutationInput, ImportProgressUncheckedUpdateManyInput>
    /**
     * Filter which ImportProgresses to update
     */
    where?: ImportProgressWhereInput
    /**
     * Limit how many ImportProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportProgress upsert
   */
  export type ImportProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the ImportProgress to update in case it exists.
     */
    where: ImportProgressWhereUniqueInput
    /**
     * In case the ImportProgress found by the `where` argument doesn't exist, create a new ImportProgress with this data.
     */
    create: XOR<ImportProgressCreateInput, ImportProgressUncheckedCreateInput>
    /**
     * In case the ImportProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImportProgressUpdateInput, ImportProgressUncheckedUpdateInput>
  }

  /**
   * ImportProgress delete
   */
  export type ImportProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
    /**
     * Filter which ImportProgress to delete.
     */
    where: ImportProgressWhereUniqueInput
  }

  /**
   * ImportProgress deleteMany
   */
  export type ImportProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportProgresses to delete
     */
    where?: ImportProgressWhereInput
    /**
     * Limit how many ImportProgresses to delete.
     */
    limit?: number
  }

  /**
   * ImportProgress without action
   */
  export type ImportProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportProgress
     */
    select?: ImportProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportProgress
     */
    omit?: ImportProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportProgressInclude<ExtArgs> | null
  }


  /**
   * Model ImportErrorDetail
   */

  export type AggregateImportErrorDetail = {
    _count: ImportErrorDetailCountAggregateOutputType | null
    _avg: ImportErrorDetailAvgAggregateOutputType | null
    _sum: ImportErrorDetailSumAggregateOutputType | null
    _min: ImportErrorDetailMinAggregateOutputType | null
    _max: ImportErrorDetailMaxAggregateOutputType | null
  }

  export type ImportErrorDetailAvgAggregateOutputType = {
    rowNumber: number | null
  }

  export type ImportErrorDetailSumAggregateOutputType = {
    rowNumber: number | null
  }

  export type ImportErrorDetailMinAggregateOutputType = {
    id: string | null
    batchId: string | null
    rowNumber: number | null
    columnName: string | null
    errorType: string | null
    errorMessage: string | null
    rawValue: string | null
    suggestedFix: string | null
    severity: string | null
    isResolved: boolean | null
    createdAt: Date | null
  }

  export type ImportErrorDetailMaxAggregateOutputType = {
    id: string | null
    batchId: string | null
    rowNumber: number | null
    columnName: string | null
    errorType: string | null
    errorMessage: string | null
    rawValue: string | null
    suggestedFix: string | null
    severity: string | null
    isResolved: boolean | null
    createdAt: Date | null
  }

  export type ImportErrorDetailCountAggregateOutputType = {
    id: number
    batchId: number
    rowNumber: number
    columnName: number
    errorType: number
    errorMessage: number
    rawValue: number
    suggestedFix: number
    severity: number
    isResolved: number
    createdAt: number
    _all: number
  }


  export type ImportErrorDetailAvgAggregateInputType = {
    rowNumber?: true
  }

  export type ImportErrorDetailSumAggregateInputType = {
    rowNumber?: true
  }

  export type ImportErrorDetailMinAggregateInputType = {
    id?: true
    batchId?: true
    rowNumber?: true
    columnName?: true
    errorType?: true
    errorMessage?: true
    rawValue?: true
    suggestedFix?: true
    severity?: true
    isResolved?: true
    createdAt?: true
  }

  export type ImportErrorDetailMaxAggregateInputType = {
    id?: true
    batchId?: true
    rowNumber?: true
    columnName?: true
    errorType?: true
    errorMessage?: true
    rawValue?: true
    suggestedFix?: true
    severity?: true
    isResolved?: true
    createdAt?: true
  }

  export type ImportErrorDetailCountAggregateInputType = {
    id?: true
    batchId?: true
    rowNumber?: true
    columnName?: true
    errorType?: true
    errorMessage?: true
    rawValue?: true
    suggestedFix?: true
    severity?: true
    isResolved?: true
    createdAt?: true
    _all?: true
  }

  export type ImportErrorDetailAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportErrorDetail to aggregate.
     */
    where?: ImportErrorDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportErrorDetails to fetch.
     */
    orderBy?: ImportErrorDetailOrderByWithRelationInput | ImportErrorDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImportErrorDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportErrorDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportErrorDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImportErrorDetails
    **/
    _count?: true | ImportErrorDetailCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImportErrorDetailAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImportErrorDetailSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImportErrorDetailMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImportErrorDetailMaxAggregateInputType
  }

  export type GetImportErrorDetailAggregateType<T extends ImportErrorDetailAggregateArgs> = {
        [P in keyof T & keyof AggregateImportErrorDetail]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImportErrorDetail[P]>
      : GetScalarType<T[P], AggregateImportErrorDetail[P]>
  }




  export type ImportErrorDetailGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportErrorDetailWhereInput
    orderBy?: ImportErrorDetailOrderByWithAggregationInput | ImportErrorDetailOrderByWithAggregationInput[]
    by: ImportErrorDetailScalarFieldEnum[] | ImportErrorDetailScalarFieldEnum
    having?: ImportErrorDetailScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImportErrorDetailCountAggregateInputType | true
    _avg?: ImportErrorDetailAvgAggregateInputType
    _sum?: ImportErrorDetailSumAggregateInputType
    _min?: ImportErrorDetailMinAggregateInputType
    _max?: ImportErrorDetailMaxAggregateInputType
  }

  export type ImportErrorDetailGroupByOutputType = {
    id: string
    batchId: string
    rowNumber: number | null
    columnName: string | null
    errorType: string
    errorMessage: string
    rawValue: string | null
    suggestedFix: string | null
    severity: string
    isResolved: boolean
    createdAt: Date
    _count: ImportErrorDetailCountAggregateOutputType | null
    _avg: ImportErrorDetailAvgAggregateOutputType | null
    _sum: ImportErrorDetailSumAggregateOutputType | null
    _min: ImportErrorDetailMinAggregateOutputType | null
    _max: ImportErrorDetailMaxAggregateOutputType | null
  }

  type GetImportErrorDetailGroupByPayload<T extends ImportErrorDetailGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImportErrorDetailGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImportErrorDetailGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImportErrorDetailGroupByOutputType[P]>
            : GetScalarType<T[P], ImportErrorDetailGroupByOutputType[P]>
        }
      >
    >


  export type ImportErrorDetailSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    rowNumber?: boolean
    columnName?: boolean
    errorType?: boolean
    errorMessage?: boolean
    rawValue?: boolean
    suggestedFix?: boolean
    severity?: boolean
    isResolved?: boolean
    createdAt?: boolean
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importErrorDetail"]>

  export type ImportErrorDetailSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    rowNumber?: boolean
    columnName?: boolean
    errorType?: boolean
    errorMessage?: boolean
    rawValue?: boolean
    suggestedFix?: boolean
    severity?: boolean
    isResolved?: boolean
    createdAt?: boolean
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importErrorDetail"]>

  export type ImportErrorDetailSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    rowNumber?: boolean
    columnName?: boolean
    errorType?: boolean
    errorMessage?: boolean
    rawValue?: boolean
    suggestedFix?: boolean
    severity?: boolean
    isResolved?: boolean
    createdAt?: boolean
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importErrorDetail"]>

  export type ImportErrorDetailSelectScalar = {
    id?: boolean
    batchId?: boolean
    rowNumber?: boolean
    columnName?: boolean
    errorType?: boolean
    errorMessage?: boolean
    rawValue?: boolean
    suggestedFix?: boolean
    severity?: boolean
    isResolved?: boolean
    createdAt?: boolean
  }

  export type ImportErrorDetailOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "batchId" | "rowNumber" | "columnName" | "errorType" | "errorMessage" | "rawValue" | "suggestedFix" | "severity" | "isResolved" | "createdAt", ExtArgs["result"]["importErrorDetail"]>
  export type ImportErrorDetailInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }
  export type ImportErrorDetailIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }
  export type ImportErrorDetailIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    batch?: boolean | DailyImportBatchDefaultArgs<ExtArgs>
  }

  export type $ImportErrorDetailPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImportErrorDetail"
    objects: {
      batch: Prisma.$DailyImportBatchPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      batchId: string
      rowNumber: number | null
      columnName: string | null
      errorType: string
      errorMessage: string
      rawValue: string | null
      suggestedFix: string | null
      severity: string
      isResolved: boolean
      createdAt: Date
    }, ExtArgs["result"]["importErrorDetail"]>
    composites: {}
  }

  type ImportErrorDetailGetPayload<S extends boolean | null | undefined | ImportErrorDetailDefaultArgs> = $Result.GetResult<Prisma.$ImportErrorDetailPayload, S>

  type ImportErrorDetailCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImportErrorDetailFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImportErrorDetailCountAggregateInputType | true
    }

  export interface ImportErrorDetailDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImportErrorDetail'], meta: { name: 'ImportErrorDetail' } }
    /**
     * Find zero or one ImportErrorDetail that matches the filter.
     * @param {ImportErrorDetailFindUniqueArgs} args - Arguments to find a ImportErrorDetail
     * @example
     * // Get one ImportErrorDetail
     * const importErrorDetail = await prisma.importErrorDetail.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImportErrorDetailFindUniqueArgs>(args: SelectSubset<T, ImportErrorDetailFindUniqueArgs<ExtArgs>>): Prisma__ImportErrorDetailClient<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImportErrorDetail that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImportErrorDetailFindUniqueOrThrowArgs} args - Arguments to find a ImportErrorDetail
     * @example
     * // Get one ImportErrorDetail
     * const importErrorDetail = await prisma.importErrorDetail.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImportErrorDetailFindUniqueOrThrowArgs>(args: SelectSubset<T, ImportErrorDetailFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImportErrorDetailClient<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportErrorDetail that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportErrorDetailFindFirstArgs} args - Arguments to find a ImportErrorDetail
     * @example
     * // Get one ImportErrorDetail
     * const importErrorDetail = await prisma.importErrorDetail.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImportErrorDetailFindFirstArgs>(args?: SelectSubset<T, ImportErrorDetailFindFirstArgs<ExtArgs>>): Prisma__ImportErrorDetailClient<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportErrorDetail that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportErrorDetailFindFirstOrThrowArgs} args - Arguments to find a ImportErrorDetail
     * @example
     * // Get one ImportErrorDetail
     * const importErrorDetail = await prisma.importErrorDetail.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImportErrorDetailFindFirstOrThrowArgs>(args?: SelectSubset<T, ImportErrorDetailFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImportErrorDetailClient<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImportErrorDetails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportErrorDetailFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImportErrorDetails
     * const importErrorDetails = await prisma.importErrorDetail.findMany()
     * 
     * // Get first 10 ImportErrorDetails
     * const importErrorDetails = await prisma.importErrorDetail.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const importErrorDetailWithIdOnly = await prisma.importErrorDetail.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImportErrorDetailFindManyArgs>(args?: SelectSubset<T, ImportErrorDetailFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImportErrorDetail.
     * @param {ImportErrorDetailCreateArgs} args - Arguments to create a ImportErrorDetail.
     * @example
     * // Create one ImportErrorDetail
     * const ImportErrorDetail = await prisma.importErrorDetail.create({
     *   data: {
     *     // ... data to create a ImportErrorDetail
     *   }
     * })
     * 
     */
    create<T extends ImportErrorDetailCreateArgs>(args: SelectSubset<T, ImportErrorDetailCreateArgs<ExtArgs>>): Prisma__ImportErrorDetailClient<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImportErrorDetails.
     * @param {ImportErrorDetailCreateManyArgs} args - Arguments to create many ImportErrorDetails.
     * @example
     * // Create many ImportErrorDetails
     * const importErrorDetail = await prisma.importErrorDetail.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImportErrorDetailCreateManyArgs>(args?: SelectSubset<T, ImportErrorDetailCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImportErrorDetails and returns the data saved in the database.
     * @param {ImportErrorDetailCreateManyAndReturnArgs} args - Arguments to create many ImportErrorDetails.
     * @example
     * // Create many ImportErrorDetails
     * const importErrorDetail = await prisma.importErrorDetail.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImportErrorDetails and only return the `id`
     * const importErrorDetailWithIdOnly = await prisma.importErrorDetail.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImportErrorDetailCreateManyAndReturnArgs>(args?: SelectSubset<T, ImportErrorDetailCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImportErrorDetail.
     * @param {ImportErrorDetailDeleteArgs} args - Arguments to delete one ImportErrorDetail.
     * @example
     * // Delete one ImportErrorDetail
     * const ImportErrorDetail = await prisma.importErrorDetail.delete({
     *   where: {
     *     // ... filter to delete one ImportErrorDetail
     *   }
     * })
     * 
     */
    delete<T extends ImportErrorDetailDeleteArgs>(args: SelectSubset<T, ImportErrorDetailDeleteArgs<ExtArgs>>): Prisma__ImportErrorDetailClient<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImportErrorDetail.
     * @param {ImportErrorDetailUpdateArgs} args - Arguments to update one ImportErrorDetail.
     * @example
     * // Update one ImportErrorDetail
     * const importErrorDetail = await prisma.importErrorDetail.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImportErrorDetailUpdateArgs>(args: SelectSubset<T, ImportErrorDetailUpdateArgs<ExtArgs>>): Prisma__ImportErrorDetailClient<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImportErrorDetails.
     * @param {ImportErrorDetailDeleteManyArgs} args - Arguments to filter ImportErrorDetails to delete.
     * @example
     * // Delete a few ImportErrorDetails
     * const { count } = await prisma.importErrorDetail.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImportErrorDetailDeleteManyArgs>(args?: SelectSubset<T, ImportErrorDetailDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportErrorDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportErrorDetailUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImportErrorDetails
     * const importErrorDetail = await prisma.importErrorDetail.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImportErrorDetailUpdateManyArgs>(args: SelectSubset<T, ImportErrorDetailUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportErrorDetails and returns the data updated in the database.
     * @param {ImportErrorDetailUpdateManyAndReturnArgs} args - Arguments to update many ImportErrorDetails.
     * @example
     * // Update many ImportErrorDetails
     * const importErrorDetail = await prisma.importErrorDetail.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImportErrorDetails and only return the `id`
     * const importErrorDetailWithIdOnly = await prisma.importErrorDetail.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImportErrorDetailUpdateManyAndReturnArgs>(args: SelectSubset<T, ImportErrorDetailUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImportErrorDetail.
     * @param {ImportErrorDetailUpsertArgs} args - Arguments to update or create a ImportErrorDetail.
     * @example
     * // Update or create a ImportErrorDetail
     * const importErrorDetail = await prisma.importErrorDetail.upsert({
     *   create: {
     *     // ... data to create a ImportErrorDetail
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImportErrorDetail we want to update
     *   }
     * })
     */
    upsert<T extends ImportErrorDetailUpsertArgs>(args: SelectSubset<T, ImportErrorDetailUpsertArgs<ExtArgs>>): Prisma__ImportErrorDetailClient<$Result.GetResult<Prisma.$ImportErrorDetailPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImportErrorDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportErrorDetailCountArgs} args - Arguments to filter ImportErrorDetails to count.
     * @example
     * // Count the number of ImportErrorDetails
     * const count = await prisma.importErrorDetail.count({
     *   where: {
     *     // ... the filter for the ImportErrorDetails we want to count
     *   }
     * })
    **/
    count<T extends ImportErrorDetailCountArgs>(
      args?: Subset<T, ImportErrorDetailCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImportErrorDetailCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImportErrorDetail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportErrorDetailAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImportErrorDetailAggregateArgs>(args: Subset<T, ImportErrorDetailAggregateArgs>): Prisma.PrismaPromise<GetImportErrorDetailAggregateType<T>>

    /**
     * Group by ImportErrorDetail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportErrorDetailGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImportErrorDetailGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImportErrorDetailGroupByArgs['orderBy'] }
        : { orderBy?: ImportErrorDetailGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImportErrorDetailGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportErrorDetailGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImportErrorDetail model
   */
  readonly fields: ImportErrorDetailFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImportErrorDetail.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImportErrorDetailClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    batch<T extends DailyImportBatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DailyImportBatchDefaultArgs<ExtArgs>>): Prisma__DailyImportBatchClient<$Result.GetResult<Prisma.$DailyImportBatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ImportErrorDetail model
   */
  interface ImportErrorDetailFieldRefs {
    readonly id: FieldRef<"ImportErrorDetail", 'String'>
    readonly batchId: FieldRef<"ImportErrorDetail", 'String'>
    readonly rowNumber: FieldRef<"ImportErrorDetail", 'Int'>
    readonly columnName: FieldRef<"ImportErrorDetail", 'String'>
    readonly errorType: FieldRef<"ImportErrorDetail", 'String'>
    readonly errorMessage: FieldRef<"ImportErrorDetail", 'String'>
    readonly rawValue: FieldRef<"ImportErrorDetail", 'String'>
    readonly suggestedFix: FieldRef<"ImportErrorDetail", 'String'>
    readonly severity: FieldRef<"ImportErrorDetail", 'String'>
    readonly isResolved: FieldRef<"ImportErrorDetail", 'Boolean'>
    readonly createdAt: FieldRef<"ImportErrorDetail", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImportErrorDetail findUnique
   */
  export type ImportErrorDetailFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * Filter, which ImportErrorDetail to fetch.
     */
    where: ImportErrorDetailWhereUniqueInput
  }

  /**
   * ImportErrorDetail findUniqueOrThrow
   */
  export type ImportErrorDetailFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * Filter, which ImportErrorDetail to fetch.
     */
    where: ImportErrorDetailWhereUniqueInput
  }

  /**
   * ImportErrorDetail findFirst
   */
  export type ImportErrorDetailFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * Filter, which ImportErrorDetail to fetch.
     */
    where?: ImportErrorDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportErrorDetails to fetch.
     */
    orderBy?: ImportErrorDetailOrderByWithRelationInput | ImportErrorDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportErrorDetails.
     */
    cursor?: ImportErrorDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportErrorDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportErrorDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportErrorDetails.
     */
    distinct?: ImportErrorDetailScalarFieldEnum | ImportErrorDetailScalarFieldEnum[]
  }

  /**
   * ImportErrorDetail findFirstOrThrow
   */
  export type ImportErrorDetailFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * Filter, which ImportErrorDetail to fetch.
     */
    where?: ImportErrorDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportErrorDetails to fetch.
     */
    orderBy?: ImportErrorDetailOrderByWithRelationInput | ImportErrorDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportErrorDetails.
     */
    cursor?: ImportErrorDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportErrorDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportErrorDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportErrorDetails.
     */
    distinct?: ImportErrorDetailScalarFieldEnum | ImportErrorDetailScalarFieldEnum[]
  }

  /**
   * ImportErrorDetail findMany
   */
  export type ImportErrorDetailFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * Filter, which ImportErrorDetails to fetch.
     */
    where?: ImportErrorDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportErrorDetails to fetch.
     */
    orderBy?: ImportErrorDetailOrderByWithRelationInput | ImportErrorDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImportErrorDetails.
     */
    cursor?: ImportErrorDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportErrorDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportErrorDetails.
     */
    skip?: number
    distinct?: ImportErrorDetailScalarFieldEnum | ImportErrorDetailScalarFieldEnum[]
  }

  /**
   * ImportErrorDetail create
   */
  export type ImportErrorDetailCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * The data needed to create a ImportErrorDetail.
     */
    data: XOR<ImportErrorDetailCreateInput, ImportErrorDetailUncheckedCreateInput>
  }

  /**
   * ImportErrorDetail createMany
   */
  export type ImportErrorDetailCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImportErrorDetails.
     */
    data: ImportErrorDetailCreateManyInput | ImportErrorDetailCreateManyInput[]
  }

  /**
   * ImportErrorDetail createManyAndReturn
   */
  export type ImportErrorDetailCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * The data used to create many ImportErrorDetails.
     */
    data: ImportErrorDetailCreateManyInput | ImportErrorDetailCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportErrorDetail update
   */
  export type ImportErrorDetailUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * The data needed to update a ImportErrorDetail.
     */
    data: XOR<ImportErrorDetailUpdateInput, ImportErrorDetailUncheckedUpdateInput>
    /**
     * Choose, which ImportErrorDetail to update.
     */
    where: ImportErrorDetailWhereUniqueInput
  }

  /**
   * ImportErrorDetail updateMany
   */
  export type ImportErrorDetailUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImportErrorDetails.
     */
    data: XOR<ImportErrorDetailUpdateManyMutationInput, ImportErrorDetailUncheckedUpdateManyInput>
    /**
     * Filter which ImportErrorDetails to update
     */
    where?: ImportErrorDetailWhereInput
    /**
     * Limit how many ImportErrorDetails to update.
     */
    limit?: number
  }

  /**
   * ImportErrorDetail updateManyAndReturn
   */
  export type ImportErrorDetailUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * The data used to update ImportErrorDetails.
     */
    data: XOR<ImportErrorDetailUpdateManyMutationInput, ImportErrorDetailUncheckedUpdateManyInput>
    /**
     * Filter which ImportErrorDetails to update
     */
    where?: ImportErrorDetailWhereInput
    /**
     * Limit how many ImportErrorDetails to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportErrorDetail upsert
   */
  export type ImportErrorDetailUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * The filter to search for the ImportErrorDetail to update in case it exists.
     */
    where: ImportErrorDetailWhereUniqueInput
    /**
     * In case the ImportErrorDetail found by the `where` argument doesn't exist, create a new ImportErrorDetail with this data.
     */
    create: XOR<ImportErrorDetailCreateInput, ImportErrorDetailUncheckedCreateInput>
    /**
     * In case the ImportErrorDetail was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImportErrorDetailUpdateInput, ImportErrorDetailUncheckedUpdateInput>
  }

  /**
   * ImportErrorDetail delete
   */
  export type ImportErrorDetailDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
    /**
     * Filter which ImportErrorDetail to delete.
     */
    where: ImportErrorDetailWhereUniqueInput
  }

  /**
   * ImportErrorDetail deleteMany
   */
  export type ImportErrorDetailDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportErrorDetails to delete
     */
    where?: ImportErrorDetailWhereInput
    /**
     * Limit how many ImportErrorDetails to delete.
     */
    limit?: number
  }

  /**
   * ImportErrorDetail without action
   */
  export type ImportErrorDetailDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportErrorDetail
     */
    select?: ImportErrorDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportErrorDetail
     */
    omit?: ImportErrorDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportErrorDetailInclude<ExtArgs> | null
  }


  /**
   * Model ImportSession
   */

  export type AggregateImportSession = {
    _count: ImportSessionCountAggregateOutputType | null
    _min: ImportSessionMinAggregateOutputType | null
    _max: ImportSessionMaxAggregateOutputType | null
  }

  export type ImportSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionToken: string | null
    status: string | null
    startedAt: Date | null
    lastActivity: Date | null
    expiresAt: Date | null
  }

  export type ImportSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionToken: string | null
    status: string | null
    startedAt: Date | null
    lastActivity: Date | null
    expiresAt: Date | null
  }

  export type ImportSessionCountAggregateOutputType = {
    id: number
    userId: number
    sessionToken: number
    status: number
    startedAt: number
    lastActivity: number
    expiresAt: number
    metadata: number
    _all: number
  }


  export type ImportSessionMinAggregateInputType = {
    id?: true
    userId?: true
    sessionToken?: true
    status?: true
    startedAt?: true
    lastActivity?: true
    expiresAt?: true
  }

  export type ImportSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionToken?: true
    status?: true
    startedAt?: true
    lastActivity?: true
    expiresAt?: true
  }

  export type ImportSessionCountAggregateInputType = {
    id?: true
    userId?: true
    sessionToken?: true
    status?: true
    startedAt?: true
    lastActivity?: true
    expiresAt?: true
    metadata?: true
    _all?: true
  }

  export type ImportSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportSession to aggregate.
     */
    where?: ImportSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportSessions to fetch.
     */
    orderBy?: ImportSessionOrderByWithRelationInput | ImportSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImportSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImportSessions
    **/
    _count?: true | ImportSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImportSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImportSessionMaxAggregateInputType
  }

  export type GetImportSessionAggregateType<T extends ImportSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateImportSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImportSession[P]>
      : GetScalarType<T[P], AggregateImportSession[P]>
  }




  export type ImportSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportSessionWhereInput
    orderBy?: ImportSessionOrderByWithAggregationInput | ImportSessionOrderByWithAggregationInput[]
    by: ImportSessionScalarFieldEnum[] | ImportSessionScalarFieldEnum
    having?: ImportSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImportSessionCountAggregateInputType | true
    _min?: ImportSessionMinAggregateInputType
    _max?: ImportSessionMaxAggregateInputType
  }

  export type ImportSessionGroupByOutputType = {
    id: string
    userId: string
    sessionToken: string
    status: string
    startedAt: Date
    lastActivity: Date
    expiresAt: Date | null
    metadata: JsonValue
    _count: ImportSessionCountAggregateOutputType | null
    _min: ImportSessionMinAggregateOutputType | null
    _max: ImportSessionMaxAggregateOutputType | null
  }

  type GetImportSessionGroupByPayload<T extends ImportSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImportSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImportSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImportSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ImportSessionGroupByOutputType[P]>
        }
      >
    >


  export type ImportSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionToken?: boolean
    status?: boolean
    startedAt?: boolean
    lastActivity?: boolean
    expiresAt?: boolean
    metadata?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importSession"]>

  export type ImportSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionToken?: boolean
    status?: boolean
    startedAt?: boolean
    lastActivity?: boolean
    expiresAt?: boolean
    metadata?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importSession"]>

  export type ImportSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionToken?: boolean
    status?: boolean
    startedAt?: boolean
    lastActivity?: boolean
    expiresAt?: boolean
    metadata?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importSession"]>

  export type ImportSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionToken?: boolean
    status?: boolean
    startedAt?: boolean
    lastActivity?: boolean
    expiresAt?: boolean
    metadata?: boolean
  }

  export type ImportSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionToken" | "status" | "startedAt" | "lastActivity" | "expiresAt" | "metadata", ExtArgs["result"]["importSession"]>
  export type ImportSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ImportSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ImportSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ImportSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImportSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      sessionToken: string
      status: string
      startedAt: Date
      lastActivity: Date
      expiresAt: Date | null
      metadata: Prisma.JsonValue
    }, ExtArgs["result"]["importSession"]>
    composites: {}
  }

  type ImportSessionGetPayload<S extends boolean | null | undefined | ImportSessionDefaultArgs> = $Result.GetResult<Prisma.$ImportSessionPayload, S>

  type ImportSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImportSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImportSessionCountAggregateInputType | true
    }

  export interface ImportSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImportSession'], meta: { name: 'ImportSession' } }
    /**
     * Find zero or one ImportSession that matches the filter.
     * @param {ImportSessionFindUniqueArgs} args - Arguments to find a ImportSession
     * @example
     * // Get one ImportSession
     * const importSession = await prisma.importSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImportSessionFindUniqueArgs>(args: SelectSubset<T, ImportSessionFindUniqueArgs<ExtArgs>>): Prisma__ImportSessionClient<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImportSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImportSessionFindUniqueOrThrowArgs} args - Arguments to find a ImportSession
     * @example
     * // Get one ImportSession
     * const importSession = await prisma.importSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImportSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ImportSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImportSessionClient<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSessionFindFirstArgs} args - Arguments to find a ImportSession
     * @example
     * // Get one ImportSession
     * const importSession = await prisma.importSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImportSessionFindFirstArgs>(args?: SelectSubset<T, ImportSessionFindFirstArgs<ExtArgs>>): Prisma__ImportSessionClient<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSessionFindFirstOrThrowArgs} args - Arguments to find a ImportSession
     * @example
     * // Get one ImportSession
     * const importSession = await prisma.importSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImportSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ImportSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImportSessionClient<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImportSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImportSessions
     * const importSessions = await prisma.importSession.findMany()
     * 
     * // Get first 10 ImportSessions
     * const importSessions = await prisma.importSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const importSessionWithIdOnly = await prisma.importSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImportSessionFindManyArgs>(args?: SelectSubset<T, ImportSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImportSession.
     * @param {ImportSessionCreateArgs} args - Arguments to create a ImportSession.
     * @example
     * // Create one ImportSession
     * const ImportSession = await prisma.importSession.create({
     *   data: {
     *     // ... data to create a ImportSession
     *   }
     * })
     * 
     */
    create<T extends ImportSessionCreateArgs>(args: SelectSubset<T, ImportSessionCreateArgs<ExtArgs>>): Prisma__ImportSessionClient<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImportSessions.
     * @param {ImportSessionCreateManyArgs} args - Arguments to create many ImportSessions.
     * @example
     * // Create many ImportSessions
     * const importSession = await prisma.importSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImportSessionCreateManyArgs>(args?: SelectSubset<T, ImportSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImportSessions and returns the data saved in the database.
     * @param {ImportSessionCreateManyAndReturnArgs} args - Arguments to create many ImportSessions.
     * @example
     * // Create many ImportSessions
     * const importSession = await prisma.importSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImportSessions and only return the `id`
     * const importSessionWithIdOnly = await prisma.importSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImportSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ImportSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImportSession.
     * @param {ImportSessionDeleteArgs} args - Arguments to delete one ImportSession.
     * @example
     * // Delete one ImportSession
     * const ImportSession = await prisma.importSession.delete({
     *   where: {
     *     // ... filter to delete one ImportSession
     *   }
     * })
     * 
     */
    delete<T extends ImportSessionDeleteArgs>(args: SelectSubset<T, ImportSessionDeleteArgs<ExtArgs>>): Prisma__ImportSessionClient<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImportSession.
     * @param {ImportSessionUpdateArgs} args - Arguments to update one ImportSession.
     * @example
     * // Update one ImportSession
     * const importSession = await prisma.importSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImportSessionUpdateArgs>(args: SelectSubset<T, ImportSessionUpdateArgs<ExtArgs>>): Prisma__ImportSessionClient<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImportSessions.
     * @param {ImportSessionDeleteManyArgs} args - Arguments to filter ImportSessions to delete.
     * @example
     * // Delete a few ImportSessions
     * const { count } = await prisma.importSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImportSessionDeleteManyArgs>(args?: SelectSubset<T, ImportSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImportSessions
     * const importSession = await prisma.importSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImportSessionUpdateManyArgs>(args: SelectSubset<T, ImportSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportSessions and returns the data updated in the database.
     * @param {ImportSessionUpdateManyAndReturnArgs} args - Arguments to update many ImportSessions.
     * @example
     * // Update many ImportSessions
     * const importSession = await prisma.importSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImportSessions and only return the `id`
     * const importSessionWithIdOnly = await prisma.importSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImportSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ImportSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImportSession.
     * @param {ImportSessionUpsertArgs} args - Arguments to update or create a ImportSession.
     * @example
     * // Update or create a ImportSession
     * const importSession = await prisma.importSession.upsert({
     *   create: {
     *     // ... data to create a ImportSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImportSession we want to update
     *   }
     * })
     */
    upsert<T extends ImportSessionUpsertArgs>(args: SelectSubset<T, ImportSessionUpsertArgs<ExtArgs>>): Prisma__ImportSessionClient<$Result.GetResult<Prisma.$ImportSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImportSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSessionCountArgs} args - Arguments to filter ImportSessions to count.
     * @example
     * // Count the number of ImportSessions
     * const count = await prisma.importSession.count({
     *   where: {
     *     // ... the filter for the ImportSessions we want to count
     *   }
     * })
    **/
    count<T extends ImportSessionCountArgs>(
      args?: Subset<T, ImportSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImportSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImportSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImportSessionAggregateArgs>(args: Subset<T, ImportSessionAggregateArgs>): Prisma.PrismaPromise<GetImportSessionAggregateType<T>>

    /**
     * Group by ImportSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImportSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImportSessionGroupByArgs['orderBy'] }
        : { orderBy?: ImportSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImportSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImportSession model
   */
  readonly fields: ImportSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImportSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImportSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ImportSession model
   */
  interface ImportSessionFieldRefs {
    readonly id: FieldRef<"ImportSession", 'String'>
    readonly userId: FieldRef<"ImportSession", 'String'>
    readonly sessionToken: FieldRef<"ImportSession", 'String'>
    readonly status: FieldRef<"ImportSession", 'String'>
    readonly startedAt: FieldRef<"ImportSession", 'DateTime'>
    readonly lastActivity: FieldRef<"ImportSession", 'DateTime'>
    readonly expiresAt: FieldRef<"ImportSession", 'DateTime'>
    readonly metadata: FieldRef<"ImportSession", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * ImportSession findUnique
   */
  export type ImportSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * Filter, which ImportSession to fetch.
     */
    where: ImportSessionWhereUniqueInput
  }

  /**
   * ImportSession findUniqueOrThrow
   */
  export type ImportSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * Filter, which ImportSession to fetch.
     */
    where: ImportSessionWhereUniqueInput
  }

  /**
   * ImportSession findFirst
   */
  export type ImportSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * Filter, which ImportSession to fetch.
     */
    where?: ImportSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportSessions to fetch.
     */
    orderBy?: ImportSessionOrderByWithRelationInput | ImportSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportSessions.
     */
    cursor?: ImportSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportSessions.
     */
    distinct?: ImportSessionScalarFieldEnum | ImportSessionScalarFieldEnum[]
  }

  /**
   * ImportSession findFirstOrThrow
   */
  export type ImportSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * Filter, which ImportSession to fetch.
     */
    where?: ImportSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportSessions to fetch.
     */
    orderBy?: ImportSessionOrderByWithRelationInput | ImportSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportSessions.
     */
    cursor?: ImportSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportSessions.
     */
    distinct?: ImportSessionScalarFieldEnum | ImportSessionScalarFieldEnum[]
  }

  /**
   * ImportSession findMany
   */
  export type ImportSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * Filter, which ImportSessions to fetch.
     */
    where?: ImportSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportSessions to fetch.
     */
    orderBy?: ImportSessionOrderByWithRelationInput | ImportSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImportSessions.
     */
    cursor?: ImportSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportSessions.
     */
    skip?: number
    distinct?: ImportSessionScalarFieldEnum | ImportSessionScalarFieldEnum[]
  }

  /**
   * ImportSession create
   */
  export type ImportSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ImportSession.
     */
    data: XOR<ImportSessionCreateInput, ImportSessionUncheckedCreateInput>
  }

  /**
   * ImportSession createMany
   */
  export type ImportSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImportSessions.
     */
    data: ImportSessionCreateManyInput | ImportSessionCreateManyInput[]
  }

  /**
   * ImportSession createManyAndReturn
   */
  export type ImportSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ImportSessions.
     */
    data: ImportSessionCreateManyInput | ImportSessionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportSession update
   */
  export type ImportSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ImportSession.
     */
    data: XOR<ImportSessionUpdateInput, ImportSessionUncheckedUpdateInput>
    /**
     * Choose, which ImportSession to update.
     */
    where: ImportSessionWhereUniqueInput
  }

  /**
   * ImportSession updateMany
   */
  export type ImportSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImportSessions.
     */
    data: XOR<ImportSessionUpdateManyMutationInput, ImportSessionUncheckedUpdateManyInput>
    /**
     * Filter which ImportSessions to update
     */
    where?: ImportSessionWhereInput
    /**
     * Limit how many ImportSessions to update.
     */
    limit?: number
  }

  /**
   * ImportSession updateManyAndReturn
   */
  export type ImportSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * The data used to update ImportSessions.
     */
    data: XOR<ImportSessionUpdateManyMutationInput, ImportSessionUncheckedUpdateManyInput>
    /**
     * Filter which ImportSessions to update
     */
    where?: ImportSessionWhereInput
    /**
     * Limit how many ImportSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportSession upsert
   */
  export type ImportSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ImportSession to update in case it exists.
     */
    where: ImportSessionWhereUniqueInput
    /**
     * In case the ImportSession found by the `where` argument doesn't exist, create a new ImportSession with this data.
     */
    create: XOR<ImportSessionCreateInput, ImportSessionUncheckedCreateInput>
    /**
     * In case the ImportSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImportSessionUpdateInput, ImportSessionUncheckedUpdateInput>
  }

  /**
   * ImportSession delete
   */
  export type ImportSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
    /**
     * Filter which ImportSession to delete.
     */
    where: ImportSessionWhereUniqueInput
  }

  /**
   * ImportSession deleteMany
   */
  export type ImportSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportSessions to delete
     */
    where?: ImportSessionWhereInput
    /**
     * Limit how many ImportSessions to delete.
     */
    limit?: number
  }

  /**
   * ImportSession without action
   */
  export type ImportSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSession
     */
    select?: ImportSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSession
     */
    omit?: ImportSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSessionInclude<ExtArgs> | null
  }


  /**
   * Model ValidationResult
   */

  export type AggregateValidationResult = {
    _count: ValidationResultCountAggregateOutputType | null
    _avg: ValidationResultAvgAggregateOutputType | null
    _sum: ValidationResultSumAggregateOutputType | null
    _min: ValidationResultMinAggregateOutputType | null
    _max: ValidationResultMaxAggregateOutputType | null
  }

  export type ValidationResultAvgAggregateOutputType = {
    totalRows: number | null
    validRows: number | null
    invalidRows: number | null
  }

  export type ValidationResultSumAggregateOutputType = {
    totalRows: number | null
    validRows: number | null
    invalidRows: number | null
  }

  export type ValidationResultMinAggregateOutputType = {
    id: string | null
    userId: string | null
    filename: string | null
    fileChecksum: string | null
    validationStatus: string | null
    totalRows: number | null
    validRows: number | null
    invalidRows: number | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type ValidationResultMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    filename: string | null
    fileChecksum: string | null
    validationStatus: string | null
    totalRows: number | null
    validRows: number | null
    invalidRows: number | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type ValidationResultCountAggregateOutputType = {
    id: number
    userId: number
    filename: number
    fileChecksum: number
    validationStatus: number
    totalRows: number
    validRows: number
    invalidRows: number
    errors: number
    warnings: number
    previewData: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type ValidationResultAvgAggregateInputType = {
    totalRows?: true
    validRows?: true
    invalidRows?: true
  }

  export type ValidationResultSumAggregateInputType = {
    totalRows?: true
    validRows?: true
    invalidRows?: true
  }

  export type ValidationResultMinAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    fileChecksum?: true
    validationStatus?: true
    totalRows?: true
    validRows?: true
    invalidRows?: true
    createdAt?: true
    expiresAt?: true
  }

  export type ValidationResultMaxAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    fileChecksum?: true
    validationStatus?: true
    totalRows?: true
    validRows?: true
    invalidRows?: true
    createdAt?: true
    expiresAt?: true
  }

  export type ValidationResultCountAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    fileChecksum?: true
    validationStatus?: true
    totalRows?: true
    validRows?: true
    invalidRows?: true
    errors?: true
    warnings?: true
    previewData?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type ValidationResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidationResult to aggregate.
     */
    where?: ValidationResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationResults to fetch.
     */
    orderBy?: ValidationResultOrderByWithRelationInput | ValidationResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ValidationResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ValidationResults
    **/
    _count?: true | ValidationResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ValidationResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ValidationResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ValidationResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ValidationResultMaxAggregateInputType
  }

  export type GetValidationResultAggregateType<T extends ValidationResultAggregateArgs> = {
        [P in keyof T & keyof AggregateValidationResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateValidationResult[P]>
      : GetScalarType<T[P], AggregateValidationResult[P]>
  }




  export type ValidationResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ValidationResultWhereInput
    orderBy?: ValidationResultOrderByWithAggregationInput | ValidationResultOrderByWithAggregationInput[]
    by: ValidationResultScalarFieldEnum[] | ValidationResultScalarFieldEnum
    having?: ValidationResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ValidationResultCountAggregateInputType | true
    _avg?: ValidationResultAvgAggregateInputType
    _sum?: ValidationResultSumAggregateInputType
    _min?: ValidationResultMinAggregateInputType
    _max?: ValidationResultMaxAggregateInputType
  }

  export type ValidationResultGroupByOutputType = {
    id: string
    userId: string
    filename: string
    fileChecksum: string
    validationStatus: string
    totalRows: number
    validRows: number
    invalidRows: number
    errors: JsonValue
    warnings: JsonValue
    previewData: JsonValue
    createdAt: Date
    expiresAt: Date
    _count: ValidationResultCountAggregateOutputType | null
    _avg: ValidationResultAvgAggregateOutputType | null
    _sum: ValidationResultSumAggregateOutputType | null
    _min: ValidationResultMinAggregateOutputType | null
    _max: ValidationResultMaxAggregateOutputType | null
  }

  type GetValidationResultGroupByPayload<T extends ValidationResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ValidationResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ValidationResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ValidationResultGroupByOutputType[P]>
            : GetScalarType<T[P], ValidationResultGroupByOutputType[P]>
        }
      >
    >


  export type ValidationResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    filename?: boolean
    fileChecksum?: boolean
    validationStatus?: boolean
    totalRows?: boolean
    validRows?: boolean
    invalidRows?: boolean
    errors?: boolean
    warnings?: boolean
    previewData?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["validationResult"]>

  export type ValidationResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    filename?: boolean
    fileChecksum?: boolean
    validationStatus?: boolean
    totalRows?: boolean
    validRows?: boolean
    invalidRows?: boolean
    errors?: boolean
    warnings?: boolean
    previewData?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["validationResult"]>

  export type ValidationResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    filename?: boolean
    fileChecksum?: boolean
    validationStatus?: boolean
    totalRows?: boolean
    validRows?: boolean
    invalidRows?: boolean
    errors?: boolean
    warnings?: boolean
    previewData?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["validationResult"]>

  export type ValidationResultSelectScalar = {
    id?: boolean
    userId?: boolean
    filename?: boolean
    fileChecksum?: boolean
    validationStatus?: boolean
    totalRows?: boolean
    validRows?: boolean
    invalidRows?: boolean
    errors?: boolean
    warnings?: boolean
    previewData?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }

  export type ValidationResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "filename" | "fileChecksum" | "validationStatus" | "totalRows" | "validRows" | "invalidRows" | "errors" | "warnings" | "previewData" | "createdAt" | "expiresAt", ExtArgs["result"]["validationResult"]>
  export type ValidationResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ValidationResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ValidationResultIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ValidationResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ValidationResult"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      filename: string
      fileChecksum: string
      validationStatus: string
      totalRows: number
      validRows: number
      invalidRows: number
      errors: Prisma.JsonValue
      warnings: Prisma.JsonValue
      previewData: Prisma.JsonValue
      createdAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["validationResult"]>
    composites: {}
  }

  type ValidationResultGetPayload<S extends boolean | null | undefined | ValidationResultDefaultArgs> = $Result.GetResult<Prisma.$ValidationResultPayload, S>

  type ValidationResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ValidationResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ValidationResultCountAggregateInputType | true
    }

  export interface ValidationResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ValidationResult'], meta: { name: 'ValidationResult' } }
    /**
     * Find zero or one ValidationResult that matches the filter.
     * @param {ValidationResultFindUniqueArgs} args - Arguments to find a ValidationResult
     * @example
     * // Get one ValidationResult
     * const validationResult = await prisma.validationResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ValidationResultFindUniqueArgs>(args: SelectSubset<T, ValidationResultFindUniqueArgs<ExtArgs>>): Prisma__ValidationResultClient<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ValidationResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ValidationResultFindUniqueOrThrowArgs} args - Arguments to find a ValidationResult
     * @example
     * // Get one ValidationResult
     * const validationResult = await prisma.validationResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ValidationResultFindUniqueOrThrowArgs>(args: SelectSubset<T, ValidationResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ValidationResultClient<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ValidationResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationResultFindFirstArgs} args - Arguments to find a ValidationResult
     * @example
     * // Get one ValidationResult
     * const validationResult = await prisma.validationResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ValidationResultFindFirstArgs>(args?: SelectSubset<T, ValidationResultFindFirstArgs<ExtArgs>>): Prisma__ValidationResultClient<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ValidationResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationResultFindFirstOrThrowArgs} args - Arguments to find a ValidationResult
     * @example
     * // Get one ValidationResult
     * const validationResult = await prisma.validationResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ValidationResultFindFirstOrThrowArgs>(args?: SelectSubset<T, ValidationResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__ValidationResultClient<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ValidationResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ValidationResults
     * const validationResults = await prisma.validationResult.findMany()
     * 
     * // Get first 10 ValidationResults
     * const validationResults = await prisma.validationResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const validationResultWithIdOnly = await prisma.validationResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ValidationResultFindManyArgs>(args?: SelectSubset<T, ValidationResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ValidationResult.
     * @param {ValidationResultCreateArgs} args - Arguments to create a ValidationResult.
     * @example
     * // Create one ValidationResult
     * const ValidationResult = await prisma.validationResult.create({
     *   data: {
     *     // ... data to create a ValidationResult
     *   }
     * })
     * 
     */
    create<T extends ValidationResultCreateArgs>(args: SelectSubset<T, ValidationResultCreateArgs<ExtArgs>>): Prisma__ValidationResultClient<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ValidationResults.
     * @param {ValidationResultCreateManyArgs} args - Arguments to create many ValidationResults.
     * @example
     * // Create many ValidationResults
     * const validationResult = await prisma.validationResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ValidationResultCreateManyArgs>(args?: SelectSubset<T, ValidationResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ValidationResults and returns the data saved in the database.
     * @param {ValidationResultCreateManyAndReturnArgs} args - Arguments to create many ValidationResults.
     * @example
     * // Create many ValidationResults
     * const validationResult = await prisma.validationResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ValidationResults and only return the `id`
     * const validationResultWithIdOnly = await prisma.validationResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ValidationResultCreateManyAndReturnArgs>(args?: SelectSubset<T, ValidationResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ValidationResult.
     * @param {ValidationResultDeleteArgs} args - Arguments to delete one ValidationResult.
     * @example
     * // Delete one ValidationResult
     * const ValidationResult = await prisma.validationResult.delete({
     *   where: {
     *     // ... filter to delete one ValidationResult
     *   }
     * })
     * 
     */
    delete<T extends ValidationResultDeleteArgs>(args: SelectSubset<T, ValidationResultDeleteArgs<ExtArgs>>): Prisma__ValidationResultClient<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ValidationResult.
     * @param {ValidationResultUpdateArgs} args - Arguments to update one ValidationResult.
     * @example
     * // Update one ValidationResult
     * const validationResult = await prisma.validationResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ValidationResultUpdateArgs>(args: SelectSubset<T, ValidationResultUpdateArgs<ExtArgs>>): Prisma__ValidationResultClient<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ValidationResults.
     * @param {ValidationResultDeleteManyArgs} args - Arguments to filter ValidationResults to delete.
     * @example
     * // Delete a few ValidationResults
     * const { count } = await prisma.validationResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ValidationResultDeleteManyArgs>(args?: SelectSubset<T, ValidationResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ValidationResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ValidationResults
     * const validationResult = await prisma.validationResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ValidationResultUpdateManyArgs>(args: SelectSubset<T, ValidationResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ValidationResults and returns the data updated in the database.
     * @param {ValidationResultUpdateManyAndReturnArgs} args - Arguments to update many ValidationResults.
     * @example
     * // Update many ValidationResults
     * const validationResult = await prisma.validationResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ValidationResults and only return the `id`
     * const validationResultWithIdOnly = await prisma.validationResult.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ValidationResultUpdateManyAndReturnArgs>(args: SelectSubset<T, ValidationResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ValidationResult.
     * @param {ValidationResultUpsertArgs} args - Arguments to update or create a ValidationResult.
     * @example
     * // Update or create a ValidationResult
     * const validationResult = await prisma.validationResult.upsert({
     *   create: {
     *     // ... data to create a ValidationResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ValidationResult we want to update
     *   }
     * })
     */
    upsert<T extends ValidationResultUpsertArgs>(args: SelectSubset<T, ValidationResultUpsertArgs<ExtArgs>>): Prisma__ValidationResultClient<$Result.GetResult<Prisma.$ValidationResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ValidationResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationResultCountArgs} args - Arguments to filter ValidationResults to count.
     * @example
     * // Count the number of ValidationResults
     * const count = await prisma.validationResult.count({
     *   where: {
     *     // ... the filter for the ValidationResults we want to count
     *   }
     * })
    **/
    count<T extends ValidationResultCountArgs>(
      args?: Subset<T, ValidationResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ValidationResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ValidationResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ValidationResultAggregateArgs>(args: Subset<T, ValidationResultAggregateArgs>): Prisma.PrismaPromise<GetValidationResultAggregateType<T>>

    /**
     * Group by ValidationResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ValidationResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ValidationResultGroupByArgs['orderBy'] }
        : { orderBy?: ValidationResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ValidationResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetValidationResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ValidationResult model
   */
  readonly fields: ValidationResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ValidationResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ValidationResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ValidationResult model
   */
  interface ValidationResultFieldRefs {
    readonly id: FieldRef<"ValidationResult", 'String'>
    readonly userId: FieldRef<"ValidationResult", 'String'>
    readonly filename: FieldRef<"ValidationResult", 'String'>
    readonly fileChecksum: FieldRef<"ValidationResult", 'String'>
    readonly validationStatus: FieldRef<"ValidationResult", 'String'>
    readonly totalRows: FieldRef<"ValidationResult", 'Int'>
    readonly validRows: FieldRef<"ValidationResult", 'Int'>
    readonly invalidRows: FieldRef<"ValidationResult", 'Int'>
    readonly errors: FieldRef<"ValidationResult", 'Json'>
    readonly warnings: FieldRef<"ValidationResult", 'Json'>
    readonly previewData: FieldRef<"ValidationResult", 'Json'>
    readonly createdAt: FieldRef<"ValidationResult", 'DateTime'>
    readonly expiresAt: FieldRef<"ValidationResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ValidationResult findUnique
   */
  export type ValidationResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * Filter, which ValidationResult to fetch.
     */
    where: ValidationResultWhereUniqueInput
  }

  /**
   * ValidationResult findUniqueOrThrow
   */
  export type ValidationResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * Filter, which ValidationResult to fetch.
     */
    where: ValidationResultWhereUniqueInput
  }

  /**
   * ValidationResult findFirst
   */
  export type ValidationResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * Filter, which ValidationResult to fetch.
     */
    where?: ValidationResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationResults to fetch.
     */
    orderBy?: ValidationResultOrderByWithRelationInput | ValidationResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidationResults.
     */
    cursor?: ValidationResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidationResults.
     */
    distinct?: ValidationResultScalarFieldEnum | ValidationResultScalarFieldEnum[]
  }

  /**
   * ValidationResult findFirstOrThrow
   */
  export type ValidationResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * Filter, which ValidationResult to fetch.
     */
    where?: ValidationResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationResults to fetch.
     */
    orderBy?: ValidationResultOrderByWithRelationInput | ValidationResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidationResults.
     */
    cursor?: ValidationResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidationResults.
     */
    distinct?: ValidationResultScalarFieldEnum | ValidationResultScalarFieldEnum[]
  }

  /**
   * ValidationResult findMany
   */
  export type ValidationResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * Filter, which ValidationResults to fetch.
     */
    where?: ValidationResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationResults to fetch.
     */
    orderBy?: ValidationResultOrderByWithRelationInput | ValidationResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ValidationResults.
     */
    cursor?: ValidationResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationResults.
     */
    skip?: number
    distinct?: ValidationResultScalarFieldEnum | ValidationResultScalarFieldEnum[]
  }

  /**
   * ValidationResult create
   */
  export type ValidationResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * The data needed to create a ValidationResult.
     */
    data: XOR<ValidationResultCreateInput, ValidationResultUncheckedCreateInput>
  }

  /**
   * ValidationResult createMany
   */
  export type ValidationResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ValidationResults.
     */
    data: ValidationResultCreateManyInput | ValidationResultCreateManyInput[]
  }

  /**
   * ValidationResult createManyAndReturn
   */
  export type ValidationResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * The data used to create many ValidationResults.
     */
    data: ValidationResultCreateManyInput | ValidationResultCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ValidationResult update
   */
  export type ValidationResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * The data needed to update a ValidationResult.
     */
    data: XOR<ValidationResultUpdateInput, ValidationResultUncheckedUpdateInput>
    /**
     * Choose, which ValidationResult to update.
     */
    where: ValidationResultWhereUniqueInput
  }

  /**
   * ValidationResult updateMany
   */
  export type ValidationResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ValidationResults.
     */
    data: XOR<ValidationResultUpdateManyMutationInput, ValidationResultUncheckedUpdateManyInput>
    /**
     * Filter which ValidationResults to update
     */
    where?: ValidationResultWhereInput
    /**
     * Limit how many ValidationResults to update.
     */
    limit?: number
  }

  /**
   * ValidationResult updateManyAndReturn
   */
  export type ValidationResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * The data used to update ValidationResults.
     */
    data: XOR<ValidationResultUpdateManyMutationInput, ValidationResultUncheckedUpdateManyInput>
    /**
     * Filter which ValidationResults to update
     */
    where?: ValidationResultWhereInput
    /**
     * Limit how many ValidationResults to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ValidationResult upsert
   */
  export type ValidationResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * The filter to search for the ValidationResult to update in case it exists.
     */
    where: ValidationResultWhereUniqueInput
    /**
     * In case the ValidationResult found by the `where` argument doesn't exist, create a new ValidationResult with this data.
     */
    create: XOR<ValidationResultCreateInput, ValidationResultUncheckedCreateInput>
    /**
     * In case the ValidationResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ValidationResultUpdateInput, ValidationResultUncheckedUpdateInput>
  }

  /**
   * ValidationResult delete
   */
  export type ValidationResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
    /**
     * Filter which ValidationResult to delete.
     */
    where: ValidationResultWhereUniqueInput
  }

  /**
   * ValidationResult deleteMany
   */
  export type ValidationResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidationResults to delete
     */
    where?: ValidationResultWhereInput
    /**
     * Limit how many ValidationResults to delete.
     */
    limit?: number
  }

  /**
   * ValidationResult without action
   */
  export type ValidationResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationResult
     */
    select?: ValidationResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidationResult
     */
    omit?: ValidationResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationResultInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CourtScalarFieldEnum: {
    id: 'id',
    courtName: 'courtName',
    courtCode: 'courtCode',
    courtType: 'courtType',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    originalCode: 'originalCode',
    originalNumber: 'originalNumber',
    originalYear: 'originalYear'
  };

  export type CourtScalarFieldEnum = (typeof CourtScalarFieldEnum)[keyof typeof CourtScalarFieldEnum]


  export const JudgeScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    firstName: 'firstName',
    lastName: 'lastName',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JudgeScalarFieldEnum = (typeof JudgeScalarFieldEnum)[keyof typeof JudgeScalarFieldEnum]


  export const CaseTypeScalarFieldEnum: {
    id: 'id',
    caseTypeName: 'caseTypeName',
    caseTypeCode: 'caseTypeCode',
    description: 'description',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type CaseTypeScalarFieldEnum = (typeof CaseTypeScalarFieldEnum)[keyof typeof CaseTypeScalarFieldEnum]


  export const CaseScalarFieldEnum: {
    id: 'id',
    caseNumber: 'caseNumber',
    courtName: 'courtName',
    caseTypeId: 'caseTypeId',
    filedDate: 'filedDate',
    originalCourtId: 'originalCourtId',
    originalCaseNumber: 'originalCaseNumber',
    originalYear: 'originalYear',
    parties: 'parties',
    status: 'status',
    lastActivityDate: 'lastActivityDate',
    totalActivities: 'totalActivities',
    hasLegalRepresentation: 'hasLegalRepresentation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    caseidType: 'caseidType',
    caseidNo: 'caseidNo',
    maleApplicant: 'maleApplicant',
    femaleApplicant: 'femaleApplicant',
    organizationApplicant: 'organizationApplicant',
    maleDefendant: 'maleDefendant',
    femaleDefendant: 'femaleDefendant',
    organizationDefendant: 'organizationDefendant'
  };

  export type CaseScalarFieldEnum = (typeof CaseScalarFieldEnum)[keyof typeof CaseScalarFieldEnum]


  export const CaseActivityScalarFieldEnum: {
    id: 'id',
    caseId: 'caseId',
    activityDate: 'activityDate',
    activityType: 'activityType',
    outcome: 'outcome',
    reasonForAdjournment: 'reasonForAdjournment',
    nextHearingDate: 'nextHearingDate',
    primaryJudgeId: 'primaryJudgeId',
    hasLegalRepresentation: 'hasLegalRepresentation',
    applicantWitnesses: 'applicantWitnesses',
    defendantWitnesses: 'defendantWitnesses',
    custodyStatus: 'custodyStatus',
    details: 'details',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    judge1: 'judge1',
    judge2: 'judge2',
    judge3: 'judge3',
    judge4: 'judge4',
    judge5: 'judge5',
    judge6: 'judge6',
    judge7: 'judge7',
    comingFor: 'comingFor',
    legalRepString: 'legalRepString',
    custodyNumeric: 'custodyNumeric',
    otherDetails: 'otherDetails'
  };

  export type CaseActivityScalarFieldEnum = (typeof CaseActivityScalarFieldEnum)[keyof typeof CaseActivityScalarFieldEnum]


  export const CaseJudgeAssignmentScalarFieldEnum: {
    caseId: 'caseId',
    judgeId: 'judgeId',
    assignedAt: 'assignedAt',
    isPrimary: 'isPrimary'
  };

  export type CaseJudgeAssignmentScalarFieldEnum = (typeof CaseJudgeAssignmentScalarFieldEnum)[keyof typeof CaseJudgeAssignmentScalarFieldEnum]


  export const DailyImportBatchScalarFieldEnum: {
    id: 'id',
    importDate: 'importDate',
    filename: 'filename',
    fileSize: 'fileSize',
    fileChecksum: 'fileChecksum',
    totalRecords: 'totalRecords',
    successfulRecords: 'successfulRecords',
    failedRecords: 'failedRecords',
    errorLogs: 'errorLogs',
    status: 'status',
    estimatedCompletionTime: 'estimatedCompletionTime',
    processingStartTime: 'processingStartTime',
    userConfig: 'userConfig',
    validationWarnings: 'validationWarnings',
    createdAt: 'createdAt',
    completedAt: 'completedAt',
    createdBy: 'createdBy'
  };

  export type DailyImportBatchScalarFieldEnum = (typeof DailyImportBatchScalarFieldEnum)[keyof typeof DailyImportBatchScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ImportProgressScalarFieldEnum: {
    id: 'id',
    batchId: 'batchId',
    progressPercentage: 'progressPercentage',
    currentStep: 'currentStep',
    message: 'message',
    recordsProcessed: 'recordsProcessed',
    totalRecords: 'totalRecords',
    errorsCount: 'errorsCount',
    warningsCount: 'warningsCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ImportProgressScalarFieldEnum = (typeof ImportProgressScalarFieldEnum)[keyof typeof ImportProgressScalarFieldEnum]


  export const ImportErrorDetailScalarFieldEnum: {
    id: 'id',
    batchId: 'batchId',
    rowNumber: 'rowNumber',
    columnName: 'columnName',
    errorType: 'errorType',
    errorMessage: 'errorMessage',
    rawValue: 'rawValue',
    suggestedFix: 'suggestedFix',
    severity: 'severity',
    isResolved: 'isResolved',
    createdAt: 'createdAt'
  };

  export type ImportErrorDetailScalarFieldEnum = (typeof ImportErrorDetailScalarFieldEnum)[keyof typeof ImportErrorDetailScalarFieldEnum]


  export const ImportSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionToken: 'sessionToken',
    status: 'status',
    startedAt: 'startedAt',
    lastActivity: 'lastActivity',
    expiresAt: 'expiresAt',
    metadata: 'metadata'
  };

  export type ImportSessionScalarFieldEnum = (typeof ImportSessionScalarFieldEnum)[keyof typeof ImportSessionScalarFieldEnum]


  export const ValidationResultScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    filename: 'filename',
    fileChecksum: 'fileChecksum',
    validationStatus: 'validationStatus',
    totalRows: 'totalRows',
    validRows: 'validRows',
    invalidRows: 'invalidRows',
    errors: 'errors',
    warnings: 'warnings',
    previewData: 'previewData',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type ValidationResultScalarFieldEnum = (typeof ValidationResultScalarFieldEnum)[keyof typeof ValidationResultScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type CourtWhereInput = {
    AND?: CourtWhereInput | CourtWhereInput[]
    OR?: CourtWhereInput[]
    NOT?: CourtWhereInput | CourtWhereInput[]
    id?: StringFilter<"Court"> | string
    courtName?: StringFilter<"Court"> | string
    courtCode?: StringFilter<"Court"> | string
    courtType?: StringFilter<"Court"> | string
    isActive?: BoolFilter<"Court"> | boolean
    createdAt?: DateTimeFilter<"Court"> | Date | string
    updatedAt?: DateTimeFilter<"Court"> | Date | string
    originalCode?: StringNullableFilter<"Court"> | string | null
    originalNumber?: StringNullableFilter<"Court"> | string | null
    originalYear?: IntNullableFilter<"Court"> | number | null
    cases?: CaseListRelationFilter
  }

  export type CourtOrderByWithRelationInput = {
    id?: SortOrder
    courtName?: SortOrder
    courtCode?: SortOrder
    courtType?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    originalCode?: SortOrderInput | SortOrder
    originalNumber?: SortOrderInput | SortOrder
    originalYear?: SortOrderInput | SortOrder
    cases?: CaseOrderByRelationAggregateInput
  }

  export type CourtWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    courtCode?: string
    AND?: CourtWhereInput | CourtWhereInput[]
    OR?: CourtWhereInput[]
    NOT?: CourtWhereInput | CourtWhereInput[]
    courtName?: StringFilter<"Court"> | string
    courtType?: StringFilter<"Court"> | string
    isActive?: BoolFilter<"Court"> | boolean
    createdAt?: DateTimeFilter<"Court"> | Date | string
    updatedAt?: DateTimeFilter<"Court"> | Date | string
    originalCode?: StringNullableFilter<"Court"> | string | null
    originalNumber?: StringNullableFilter<"Court"> | string | null
    originalYear?: IntNullableFilter<"Court"> | number | null
    cases?: CaseListRelationFilter
  }, "id" | "courtCode">

  export type CourtOrderByWithAggregationInput = {
    id?: SortOrder
    courtName?: SortOrder
    courtCode?: SortOrder
    courtType?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    originalCode?: SortOrderInput | SortOrder
    originalNumber?: SortOrderInput | SortOrder
    originalYear?: SortOrderInput | SortOrder
    _count?: CourtCountOrderByAggregateInput
    _avg?: CourtAvgOrderByAggregateInput
    _max?: CourtMaxOrderByAggregateInput
    _min?: CourtMinOrderByAggregateInput
    _sum?: CourtSumOrderByAggregateInput
  }

  export type CourtScalarWhereWithAggregatesInput = {
    AND?: CourtScalarWhereWithAggregatesInput | CourtScalarWhereWithAggregatesInput[]
    OR?: CourtScalarWhereWithAggregatesInput[]
    NOT?: CourtScalarWhereWithAggregatesInput | CourtScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Court"> | string
    courtName?: StringWithAggregatesFilter<"Court"> | string
    courtCode?: StringWithAggregatesFilter<"Court"> | string
    courtType?: StringWithAggregatesFilter<"Court"> | string
    isActive?: BoolWithAggregatesFilter<"Court"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Court"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Court"> | Date | string
    originalCode?: StringNullableWithAggregatesFilter<"Court"> | string | null
    originalNumber?: StringNullableWithAggregatesFilter<"Court"> | string | null
    originalYear?: IntNullableWithAggregatesFilter<"Court"> | number | null
  }

  export type JudgeWhereInput = {
    AND?: JudgeWhereInput | JudgeWhereInput[]
    OR?: JudgeWhereInput[]
    NOT?: JudgeWhereInput | JudgeWhereInput[]
    id?: StringFilter<"Judge"> | string
    fullName?: StringFilter<"Judge"> | string
    firstName?: StringFilter<"Judge"> | string
    lastName?: StringFilter<"Judge"> | string
    isActive?: BoolFilter<"Judge"> | boolean
    createdAt?: DateTimeFilter<"Judge"> | Date | string
    updatedAt?: DateTimeFilter<"Judge"> | Date | string
    caseActivities?: CaseActivityListRelationFilter
    caseAssignments?: CaseJudgeAssignmentListRelationFilter
  }

  export type JudgeOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    caseActivities?: CaseActivityOrderByRelationAggregateInput
    caseAssignments?: CaseJudgeAssignmentOrderByRelationAggregateInput
  }

  export type JudgeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JudgeWhereInput | JudgeWhereInput[]
    OR?: JudgeWhereInput[]
    NOT?: JudgeWhereInput | JudgeWhereInput[]
    fullName?: StringFilter<"Judge"> | string
    firstName?: StringFilter<"Judge"> | string
    lastName?: StringFilter<"Judge"> | string
    isActive?: BoolFilter<"Judge"> | boolean
    createdAt?: DateTimeFilter<"Judge"> | Date | string
    updatedAt?: DateTimeFilter<"Judge"> | Date | string
    caseActivities?: CaseActivityListRelationFilter
    caseAssignments?: CaseJudgeAssignmentListRelationFilter
  }, "id">

  export type JudgeOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JudgeCountOrderByAggregateInput
    _max?: JudgeMaxOrderByAggregateInput
    _min?: JudgeMinOrderByAggregateInput
  }

  export type JudgeScalarWhereWithAggregatesInput = {
    AND?: JudgeScalarWhereWithAggregatesInput | JudgeScalarWhereWithAggregatesInput[]
    OR?: JudgeScalarWhereWithAggregatesInput[]
    NOT?: JudgeScalarWhereWithAggregatesInput | JudgeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Judge"> | string
    fullName?: StringWithAggregatesFilter<"Judge"> | string
    firstName?: StringWithAggregatesFilter<"Judge"> | string
    lastName?: StringWithAggregatesFilter<"Judge"> | string
    isActive?: BoolWithAggregatesFilter<"Judge"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Judge"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Judge"> | Date | string
  }

  export type CaseTypeWhereInput = {
    AND?: CaseTypeWhereInput | CaseTypeWhereInput[]
    OR?: CaseTypeWhereInput[]
    NOT?: CaseTypeWhereInput | CaseTypeWhereInput[]
    id?: StringFilter<"CaseType"> | string
    caseTypeName?: StringFilter<"CaseType"> | string
    caseTypeCode?: StringFilter<"CaseType"> | string
    description?: StringNullableFilter<"CaseType"> | string | null
    isActive?: BoolFilter<"CaseType"> | boolean
    createdAt?: DateTimeFilter<"CaseType"> | Date | string
    cases?: CaseListRelationFilter
  }

  export type CaseTypeOrderByWithRelationInput = {
    id?: SortOrder
    caseTypeName?: SortOrder
    caseTypeCode?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    cases?: CaseOrderByRelationAggregateInput
  }

  export type CaseTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    caseTypeCode?: string
    AND?: CaseTypeWhereInput | CaseTypeWhereInput[]
    OR?: CaseTypeWhereInput[]
    NOT?: CaseTypeWhereInput | CaseTypeWhereInput[]
    caseTypeName?: StringFilter<"CaseType"> | string
    description?: StringNullableFilter<"CaseType"> | string | null
    isActive?: BoolFilter<"CaseType"> | boolean
    createdAt?: DateTimeFilter<"CaseType"> | Date | string
    cases?: CaseListRelationFilter
  }, "id" | "caseTypeCode">

  export type CaseTypeOrderByWithAggregationInput = {
    id?: SortOrder
    caseTypeName?: SortOrder
    caseTypeCode?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: CaseTypeCountOrderByAggregateInput
    _max?: CaseTypeMaxOrderByAggregateInput
    _min?: CaseTypeMinOrderByAggregateInput
  }

  export type CaseTypeScalarWhereWithAggregatesInput = {
    AND?: CaseTypeScalarWhereWithAggregatesInput | CaseTypeScalarWhereWithAggregatesInput[]
    OR?: CaseTypeScalarWhereWithAggregatesInput[]
    NOT?: CaseTypeScalarWhereWithAggregatesInput | CaseTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CaseType"> | string
    caseTypeName?: StringWithAggregatesFilter<"CaseType"> | string
    caseTypeCode?: StringWithAggregatesFilter<"CaseType"> | string
    description?: StringNullableWithAggregatesFilter<"CaseType"> | string | null
    isActive?: BoolWithAggregatesFilter<"CaseType"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CaseType"> | Date | string
  }

  export type CaseWhereInput = {
    AND?: CaseWhereInput | CaseWhereInput[]
    OR?: CaseWhereInput[]
    NOT?: CaseWhereInput | CaseWhereInput[]
    id?: StringFilter<"Case"> | string
    caseNumber?: StringFilter<"Case"> | string
    courtName?: StringFilter<"Case"> | string
    caseTypeId?: StringFilter<"Case"> | string
    filedDate?: DateTimeFilter<"Case"> | Date | string
    originalCourtId?: StringNullableFilter<"Case"> | string | null
    originalCaseNumber?: StringNullableFilter<"Case"> | string | null
    originalYear?: IntNullableFilter<"Case"> | number | null
    parties?: JsonFilter<"Case">
    status?: StringFilter<"Case"> | string
    lastActivityDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    totalActivities?: IntFilter<"Case"> | number
    hasLegalRepresentation?: BoolFilter<"Case"> | boolean
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    caseidType?: StringNullableFilter<"Case"> | string | null
    caseidNo?: StringNullableFilter<"Case"> | string | null
    maleApplicant?: IntFilter<"Case"> | number
    femaleApplicant?: IntFilter<"Case"> | number
    organizationApplicant?: IntFilter<"Case"> | number
    maleDefendant?: IntFilter<"Case"> | number
    femaleDefendant?: IntFilter<"Case"> | number
    organizationDefendant?: IntFilter<"Case"> | number
    caseType?: XOR<CaseTypeScalarRelationFilter, CaseTypeWhereInput>
    originalCourt?: XOR<CourtNullableScalarRelationFilter, CourtWhereInput> | null
    activities?: CaseActivityListRelationFilter
    judgeAssignments?: CaseJudgeAssignmentListRelationFilter
  }

  export type CaseOrderByWithRelationInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    courtName?: SortOrder
    caseTypeId?: SortOrder
    filedDate?: SortOrder
    originalCourtId?: SortOrderInput | SortOrder
    originalCaseNumber?: SortOrderInput | SortOrder
    originalYear?: SortOrderInput | SortOrder
    parties?: SortOrder
    status?: SortOrder
    lastActivityDate?: SortOrderInput | SortOrder
    totalActivities?: SortOrder
    hasLegalRepresentation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    caseidType?: SortOrderInput | SortOrder
    caseidNo?: SortOrderInput | SortOrder
    maleApplicant?: SortOrder
    femaleApplicant?: SortOrder
    organizationApplicant?: SortOrder
    maleDefendant?: SortOrder
    femaleDefendant?: SortOrder
    organizationDefendant?: SortOrder
    caseType?: CaseTypeOrderByWithRelationInput
    originalCourt?: CourtOrderByWithRelationInput
    activities?: CaseActivityOrderByRelationAggregateInput
    judgeAssignments?: CaseJudgeAssignmentOrderByRelationAggregateInput
  }

  export type CaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    case_number_court_unique?: CaseCase_number_court_uniqueCompoundUniqueInput
    AND?: CaseWhereInput | CaseWhereInput[]
    OR?: CaseWhereInput[]
    NOT?: CaseWhereInput | CaseWhereInput[]
    caseNumber?: StringFilter<"Case"> | string
    courtName?: StringFilter<"Case"> | string
    caseTypeId?: StringFilter<"Case"> | string
    filedDate?: DateTimeFilter<"Case"> | Date | string
    originalCourtId?: StringNullableFilter<"Case"> | string | null
    originalCaseNumber?: StringNullableFilter<"Case"> | string | null
    originalYear?: IntNullableFilter<"Case"> | number | null
    parties?: JsonFilter<"Case">
    status?: StringFilter<"Case"> | string
    lastActivityDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    totalActivities?: IntFilter<"Case"> | number
    hasLegalRepresentation?: BoolFilter<"Case"> | boolean
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    caseidType?: StringNullableFilter<"Case"> | string | null
    caseidNo?: StringNullableFilter<"Case"> | string | null
    maleApplicant?: IntFilter<"Case"> | number
    femaleApplicant?: IntFilter<"Case"> | number
    organizationApplicant?: IntFilter<"Case"> | number
    maleDefendant?: IntFilter<"Case"> | number
    femaleDefendant?: IntFilter<"Case"> | number
    organizationDefendant?: IntFilter<"Case"> | number
    caseType?: XOR<CaseTypeScalarRelationFilter, CaseTypeWhereInput>
    originalCourt?: XOR<CourtNullableScalarRelationFilter, CourtWhereInput> | null
    activities?: CaseActivityListRelationFilter
    judgeAssignments?: CaseJudgeAssignmentListRelationFilter
  }, "id" | "case_number_court_unique">

  export type CaseOrderByWithAggregationInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    courtName?: SortOrder
    caseTypeId?: SortOrder
    filedDate?: SortOrder
    originalCourtId?: SortOrderInput | SortOrder
    originalCaseNumber?: SortOrderInput | SortOrder
    originalYear?: SortOrderInput | SortOrder
    parties?: SortOrder
    status?: SortOrder
    lastActivityDate?: SortOrderInput | SortOrder
    totalActivities?: SortOrder
    hasLegalRepresentation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    caseidType?: SortOrderInput | SortOrder
    caseidNo?: SortOrderInput | SortOrder
    maleApplicant?: SortOrder
    femaleApplicant?: SortOrder
    organizationApplicant?: SortOrder
    maleDefendant?: SortOrder
    femaleDefendant?: SortOrder
    organizationDefendant?: SortOrder
    _count?: CaseCountOrderByAggregateInput
    _avg?: CaseAvgOrderByAggregateInput
    _max?: CaseMaxOrderByAggregateInput
    _min?: CaseMinOrderByAggregateInput
    _sum?: CaseSumOrderByAggregateInput
  }

  export type CaseScalarWhereWithAggregatesInput = {
    AND?: CaseScalarWhereWithAggregatesInput | CaseScalarWhereWithAggregatesInput[]
    OR?: CaseScalarWhereWithAggregatesInput[]
    NOT?: CaseScalarWhereWithAggregatesInput | CaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Case"> | string
    caseNumber?: StringWithAggregatesFilter<"Case"> | string
    courtName?: StringWithAggregatesFilter<"Case"> | string
    caseTypeId?: StringWithAggregatesFilter<"Case"> | string
    filedDate?: DateTimeWithAggregatesFilter<"Case"> | Date | string
    originalCourtId?: StringNullableWithAggregatesFilter<"Case"> | string | null
    originalCaseNumber?: StringNullableWithAggregatesFilter<"Case"> | string | null
    originalYear?: IntNullableWithAggregatesFilter<"Case"> | number | null
    parties?: JsonWithAggregatesFilter<"Case">
    status?: StringWithAggregatesFilter<"Case"> | string
    lastActivityDate?: DateTimeNullableWithAggregatesFilter<"Case"> | Date | string | null
    totalActivities?: IntWithAggregatesFilter<"Case"> | number
    hasLegalRepresentation?: BoolWithAggregatesFilter<"Case"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Case"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Case"> | Date | string
    caseidType?: StringNullableWithAggregatesFilter<"Case"> | string | null
    caseidNo?: StringNullableWithAggregatesFilter<"Case"> | string | null
    maleApplicant?: IntWithAggregatesFilter<"Case"> | number
    femaleApplicant?: IntWithAggregatesFilter<"Case"> | number
    organizationApplicant?: IntWithAggregatesFilter<"Case"> | number
    maleDefendant?: IntWithAggregatesFilter<"Case"> | number
    femaleDefendant?: IntWithAggregatesFilter<"Case"> | number
    organizationDefendant?: IntWithAggregatesFilter<"Case"> | number
  }

  export type CaseActivityWhereInput = {
    AND?: CaseActivityWhereInput | CaseActivityWhereInput[]
    OR?: CaseActivityWhereInput[]
    NOT?: CaseActivityWhereInput | CaseActivityWhereInput[]
    id?: StringFilter<"CaseActivity"> | string
    caseId?: StringFilter<"CaseActivity"> | string
    activityDate?: DateTimeFilter<"CaseActivity"> | Date | string
    activityType?: StringFilter<"CaseActivity"> | string
    outcome?: StringFilter<"CaseActivity"> | string
    reasonForAdjournment?: StringNullableFilter<"CaseActivity"> | string | null
    nextHearingDate?: DateTimeNullableFilter<"CaseActivity"> | Date | string | null
    primaryJudgeId?: StringFilter<"CaseActivity"> | string
    hasLegalRepresentation?: BoolFilter<"CaseActivity"> | boolean
    applicantWitnesses?: IntFilter<"CaseActivity"> | number
    defendantWitnesses?: IntFilter<"CaseActivity"> | number
    custodyStatus?: StringFilter<"CaseActivity"> | string
    details?: StringNullableFilter<"CaseActivity"> | string | null
    importBatchId?: StringFilter<"CaseActivity"> | string
    createdAt?: DateTimeFilter<"CaseActivity"> | Date | string
    judge1?: StringNullableFilter<"CaseActivity"> | string | null
    judge2?: StringNullableFilter<"CaseActivity"> | string | null
    judge3?: StringNullableFilter<"CaseActivity"> | string | null
    judge4?: StringNullableFilter<"CaseActivity"> | string | null
    judge5?: StringNullableFilter<"CaseActivity"> | string | null
    judge6?: StringNullableFilter<"CaseActivity"> | string | null
    judge7?: StringNullableFilter<"CaseActivity"> | string | null
    comingFor?: StringNullableFilter<"CaseActivity"> | string | null
    legalRepString?: StringNullableFilter<"CaseActivity"> | string | null
    custodyNumeric?: IntNullableFilter<"CaseActivity"> | number | null
    otherDetails?: StringNullableFilter<"CaseActivity"> | string | null
    case?: XOR<CaseScalarRelationFilter, CaseWhereInput>
    primaryJudge?: XOR<JudgeScalarRelationFilter, JudgeWhereInput>
    importBatch?: XOR<DailyImportBatchScalarRelationFilter, DailyImportBatchWhereInput>
  }

  export type CaseActivityOrderByWithRelationInput = {
    id?: SortOrder
    caseId?: SortOrder
    activityDate?: SortOrder
    activityType?: SortOrder
    outcome?: SortOrder
    reasonForAdjournment?: SortOrderInput | SortOrder
    nextHearingDate?: SortOrderInput | SortOrder
    primaryJudgeId?: SortOrder
    hasLegalRepresentation?: SortOrder
    applicantWitnesses?: SortOrder
    defendantWitnesses?: SortOrder
    custodyStatus?: SortOrder
    details?: SortOrderInput | SortOrder
    importBatchId?: SortOrder
    createdAt?: SortOrder
    judge1?: SortOrderInput | SortOrder
    judge2?: SortOrderInput | SortOrder
    judge3?: SortOrderInput | SortOrder
    judge4?: SortOrderInput | SortOrder
    judge5?: SortOrderInput | SortOrder
    judge6?: SortOrderInput | SortOrder
    judge7?: SortOrderInput | SortOrder
    comingFor?: SortOrderInput | SortOrder
    legalRepString?: SortOrderInput | SortOrder
    custodyNumeric?: SortOrderInput | SortOrder
    otherDetails?: SortOrderInput | SortOrder
    case?: CaseOrderByWithRelationInput
    primaryJudge?: JudgeOrderByWithRelationInput
    importBatch?: DailyImportBatchOrderByWithRelationInput
  }

  export type CaseActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CaseActivityWhereInput | CaseActivityWhereInput[]
    OR?: CaseActivityWhereInput[]
    NOT?: CaseActivityWhereInput | CaseActivityWhereInput[]
    caseId?: StringFilter<"CaseActivity"> | string
    activityDate?: DateTimeFilter<"CaseActivity"> | Date | string
    activityType?: StringFilter<"CaseActivity"> | string
    outcome?: StringFilter<"CaseActivity"> | string
    reasonForAdjournment?: StringNullableFilter<"CaseActivity"> | string | null
    nextHearingDate?: DateTimeNullableFilter<"CaseActivity"> | Date | string | null
    primaryJudgeId?: StringFilter<"CaseActivity"> | string
    hasLegalRepresentation?: BoolFilter<"CaseActivity"> | boolean
    applicantWitnesses?: IntFilter<"CaseActivity"> | number
    defendantWitnesses?: IntFilter<"CaseActivity"> | number
    custodyStatus?: StringFilter<"CaseActivity"> | string
    details?: StringNullableFilter<"CaseActivity"> | string | null
    importBatchId?: StringFilter<"CaseActivity"> | string
    createdAt?: DateTimeFilter<"CaseActivity"> | Date | string
    judge1?: StringNullableFilter<"CaseActivity"> | string | null
    judge2?: StringNullableFilter<"CaseActivity"> | string | null
    judge3?: StringNullableFilter<"CaseActivity"> | string | null
    judge4?: StringNullableFilter<"CaseActivity"> | string | null
    judge5?: StringNullableFilter<"CaseActivity"> | string | null
    judge6?: StringNullableFilter<"CaseActivity"> | string | null
    judge7?: StringNullableFilter<"CaseActivity"> | string | null
    comingFor?: StringNullableFilter<"CaseActivity"> | string | null
    legalRepString?: StringNullableFilter<"CaseActivity"> | string | null
    custodyNumeric?: IntNullableFilter<"CaseActivity"> | number | null
    otherDetails?: StringNullableFilter<"CaseActivity"> | string | null
    case?: XOR<CaseScalarRelationFilter, CaseWhereInput>
    primaryJudge?: XOR<JudgeScalarRelationFilter, JudgeWhereInput>
    importBatch?: XOR<DailyImportBatchScalarRelationFilter, DailyImportBatchWhereInput>
  }, "id">

  export type CaseActivityOrderByWithAggregationInput = {
    id?: SortOrder
    caseId?: SortOrder
    activityDate?: SortOrder
    activityType?: SortOrder
    outcome?: SortOrder
    reasonForAdjournment?: SortOrderInput | SortOrder
    nextHearingDate?: SortOrderInput | SortOrder
    primaryJudgeId?: SortOrder
    hasLegalRepresentation?: SortOrder
    applicantWitnesses?: SortOrder
    defendantWitnesses?: SortOrder
    custodyStatus?: SortOrder
    details?: SortOrderInput | SortOrder
    importBatchId?: SortOrder
    createdAt?: SortOrder
    judge1?: SortOrderInput | SortOrder
    judge2?: SortOrderInput | SortOrder
    judge3?: SortOrderInput | SortOrder
    judge4?: SortOrderInput | SortOrder
    judge5?: SortOrderInput | SortOrder
    judge6?: SortOrderInput | SortOrder
    judge7?: SortOrderInput | SortOrder
    comingFor?: SortOrderInput | SortOrder
    legalRepString?: SortOrderInput | SortOrder
    custodyNumeric?: SortOrderInput | SortOrder
    otherDetails?: SortOrderInput | SortOrder
    _count?: CaseActivityCountOrderByAggregateInput
    _avg?: CaseActivityAvgOrderByAggregateInput
    _max?: CaseActivityMaxOrderByAggregateInput
    _min?: CaseActivityMinOrderByAggregateInput
    _sum?: CaseActivitySumOrderByAggregateInput
  }

  export type CaseActivityScalarWhereWithAggregatesInput = {
    AND?: CaseActivityScalarWhereWithAggregatesInput | CaseActivityScalarWhereWithAggregatesInput[]
    OR?: CaseActivityScalarWhereWithAggregatesInput[]
    NOT?: CaseActivityScalarWhereWithAggregatesInput | CaseActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CaseActivity"> | string
    caseId?: StringWithAggregatesFilter<"CaseActivity"> | string
    activityDate?: DateTimeWithAggregatesFilter<"CaseActivity"> | Date | string
    activityType?: StringWithAggregatesFilter<"CaseActivity"> | string
    outcome?: StringWithAggregatesFilter<"CaseActivity"> | string
    reasonForAdjournment?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    nextHearingDate?: DateTimeNullableWithAggregatesFilter<"CaseActivity"> | Date | string | null
    primaryJudgeId?: StringWithAggregatesFilter<"CaseActivity"> | string
    hasLegalRepresentation?: BoolWithAggregatesFilter<"CaseActivity"> | boolean
    applicantWitnesses?: IntWithAggregatesFilter<"CaseActivity"> | number
    defendantWitnesses?: IntWithAggregatesFilter<"CaseActivity"> | number
    custodyStatus?: StringWithAggregatesFilter<"CaseActivity"> | string
    details?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    importBatchId?: StringWithAggregatesFilter<"CaseActivity"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CaseActivity"> | Date | string
    judge1?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    judge2?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    judge3?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    judge4?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    judge5?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    judge6?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    judge7?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    comingFor?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    legalRepString?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
    custodyNumeric?: IntNullableWithAggregatesFilter<"CaseActivity"> | number | null
    otherDetails?: StringNullableWithAggregatesFilter<"CaseActivity"> | string | null
  }

  export type CaseJudgeAssignmentWhereInput = {
    AND?: CaseJudgeAssignmentWhereInput | CaseJudgeAssignmentWhereInput[]
    OR?: CaseJudgeAssignmentWhereInput[]
    NOT?: CaseJudgeAssignmentWhereInput | CaseJudgeAssignmentWhereInput[]
    caseId?: StringFilter<"CaseJudgeAssignment"> | string
    judgeId?: StringFilter<"CaseJudgeAssignment"> | string
    assignedAt?: DateTimeFilter<"CaseJudgeAssignment"> | Date | string
    isPrimary?: BoolFilter<"CaseJudgeAssignment"> | boolean
    case?: XOR<CaseScalarRelationFilter, CaseWhereInput>
    judge?: XOR<JudgeScalarRelationFilter, JudgeWhereInput>
  }

  export type CaseJudgeAssignmentOrderByWithRelationInput = {
    caseId?: SortOrder
    judgeId?: SortOrder
    assignedAt?: SortOrder
    isPrimary?: SortOrder
    case?: CaseOrderByWithRelationInput
    judge?: JudgeOrderByWithRelationInput
  }

  export type CaseJudgeAssignmentWhereUniqueInput = Prisma.AtLeast<{
    caseId_judgeId?: CaseJudgeAssignmentCaseIdJudgeIdCompoundUniqueInput
    AND?: CaseJudgeAssignmentWhereInput | CaseJudgeAssignmentWhereInput[]
    OR?: CaseJudgeAssignmentWhereInput[]
    NOT?: CaseJudgeAssignmentWhereInput | CaseJudgeAssignmentWhereInput[]
    caseId?: StringFilter<"CaseJudgeAssignment"> | string
    judgeId?: StringFilter<"CaseJudgeAssignment"> | string
    assignedAt?: DateTimeFilter<"CaseJudgeAssignment"> | Date | string
    isPrimary?: BoolFilter<"CaseJudgeAssignment"> | boolean
    case?: XOR<CaseScalarRelationFilter, CaseWhereInput>
    judge?: XOR<JudgeScalarRelationFilter, JudgeWhereInput>
  }, "caseId_judgeId">

  export type CaseJudgeAssignmentOrderByWithAggregationInput = {
    caseId?: SortOrder
    judgeId?: SortOrder
    assignedAt?: SortOrder
    isPrimary?: SortOrder
    _count?: CaseJudgeAssignmentCountOrderByAggregateInput
    _max?: CaseJudgeAssignmentMaxOrderByAggregateInput
    _min?: CaseJudgeAssignmentMinOrderByAggregateInput
  }

  export type CaseJudgeAssignmentScalarWhereWithAggregatesInput = {
    AND?: CaseJudgeAssignmentScalarWhereWithAggregatesInput | CaseJudgeAssignmentScalarWhereWithAggregatesInput[]
    OR?: CaseJudgeAssignmentScalarWhereWithAggregatesInput[]
    NOT?: CaseJudgeAssignmentScalarWhereWithAggregatesInput | CaseJudgeAssignmentScalarWhereWithAggregatesInput[]
    caseId?: StringWithAggregatesFilter<"CaseJudgeAssignment"> | string
    judgeId?: StringWithAggregatesFilter<"CaseJudgeAssignment"> | string
    assignedAt?: DateTimeWithAggregatesFilter<"CaseJudgeAssignment"> | Date | string
    isPrimary?: BoolWithAggregatesFilter<"CaseJudgeAssignment"> | boolean
  }

  export type DailyImportBatchWhereInput = {
    AND?: DailyImportBatchWhereInput | DailyImportBatchWhereInput[]
    OR?: DailyImportBatchWhereInput[]
    NOT?: DailyImportBatchWhereInput | DailyImportBatchWhereInput[]
    id?: StringFilter<"DailyImportBatch"> | string
    importDate?: DateTimeFilter<"DailyImportBatch"> | Date | string
    filename?: StringFilter<"DailyImportBatch"> | string
    fileSize?: IntFilter<"DailyImportBatch"> | number
    fileChecksum?: StringFilter<"DailyImportBatch"> | string
    totalRecords?: IntFilter<"DailyImportBatch"> | number
    successfulRecords?: IntFilter<"DailyImportBatch"> | number
    failedRecords?: IntFilter<"DailyImportBatch"> | number
    errorLogs?: JsonFilter<"DailyImportBatch">
    status?: StringFilter<"DailyImportBatch"> | string
    estimatedCompletionTime?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    processingStartTime?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    userConfig?: JsonFilter<"DailyImportBatch">
    validationWarnings?: JsonFilter<"DailyImportBatch">
    createdAt?: DateTimeFilter<"DailyImportBatch"> | Date | string
    completedAt?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    createdBy?: StringFilter<"DailyImportBatch"> | string
    activities?: CaseActivityListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    progress?: ImportProgressListRelationFilter
    errorDetails?: ImportErrorDetailListRelationFilter
  }

  export type DailyImportBatchOrderByWithRelationInput = {
    id?: SortOrder
    importDate?: SortOrder
    filename?: SortOrder
    fileSize?: SortOrder
    fileChecksum?: SortOrder
    totalRecords?: SortOrder
    successfulRecords?: SortOrder
    failedRecords?: SortOrder
    errorLogs?: SortOrder
    status?: SortOrder
    estimatedCompletionTime?: SortOrderInput | SortOrder
    processingStartTime?: SortOrderInput | SortOrder
    userConfig?: SortOrder
    validationWarnings?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    activities?: CaseActivityOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
    progress?: ImportProgressOrderByRelationAggregateInput
    errorDetails?: ImportErrorDetailOrderByRelationAggregateInput
  }

  export type DailyImportBatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DailyImportBatchWhereInput | DailyImportBatchWhereInput[]
    OR?: DailyImportBatchWhereInput[]
    NOT?: DailyImportBatchWhereInput | DailyImportBatchWhereInput[]
    importDate?: DateTimeFilter<"DailyImportBatch"> | Date | string
    filename?: StringFilter<"DailyImportBatch"> | string
    fileSize?: IntFilter<"DailyImportBatch"> | number
    fileChecksum?: StringFilter<"DailyImportBatch"> | string
    totalRecords?: IntFilter<"DailyImportBatch"> | number
    successfulRecords?: IntFilter<"DailyImportBatch"> | number
    failedRecords?: IntFilter<"DailyImportBatch"> | number
    errorLogs?: JsonFilter<"DailyImportBatch">
    status?: StringFilter<"DailyImportBatch"> | string
    estimatedCompletionTime?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    processingStartTime?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    userConfig?: JsonFilter<"DailyImportBatch">
    validationWarnings?: JsonFilter<"DailyImportBatch">
    createdAt?: DateTimeFilter<"DailyImportBatch"> | Date | string
    completedAt?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    createdBy?: StringFilter<"DailyImportBatch"> | string
    activities?: CaseActivityListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    progress?: ImportProgressListRelationFilter
    errorDetails?: ImportErrorDetailListRelationFilter
  }, "id">

  export type DailyImportBatchOrderByWithAggregationInput = {
    id?: SortOrder
    importDate?: SortOrder
    filename?: SortOrder
    fileSize?: SortOrder
    fileChecksum?: SortOrder
    totalRecords?: SortOrder
    successfulRecords?: SortOrder
    failedRecords?: SortOrder
    errorLogs?: SortOrder
    status?: SortOrder
    estimatedCompletionTime?: SortOrderInput | SortOrder
    processingStartTime?: SortOrderInput | SortOrder
    userConfig?: SortOrder
    validationWarnings?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    _count?: DailyImportBatchCountOrderByAggregateInput
    _avg?: DailyImportBatchAvgOrderByAggregateInput
    _max?: DailyImportBatchMaxOrderByAggregateInput
    _min?: DailyImportBatchMinOrderByAggregateInput
    _sum?: DailyImportBatchSumOrderByAggregateInput
  }

  export type DailyImportBatchScalarWhereWithAggregatesInput = {
    AND?: DailyImportBatchScalarWhereWithAggregatesInput | DailyImportBatchScalarWhereWithAggregatesInput[]
    OR?: DailyImportBatchScalarWhereWithAggregatesInput[]
    NOT?: DailyImportBatchScalarWhereWithAggregatesInput | DailyImportBatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DailyImportBatch"> | string
    importDate?: DateTimeWithAggregatesFilter<"DailyImportBatch"> | Date | string
    filename?: StringWithAggregatesFilter<"DailyImportBatch"> | string
    fileSize?: IntWithAggregatesFilter<"DailyImportBatch"> | number
    fileChecksum?: StringWithAggregatesFilter<"DailyImportBatch"> | string
    totalRecords?: IntWithAggregatesFilter<"DailyImportBatch"> | number
    successfulRecords?: IntWithAggregatesFilter<"DailyImportBatch"> | number
    failedRecords?: IntWithAggregatesFilter<"DailyImportBatch"> | number
    errorLogs?: JsonWithAggregatesFilter<"DailyImportBatch">
    status?: StringWithAggregatesFilter<"DailyImportBatch"> | string
    estimatedCompletionTime?: DateTimeNullableWithAggregatesFilter<"DailyImportBatch"> | Date | string | null
    processingStartTime?: DateTimeNullableWithAggregatesFilter<"DailyImportBatch"> | Date | string | null
    userConfig?: JsonWithAggregatesFilter<"DailyImportBatch">
    validationWarnings?: JsonWithAggregatesFilter<"DailyImportBatch">
    createdAt?: DateTimeWithAggregatesFilter<"DailyImportBatch"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"DailyImportBatch"> | Date | string | null
    createdBy?: StringWithAggregatesFilter<"DailyImportBatch"> | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    importBatches?: DailyImportBatchListRelationFilter
    importSessions?: ImportSessionListRelationFilter
    validationResults?: ValidationResultListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    importBatches?: DailyImportBatchOrderByRelationAggregateInput
    importSessions?: ImportSessionOrderByRelationAggregateInput
    validationResults?: ValidationResultOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    importBatches?: DailyImportBatchListRelationFilter
    importSessions?: ImportSessionListRelationFilter
    validationResults?: ValidationResultListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ImportProgressWhereInput = {
    AND?: ImportProgressWhereInput | ImportProgressWhereInput[]
    OR?: ImportProgressWhereInput[]
    NOT?: ImportProgressWhereInput | ImportProgressWhereInput[]
    id?: StringFilter<"ImportProgress"> | string
    batchId?: StringFilter<"ImportProgress"> | string
    progressPercentage?: IntNullableFilter<"ImportProgress"> | number | null
    currentStep?: StringNullableFilter<"ImportProgress"> | string | null
    message?: StringNullableFilter<"ImportProgress"> | string | null
    recordsProcessed?: IntFilter<"ImportProgress"> | number
    totalRecords?: IntFilter<"ImportProgress"> | number
    errorsCount?: IntFilter<"ImportProgress"> | number
    warningsCount?: IntFilter<"ImportProgress"> | number
    createdAt?: DateTimeFilter<"ImportProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ImportProgress"> | Date | string
    batch?: XOR<DailyImportBatchScalarRelationFilter, DailyImportBatchWhereInput>
  }

  export type ImportProgressOrderByWithRelationInput = {
    id?: SortOrder
    batchId?: SortOrder
    progressPercentage?: SortOrderInput | SortOrder
    currentStep?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    recordsProcessed?: SortOrder
    totalRecords?: SortOrder
    errorsCount?: SortOrder
    warningsCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    batch?: DailyImportBatchOrderByWithRelationInput
  }

  export type ImportProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImportProgressWhereInput | ImportProgressWhereInput[]
    OR?: ImportProgressWhereInput[]
    NOT?: ImportProgressWhereInput | ImportProgressWhereInput[]
    batchId?: StringFilter<"ImportProgress"> | string
    progressPercentage?: IntNullableFilter<"ImportProgress"> | number | null
    currentStep?: StringNullableFilter<"ImportProgress"> | string | null
    message?: StringNullableFilter<"ImportProgress"> | string | null
    recordsProcessed?: IntFilter<"ImportProgress"> | number
    totalRecords?: IntFilter<"ImportProgress"> | number
    errorsCount?: IntFilter<"ImportProgress"> | number
    warningsCount?: IntFilter<"ImportProgress"> | number
    createdAt?: DateTimeFilter<"ImportProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ImportProgress"> | Date | string
    batch?: XOR<DailyImportBatchScalarRelationFilter, DailyImportBatchWhereInput>
  }, "id">

  export type ImportProgressOrderByWithAggregationInput = {
    id?: SortOrder
    batchId?: SortOrder
    progressPercentage?: SortOrderInput | SortOrder
    currentStep?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    recordsProcessed?: SortOrder
    totalRecords?: SortOrder
    errorsCount?: SortOrder
    warningsCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImportProgressCountOrderByAggregateInput
    _avg?: ImportProgressAvgOrderByAggregateInput
    _max?: ImportProgressMaxOrderByAggregateInput
    _min?: ImportProgressMinOrderByAggregateInput
    _sum?: ImportProgressSumOrderByAggregateInput
  }

  export type ImportProgressScalarWhereWithAggregatesInput = {
    AND?: ImportProgressScalarWhereWithAggregatesInput | ImportProgressScalarWhereWithAggregatesInput[]
    OR?: ImportProgressScalarWhereWithAggregatesInput[]
    NOT?: ImportProgressScalarWhereWithAggregatesInput | ImportProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImportProgress"> | string
    batchId?: StringWithAggregatesFilter<"ImportProgress"> | string
    progressPercentage?: IntNullableWithAggregatesFilter<"ImportProgress"> | number | null
    currentStep?: StringNullableWithAggregatesFilter<"ImportProgress"> | string | null
    message?: StringNullableWithAggregatesFilter<"ImportProgress"> | string | null
    recordsProcessed?: IntWithAggregatesFilter<"ImportProgress"> | number
    totalRecords?: IntWithAggregatesFilter<"ImportProgress"> | number
    errorsCount?: IntWithAggregatesFilter<"ImportProgress"> | number
    warningsCount?: IntWithAggregatesFilter<"ImportProgress"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ImportProgress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ImportProgress"> | Date | string
  }

  export type ImportErrorDetailWhereInput = {
    AND?: ImportErrorDetailWhereInput | ImportErrorDetailWhereInput[]
    OR?: ImportErrorDetailWhereInput[]
    NOT?: ImportErrorDetailWhereInput | ImportErrorDetailWhereInput[]
    id?: StringFilter<"ImportErrorDetail"> | string
    batchId?: StringFilter<"ImportErrorDetail"> | string
    rowNumber?: IntNullableFilter<"ImportErrorDetail"> | number | null
    columnName?: StringNullableFilter<"ImportErrorDetail"> | string | null
    errorType?: StringFilter<"ImportErrorDetail"> | string
    errorMessage?: StringFilter<"ImportErrorDetail"> | string
    rawValue?: StringNullableFilter<"ImportErrorDetail"> | string | null
    suggestedFix?: StringNullableFilter<"ImportErrorDetail"> | string | null
    severity?: StringFilter<"ImportErrorDetail"> | string
    isResolved?: BoolFilter<"ImportErrorDetail"> | boolean
    createdAt?: DateTimeFilter<"ImportErrorDetail"> | Date | string
    batch?: XOR<DailyImportBatchScalarRelationFilter, DailyImportBatchWhereInput>
  }

  export type ImportErrorDetailOrderByWithRelationInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrderInput | SortOrder
    columnName?: SortOrderInput | SortOrder
    errorType?: SortOrder
    errorMessage?: SortOrder
    rawValue?: SortOrderInput | SortOrder
    suggestedFix?: SortOrderInput | SortOrder
    severity?: SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
    batch?: DailyImportBatchOrderByWithRelationInput
  }

  export type ImportErrorDetailWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImportErrorDetailWhereInput | ImportErrorDetailWhereInput[]
    OR?: ImportErrorDetailWhereInput[]
    NOT?: ImportErrorDetailWhereInput | ImportErrorDetailWhereInput[]
    batchId?: StringFilter<"ImportErrorDetail"> | string
    rowNumber?: IntNullableFilter<"ImportErrorDetail"> | number | null
    columnName?: StringNullableFilter<"ImportErrorDetail"> | string | null
    errorType?: StringFilter<"ImportErrorDetail"> | string
    errorMessage?: StringFilter<"ImportErrorDetail"> | string
    rawValue?: StringNullableFilter<"ImportErrorDetail"> | string | null
    suggestedFix?: StringNullableFilter<"ImportErrorDetail"> | string | null
    severity?: StringFilter<"ImportErrorDetail"> | string
    isResolved?: BoolFilter<"ImportErrorDetail"> | boolean
    createdAt?: DateTimeFilter<"ImportErrorDetail"> | Date | string
    batch?: XOR<DailyImportBatchScalarRelationFilter, DailyImportBatchWhereInput>
  }, "id">

  export type ImportErrorDetailOrderByWithAggregationInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrderInput | SortOrder
    columnName?: SortOrderInput | SortOrder
    errorType?: SortOrder
    errorMessage?: SortOrder
    rawValue?: SortOrderInput | SortOrder
    suggestedFix?: SortOrderInput | SortOrder
    severity?: SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
    _count?: ImportErrorDetailCountOrderByAggregateInput
    _avg?: ImportErrorDetailAvgOrderByAggregateInput
    _max?: ImportErrorDetailMaxOrderByAggregateInput
    _min?: ImportErrorDetailMinOrderByAggregateInput
    _sum?: ImportErrorDetailSumOrderByAggregateInput
  }

  export type ImportErrorDetailScalarWhereWithAggregatesInput = {
    AND?: ImportErrorDetailScalarWhereWithAggregatesInput | ImportErrorDetailScalarWhereWithAggregatesInput[]
    OR?: ImportErrorDetailScalarWhereWithAggregatesInput[]
    NOT?: ImportErrorDetailScalarWhereWithAggregatesInput | ImportErrorDetailScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImportErrorDetail"> | string
    batchId?: StringWithAggregatesFilter<"ImportErrorDetail"> | string
    rowNumber?: IntNullableWithAggregatesFilter<"ImportErrorDetail"> | number | null
    columnName?: StringNullableWithAggregatesFilter<"ImportErrorDetail"> | string | null
    errorType?: StringWithAggregatesFilter<"ImportErrorDetail"> | string
    errorMessage?: StringWithAggregatesFilter<"ImportErrorDetail"> | string
    rawValue?: StringNullableWithAggregatesFilter<"ImportErrorDetail"> | string | null
    suggestedFix?: StringNullableWithAggregatesFilter<"ImportErrorDetail"> | string | null
    severity?: StringWithAggregatesFilter<"ImportErrorDetail"> | string
    isResolved?: BoolWithAggregatesFilter<"ImportErrorDetail"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ImportErrorDetail"> | Date | string
  }

  export type ImportSessionWhereInput = {
    AND?: ImportSessionWhereInput | ImportSessionWhereInput[]
    OR?: ImportSessionWhereInput[]
    NOT?: ImportSessionWhereInput | ImportSessionWhereInput[]
    id?: StringFilter<"ImportSession"> | string
    userId?: StringFilter<"ImportSession"> | string
    sessionToken?: StringFilter<"ImportSession"> | string
    status?: StringFilter<"ImportSession"> | string
    startedAt?: DateTimeFilter<"ImportSession"> | Date | string
    lastActivity?: DateTimeFilter<"ImportSession"> | Date | string
    expiresAt?: DateTimeNullableFilter<"ImportSession"> | Date | string | null
    metadata?: JsonFilter<"ImportSession">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ImportSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ImportSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: ImportSessionWhereInput | ImportSessionWhereInput[]
    OR?: ImportSessionWhereInput[]
    NOT?: ImportSessionWhereInput | ImportSessionWhereInput[]
    userId?: StringFilter<"ImportSession"> | string
    status?: StringFilter<"ImportSession"> | string
    startedAt?: DateTimeFilter<"ImportSession"> | Date | string
    lastActivity?: DateTimeFilter<"ImportSession"> | Date | string
    expiresAt?: DateTimeNullableFilter<"ImportSession"> | Date | string | null
    metadata?: JsonFilter<"ImportSession">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type ImportSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    _count?: ImportSessionCountOrderByAggregateInput
    _max?: ImportSessionMaxOrderByAggregateInput
    _min?: ImportSessionMinOrderByAggregateInput
  }

  export type ImportSessionScalarWhereWithAggregatesInput = {
    AND?: ImportSessionScalarWhereWithAggregatesInput | ImportSessionScalarWhereWithAggregatesInput[]
    OR?: ImportSessionScalarWhereWithAggregatesInput[]
    NOT?: ImportSessionScalarWhereWithAggregatesInput | ImportSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImportSession"> | string
    userId?: StringWithAggregatesFilter<"ImportSession"> | string
    sessionToken?: StringWithAggregatesFilter<"ImportSession"> | string
    status?: StringWithAggregatesFilter<"ImportSession"> | string
    startedAt?: DateTimeWithAggregatesFilter<"ImportSession"> | Date | string
    lastActivity?: DateTimeWithAggregatesFilter<"ImportSession"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"ImportSession"> | Date | string | null
    metadata?: JsonWithAggregatesFilter<"ImportSession">
  }

  export type ValidationResultWhereInput = {
    AND?: ValidationResultWhereInput | ValidationResultWhereInput[]
    OR?: ValidationResultWhereInput[]
    NOT?: ValidationResultWhereInput | ValidationResultWhereInput[]
    id?: StringFilter<"ValidationResult"> | string
    userId?: StringFilter<"ValidationResult"> | string
    filename?: StringFilter<"ValidationResult"> | string
    fileChecksum?: StringFilter<"ValidationResult"> | string
    validationStatus?: StringFilter<"ValidationResult"> | string
    totalRows?: IntFilter<"ValidationResult"> | number
    validRows?: IntFilter<"ValidationResult"> | number
    invalidRows?: IntFilter<"ValidationResult"> | number
    errors?: JsonFilter<"ValidationResult">
    warnings?: JsonFilter<"ValidationResult">
    previewData?: JsonFilter<"ValidationResult">
    createdAt?: DateTimeFilter<"ValidationResult"> | Date | string
    expiresAt?: DateTimeFilter<"ValidationResult"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ValidationResultOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    fileChecksum?: SortOrder
    validationStatus?: SortOrder
    totalRows?: SortOrder
    validRows?: SortOrder
    invalidRows?: SortOrder
    errors?: SortOrder
    warnings?: SortOrder
    previewData?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ValidationResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ValidationResultWhereInput | ValidationResultWhereInput[]
    OR?: ValidationResultWhereInput[]
    NOT?: ValidationResultWhereInput | ValidationResultWhereInput[]
    userId?: StringFilter<"ValidationResult"> | string
    filename?: StringFilter<"ValidationResult"> | string
    fileChecksum?: StringFilter<"ValidationResult"> | string
    validationStatus?: StringFilter<"ValidationResult"> | string
    totalRows?: IntFilter<"ValidationResult"> | number
    validRows?: IntFilter<"ValidationResult"> | number
    invalidRows?: IntFilter<"ValidationResult"> | number
    errors?: JsonFilter<"ValidationResult">
    warnings?: JsonFilter<"ValidationResult">
    previewData?: JsonFilter<"ValidationResult">
    createdAt?: DateTimeFilter<"ValidationResult"> | Date | string
    expiresAt?: DateTimeFilter<"ValidationResult"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ValidationResultOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    fileChecksum?: SortOrder
    validationStatus?: SortOrder
    totalRows?: SortOrder
    validRows?: SortOrder
    invalidRows?: SortOrder
    errors?: SortOrder
    warnings?: SortOrder
    previewData?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    _count?: ValidationResultCountOrderByAggregateInput
    _avg?: ValidationResultAvgOrderByAggregateInput
    _max?: ValidationResultMaxOrderByAggregateInput
    _min?: ValidationResultMinOrderByAggregateInput
    _sum?: ValidationResultSumOrderByAggregateInput
  }

  export type ValidationResultScalarWhereWithAggregatesInput = {
    AND?: ValidationResultScalarWhereWithAggregatesInput | ValidationResultScalarWhereWithAggregatesInput[]
    OR?: ValidationResultScalarWhereWithAggregatesInput[]
    NOT?: ValidationResultScalarWhereWithAggregatesInput | ValidationResultScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ValidationResult"> | string
    userId?: StringWithAggregatesFilter<"ValidationResult"> | string
    filename?: StringWithAggregatesFilter<"ValidationResult"> | string
    fileChecksum?: StringWithAggregatesFilter<"ValidationResult"> | string
    validationStatus?: StringWithAggregatesFilter<"ValidationResult"> | string
    totalRows?: IntWithAggregatesFilter<"ValidationResult"> | number
    validRows?: IntWithAggregatesFilter<"ValidationResult"> | number
    invalidRows?: IntWithAggregatesFilter<"ValidationResult"> | number
    errors?: JsonWithAggregatesFilter<"ValidationResult">
    warnings?: JsonWithAggregatesFilter<"ValidationResult">
    previewData?: JsonWithAggregatesFilter<"ValidationResult">
    createdAt?: DateTimeWithAggregatesFilter<"ValidationResult"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"ValidationResult"> | Date | string
  }

  export type CourtCreateInput = {
    id?: string
    courtName: string
    courtCode: string
    courtType: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    originalCode?: string | null
    originalNumber?: string | null
    originalYear?: number | null
    cases?: CaseCreateNestedManyWithoutOriginalCourtInput
  }

  export type CourtUncheckedCreateInput = {
    id?: string
    courtName: string
    courtCode: string
    courtType: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    originalCode?: string | null
    originalNumber?: string | null
    originalYear?: number | null
    cases?: CaseUncheckedCreateNestedManyWithoutOriginalCourtInput
  }

  export type CourtUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    courtCode?: StringFieldUpdateOperationsInput | string
    courtType?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCode?: NullableStringFieldUpdateOperationsInput | string | null
    originalNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    cases?: CaseUpdateManyWithoutOriginalCourtNestedInput
  }

  export type CourtUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    courtCode?: StringFieldUpdateOperationsInput | string
    courtType?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCode?: NullableStringFieldUpdateOperationsInput | string | null
    originalNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    cases?: CaseUncheckedUpdateManyWithoutOriginalCourtNestedInput
  }

  export type CourtCreateManyInput = {
    id?: string
    courtName: string
    courtCode: string
    courtType: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    originalCode?: string | null
    originalNumber?: string | null
    originalYear?: number | null
  }

  export type CourtUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    courtCode?: StringFieldUpdateOperationsInput | string
    courtType?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCode?: NullableStringFieldUpdateOperationsInput | string | null
    originalNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CourtUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    courtCode?: StringFieldUpdateOperationsInput | string
    courtType?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCode?: NullableStringFieldUpdateOperationsInput | string | null
    originalNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type JudgeCreateInput = {
    id?: string
    fullName: string
    firstName: string
    lastName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseActivities?: CaseActivityCreateNestedManyWithoutPrimaryJudgeInput
    caseAssignments?: CaseJudgeAssignmentCreateNestedManyWithoutJudgeInput
  }

  export type JudgeUncheckedCreateInput = {
    id?: string
    fullName: string
    firstName: string
    lastName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseActivities?: CaseActivityUncheckedCreateNestedManyWithoutPrimaryJudgeInput
    caseAssignments?: CaseJudgeAssignmentUncheckedCreateNestedManyWithoutJudgeInput
  }

  export type JudgeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseActivities?: CaseActivityUpdateManyWithoutPrimaryJudgeNestedInput
    caseAssignments?: CaseJudgeAssignmentUpdateManyWithoutJudgeNestedInput
  }

  export type JudgeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseActivities?: CaseActivityUncheckedUpdateManyWithoutPrimaryJudgeNestedInput
    caseAssignments?: CaseJudgeAssignmentUncheckedUpdateManyWithoutJudgeNestedInput
  }

  export type JudgeCreateManyInput = {
    id?: string
    fullName: string
    firstName: string
    lastName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JudgeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JudgeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseTypeCreateInput = {
    id?: string
    caseTypeName: string
    caseTypeCode: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    cases?: CaseCreateNestedManyWithoutCaseTypeInput
  }

  export type CaseTypeUncheckedCreateInput = {
    id?: string
    caseTypeName: string
    caseTypeCode: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    cases?: CaseUncheckedCreateNestedManyWithoutCaseTypeInput
  }

  export type CaseTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseTypeName?: StringFieldUpdateOperationsInput | string
    caseTypeCode?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUpdateManyWithoutCaseTypeNestedInput
  }

  export type CaseTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseTypeName?: StringFieldUpdateOperationsInput | string
    caseTypeCode?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cases?: CaseUncheckedUpdateManyWithoutCaseTypeNestedInput
  }

  export type CaseTypeCreateManyInput = {
    id?: string
    caseTypeName: string
    caseTypeCode: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type CaseTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseTypeName?: StringFieldUpdateOperationsInput | string
    caseTypeCode?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseTypeName?: StringFieldUpdateOperationsInput | string
    caseTypeCode?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseCreateInput = {
    id?: string
    caseNumber: string
    courtName: string
    filedDate: Date | string
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    caseType: CaseTypeCreateNestedOneWithoutCasesInput
    originalCourt?: CourtCreateNestedOneWithoutCasesInput
    activities?: CaseActivityCreateNestedManyWithoutCaseInput
    judgeAssignments?: CaseJudgeAssignmentCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateInput = {
    id?: string
    caseNumber: string
    courtName: string
    caseTypeId: string
    filedDate: Date | string
    originalCourtId?: string | null
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    activities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
    judgeAssignments?: CaseJudgeAssignmentUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    caseType?: CaseTypeUpdateOneRequiredWithoutCasesNestedInput
    originalCourt?: CourtUpdateOneWithoutCasesNestedInput
    activities?: CaseActivityUpdateManyWithoutCaseNestedInput
    judgeAssignments?: CaseJudgeAssignmentUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    caseTypeId?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCourtId?: NullableStringFieldUpdateOperationsInput | string | null
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    activities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
    judgeAssignments?: CaseJudgeAssignmentUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseCreateManyInput = {
    id?: string
    caseNumber: string
    courtName: string
    caseTypeId: string
    filedDate: Date | string
    originalCourtId?: string | null
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
  }

  export type CaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
  }

  export type CaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    caseTypeId?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCourtId?: NullableStringFieldUpdateOperationsInput | string | null
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
  }

  export type CaseActivityCreateInput = {
    id?: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
    case: CaseCreateNestedOneWithoutActivitiesInput
    primaryJudge: JudgeCreateNestedOneWithoutCaseActivitiesInput
    importBatch: DailyImportBatchCreateNestedOneWithoutActivitiesInput
  }

  export type CaseActivityUncheckedCreateInput = {
    id?: string
    caseId: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    primaryJudgeId: string
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    importBatchId: string
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
  }

  export type CaseActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
    case?: CaseUpdateOneRequiredWithoutActivitiesNestedInput
    primaryJudge?: JudgeUpdateOneRequiredWithoutCaseActivitiesNestedInput
    importBatch?: DailyImportBatchUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type CaseActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryJudgeId?: StringFieldUpdateOperationsInput | string
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    importBatchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseActivityCreateManyInput = {
    id?: string
    caseId: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    primaryJudgeId: string
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    importBatchId: string
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
  }

  export type CaseActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryJudgeId?: StringFieldUpdateOperationsInput | string
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    importBatchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseJudgeAssignmentCreateInput = {
    assignedAt?: Date | string
    isPrimary?: boolean
    case: CaseCreateNestedOneWithoutJudgeAssignmentsInput
    judge: JudgeCreateNestedOneWithoutCaseAssignmentsInput
  }

  export type CaseJudgeAssignmentUncheckedCreateInput = {
    caseId: string
    judgeId: string
    assignedAt?: Date | string
    isPrimary?: boolean
  }

  export type CaseJudgeAssignmentUpdateInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    case?: CaseUpdateOneRequiredWithoutJudgeAssignmentsNestedInput
    judge?: JudgeUpdateOneRequiredWithoutCaseAssignmentsNestedInput
  }

  export type CaseJudgeAssignmentUncheckedUpdateInput = {
    caseId?: StringFieldUpdateOperationsInput | string
    judgeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CaseJudgeAssignmentCreateManyInput = {
    caseId: string
    judgeId: string
    assignedAt?: Date | string
    isPrimary?: boolean
  }

  export type CaseJudgeAssignmentUpdateManyMutationInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CaseJudgeAssignmentUncheckedUpdateManyInput = {
    caseId?: StringFieldUpdateOperationsInput | string
    judgeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DailyImportBatchCreateInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    activities?: CaseActivityCreateNestedManyWithoutImportBatchInput
    user: UserCreateNestedOneWithoutImportBatchesInput
    progress?: ImportProgressCreateNestedManyWithoutBatchInput
    errorDetails?: ImportErrorDetailCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchUncheckedCreateInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    createdBy: string
    activities?: CaseActivityUncheckedCreateNestedManyWithoutImportBatchInput
    progress?: ImportProgressUncheckedCreateNestedManyWithoutBatchInput
    errorDetails?: ImportErrorDetailUncheckedCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activities?: CaseActivityUpdateManyWithoutImportBatchNestedInput
    user?: UserUpdateOneRequiredWithoutImportBatchesNestedInput
    progress?: ImportProgressUpdateManyWithoutBatchNestedInput
    errorDetails?: ImportErrorDetailUpdateManyWithoutBatchNestedInput
  }

  export type DailyImportBatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    activities?: CaseActivityUncheckedUpdateManyWithoutImportBatchNestedInput
    progress?: ImportProgressUncheckedUpdateManyWithoutBatchNestedInput
    errorDetails?: ImportErrorDetailUncheckedUpdateManyWithoutBatchNestedInput
  }

  export type DailyImportBatchCreateManyInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    createdBy: string
  }

  export type DailyImportBatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DailyImportBatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    importBatches?: DailyImportBatchCreateNestedManyWithoutUserInput
    importSessions?: ImportSessionCreateNestedManyWithoutUserInput
    validationResults?: ValidationResultCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    importBatches?: DailyImportBatchUncheckedCreateNestedManyWithoutUserInput
    importSessions?: ImportSessionUncheckedCreateNestedManyWithoutUserInput
    validationResults?: ValidationResultUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importBatches?: DailyImportBatchUpdateManyWithoutUserNestedInput
    importSessions?: ImportSessionUpdateManyWithoutUserNestedInput
    validationResults?: ValidationResultUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importBatches?: DailyImportBatchUncheckedUpdateManyWithoutUserNestedInput
    importSessions?: ImportSessionUncheckedUpdateManyWithoutUserNestedInput
    validationResults?: ValidationResultUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportProgressCreateInput = {
    id?: string
    progressPercentage?: number | null
    currentStep?: string | null
    message?: string | null
    recordsProcessed?: number
    totalRecords?: number
    errorsCount?: number
    warningsCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    batch: DailyImportBatchCreateNestedOneWithoutProgressInput
  }

  export type ImportProgressUncheckedCreateInput = {
    id?: string
    batchId: string
    progressPercentage?: number | null
    currentStep?: string | null
    message?: string | null
    recordsProcessed?: number
    totalRecords?: number
    errorsCount?: number
    warningsCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImportProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableIntFieldUpdateOperationsInput | number | null
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    recordsProcessed?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    errorsCount?: IntFieldUpdateOperationsInput | number
    warningsCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batch?: DailyImportBatchUpdateOneRequiredWithoutProgressNestedInput
  }

  export type ImportProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableIntFieldUpdateOperationsInput | number | null
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    recordsProcessed?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    errorsCount?: IntFieldUpdateOperationsInput | number
    warningsCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportProgressCreateManyInput = {
    id?: string
    batchId: string
    progressPercentage?: number | null
    currentStep?: string | null
    message?: string | null
    recordsProcessed?: number
    totalRecords?: number
    errorsCount?: number
    warningsCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImportProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableIntFieldUpdateOperationsInput | number | null
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    recordsProcessed?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    errorsCount?: IntFieldUpdateOperationsInput | number
    warningsCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableIntFieldUpdateOperationsInput | number | null
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    recordsProcessed?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    errorsCount?: IntFieldUpdateOperationsInput | number
    warningsCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportErrorDetailCreateInput = {
    id?: string
    rowNumber?: number | null
    columnName?: string | null
    errorType: string
    errorMessage: string
    rawValue?: string | null
    suggestedFix?: string | null
    severity?: string
    isResolved?: boolean
    createdAt?: Date | string
    batch: DailyImportBatchCreateNestedOneWithoutErrorDetailsInput
  }

  export type ImportErrorDetailUncheckedCreateInput = {
    id?: string
    batchId: string
    rowNumber?: number | null
    columnName?: string | null
    errorType: string
    errorMessage: string
    rawValue?: string | null
    suggestedFix?: string | null
    severity?: string
    isResolved?: boolean
    createdAt?: Date | string
  }

  export type ImportErrorDetailUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: NullableIntFieldUpdateOperationsInput | number | null
    columnName?: NullableStringFieldUpdateOperationsInput | string | null
    errorType?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    rawValue?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedFix?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    batch?: DailyImportBatchUpdateOneRequiredWithoutErrorDetailsNestedInput
  }

  export type ImportErrorDetailUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    rowNumber?: NullableIntFieldUpdateOperationsInput | number | null
    columnName?: NullableStringFieldUpdateOperationsInput | string | null
    errorType?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    rawValue?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedFix?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportErrorDetailCreateManyInput = {
    id?: string
    batchId: string
    rowNumber?: number | null
    columnName?: string | null
    errorType: string
    errorMessage: string
    rawValue?: string | null
    suggestedFix?: string | null
    severity?: string
    isResolved?: boolean
    createdAt?: Date | string
  }

  export type ImportErrorDetailUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: NullableIntFieldUpdateOperationsInput | number | null
    columnName?: NullableStringFieldUpdateOperationsInput | string | null
    errorType?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    rawValue?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedFix?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportErrorDetailUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    rowNumber?: NullableIntFieldUpdateOperationsInput | number | null
    columnName?: NullableStringFieldUpdateOperationsInput | string | null
    errorType?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    rawValue?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedFix?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportSessionCreateInput = {
    id?: string
    sessionToken: string
    status?: string
    startedAt?: Date | string
    lastActivity?: Date | string
    expiresAt?: Date | string | null
    metadata: JsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutImportSessionsInput
  }

  export type ImportSessionUncheckedCreateInput = {
    id?: string
    userId: string
    sessionToken: string
    status?: string
    startedAt?: Date | string
    lastActivity?: Date | string
    expiresAt?: Date | string | null
    metadata: JsonNullValueInput | InputJsonValue
  }

  export type ImportSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutImportSessionsNestedInput
  }

  export type ImportSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ImportSessionCreateManyInput = {
    id?: string
    userId: string
    sessionToken: string
    status?: string
    startedAt?: Date | string
    lastActivity?: Date | string
    expiresAt?: Date | string | null
    metadata: JsonNullValueInput | InputJsonValue
  }

  export type ImportSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ImportSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ValidationResultCreateInput = {
    id?: string
    filename: string
    fileChecksum: string
    validationStatus: string
    totalRows: number
    validRows: number
    invalidRows: number
    errors: JsonNullValueInput | InputJsonValue
    warnings: JsonNullValueInput | InputJsonValue
    previewData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
    user: UserCreateNestedOneWithoutValidationResultsInput
  }

  export type ValidationResultUncheckedCreateInput = {
    id?: string
    userId: string
    filename: string
    fileChecksum: string
    validationStatus: string
    totalRows: number
    validRows: number
    invalidRows: number
    errors: JsonNullValueInput | InputJsonValue
    warnings: JsonNullValueInput | InputJsonValue
    previewData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type ValidationResultUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileChecksum?: StringFieldUpdateOperationsInput | string
    validationStatus?: StringFieldUpdateOperationsInput | string
    totalRows?: IntFieldUpdateOperationsInput | number
    validRows?: IntFieldUpdateOperationsInput | number
    invalidRows?: IntFieldUpdateOperationsInput | number
    errors?: JsonNullValueInput | InputJsonValue
    warnings?: JsonNullValueInput | InputJsonValue
    previewData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutValidationResultsNestedInput
  }

  export type ValidationResultUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileChecksum?: StringFieldUpdateOperationsInput | string
    validationStatus?: StringFieldUpdateOperationsInput | string
    totalRows?: IntFieldUpdateOperationsInput | number
    validRows?: IntFieldUpdateOperationsInput | number
    invalidRows?: IntFieldUpdateOperationsInput | number
    errors?: JsonNullValueInput | InputJsonValue
    warnings?: JsonNullValueInput | InputJsonValue
    previewData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationResultCreateManyInput = {
    id?: string
    userId: string
    filename: string
    fileChecksum: string
    validationStatus: string
    totalRows: number
    validRows: number
    invalidRows: number
    errors: JsonNullValueInput | InputJsonValue
    warnings: JsonNullValueInput | InputJsonValue
    previewData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type ValidationResultUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileChecksum?: StringFieldUpdateOperationsInput | string
    validationStatus?: StringFieldUpdateOperationsInput | string
    totalRows?: IntFieldUpdateOperationsInput | number
    validRows?: IntFieldUpdateOperationsInput | number
    invalidRows?: IntFieldUpdateOperationsInput | number
    errors?: JsonNullValueInput | InputJsonValue
    warnings?: JsonNullValueInput | InputJsonValue
    previewData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationResultUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileChecksum?: StringFieldUpdateOperationsInput | string
    validationStatus?: StringFieldUpdateOperationsInput | string
    totalRows?: IntFieldUpdateOperationsInput | number
    validRows?: IntFieldUpdateOperationsInput | number
    invalidRows?: IntFieldUpdateOperationsInput | number
    errors?: JsonNullValueInput | InputJsonValue
    warnings?: JsonNullValueInput | InputJsonValue
    previewData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type CaseListRelationFilter = {
    every?: CaseWhereInput
    some?: CaseWhereInput
    none?: CaseWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CourtCountOrderByAggregateInput = {
    id?: SortOrder
    courtName?: SortOrder
    courtCode?: SortOrder
    courtType?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    originalCode?: SortOrder
    originalNumber?: SortOrder
    originalYear?: SortOrder
  }

  export type CourtAvgOrderByAggregateInput = {
    originalYear?: SortOrder
  }

  export type CourtMaxOrderByAggregateInput = {
    id?: SortOrder
    courtName?: SortOrder
    courtCode?: SortOrder
    courtType?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    originalCode?: SortOrder
    originalNumber?: SortOrder
    originalYear?: SortOrder
  }

  export type CourtMinOrderByAggregateInput = {
    id?: SortOrder
    courtName?: SortOrder
    courtCode?: SortOrder
    courtType?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    originalCode?: SortOrder
    originalNumber?: SortOrder
    originalYear?: SortOrder
  }

  export type CourtSumOrderByAggregateInput = {
    originalYear?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type CaseActivityListRelationFilter = {
    every?: CaseActivityWhereInput
    some?: CaseActivityWhereInput
    none?: CaseActivityWhereInput
  }

  export type CaseJudgeAssignmentListRelationFilter = {
    every?: CaseJudgeAssignmentWhereInput
    some?: CaseJudgeAssignmentWhereInput
    none?: CaseJudgeAssignmentWhereInput
  }

  export type CaseActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CaseJudgeAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JudgeCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JudgeMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JudgeMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CaseTypeCountOrderByAggregateInput = {
    id?: SortOrder
    caseTypeName?: SortOrder
    caseTypeCode?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type CaseTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    caseTypeName?: SortOrder
    caseTypeCode?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type CaseTypeMinOrderByAggregateInput = {
    id?: SortOrder
    caseTypeName?: SortOrder
    caseTypeCode?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CaseTypeScalarRelationFilter = {
    is?: CaseTypeWhereInput
    isNot?: CaseTypeWhereInput
  }

  export type CourtNullableScalarRelationFilter = {
    is?: CourtWhereInput | null
    isNot?: CourtWhereInput | null
  }

  export type CaseCase_number_court_uniqueCompoundUniqueInput = {
    caseNumber: string
    courtName: string
  }

  export type CaseCountOrderByAggregateInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    courtName?: SortOrder
    caseTypeId?: SortOrder
    filedDate?: SortOrder
    originalCourtId?: SortOrder
    originalCaseNumber?: SortOrder
    originalYear?: SortOrder
    parties?: SortOrder
    status?: SortOrder
    lastActivityDate?: SortOrder
    totalActivities?: SortOrder
    hasLegalRepresentation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    caseidType?: SortOrder
    caseidNo?: SortOrder
    maleApplicant?: SortOrder
    femaleApplicant?: SortOrder
    organizationApplicant?: SortOrder
    maleDefendant?: SortOrder
    femaleDefendant?: SortOrder
    organizationDefendant?: SortOrder
  }

  export type CaseAvgOrderByAggregateInput = {
    originalYear?: SortOrder
    totalActivities?: SortOrder
    maleApplicant?: SortOrder
    femaleApplicant?: SortOrder
    organizationApplicant?: SortOrder
    maleDefendant?: SortOrder
    femaleDefendant?: SortOrder
    organizationDefendant?: SortOrder
  }

  export type CaseMaxOrderByAggregateInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    courtName?: SortOrder
    caseTypeId?: SortOrder
    filedDate?: SortOrder
    originalCourtId?: SortOrder
    originalCaseNumber?: SortOrder
    originalYear?: SortOrder
    status?: SortOrder
    lastActivityDate?: SortOrder
    totalActivities?: SortOrder
    hasLegalRepresentation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    caseidType?: SortOrder
    caseidNo?: SortOrder
    maleApplicant?: SortOrder
    femaleApplicant?: SortOrder
    organizationApplicant?: SortOrder
    maleDefendant?: SortOrder
    femaleDefendant?: SortOrder
    organizationDefendant?: SortOrder
  }

  export type CaseMinOrderByAggregateInput = {
    id?: SortOrder
    caseNumber?: SortOrder
    courtName?: SortOrder
    caseTypeId?: SortOrder
    filedDate?: SortOrder
    originalCourtId?: SortOrder
    originalCaseNumber?: SortOrder
    originalYear?: SortOrder
    status?: SortOrder
    lastActivityDate?: SortOrder
    totalActivities?: SortOrder
    hasLegalRepresentation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    caseidType?: SortOrder
    caseidNo?: SortOrder
    maleApplicant?: SortOrder
    femaleApplicant?: SortOrder
    organizationApplicant?: SortOrder
    maleDefendant?: SortOrder
    femaleDefendant?: SortOrder
    organizationDefendant?: SortOrder
  }

  export type CaseSumOrderByAggregateInput = {
    originalYear?: SortOrder
    totalActivities?: SortOrder
    maleApplicant?: SortOrder
    femaleApplicant?: SortOrder
    organizationApplicant?: SortOrder
    maleDefendant?: SortOrder
    femaleDefendant?: SortOrder
    organizationDefendant?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type CaseScalarRelationFilter = {
    is?: CaseWhereInput
    isNot?: CaseWhereInput
  }

  export type JudgeScalarRelationFilter = {
    is?: JudgeWhereInput
    isNot?: JudgeWhereInput
  }

  export type DailyImportBatchScalarRelationFilter = {
    is?: DailyImportBatchWhereInput
    isNot?: DailyImportBatchWhereInput
  }

  export type CaseActivityCountOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    activityDate?: SortOrder
    activityType?: SortOrder
    outcome?: SortOrder
    reasonForAdjournment?: SortOrder
    nextHearingDate?: SortOrder
    primaryJudgeId?: SortOrder
    hasLegalRepresentation?: SortOrder
    applicantWitnesses?: SortOrder
    defendantWitnesses?: SortOrder
    custodyStatus?: SortOrder
    details?: SortOrder
    importBatchId?: SortOrder
    createdAt?: SortOrder
    judge1?: SortOrder
    judge2?: SortOrder
    judge3?: SortOrder
    judge4?: SortOrder
    judge5?: SortOrder
    judge6?: SortOrder
    judge7?: SortOrder
    comingFor?: SortOrder
    legalRepString?: SortOrder
    custodyNumeric?: SortOrder
    otherDetails?: SortOrder
  }

  export type CaseActivityAvgOrderByAggregateInput = {
    applicantWitnesses?: SortOrder
    defendantWitnesses?: SortOrder
    custodyNumeric?: SortOrder
  }

  export type CaseActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    activityDate?: SortOrder
    activityType?: SortOrder
    outcome?: SortOrder
    reasonForAdjournment?: SortOrder
    nextHearingDate?: SortOrder
    primaryJudgeId?: SortOrder
    hasLegalRepresentation?: SortOrder
    applicantWitnesses?: SortOrder
    defendantWitnesses?: SortOrder
    custodyStatus?: SortOrder
    details?: SortOrder
    importBatchId?: SortOrder
    createdAt?: SortOrder
    judge1?: SortOrder
    judge2?: SortOrder
    judge3?: SortOrder
    judge4?: SortOrder
    judge5?: SortOrder
    judge6?: SortOrder
    judge7?: SortOrder
    comingFor?: SortOrder
    legalRepString?: SortOrder
    custodyNumeric?: SortOrder
    otherDetails?: SortOrder
  }

  export type CaseActivityMinOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    activityDate?: SortOrder
    activityType?: SortOrder
    outcome?: SortOrder
    reasonForAdjournment?: SortOrder
    nextHearingDate?: SortOrder
    primaryJudgeId?: SortOrder
    hasLegalRepresentation?: SortOrder
    applicantWitnesses?: SortOrder
    defendantWitnesses?: SortOrder
    custodyStatus?: SortOrder
    details?: SortOrder
    importBatchId?: SortOrder
    createdAt?: SortOrder
    judge1?: SortOrder
    judge2?: SortOrder
    judge3?: SortOrder
    judge4?: SortOrder
    judge5?: SortOrder
    judge6?: SortOrder
    judge7?: SortOrder
    comingFor?: SortOrder
    legalRepString?: SortOrder
    custodyNumeric?: SortOrder
    otherDetails?: SortOrder
  }

  export type CaseActivitySumOrderByAggregateInput = {
    applicantWitnesses?: SortOrder
    defendantWitnesses?: SortOrder
    custodyNumeric?: SortOrder
  }

  export type CaseJudgeAssignmentCaseIdJudgeIdCompoundUniqueInput = {
    caseId: string
    judgeId: string
  }

  export type CaseJudgeAssignmentCountOrderByAggregateInput = {
    caseId?: SortOrder
    judgeId?: SortOrder
    assignedAt?: SortOrder
    isPrimary?: SortOrder
  }

  export type CaseJudgeAssignmentMaxOrderByAggregateInput = {
    caseId?: SortOrder
    judgeId?: SortOrder
    assignedAt?: SortOrder
    isPrimary?: SortOrder
  }

  export type CaseJudgeAssignmentMinOrderByAggregateInput = {
    caseId?: SortOrder
    judgeId?: SortOrder
    assignedAt?: SortOrder
    isPrimary?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ImportProgressListRelationFilter = {
    every?: ImportProgressWhereInput
    some?: ImportProgressWhereInput
    none?: ImportProgressWhereInput
  }

  export type ImportErrorDetailListRelationFilter = {
    every?: ImportErrorDetailWhereInput
    some?: ImportErrorDetailWhereInput
    none?: ImportErrorDetailWhereInput
  }

  export type ImportProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImportErrorDetailOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DailyImportBatchCountOrderByAggregateInput = {
    id?: SortOrder
    importDate?: SortOrder
    filename?: SortOrder
    fileSize?: SortOrder
    fileChecksum?: SortOrder
    totalRecords?: SortOrder
    successfulRecords?: SortOrder
    failedRecords?: SortOrder
    errorLogs?: SortOrder
    status?: SortOrder
    estimatedCompletionTime?: SortOrder
    processingStartTime?: SortOrder
    userConfig?: SortOrder
    validationWarnings?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type DailyImportBatchAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    totalRecords?: SortOrder
    successfulRecords?: SortOrder
    failedRecords?: SortOrder
  }

  export type DailyImportBatchMaxOrderByAggregateInput = {
    id?: SortOrder
    importDate?: SortOrder
    filename?: SortOrder
    fileSize?: SortOrder
    fileChecksum?: SortOrder
    totalRecords?: SortOrder
    successfulRecords?: SortOrder
    failedRecords?: SortOrder
    status?: SortOrder
    estimatedCompletionTime?: SortOrder
    processingStartTime?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type DailyImportBatchMinOrderByAggregateInput = {
    id?: SortOrder
    importDate?: SortOrder
    filename?: SortOrder
    fileSize?: SortOrder
    fileChecksum?: SortOrder
    totalRecords?: SortOrder
    successfulRecords?: SortOrder
    failedRecords?: SortOrder
    status?: SortOrder
    estimatedCompletionTime?: SortOrder
    processingStartTime?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type DailyImportBatchSumOrderByAggregateInput = {
    fileSize?: SortOrder
    totalRecords?: SortOrder
    successfulRecords?: SortOrder
    failedRecords?: SortOrder
  }

  export type DailyImportBatchListRelationFilter = {
    every?: DailyImportBatchWhereInput
    some?: DailyImportBatchWhereInput
    none?: DailyImportBatchWhereInput
  }

  export type ImportSessionListRelationFilter = {
    every?: ImportSessionWhereInput
    some?: ImportSessionWhereInput
    none?: ImportSessionWhereInput
  }

  export type ValidationResultListRelationFilter = {
    every?: ValidationResultWhereInput
    some?: ValidationResultWhereInput
    none?: ValidationResultWhereInput
  }

  export type DailyImportBatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImportSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ValidationResultOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImportProgressCountOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    progressPercentage?: SortOrder
    currentStep?: SortOrder
    message?: SortOrder
    recordsProcessed?: SortOrder
    totalRecords?: SortOrder
    errorsCount?: SortOrder
    warningsCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImportProgressAvgOrderByAggregateInput = {
    progressPercentage?: SortOrder
    recordsProcessed?: SortOrder
    totalRecords?: SortOrder
    errorsCount?: SortOrder
    warningsCount?: SortOrder
  }

  export type ImportProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    progressPercentage?: SortOrder
    currentStep?: SortOrder
    message?: SortOrder
    recordsProcessed?: SortOrder
    totalRecords?: SortOrder
    errorsCount?: SortOrder
    warningsCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImportProgressMinOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    progressPercentage?: SortOrder
    currentStep?: SortOrder
    message?: SortOrder
    recordsProcessed?: SortOrder
    totalRecords?: SortOrder
    errorsCount?: SortOrder
    warningsCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImportProgressSumOrderByAggregateInput = {
    progressPercentage?: SortOrder
    recordsProcessed?: SortOrder
    totalRecords?: SortOrder
    errorsCount?: SortOrder
    warningsCount?: SortOrder
  }

  export type ImportErrorDetailCountOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrder
    columnName?: SortOrder
    errorType?: SortOrder
    errorMessage?: SortOrder
    rawValue?: SortOrder
    suggestedFix?: SortOrder
    severity?: SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
  }

  export type ImportErrorDetailAvgOrderByAggregateInput = {
    rowNumber?: SortOrder
  }

  export type ImportErrorDetailMaxOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrder
    columnName?: SortOrder
    errorType?: SortOrder
    errorMessage?: SortOrder
    rawValue?: SortOrder
    suggestedFix?: SortOrder
    severity?: SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
  }

  export type ImportErrorDetailMinOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrder
    columnName?: SortOrder
    errorType?: SortOrder
    errorMessage?: SortOrder
    rawValue?: SortOrder
    suggestedFix?: SortOrder
    severity?: SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
  }

  export type ImportErrorDetailSumOrderByAggregateInput = {
    rowNumber?: SortOrder
  }

  export type ImportSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrder
    metadata?: SortOrder
  }

  export type ImportSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrder
  }

  export type ImportSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrder
  }

  export type ValidationResultCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    fileChecksum?: SortOrder
    validationStatus?: SortOrder
    totalRows?: SortOrder
    validRows?: SortOrder
    invalidRows?: SortOrder
    errors?: SortOrder
    warnings?: SortOrder
    previewData?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ValidationResultAvgOrderByAggregateInput = {
    totalRows?: SortOrder
    validRows?: SortOrder
    invalidRows?: SortOrder
  }

  export type ValidationResultMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    fileChecksum?: SortOrder
    validationStatus?: SortOrder
    totalRows?: SortOrder
    validRows?: SortOrder
    invalidRows?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ValidationResultMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    fileChecksum?: SortOrder
    validationStatus?: SortOrder
    totalRows?: SortOrder
    validRows?: SortOrder
    invalidRows?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ValidationResultSumOrderByAggregateInput = {
    totalRows?: SortOrder
    validRows?: SortOrder
    invalidRows?: SortOrder
  }

  export type CaseCreateNestedManyWithoutOriginalCourtInput = {
    create?: XOR<CaseCreateWithoutOriginalCourtInput, CaseUncheckedCreateWithoutOriginalCourtInput> | CaseCreateWithoutOriginalCourtInput[] | CaseUncheckedCreateWithoutOriginalCourtInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutOriginalCourtInput | CaseCreateOrConnectWithoutOriginalCourtInput[]
    createMany?: CaseCreateManyOriginalCourtInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type CaseUncheckedCreateNestedManyWithoutOriginalCourtInput = {
    create?: XOR<CaseCreateWithoutOriginalCourtInput, CaseUncheckedCreateWithoutOriginalCourtInput> | CaseCreateWithoutOriginalCourtInput[] | CaseUncheckedCreateWithoutOriginalCourtInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutOriginalCourtInput | CaseCreateOrConnectWithoutOriginalCourtInput[]
    createMany?: CaseCreateManyOriginalCourtInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CaseUpdateManyWithoutOriginalCourtNestedInput = {
    create?: XOR<CaseCreateWithoutOriginalCourtInput, CaseUncheckedCreateWithoutOriginalCourtInput> | CaseCreateWithoutOriginalCourtInput[] | CaseUncheckedCreateWithoutOriginalCourtInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutOriginalCourtInput | CaseCreateOrConnectWithoutOriginalCourtInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutOriginalCourtInput | CaseUpsertWithWhereUniqueWithoutOriginalCourtInput[]
    createMany?: CaseCreateManyOriginalCourtInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutOriginalCourtInput | CaseUpdateWithWhereUniqueWithoutOriginalCourtInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutOriginalCourtInput | CaseUpdateManyWithWhereWithoutOriginalCourtInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type CaseUncheckedUpdateManyWithoutOriginalCourtNestedInput = {
    create?: XOR<CaseCreateWithoutOriginalCourtInput, CaseUncheckedCreateWithoutOriginalCourtInput> | CaseCreateWithoutOriginalCourtInput[] | CaseUncheckedCreateWithoutOriginalCourtInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutOriginalCourtInput | CaseCreateOrConnectWithoutOriginalCourtInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutOriginalCourtInput | CaseUpsertWithWhereUniqueWithoutOriginalCourtInput[]
    createMany?: CaseCreateManyOriginalCourtInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutOriginalCourtInput | CaseUpdateWithWhereUniqueWithoutOriginalCourtInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutOriginalCourtInput | CaseUpdateManyWithWhereWithoutOriginalCourtInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type CaseActivityCreateNestedManyWithoutPrimaryJudgeInput = {
    create?: XOR<CaseActivityCreateWithoutPrimaryJudgeInput, CaseActivityUncheckedCreateWithoutPrimaryJudgeInput> | CaseActivityCreateWithoutPrimaryJudgeInput[] | CaseActivityUncheckedCreateWithoutPrimaryJudgeInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutPrimaryJudgeInput | CaseActivityCreateOrConnectWithoutPrimaryJudgeInput[]
    createMany?: CaseActivityCreateManyPrimaryJudgeInputEnvelope
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
  }

  export type CaseJudgeAssignmentCreateNestedManyWithoutJudgeInput = {
    create?: XOR<CaseJudgeAssignmentCreateWithoutJudgeInput, CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput> | CaseJudgeAssignmentCreateWithoutJudgeInput[] | CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput[]
    connectOrCreate?: CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput | CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput[]
    createMany?: CaseJudgeAssignmentCreateManyJudgeInputEnvelope
    connect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
  }

  export type CaseActivityUncheckedCreateNestedManyWithoutPrimaryJudgeInput = {
    create?: XOR<CaseActivityCreateWithoutPrimaryJudgeInput, CaseActivityUncheckedCreateWithoutPrimaryJudgeInput> | CaseActivityCreateWithoutPrimaryJudgeInput[] | CaseActivityUncheckedCreateWithoutPrimaryJudgeInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutPrimaryJudgeInput | CaseActivityCreateOrConnectWithoutPrimaryJudgeInput[]
    createMany?: CaseActivityCreateManyPrimaryJudgeInputEnvelope
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
  }

  export type CaseJudgeAssignmentUncheckedCreateNestedManyWithoutJudgeInput = {
    create?: XOR<CaseJudgeAssignmentCreateWithoutJudgeInput, CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput> | CaseJudgeAssignmentCreateWithoutJudgeInput[] | CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput[]
    connectOrCreate?: CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput | CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput[]
    createMany?: CaseJudgeAssignmentCreateManyJudgeInputEnvelope
    connect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
  }

  export type CaseActivityUpdateManyWithoutPrimaryJudgeNestedInput = {
    create?: XOR<CaseActivityCreateWithoutPrimaryJudgeInput, CaseActivityUncheckedCreateWithoutPrimaryJudgeInput> | CaseActivityCreateWithoutPrimaryJudgeInput[] | CaseActivityUncheckedCreateWithoutPrimaryJudgeInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutPrimaryJudgeInput | CaseActivityCreateOrConnectWithoutPrimaryJudgeInput[]
    upsert?: CaseActivityUpsertWithWhereUniqueWithoutPrimaryJudgeInput | CaseActivityUpsertWithWhereUniqueWithoutPrimaryJudgeInput[]
    createMany?: CaseActivityCreateManyPrimaryJudgeInputEnvelope
    set?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    disconnect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    delete?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    update?: CaseActivityUpdateWithWhereUniqueWithoutPrimaryJudgeInput | CaseActivityUpdateWithWhereUniqueWithoutPrimaryJudgeInput[]
    updateMany?: CaseActivityUpdateManyWithWhereWithoutPrimaryJudgeInput | CaseActivityUpdateManyWithWhereWithoutPrimaryJudgeInput[]
    deleteMany?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
  }

  export type CaseJudgeAssignmentUpdateManyWithoutJudgeNestedInput = {
    create?: XOR<CaseJudgeAssignmentCreateWithoutJudgeInput, CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput> | CaseJudgeAssignmentCreateWithoutJudgeInput[] | CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput[]
    connectOrCreate?: CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput | CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput[]
    upsert?: CaseJudgeAssignmentUpsertWithWhereUniqueWithoutJudgeInput | CaseJudgeAssignmentUpsertWithWhereUniqueWithoutJudgeInput[]
    createMany?: CaseJudgeAssignmentCreateManyJudgeInputEnvelope
    set?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    disconnect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    delete?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    connect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    update?: CaseJudgeAssignmentUpdateWithWhereUniqueWithoutJudgeInput | CaseJudgeAssignmentUpdateWithWhereUniqueWithoutJudgeInput[]
    updateMany?: CaseJudgeAssignmentUpdateManyWithWhereWithoutJudgeInput | CaseJudgeAssignmentUpdateManyWithWhereWithoutJudgeInput[]
    deleteMany?: CaseJudgeAssignmentScalarWhereInput | CaseJudgeAssignmentScalarWhereInput[]
  }

  export type CaseActivityUncheckedUpdateManyWithoutPrimaryJudgeNestedInput = {
    create?: XOR<CaseActivityCreateWithoutPrimaryJudgeInput, CaseActivityUncheckedCreateWithoutPrimaryJudgeInput> | CaseActivityCreateWithoutPrimaryJudgeInput[] | CaseActivityUncheckedCreateWithoutPrimaryJudgeInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutPrimaryJudgeInput | CaseActivityCreateOrConnectWithoutPrimaryJudgeInput[]
    upsert?: CaseActivityUpsertWithWhereUniqueWithoutPrimaryJudgeInput | CaseActivityUpsertWithWhereUniqueWithoutPrimaryJudgeInput[]
    createMany?: CaseActivityCreateManyPrimaryJudgeInputEnvelope
    set?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    disconnect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    delete?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    update?: CaseActivityUpdateWithWhereUniqueWithoutPrimaryJudgeInput | CaseActivityUpdateWithWhereUniqueWithoutPrimaryJudgeInput[]
    updateMany?: CaseActivityUpdateManyWithWhereWithoutPrimaryJudgeInput | CaseActivityUpdateManyWithWhereWithoutPrimaryJudgeInput[]
    deleteMany?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
  }

  export type CaseJudgeAssignmentUncheckedUpdateManyWithoutJudgeNestedInput = {
    create?: XOR<CaseJudgeAssignmentCreateWithoutJudgeInput, CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput> | CaseJudgeAssignmentCreateWithoutJudgeInput[] | CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput[]
    connectOrCreate?: CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput | CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput[]
    upsert?: CaseJudgeAssignmentUpsertWithWhereUniqueWithoutJudgeInput | CaseJudgeAssignmentUpsertWithWhereUniqueWithoutJudgeInput[]
    createMany?: CaseJudgeAssignmentCreateManyJudgeInputEnvelope
    set?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    disconnect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    delete?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    connect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    update?: CaseJudgeAssignmentUpdateWithWhereUniqueWithoutJudgeInput | CaseJudgeAssignmentUpdateWithWhereUniqueWithoutJudgeInput[]
    updateMany?: CaseJudgeAssignmentUpdateManyWithWhereWithoutJudgeInput | CaseJudgeAssignmentUpdateManyWithWhereWithoutJudgeInput[]
    deleteMany?: CaseJudgeAssignmentScalarWhereInput | CaseJudgeAssignmentScalarWhereInput[]
  }

  export type CaseCreateNestedManyWithoutCaseTypeInput = {
    create?: XOR<CaseCreateWithoutCaseTypeInput, CaseUncheckedCreateWithoutCaseTypeInput> | CaseCreateWithoutCaseTypeInput[] | CaseUncheckedCreateWithoutCaseTypeInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutCaseTypeInput | CaseCreateOrConnectWithoutCaseTypeInput[]
    createMany?: CaseCreateManyCaseTypeInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type CaseUncheckedCreateNestedManyWithoutCaseTypeInput = {
    create?: XOR<CaseCreateWithoutCaseTypeInput, CaseUncheckedCreateWithoutCaseTypeInput> | CaseCreateWithoutCaseTypeInput[] | CaseUncheckedCreateWithoutCaseTypeInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutCaseTypeInput | CaseCreateOrConnectWithoutCaseTypeInput[]
    createMany?: CaseCreateManyCaseTypeInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type CaseUpdateManyWithoutCaseTypeNestedInput = {
    create?: XOR<CaseCreateWithoutCaseTypeInput, CaseUncheckedCreateWithoutCaseTypeInput> | CaseCreateWithoutCaseTypeInput[] | CaseUncheckedCreateWithoutCaseTypeInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutCaseTypeInput | CaseCreateOrConnectWithoutCaseTypeInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutCaseTypeInput | CaseUpsertWithWhereUniqueWithoutCaseTypeInput[]
    createMany?: CaseCreateManyCaseTypeInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutCaseTypeInput | CaseUpdateWithWhereUniqueWithoutCaseTypeInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutCaseTypeInput | CaseUpdateManyWithWhereWithoutCaseTypeInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type CaseUncheckedUpdateManyWithoutCaseTypeNestedInput = {
    create?: XOR<CaseCreateWithoutCaseTypeInput, CaseUncheckedCreateWithoutCaseTypeInput> | CaseCreateWithoutCaseTypeInput[] | CaseUncheckedCreateWithoutCaseTypeInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutCaseTypeInput | CaseCreateOrConnectWithoutCaseTypeInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutCaseTypeInput | CaseUpsertWithWhereUniqueWithoutCaseTypeInput[]
    createMany?: CaseCreateManyCaseTypeInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutCaseTypeInput | CaseUpdateWithWhereUniqueWithoutCaseTypeInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutCaseTypeInput | CaseUpdateManyWithWhereWithoutCaseTypeInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type CaseTypeCreateNestedOneWithoutCasesInput = {
    create?: XOR<CaseTypeCreateWithoutCasesInput, CaseTypeUncheckedCreateWithoutCasesInput>
    connectOrCreate?: CaseTypeCreateOrConnectWithoutCasesInput
    connect?: CaseTypeWhereUniqueInput
  }

  export type CourtCreateNestedOneWithoutCasesInput = {
    create?: XOR<CourtCreateWithoutCasesInput, CourtUncheckedCreateWithoutCasesInput>
    connectOrCreate?: CourtCreateOrConnectWithoutCasesInput
    connect?: CourtWhereUniqueInput
  }

  export type CaseActivityCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput> | CaseActivityCreateWithoutCaseInput[] | CaseActivityUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutCaseInput | CaseActivityCreateOrConnectWithoutCaseInput[]
    createMany?: CaseActivityCreateManyCaseInputEnvelope
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
  }

  export type CaseJudgeAssignmentCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseJudgeAssignmentCreateWithoutCaseInput, CaseJudgeAssignmentUncheckedCreateWithoutCaseInput> | CaseJudgeAssignmentCreateWithoutCaseInput[] | CaseJudgeAssignmentUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseJudgeAssignmentCreateOrConnectWithoutCaseInput | CaseJudgeAssignmentCreateOrConnectWithoutCaseInput[]
    createMany?: CaseJudgeAssignmentCreateManyCaseInputEnvelope
    connect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
  }

  export type CaseActivityUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput> | CaseActivityCreateWithoutCaseInput[] | CaseActivityUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutCaseInput | CaseActivityCreateOrConnectWithoutCaseInput[]
    createMany?: CaseActivityCreateManyCaseInputEnvelope
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
  }

  export type CaseJudgeAssignmentUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseJudgeAssignmentCreateWithoutCaseInput, CaseJudgeAssignmentUncheckedCreateWithoutCaseInput> | CaseJudgeAssignmentCreateWithoutCaseInput[] | CaseJudgeAssignmentUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseJudgeAssignmentCreateOrConnectWithoutCaseInput | CaseJudgeAssignmentCreateOrConnectWithoutCaseInput[]
    createMany?: CaseJudgeAssignmentCreateManyCaseInputEnvelope
    connect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CaseTypeUpdateOneRequiredWithoutCasesNestedInput = {
    create?: XOR<CaseTypeCreateWithoutCasesInput, CaseTypeUncheckedCreateWithoutCasesInput>
    connectOrCreate?: CaseTypeCreateOrConnectWithoutCasesInput
    upsert?: CaseTypeUpsertWithoutCasesInput
    connect?: CaseTypeWhereUniqueInput
    update?: XOR<XOR<CaseTypeUpdateToOneWithWhereWithoutCasesInput, CaseTypeUpdateWithoutCasesInput>, CaseTypeUncheckedUpdateWithoutCasesInput>
  }

  export type CourtUpdateOneWithoutCasesNestedInput = {
    create?: XOR<CourtCreateWithoutCasesInput, CourtUncheckedCreateWithoutCasesInput>
    connectOrCreate?: CourtCreateOrConnectWithoutCasesInput
    upsert?: CourtUpsertWithoutCasesInput
    disconnect?: CourtWhereInput | boolean
    delete?: CourtWhereInput | boolean
    connect?: CourtWhereUniqueInput
    update?: XOR<XOR<CourtUpdateToOneWithWhereWithoutCasesInput, CourtUpdateWithoutCasesInput>, CourtUncheckedUpdateWithoutCasesInput>
  }

  export type CaseActivityUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput> | CaseActivityCreateWithoutCaseInput[] | CaseActivityUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutCaseInput | CaseActivityCreateOrConnectWithoutCaseInput[]
    upsert?: CaseActivityUpsertWithWhereUniqueWithoutCaseInput | CaseActivityUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseActivityCreateManyCaseInputEnvelope
    set?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    disconnect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    delete?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    update?: CaseActivityUpdateWithWhereUniqueWithoutCaseInput | CaseActivityUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseActivityUpdateManyWithWhereWithoutCaseInput | CaseActivityUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
  }

  export type CaseJudgeAssignmentUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseJudgeAssignmentCreateWithoutCaseInput, CaseJudgeAssignmentUncheckedCreateWithoutCaseInput> | CaseJudgeAssignmentCreateWithoutCaseInput[] | CaseJudgeAssignmentUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseJudgeAssignmentCreateOrConnectWithoutCaseInput | CaseJudgeAssignmentCreateOrConnectWithoutCaseInput[]
    upsert?: CaseJudgeAssignmentUpsertWithWhereUniqueWithoutCaseInput | CaseJudgeAssignmentUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseJudgeAssignmentCreateManyCaseInputEnvelope
    set?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    disconnect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    delete?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    connect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    update?: CaseJudgeAssignmentUpdateWithWhereUniqueWithoutCaseInput | CaseJudgeAssignmentUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseJudgeAssignmentUpdateManyWithWhereWithoutCaseInput | CaseJudgeAssignmentUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseJudgeAssignmentScalarWhereInput | CaseJudgeAssignmentScalarWhereInput[]
  }

  export type CaseActivityUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput> | CaseActivityCreateWithoutCaseInput[] | CaseActivityUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutCaseInput | CaseActivityCreateOrConnectWithoutCaseInput[]
    upsert?: CaseActivityUpsertWithWhereUniqueWithoutCaseInput | CaseActivityUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseActivityCreateManyCaseInputEnvelope
    set?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    disconnect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    delete?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    update?: CaseActivityUpdateWithWhereUniqueWithoutCaseInput | CaseActivityUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseActivityUpdateManyWithWhereWithoutCaseInput | CaseActivityUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
  }

  export type CaseJudgeAssignmentUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseJudgeAssignmentCreateWithoutCaseInput, CaseJudgeAssignmentUncheckedCreateWithoutCaseInput> | CaseJudgeAssignmentCreateWithoutCaseInput[] | CaseJudgeAssignmentUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseJudgeAssignmentCreateOrConnectWithoutCaseInput | CaseJudgeAssignmentCreateOrConnectWithoutCaseInput[]
    upsert?: CaseJudgeAssignmentUpsertWithWhereUniqueWithoutCaseInput | CaseJudgeAssignmentUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseJudgeAssignmentCreateManyCaseInputEnvelope
    set?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    disconnect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    delete?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    connect?: CaseJudgeAssignmentWhereUniqueInput | CaseJudgeAssignmentWhereUniqueInput[]
    update?: CaseJudgeAssignmentUpdateWithWhereUniqueWithoutCaseInput | CaseJudgeAssignmentUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseJudgeAssignmentUpdateManyWithWhereWithoutCaseInput | CaseJudgeAssignmentUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseJudgeAssignmentScalarWhereInput | CaseJudgeAssignmentScalarWhereInput[]
  }

  export type CaseCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<CaseCreateWithoutActivitiesInput, CaseUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: CaseCreateOrConnectWithoutActivitiesInput
    connect?: CaseWhereUniqueInput
  }

  export type JudgeCreateNestedOneWithoutCaseActivitiesInput = {
    create?: XOR<JudgeCreateWithoutCaseActivitiesInput, JudgeUncheckedCreateWithoutCaseActivitiesInput>
    connectOrCreate?: JudgeCreateOrConnectWithoutCaseActivitiesInput
    connect?: JudgeWhereUniqueInput
  }

  export type DailyImportBatchCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<DailyImportBatchCreateWithoutActivitiesInput, DailyImportBatchUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutActivitiesInput
    connect?: DailyImportBatchWhereUniqueInput
  }

  export type CaseUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<CaseCreateWithoutActivitiesInput, CaseUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: CaseCreateOrConnectWithoutActivitiesInput
    upsert?: CaseUpsertWithoutActivitiesInput
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutActivitiesInput, CaseUpdateWithoutActivitiesInput>, CaseUncheckedUpdateWithoutActivitiesInput>
  }

  export type JudgeUpdateOneRequiredWithoutCaseActivitiesNestedInput = {
    create?: XOR<JudgeCreateWithoutCaseActivitiesInput, JudgeUncheckedCreateWithoutCaseActivitiesInput>
    connectOrCreate?: JudgeCreateOrConnectWithoutCaseActivitiesInput
    upsert?: JudgeUpsertWithoutCaseActivitiesInput
    connect?: JudgeWhereUniqueInput
    update?: XOR<XOR<JudgeUpdateToOneWithWhereWithoutCaseActivitiesInput, JudgeUpdateWithoutCaseActivitiesInput>, JudgeUncheckedUpdateWithoutCaseActivitiesInput>
  }

  export type DailyImportBatchUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<DailyImportBatchCreateWithoutActivitiesInput, DailyImportBatchUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutActivitiesInput
    upsert?: DailyImportBatchUpsertWithoutActivitiesInput
    connect?: DailyImportBatchWhereUniqueInput
    update?: XOR<XOR<DailyImportBatchUpdateToOneWithWhereWithoutActivitiesInput, DailyImportBatchUpdateWithoutActivitiesInput>, DailyImportBatchUncheckedUpdateWithoutActivitiesInput>
  }

  export type CaseCreateNestedOneWithoutJudgeAssignmentsInput = {
    create?: XOR<CaseCreateWithoutJudgeAssignmentsInput, CaseUncheckedCreateWithoutJudgeAssignmentsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutJudgeAssignmentsInput
    connect?: CaseWhereUniqueInput
  }

  export type JudgeCreateNestedOneWithoutCaseAssignmentsInput = {
    create?: XOR<JudgeCreateWithoutCaseAssignmentsInput, JudgeUncheckedCreateWithoutCaseAssignmentsInput>
    connectOrCreate?: JudgeCreateOrConnectWithoutCaseAssignmentsInput
    connect?: JudgeWhereUniqueInput
  }

  export type CaseUpdateOneRequiredWithoutJudgeAssignmentsNestedInput = {
    create?: XOR<CaseCreateWithoutJudgeAssignmentsInput, CaseUncheckedCreateWithoutJudgeAssignmentsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutJudgeAssignmentsInput
    upsert?: CaseUpsertWithoutJudgeAssignmentsInput
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutJudgeAssignmentsInput, CaseUpdateWithoutJudgeAssignmentsInput>, CaseUncheckedUpdateWithoutJudgeAssignmentsInput>
  }

  export type JudgeUpdateOneRequiredWithoutCaseAssignmentsNestedInput = {
    create?: XOR<JudgeCreateWithoutCaseAssignmentsInput, JudgeUncheckedCreateWithoutCaseAssignmentsInput>
    connectOrCreate?: JudgeCreateOrConnectWithoutCaseAssignmentsInput
    upsert?: JudgeUpsertWithoutCaseAssignmentsInput
    connect?: JudgeWhereUniqueInput
    update?: XOR<XOR<JudgeUpdateToOneWithWhereWithoutCaseAssignmentsInput, JudgeUpdateWithoutCaseAssignmentsInput>, JudgeUncheckedUpdateWithoutCaseAssignmentsInput>
  }

  export type CaseActivityCreateNestedManyWithoutImportBatchInput = {
    create?: XOR<CaseActivityCreateWithoutImportBatchInput, CaseActivityUncheckedCreateWithoutImportBatchInput> | CaseActivityCreateWithoutImportBatchInput[] | CaseActivityUncheckedCreateWithoutImportBatchInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutImportBatchInput | CaseActivityCreateOrConnectWithoutImportBatchInput[]
    createMany?: CaseActivityCreateManyImportBatchInputEnvelope
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutImportBatchesInput = {
    create?: XOR<UserCreateWithoutImportBatchesInput, UserUncheckedCreateWithoutImportBatchesInput>
    connectOrCreate?: UserCreateOrConnectWithoutImportBatchesInput
    connect?: UserWhereUniqueInput
  }

  export type ImportProgressCreateNestedManyWithoutBatchInput = {
    create?: XOR<ImportProgressCreateWithoutBatchInput, ImportProgressUncheckedCreateWithoutBatchInput> | ImportProgressCreateWithoutBatchInput[] | ImportProgressUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: ImportProgressCreateOrConnectWithoutBatchInput | ImportProgressCreateOrConnectWithoutBatchInput[]
    createMany?: ImportProgressCreateManyBatchInputEnvelope
    connect?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
  }

  export type ImportErrorDetailCreateNestedManyWithoutBatchInput = {
    create?: XOR<ImportErrorDetailCreateWithoutBatchInput, ImportErrorDetailUncheckedCreateWithoutBatchInput> | ImportErrorDetailCreateWithoutBatchInput[] | ImportErrorDetailUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: ImportErrorDetailCreateOrConnectWithoutBatchInput | ImportErrorDetailCreateOrConnectWithoutBatchInput[]
    createMany?: ImportErrorDetailCreateManyBatchInputEnvelope
    connect?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
  }

  export type CaseActivityUncheckedCreateNestedManyWithoutImportBatchInput = {
    create?: XOR<CaseActivityCreateWithoutImportBatchInput, CaseActivityUncheckedCreateWithoutImportBatchInput> | CaseActivityCreateWithoutImportBatchInput[] | CaseActivityUncheckedCreateWithoutImportBatchInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutImportBatchInput | CaseActivityCreateOrConnectWithoutImportBatchInput[]
    createMany?: CaseActivityCreateManyImportBatchInputEnvelope
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
  }

  export type ImportProgressUncheckedCreateNestedManyWithoutBatchInput = {
    create?: XOR<ImportProgressCreateWithoutBatchInput, ImportProgressUncheckedCreateWithoutBatchInput> | ImportProgressCreateWithoutBatchInput[] | ImportProgressUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: ImportProgressCreateOrConnectWithoutBatchInput | ImportProgressCreateOrConnectWithoutBatchInput[]
    createMany?: ImportProgressCreateManyBatchInputEnvelope
    connect?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
  }

  export type ImportErrorDetailUncheckedCreateNestedManyWithoutBatchInput = {
    create?: XOR<ImportErrorDetailCreateWithoutBatchInput, ImportErrorDetailUncheckedCreateWithoutBatchInput> | ImportErrorDetailCreateWithoutBatchInput[] | ImportErrorDetailUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: ImportErrorDetailCreateOrConnectWithoutBatchInput | ImportErrorDetailCreateOrConnectWithoutBatchInput[]
    createMany?: ImportErrorDetailCreateManyBatchInputEnvelope
    connect?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
  }

  export type CaseActivityUpdateManyWithoutImportBatchNestedInput = {
    create?: XOR<CaseActivityCreateWithoutImportBatchInput, CaseActivityUncheckedCreateWithoutImportBatchInput> | CaseActivityCreateWithoutImportBatchInput[] | CaseActivityUncheckedCreateWithoutImportBatchInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutImportBatchInput | CaseActivityCreateOrConnectWithoutImportBatchInput[]
    upsert?: CaseActivityUpsertWithWhereUniqueWithoutImportBatchInput | CaseActivityUpsertWithWhereUniqueWithoutImportBatchInput[]
    createMany?: CaseActivityCreateManyImportBatchInputEnvelope
    set?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    disconnect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    delete?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    update?: CaseActivityUpdateWithWhereUniqueWithoutImportBatchInput | CaseActivityUpdateWithWhereUniqueWithoutImportBatchInput[]
    updateMany?: CaseActivityUpdateManyWithWhereWithoutImportBatchInput | CaseActivityUpdateManyWithWhereWithoutImportBatchInput[]
    deleteMany?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutImportBatchesNestedInput = {
    create?: XOR<UserCreateWithoutImportBatchesInput, UserUncheckedCreateWithoutImportBatchesInput>
    connectOrCreate?: UserCreateOrConnectWithoutImportBatchesInput
    upsert?: UserUpsertWithoutImportBatchesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutImportBatchesInput, UserUpdateWithoutImportBatchesInput>, UserUncheckedUpdateWithoutImportBatchesInput>
  }

  export type ImportProgressUpdateManyWithoutBatchNestedInput = {
    create?: XOR<ImportProgressCreateWithoutBatchInput, ImportProgressUncheckedCreateWithoutBatchInput> | ImportProgressCreateWithoutBatchInput[] | ImportProgressUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: ImportProgressCreateOrConnectWithoutBatchInput | ImportProgressCreateOrConnectWithoutBatchInput[]
    upsert?: ImportProgressUpsertWithWhereUniqueWithoutBatchInput | ImportProgressUpsertWithWhereUniqueWithoutBatchInput[]
    createMany?: ImportProgressCreateManyBatchInputEnvelope
    set?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
    disconnect?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
    delete?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
    connect?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
    update?: ImportProgressUpdateWithWhereUniqueWithoutBatchInput | ImportProgressUpdateWithWhereUniqueWithoutBatchInput[]
    updateMany?: ImportProgressUpdateManyWithWhereWithoutBatchInput | ImportProgressUpdateManyWithWhereWithoutBatchInput[]
    deleteMany?: ImportProgressScalarWhereInput | ImportProgressScalarWhereInput[]
  }

  export type ImportErrorDetailUpdateManyWithoutBatchNestedInput = {
    create?: XOR<ImportErrorDetailCreateWithoutBatchInput, ImportErrorDetailUncheckedCreateWithoutBatchInput> | ImportErrorDetailCreateWithoutBatchInput[] | ImportErrorDetailUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: ImportErrorDetailCreateOrConnectWithoutBatchInput | ImportErrorDetailCreateOrConnectWithoutBatchInput[]
    upsert?: ImportErrorDetailUpsertWithWhereUniqueWithoutBatchInput | ImportErrorDetailUpsertWithWhereUniqueWithoutBatchInput[]
    createMany?: ImportErrorDetailCreateManyBatchInputEnvelope
    set?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
    disconnect?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
    delete?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
    connect?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
    update?: ImportErrorDetailUpdateWithWhereUniqueWithoutBatchInput | ImportErrorDetailUpdateWithWhereUniqueWithoutBatchInput[]
    updateMany?: ImportErrorDetailUpdateManyWithWhereWithoutBatchInput | ImportErrorDetailUpdateManyWithWhereWithoutBatchInput[]
    deleteMany?: ImportErrorDetailScalarWhereInput | ImportErrorDetailScalarWhereInput[]
  }

  export type CaseActivityUncheckedUpdateManyWithoutImportBatchNestedInput = {
    create?: XOR<CaseActivityCreateWithoutImportBatchInput, CaseActivityUncheckedCreateWithoutImportBatchInput> | CaseActivityCreateWithoutImportBatchInput[] | CaseActivityUncheckedCreateWithoutImportBatchInput[]
    connectOrCreate?: CaseActivityCreateOrConnectWithoutImportBatchInput | CaseActivityCreateOrConnectWithoutImportBatchInput[]
    upsert?: CaseActivityUpsertWithWhereUniqueWithoutImportBatchInput | CaseActivityUpsertWithWhereUniqueWithoutImportBatchInput[]
    createMany?: CaseActivityCreateManyImportBatchInputEnvelope
    set?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    disconnect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    delete?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    connect?: CaseActivityWhereUniqueInput | CaseActivityWhereUniqueInput[]
    update?: CaseActivityUpdateWithWhereUniqueWithoutImportBatchInput | CaseActivityUpdateWithWhereUniqueWithoutImportBatchInput[]
    updateMany?: CaseActivityUpdateManyWithWhereWithoutImportBatchInput | CaseActivityUpdateManyWithWhereWithoutImportBatchInput[]
    deleteMany?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
  }

  export type ImportProgressUncheckedUpdateManyWithoutBatchNestedInput = {
    create?: XOR<ImportProgressCreateWithoutBatchInput, ImportProgressUncheckedCreateWithoutBatchInput> | ImportProgressCreateWithoutBatchInput[] | ImportProgressUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: ImportProgressCreateOrConnectWithoutBatchInput | ImportProgressCreateOrConnectWithoutBatchInput[]
    upsert?: ImportProgressUpsertWithWhereUniqueWithoutBatchInput | ImportProgressUpsertWithWhereUniqueWithoutBatchInput[]
    createMany?: ImportProgressCreateManyBatchInputEnvelope
    set?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
    disconnect?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
    delete?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
    connect?: ImportProgressWhereUniqueInput | ImportProgressWhereUniqueInput[]
    update?: ImportProgressUpdateWithWhereUniqueWithoutBatchInput | ImportProgressUpdateWithWhereUniqueWithoutBatchInput[]
    updateMany?: ImportProgressUpdateManyWithWhereWithoutBatchInput | ImportProgressUpdateManyWithWhereWithoutBatchInput[]
    deleteMany?: ImportProgressScalarWhereInput | ImportProgressScalarWhereInput[]
  }

  export type ImportErrorDetailUncheckedUpdateManyWithoutBatchNestedInput = {
    create?: XOR<ImportErrorDetailCreateWithoutBatchInput, ImportErrorDetailUncheckedCreateWithoutBatchInput> | ImportErrorDetailCreateWithoutBatchInput[] | ImportErrorDetailUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: ImportErrorDetailCreateOrConnectWithoutBatchInput | ImportErrorDetailCreateOrConnectWithoutBatchInput[]
    upsert?: ImportErrorDetailUpsertWithWhereUniqueWithoutBatchInput | ImportErrorDetailUpsertWithWhereUniqueWithoutBatchInput[]
    createMany?: ImportErrorDetailCreateManyBatchInputEnvelope
    set?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
    disconnect?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
    delete?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
    connect?: ImportErrorDetailWhereUniqueInput | ImportErrorDetailWhereUniqueInput[]
    update?: ImportErrorDetailUpdateWithWhereUniqueWithoutBatchInput | ImportErrorDetailUpdateWithWhereUniqueWithoutBatchInput[]
    updateMany?: ImportErrorDetailUpdateManyWithWhereWithoutBatchInput | ImportErrorDetailUpdateManyWithWhereWithoutBatchInput[]
    deleteMany?: ImportErrorDetailScalarWhereInput | ImportErrorDetailScalarWhereInput[]
  }

  export type DailyImportBatchCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyImportBatchCreateWithoutUserInput, DailyImportBatchUncheckedCreateWithoutUserInput> | DailyImportBatchCreateWithoutUserInput[] | DailyImportBatchUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutUserInput | DailyImportBatchCreateOrConnectWithoutUserInput[]
    createMany?: DailyImportBatchCreateManyUserInputEnvelope
    connect?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
  }

  export type ImportSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ImportSessionCreateWithoutUserInput, ImportSessionUncheckedCreateWithoutUserInput> | ImportSessionCreateWithoutUserInput[] | ImportSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImportSessionCreateOrConnectWithoutUserInput | ImportSessionCreateOrConnectWithoutUserInput[]
    createMany?: ImportSessionCreateManyUserInputEnvelope
    connect?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
  }

  export type ValidationResultCreateNestedManyWithoutUserInput = {
    create?: XOR<ValidationResultCreateWithoutUserInput, ValidationResultUncheckedCreateWithoutUserInput> | ValidationResultCreateWithoutUserInput[] | ValidationResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ValidationResultCreateOrConnectWithoutUserInput | ValidationResultCreateOrConnectWithoutUserInput[]
    createMany?: ValidationResultCreateManyUserInputEnvelope
    connect?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
  }

  export type DailyImportBatchUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyImportBatchCreateWithoutUserInput, DailyImportBatchUncheckedCreateWithoutUserInput> | DailyImportBatchCreateWithoutUserInput[] | DailyImportBatchUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutUserInput | DailyImportBatchCreateOrConnectWithoutUserInput[]
    createMany?: DailyImportBatchCreateManyUserInputEnvelope
    connect?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
  }

  export type ImportSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ImportSessionCreateWithoutUserInput, ImportSessionUncheckedCreateWithoutUserInput> | ImportSessionCreateWithoutUserInput[] | ImportSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImportSessionCreateOrConnectWithoutUserInput | ImportSessionCreateOrConnectWithoutUserInput[]
    createMany?: ImportSessionCreateManyUserInputEnvelope
    connect?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
  }

  export type ValidationResultUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ValidationResultCreateWithoutUserInput, ValidationResultUncheckedCreateWithoutUserInput> | ValidationResultCreateWithoutUserInput[] | ValidationResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ValidationResultCreateOrConnectWithoutUserInput | ValidationResultCreateOrConnectWithoutUserInput[]
    createMany?: ValidationResultCreateManyUserInputEnvelope
    connect?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
  }

  export type DailyImportBatchUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyImportBatchCreateWithoutUserInput, DailyImportBatchUncheckedCreateWithoutUserInput> | DailyImportBatchCreateWithoutUserInput[] | DailyImportBatchUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutUserInput | DailyImportBatchCreateOrConnectWithoutUserInput[]
    upsert?: DailyImportBatchUpsertWithWhereUniqueWithoutUserInput | DailyImportBatchUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyImportBatchCreateManyUserInputEnvelope
    set?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
    disconnect?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
    delete?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
    connect?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
    update?: DailyImportBatchUpdateWithWhereUniqueWithoutUserInput | DailyImportBatchUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyImportBatchUpdateManyWithWhereWithoutUserInput | DailyImportBatchUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyImportBatchScalarWhereInput | DailyImportBatchScalarWhereInput[]
  }

  export type ImportSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ImportSessionCreateWithoutUserInput, ImportSessionUncheckedCreateWithoutUserInput> | ImportSessionCreateWithoutUserInput[] | ImportSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImportSessionCreateOrConnectWithoutUserInput | ImportSessionCreateOrConnectWithoutUserInput[]
    upsert?: ImportSessionUpsertWithWhereUniqueWithoutUserInput | ImportSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ImportSessionCreateManyUserInputEnvelope
    set?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
    disconnect?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
    delete?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
    connect?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
    update?: ImportSessionUpdateWithWhereUniqueWithoutUserInput | ImportSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ImportSessionUpdateManyWithWhereWithoutUserInput | ImportSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ImportSessionScalarWhereInput | ImportSessionScalarWhereInput[]
  }

  export type ValidationResultUpdateManyWithoutUserNestedInput = {
    create?: XOR<ValidationResultCreateWithoutUserInput, ValidationResultUncheckedCreateWithoutUserInput> | ValidationResultCreateWithoutUserInput[] | ValidationResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ValidationResultCreateOrConnectWithoutUserInput | ValidationResultCreateOrConnectWithoutUserInput[]
    upsert?: ValidationResultUpsertWithWhereUniqueWithoutUserInput | ValidationResultUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ValidationResultCreateManyUserInputEnvelope
    set?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
    disconnect?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
    delete?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
    connect?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
    update?: ValidationResultUpdateWithWhereUniqueWithoutUserInput | ValidationResultUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ValidationResultUpdateManyWithWhereWithoutUserInput | ValidationResultUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ValidationResultScalarWhereInput | ValidationResultScalarWhereInput[]
  }

  export type DailyImportBatchUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyImportBatchCreateWithoutUserInput, DailyImportBatchUncheckedCreateWithoutUserInput> | DailyImportBatchCreateWithoutUserInput[] | DailyImportBatchUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutUserInput | DailyImportBatchCreateOrConnectWithoutUserInput[]
    upsert?: DailyImportBatchUpsertWithWhereUniqueWithoutUserInput | DailyImportBatchUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyImportBatchCreateManyUserInputEnvelope
    set?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
    disconnect?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
    delete?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
    connect?: DailyImportBatchWhereUniqueInput | DailyImportBatchWhereUniqueInput[]
    update?: DailyImportBatchUpdateWithWhereUniqueWithoutUserInput | DailyImportBatchUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyImportBatchUpdateManyWithWhereWithoutUserInput | DailyImportBatchUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyImportBatchScalarWhereInput | DailyImportBatchScalarWhereInput[]
  }

  export type ImportSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ImportSessionCreateWithoutUserInput, ImportSessionUncheckedCreateWithoutUserInput> | ImportSessionCreateWithoutUserInput[] | ImportSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImportSessionCreateOrConnectWithoutUserInput | ImportSessionCreateOrConnectWithoutUserInput[]
    upsert?: ImportSessionUpsertWithWhereUniqueWithoutUserInput | ImportSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ImportSessionCreateManyUserInputEnvelope
    set?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
    disconnect?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
    delete?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
    connect?: ImportSessionWhereUniqueInput | ImportSessionWhereUniqueInput[]
    update?: ImportSessionUpdateWithWhereUniqueWithoutUserInput | ImportSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ImportSessionUpdateManyWithWhereWithoutUserInput | ImportSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ImportSessionScalarWhereInput | ImportSessionScalarWhereInput[]
  }

  export type ValidationResultUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ValidationResultCreateWithoutUserInput, ValidationResultUncheckedCreateWithoutUserInput> | ValidationResultCreateWithoutUserInput[] | ValidationResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ValidationResultCreateOrConnectWithoutUserInput | ValidationResultCreateOrConnectWithoutUserInput[]
    upsert?: ValidationResultUpsertWithWhereUniqueWithoutUserInput | ValidationResultUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ValidationResultCreateManyUserInputEnvelope
    set?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
    disconnect?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
    delete?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
    connect?: ValidationResultWhereUniqueInput | ValidationResultWhereUniqueInput[]
    update?: ValidationResultUpdateWithWhereUniqueWithoutUserInput | ValidationResultUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ValidationResultUpdateManyWithWhereWithoutUserInput | ValidationResultUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ValidationResultScalarWhereInput | ValidationResultScalarWhereInput[]
  }

  export type DailyImportBatchCreateNestedOneWithoutProgressInput = {
    create?: XOR<DailyImportBatchCreateWithoutProgressInput, DailyImportBatchUncheckedCreateWithoutProgressInput>
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutProgressInput
    connect?: DailyImportBatchWhereUniqueInput
  }

  export type DailyImportBatchUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<DailyImportBatchCreateWithoutProgressInput, DailyImportBatchUncheckedCreateWithoutProgressInput>
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutProgressInput
    upsert?: DailyImportBatchUpsertWithoutProgressInput
    connect?: DailyImportBatchWhereUniqueInput
    update?: XOR<XOR<DailyImportBatchUpdateToOneWithWhereWithoutProgressInput, DailyImportBatchUpdateWithoutProgressInput>, DailyImportBatchUncheckedUpdateWithoutProgressInput>
  }

  export type DailyImportBatchCreateNestedOneWithoutErrorDetailsInput = {
    create?: XOR<DailyImportBatchCreateWithoutErrorDetailsInput, DailyImportBatchUncheckedCreateWithoutErrorDetailsInput>
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutErrorDetailsInput
    connect?: DailyImportBatchWhereUniqueInput
  }

  export type DailyImportBatchUpdateOneRequiredWithoutErrorDetailsNestedInput = {
    create?: XOR<DailyImportBatchCreateWithoutErrorDetailsInput, DailyImportBatchUncheckedCreateWithoutErrorDetailsInput>
    connectOrCreate?: DailyImportBatchCreateOrConnectWithoutErrorDetailsInput
    upsert?: DailyImportBatchUpsertWithoutErrorDetailsInput
    connect?: DailyImportBatchWhereUniqueInput
    update?: XOR<XOR<DailyImportBatchUpdateToOneWithWhereWithoutErrorDetailsInput, DailyImportBatchUpdateWithoutErrorDetailsInput>, DailyImportBatchUncheckedUpdateWithoutErrorDetailsInput>
  }

  export type UserCreateNestedOneWithoutImportSessionsInput = {
    create?: XOR<UserCreateWithoutImportSessionsInput, UserUncheckedCreateWithoutImportSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutImportSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutImportSessionsNestedInput = {
    create?: XOR<UserCreateWithoutImportSessionsInput, UserUncheckedCreateWithoutImportSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutImportSessionsInput
    upsert?: UserUpsertWithoutImportSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutImportSessionsInput, UserUpdateWithoutImportSessionsInput>, UserUncheckedUpdateWithoutImportSessionsInput>
  }

  export type UserCreateNestedOneWithoutValidationResultsInput = {
    create?: XOR<UserCreateWithoutValidationResultsInput, UserUncheckedCreateWithoutValidationResultsInput>
    connectOrCreate?: UserCreateOrConnectWithoutValidationResultsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutValidationResultsNestedInput = {
    create?: XOR<UserCreateWithoutValidationResultsInput, UserUncheckedCreateWithoutValidationResultsInput>
    connectOrCreate?: UserCreateOrConnectWithoutValidationResultsInput
    upsert?: UserUpsertWithoutValidationResultsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutValidationResultsInput, UserUpdateWithoutValidationResultsInput>, UserUncheckedUpdateWithoutValidationResultsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CaseCreateWithoutOriginalCourtInput = {
    id?: string
    caseNumber: string
    courtName: string
    filedDate: Date | string
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    caseType: CaseTypeCreateNestedOneWithoutCasesInput
    activities?: CaseActivityCreateNestedManyWithoutCaseInput
    judgeAssignments?: CaseJudgeAssignmentCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutOriginalCourtInput = {
    id?: string
    caseNumber: string
    courtName: string
    caseTypeId: string
    filedDate: Date | string
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    activities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
    judgeAssignments?: CaseJudgeAssignmentUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutOriginalCourtInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutOriginalCourtInput, CaseUncheckedCreateWithoutOriginalCourtInput>
  }

  export type CaseCreateManyOriginalCourtInputEnvelope = {
    data: CaseCreateManyOriginalCourtInput | CaseCreateManyOriginalCourtInput[]
  }

  export type CaseUpsertWithWhereUniqueWithoutOriginalCourtInput = {
    where: CaseWhereUniqueInput
    update: XOR<CaseUpdateWithoutOriginalCourtInput, CaseUncheckedUpdateWithoutOriginalCourtInput>
    create: XOR<CaseCreateWithoutOriginalCourtInput, CaseUncheckedCreateWithoutOriginalCourtInput>
  }

  export type CaseUpdateWithWhereUniqueWithoutOriginalCourtInput = {
    where: CaseWhereUniqueInput
    data: XOR<CaseUpdateWithoutOriginalCourtInput, CaseUncheckedUpdateWithoutOriginalCourtInput>
  }

  export type CaseUpdateManyWithWhereWithoutOriginalCourtInput = {
    where: CaseScalarWhereInput
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyWithoutOriginalCourtInput>
  }

  export type CaseScalarWhereInput = {
    AND?: CaseScalarWhereInput | CaseScalarWhereInput[]
    OR?: CaseScalarWhereInput[]
    NOT?: CaseScalarWhereInput | CaseScalarWhereInput[]
    id?: StringFilter<"Case"> | string
    caseNumber?: StringFilter<"Case"> | string
    courtName?: StringFilter<"Case"> | string
    caseTypeId?: StringFilter<"Case"> | string
    filedDate?: DateTimeFilter<"Case"> | Date | string
    originalCourtId?: StringNullableFilter<"Case"> | string | null
    originalCaseNumber?: StringNullableFilter<"Case"> | string | null
    originalYear?: IntNullableFilter<"Case"> | number | null
    parties?: JsonFilter<"Case">
    status?: StringFilter<"Case"> | string
    lastActivityDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    totalActivities?: IntFilter<"Case"> | number
    hasLegalRepresentation?: BoolFilter<"Case"> | boolean
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    caseidType?: StringNullableFilter<"Case"> | string | null
    caseidNo?: StringNullableFilter<"Case"> | string | null
    maleApplicant?: IntFilter<"Case"> | number
    femaleApplicant?: IntFilter<"Case"> | number
    organizationApplicant?: IntFilter<"Case"> | number
    maleDefendant?: IntFilter<"Case"> | number
    femaleDefendant?: IntFilter<"Case"> | number
    organizationDefendant?: IntFilter<"Case"> | number
  }

  export type CaseActivityCreateWithoutPrimaryJudgeInput = {
    id?: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
    case: CaseCreateNestedOneWithoutActivitiesInput
    importBatch: DailyImportBatchCreateNestedOneWithoutActivitiesInput
  }

  export type CaseActivityUncheckedCreateWithoutPrimaryJudgeInput = {
    id?: string
    caseId: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    importBatchId: string
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
  }

  export type CaseActivityCreateOrConnectWithoutPrimaryJudgeInput = {
    where: CaseActivityWhereUniqueInput
    create: XOR<CaseActivityCreateWithoutPrimaryJudgeInput, CaseActivityUncheckedCreateWithoutPrimaryJudgeInput>
  }

  export type CaseActivityCreateManyPrimaryJudgeInputEnvelope = {
    data: CaseActivityCreateManyPrimaryJudgeInput | CaseActivityCreateManyPrimaryJudgeInput[]
  }

  export type CaseJudgeAssignmentCreateWithoutJudgeInput = {
    assignedAt?: Date | string
    isPrimary?: boolean
    case: CaseCreateNestedOneWithoutJudgeAssignmentsInput
  }

  export type CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput = {
    caseId: string
    assignedAt?: Date | string
    isPrimary?: boolean
  }

  export type CaseJudgeAssignmentCreateOrConnectWithoutJudgeInput = {
    where: CaseJudgeAssignmentWhereUniqueInput
    create: XOR<CaseJudgeAssignmentCreateWithoutJudgeInput, CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput>
  }

  export type CaseJudgeAssignmentCreateManyJudgeInputEnvelope = {
    data: CaseJudgeAssignmentCreateManyJudgeInput | CaseJudgeAssignmentCreateManyJudgeInput[]
  }

  export type CaseActivityUpsertWithWhereUniqueWithoutPrimaryJudgeInput = {
    where: CaseActivityWhereUniqueInput
    update: XOR<CaseActivityUpdateWithoutPrimaryJudgeInput, CaseActivityUncheckedUpdateWithoutPrimaryJudgeInput>
    create: XOR<CaseActivityCreateWithoutPrimaryJudgeInput, CaseActivityUncheckedCreateWithoutPrimaryJudgeInput>
  }

  export type CaseActivityUpdateWithWhereUniqueWithoutPrimaryJudgeInput = {
    where: CaseActivityWhereUniqueInput
    data: XOR<CaseActivityUpdateWithoutPrimaryJudgeInput, CaseActivityUncheckedUpdateWithoutPrimaryJudgeInput>
  }

  export type CaseActivityUpdateManyWithWhereWithoutPrimaryJudgeInput = {
    where: CaseActivityScalarWhereInput
    data: XOR<CaseActivityUpdateManyMutationInput, CaseActivityUncheckedUpdateManyWithoutPrimaryJudgeInput>
  }

  export type CaseActivityScalarWhereInput = {
    AND?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
    OR?: CaseActivityScalarWhereInput[]
    NOT?: CaseActivityScalarWhereInput | CaseActivityScalarWhereInput[]
    id?: StringFilter<"CaseActivity"> | string
    caseId?: StringFilter<"CaseActivity"> | string
    activityDate?: DateTimeFilter<"CaseActivity"> | Date | string
    activityType?: StringFilter<"CaseActivity"> | string
    outcome?: StringFilter<"CaseActivity"> | string
    reasonForAdjournment?: StringNullableFilter<"CaseActivity"> | string | null
    nextHearingDate?: DateTimeNullableFilter<"CaseActivity"> | Date | string | null
    primaryJudgeId?: StringFilter<"CaseActivity"> | string
    hasLegalRepresentation?: BoolFilter<"CaseActivity"> | boolean
    applicantWitnesses?: IntFilter<"CaseActivity"> | number
    defendantWitnesses?: IntFilter<"CaseActivity"> | number
    custodyStatus?: StringFilter<"CaseActivity"> | string
    details?: StringNullableFilter<"CaseActivity"> | string | null
    importBatchId?: StringFilter<"CaseActivity"> | string
    createdAt?: DateTimeFilter<"CaseActivity"> | Date | string
    judge1?: StringNullableFilter<"CaseActivity"> | string | null
    judge2?: StringNullableFilter<"CaseActivity"> | string | null
    judge3?: StringNullableFilter<"CaseActivity"> | string | null
    judge4?: StringNullableFilter<"CaseActivity"> | string | null
    judge5?: StringNullableFilter<"CaseActivity"> | string | null
    judge6?: StringNullableFilter<"CaseActivity"> | string | null
    judge7?: StringNullableFilter<"CaseActivity"> | string | null
    comingFor?: StringNullableFilter<"CaseActivity"> | string | null
    legalRepString?: StringNullableFilter<"CaseActivity"> | string | null
    custodyNumeric?: IntNullableFilter<"CaseActivity"> | number | null
    otherDetails?: StringNullableFilter<"CaseActivity"> | string | null
  }

  export type CaseJudgeAssignmentUpsertWithWhereUniqueWithoutJudgeInput = {
    where: CaseJudgeAssignmentWhereUniqueInput
    update: XOR<CaseJudgeAssignmentUpdateWithoutJudgeInput, CaseJudgeAssignmentUncheckedUpdateWithoutJudgeInput>
    create: XOR<CaseJudgeAssignmentCreateWithoutJudgeInput, CaseJudgeAssignmentUncheckedCreateWithoutJudgeInput>
  }

  export type CaseJudgeAssignmentUpdateWithWhereUniqueWithoutJudgeInput = {
    where: CaseJudgeAssignmentWhereUniqueInput
    data: XOR<CaseJudgeAssignmentUpdateWithoutJudgeInput, CaseJudgeAssignmentUncheckedUpdateWithoutJudgeInput>
  }

  export type CaseJudgeAssignmentUpdateManyWithWhereWithoutJudgeInput = {
    where: CaseJudgeAssignmentScalarWhereInput
    data: XOR<CaseJudgeAssignmentUpdateManyMutationInput, CaseJudgeAssignmentUncheckedUpdateManyWithoutJudgeInput>
  }

  export type CaseJudgeAssignmentScalarWhereInput = {
    AND?: CaseJudgeAssignmentScalarWhereInput | CaseJudgeAssignmentScalarWhereInput[]
    OR?: CaseJudgeAssignmentScalarWhereInput[]
    NOT?: CaseJudgeAssignmentScalarWhereInput | CaseJudgeAssignmentScalarWhereInput[]
    caseId?: StringFilter<"CaseJudgeAssignment"> | string
    judgeId?: StringFilter<"CaseJudgeAssignment"> | string
    assignedAt?: DateTimeFilter<"CaseJudgeAssignment"> | Date | string
    isPrimary?: BoolFilter<"CaseJudgeAssignment"> | boolean
  }

  export type CaseCreateWithoutCaseTypeInput = {
    id?: string
    caseNumber: string
    courtName: string
    filedDate: Date | string
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    originalCourt?: CourtCreateNestedOneWithoutCasesInput
    activities?: CaseActivityCreateNestedManyWithoutCaseInput
    judgeAssignments?: CaseJudgeAssignmentCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutCaseTypeInput = {
    id?: string
    caseNumber: string
    courtName: string
    filedDate: Date | string
    originalCourtId?: string | null
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    activities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
    judgeAssignments?: CaseJudgeAssignmentUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutCaseTypeInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutCaseTypeInput, CaseUncheckedCreateWithoutCaseTypeInput>
  }

  export type CaseCreateManyCaseTypeInputEnvelope = {
    data: CaseCreateManyCaseTypeInput | CaseCreateManyCaseTypeInput[]
  }

  export type CaseUpsertWithWhereUniqueWithoutCaseTypeInput = {
    where: CaseWhereUniqueInput
    update: XOR<CaseUpdateWithoutCaseTypeInput, CaseUncheckedUpdateWithoutCaseTypeInput>
    create: XOR<CaseCreateWithoutCaseTypeInput, CaseUncheckedCreateWithoutCaseTypeInput>
  }

  export type CaseUpdateWithWhereUniqueWithoutCaseTypeInput = {
    where: CaseWhereUniqueInput
    data: XOR<CaseUpdateWithoutCaseTypeInput, CaseUncheckedUpdateWithoutCaseTypeInput>
  }

  export type CaseUpdateManyWithWhereWithoutCaseTypeInput = {
    where: CaseScalarWhereInput
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyWithoutCaseTypeInput>
  }

  export type CaseTypeCreateWithoutCasesInput = {
    id?: string
    caseTypeName: string
    caseTypeCode: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type CaseTypeUncheckedCreateWithoutCasesInput = {
    id?: string
    caseTypeName: string
    caseTypeCode: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type CaseTypeCreateOrConnectWithoutCasesInput = {
    where: CaseTypeWhereUniqueInput
    create: XOR<CaseTypeCreateWithoutCasesInput, CaseTypeUncheckedCreateWithoutCasesInput>
  }

  export type CourtCreateWithoutCasesInput = {
    id?: string
    courtName: string
    courtCode: string
    courtType: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    originalCode?: string | null
    originalNumber?: string | null
    originalYear?: number | null
  }

  export type CourtUncheckedCreateWithoutCasesInput = {
    id?: string
    courtName: string
    courtCode: string
    courtType: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    originalCode?: string | null
    originalNumber?: string | null
    originalYear?: number | null
  }

  export type CourtCreateOrConnectWithoutCasesInput = {
    where: CourtWhereUniqueInput
    create: XOR<CourtCreateWithoutCasesInput, CourtUncheckedCreateWithoutCasesInput>
  }

  export type CaseActivityCreateWithoutCaseInput = {
    id?: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
    primaryJudge: JudgeCreateNestedOneWithoutCaseActivitiesInput
    importBatch: DailyImportBatchCreateNestedOneWithoutActivitiesInput
  }

  export type CaseActivityUncheckedCreateWithoutCaseInput = {
    id?: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    primaryJudgeId: string
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    importBatchId: string
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
  }

  export type CaseActivityCreateOrConnectWithoutCaseInput = {
    where: CaseActivityWhereUniqueInput
    create: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput>
  }

  export type CaseActivityCreateManyCaseInputEnvelope = {
    data: CaseActivityCreateManyCaseInput | CaseActivityCreateManyCaseInput[]
  }

  export type CaseJudgeAssignmentCreateWithoutCaseInput = {
    assignedAt?: Date | string
    isPrimary?: boolean
    judge: JudgeCreateNestedOneWithoutCaseAssignmentsInput
  }

  export type CaseJudgeAssignmentUncheckedCreateWithoutCaseInput = {
    judgeId: string
    assignedAt?: Date | string
    isPrimary?: boolean
  }

  export type CaseJudgeAssignmentCreateOrConnectWithoutCaseInput = {
    where: CaseJudgeAssignmentWhereUniqueInput
    create: XOR<CaseJudgeAssignmentCreateWithoutCaseInput, CaseJudgeAssignmentUncheckedCreateWithoutCaseInput>
  }

  export type CaseJudgeAssignmentCreateManyCaseInputEnvelope = {
    data: CaseJudgeAssignmentCreateManyCaseInput | CaseJudgeAssignmentCreateManyCaseInput[]
  }

  export type CaseTypeUpsertWithoutCasesInput = {
    update: XOR<CaseTypeUpdateWithoutCasesInput, CaseTypeUncheckedUpdateWithoutCasesInput>
    create: XOR<CaseTypeCreateWithoutCasesInput, CaseTypeUncheckedCreateWithoutCasesInput>
    where?: CaseTypeWhereInput
  }

  export type CaseTypeUpdateToOneWithWhereWithoutCasesInput = {
    where?: CaseTypeWhereInput
    data: XOR<CaseTypeUpdateWithoutCasesInput, CaseTypeUncheckedUpdateWithoutCasesInput>
  }

  export type CaseTypeUpdateWithoutCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseTypeName?: StringFieldUpdateOperationsInput | string
    caseTypeCode?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseTypeUncheckedUpdateWithoutCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseTypeName?: StringFieldUpdateOperationsInput | string
    caseTypeCode?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourtUpsertWithoutCasesInput = {
    update: XOR<CourtUpdateWithoutCasesInput, CourtUncheckedUpdateWithoutCasesInput>
    create: XOR<CourtCreateWithoutCasesInput, CourtUncheckedCreateWithoutCasesInput>
    where?: CourtWhereInput
  }

  export type CourtUpdateToOneWithWhereWithoutCasesInput = {
    where?: CourtWhereInput
    data: XOR<CourtUpdateWithoutCasesInput, CourtUncheckedUpdateWithoutCasesInput>
  }

  export type CourtUpdateWithoutCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    courtCode?: StringFieldUpdateOperationsInput | string
    courtType?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCode?: NullableStringFieldUpdateOperationsInput | string | null
    originalNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CourtUncheckedUpdateWithoutCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    courtCode?: StringFieldUpdateOperationsInput | string
    courtType?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCode?: NullableStringFieldUpdateOperationsInput | string | null
    originalNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CaseActivityUpsertWithWhereUniqueWithoutCaseInput = {
    where: CaseActivityWhereUniqueInput
    update: XOR<CaseActivityUpdateWithoutCaseInput, CaseActivityUncheckedUpdateWithoutCaseInput>
    create: XOR<CaseActivityCreateWithoutCaseInput, CaseActivityUncheckedCreateWithoutCaseInput>
  }

  export type CaseActivityUpdateWithWhereUniqueWithoutCaseInput = {
    where: CaseActivityWhereUniqueInput
    data: XOR<CaseActivityUpdateWithoutCaseInput, CaseActivityUncheckedUpdateWithoutCaseInput>
  }

  export type CaseActivityUpdateManyWithWhereWithoutCaseInput = {
    where: CaseActivityScalarWhereInput
    data: XOR<CaseActivityUpdateManyMutationInput, CaseActivityUncheckedUpdateManyWithoutCaseInput>
  }

  export type CaseJudgeAssignmentUpsertWithWhereUniqueWithoutCaseInput = {
    where: CaseJudgeAssignmentWhereUniqueInput
    update: XOR<CaseJudgeAssignmentUpdateWithoutCaseInput, CaseJudgeAssignmentUncheckedUpdateWithoutCaseInput>
    create: XOR<CaseJudgeAssignmentCreateWithoutCaseInput, CaseJudgeAssignmentUncheckedCreateWithoutCaseInput>
  }

  export type CaseJudgeAssignmentUpdateWithWhereUniqueWithoutCaseInput = {
    where: CaseJudgeAssignmentWhereUniqueInput
    data: XOR<CaseJudgeAssignmentUpdateWithoutCaseInput, CaseJudgeAssignmentUncheckedUpdateWithoutCaseInput>
  }

  export type CaseJudgeAssignmentUpdateManyWithWhereWithoutCaseInput = {
    where: CaseJudgeAssignmentScalarWhereInput
    data: XOR<CaseJudgeAssignmentUpdateManyMutationInput, CaseJudgeAssignmentUncheckedUpdateManyWithoutCaseInput>
  }

  export type CaseCreateWithoutActivitiesInput = {
    id?: string
    caseNumber: string
    courtName: string
    filedDate: Date | string
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    caseType: CaseTypeCreateNestedOneWithoutCasesInput
    originalCourt?: CourtCreateNestedOneWithoutCasesInput
    judgeAssignments?: CaseJudgeAssignmentCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutActivitiesInput = {
    id?: string
    caseNumber: string
    courtName: string
    caseTypeId: string
    filedDate: Date | string
    originalCourtId?: string | null
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    judgeAssignments?: CaseJudgeAssignmentUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutActivitiesInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutActivitiesInput, CaseUncheckedCreateWithoutActivitiesInput>
  }

  export type JudgeCreateWithoutCaseActivitiesInput = {
    id?: string
    fullName: string
    firstName: string
    lastName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseAssignments?: CaseJudgeAssignmentCreateNestedManyWithoutJudgeInput
  }

  export type JudgeUncheckedCreateWithoutCaseActivitiesInput = {
    id?: string
    fullName: string
    firstName: string
    lastName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseAssignments?: CaseJudgeAssignmentUncheckedCreateNestedManyWithoutJudgeInput
  }

  export type JudgeCreateOrConnectWithoutCaseActivitiesInput = {
    where: JudgeWhereUniqueInput
    create: XOR<JudgeCreateWithoutCaseActivitiesInput, JudgeUncheckedCreateWithoutCaseActivitiesInput>
  }

  export type DailyImportBatchCreateWithoutActivitiesInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutImportBatchesInput
    progress?: ImportProgressCreateNestedManyWithoutBatchInput
    errorDetails?: ImportErrorDetailCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchUncheckedCreateWithoutActivitiesInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    createdBy: string
    progress?: ImportProgressUncheckedCreateNestedManyWithoutBatchInput
    errorDetails?: ImportErrorDetailUncheckedCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchCreateOrConnectWithoutActivitiesInput = {
    where: DailyImportBatchWhereUniqueInput
    create: XOR<DailyImportBatchCreateWithoutActivitiesInput, DailyImportBatchUncheckedCreateWithoutActivitiesInput>
  }

  export type CaseUpsertWithoutActivitiesInput = {
    update: XOR<CaseUpdateWithoutActivitiesInput, CaseUncheckedUpdateWithoutActivitiesInput>
    create: XOR<CaseCreateWithoutActivitiesInput, CaseUncheckedCreateWithoutActivitiesInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutActivitiesInput, CaseUncheckedUpdateWithoutActivitiesInput>
  }

  export type CaseUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    caseType?: CaseTypeUpdateOneRequiredWithoutCasesNestedInput
    originalCourt?: CourtUpdateOneWithoutCasesNestedInput
    judgeAssignments?: CaseJudgeAssignmentUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    caseTypeId?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCourtId?: NullableStringFieldUpdateOperationsInput | string | null
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    judgeAssignments?: CaseJudgeAssignmentUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type JudgeUpsertWithoutCaseActivitiesInput = {
    update: XOR<JudgeUpdateWithoutCaseActivitiesInput, JudgeUncheckedUpdateWithoutCaseActivitiesInput>
    create: XOR<JudgeCreateWithoutCaseActivitiesInput, JudgeUncheckedCreateWithoutCaseActivitiesInput>
    where?: JudgeWhereInput
  }

  export type JudgeUpdateToOneWithWhereWithoutCaseActivitiesInput = {
    where?: JudgeWhereInput
    data: XOR<JudgeUpdateWithoutCaseActivitiesInput, JudgeUncheckedUpdateWithoutCaseActivitiesInput>
  }

  export type JudgeUpdateWithoutCaseActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseAssignments?: CaseJudgeAssignmentUpdateManyWithoutJudgeNestedInput
  }

  export type JudgeUncheckedUpdateWithoutCaseActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseAssignments?: CaseJudgeAssignmentUncheckedUpdateManyWithoutJudgeNestedInput
  }

  export type DailyImportBatchUpsertWithoutActivitiesInput = {
    update: XOR<DailyImportBatchUpdateWithoutActivitiesInput, DailyImportBatchUncheckedUpdateWithoutActivitiesInput>
    create: XOR<DailyImportBatchCreateWithoutActivitiesInput, DailyImportBatchUncheckedCreateWithoutActivitiesInput>
    where?: DailyImportBatchWhereInput
  }

  export type DailyImportBatchUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: DailyImportBatchWhereInput
    data: XOR<DailyImportBatchUpdateWithoutActivitiesInput, DailyImportBatchUncheckedUpdateWithoutActivitiesInput>
  }

  export type DailyImportBatchUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutImportBatchesNestedInput
    progress?: ImportProgressUpdateManyWithoutBatchNestedInput
    errorDetails?: ImportErrorDetailUpdateManyWithoutBatchNestedInput
  }

  export type DailyImportBatchUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    progress?: ImportProgressUncheckedUpdateManyWithoutBatchNestedInput
    errorDetails?: ImportErrorDetailUncheckedUpdateManyWithoutBatchNestedInput
  }

  export type CaseCreateWithoutJudgeAssignmentsInput = {
    id?: string
    caseNumber: string
    courtName: string
    filedDate: Date | string
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    caseType: CaseTypeCreateNestedOneWithoutCasesInput
    originalCourt?: CourtCreateNestedOneWithoutCasesInput
    activities?: CaseActivityCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutJudgeAssignmentsInput = {
    id?: string
    caseNumber: string
    courtName: string
    caseTypeId: string
    filedDate: Date | string
    originalCourtId?: string | null
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
    activities?: CaseActivityUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutJudgeAssignmentsInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutJudgeAssignmentsInput, CaseUncheckedCreateWithoutJudgeAssignmentsInput>
  }

  export type JudgeCreateWithoutCaseAssignmentsInput = {
    id?: string
    fullName: string
    firstName: string
    lastName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseActivities?: CaseActivityCreateNestedManyWithoutPrimaryJudgeInput
  }

  export type JudgeUncheckedCreateWithoutCaseAssignmentsInput = {
    id?: string
    fullName: string
    firstName: string
    lastName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseActivities?: CaseActivityUncheckedCreateNestedManyWithoutPrimaryJudgeInput
  }

  export type JudgeCreateOrConnectWithoutCaseAssignmentsInput = {
    where: JudgeWhereUniqueInput
    create: XOR<JudgeCreateWithoutCaseAssignmentsInput, JudgeUncheckedCreateWithoutCaseAssignmentsInput>
  }

  export type CaseUpsertWithoutJudgeAssignmentsInput = {
    update: XOR<CaseUpdateWithoutJudgeAssignmentsInput, CaseUncheckedUpdateWithoutJudgeAssignmentsInput>
    create: XOR<CaseCreateWithoutJudgeAssignmentsInput, CaseUncheckedCreateWithoutJudgeAssignmentsInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutJudgeAssignmentsInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutJudgeAssignmentsInput, CaseUncheckedUpdateWithoutJudgeAssignmentsInput>
  }

  export type CaseUpdateWithoutJudgeAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    caseType?: CaseTypeUpdateOneRequiredWithoutCasesNestedInput
    originalCourt?: CourtUpdateOneWithoutCasesNestedInput
    activities?: CaseActivityUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutJudgeAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    caseTypeId?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCourtId?: NullableStringFieldUpdateOperationsInput | string | null
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    activities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type JudgeUpsertWithoutCaseAssignmentsInput = {
    update: XOR<JudgeUpdateWithoutCaseAssignmentsInput, JudgeUncheckedUpdateWithoutCaseAssignmentsInput>
    create: XOR<JudgeCreateWithoutCaseAssignmentsInput, JudgeUncheckedCreateWithoutCaseAssignmentsInput>
    where?: JudgeWhereInput
  }

  export type JudgeUpdateToOneWithWhereWithoutCaseAssignmentsInput = {
    where?: JudgeWhereInput
    data: XOR<JudgeUpdateWithoutCaseAssignmentsInput, JudgeUncheckedUpdateWithoutCaseAssignmentsInput>
  }

  export type JudgeUpdateWithoutCaseAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseActivities?: CaseActivityUpdateManyWithoutPrimaryJudgeNestedInput
  }

  export type JudgeUncheckedUpdateWithoutCaseAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseActivities?: CaseActivityUncheckedUpdateManyWithoutPrimaryJudgeNestedInput
  }

  export type CaseActivityCreateWithoutImportBatchInput = {
    id?: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
    case: CaseCreateNestedOneWithoutActivitiesInput
    primaryJudge: JudgeCreateNestedOneWithoutCaseActivitiesInput
  }

  export type CaseActivityUncheckedCreateWithoutImportBatchInput = {
    id?: string
    caseId: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    primaryJudgeId: string
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
  }

  export type CaseActivityCreateOrConnectWithoutImportBatchInput = {
    where: CaseActivityWhereUniqueInput
    create: XOR<CaseActivityCreateWithoutImportBatchInput, CaseActivityUncheckedCreateWithoutImportBatchInput>
  }

  export type CaseActivityCreateManyImportBatchInputEnvelope = {
    data: CaseActivityCreateManyImportBatchInput | CaseActivityCreateManyImportBatchInput[]
  }

  export type UserCreateWithoutImportBatchesInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    importSessions?: ImportSessionCreateNestedManyWithoutUserInput
    validationResults?: ValidationResultCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutImportBatchesInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    importSessions?: ImportSessionUncheckedCreateNestedManyWithoutUserInput
    validationResults?: ValidationResultUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutImportBatchesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutImportBatchesInput, UserUncheckedCreateWithoutImportBatchesInput>
  }

  export type ImportProgressCreateWithoutBatchInput = {
    id?: string
    progressPercentage?: number | null
    currentStep?: string | null
    message?: string | null
    recordsProcessed?: number
    totalRecords?: number
    errorsCount?: number
    warningsCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImportProgressUncheckedCreateWithoutBatchInput = {
    id?: string
    progressPercentage?: number | null
    currentStep?: string | null
    message?: string | null
    recordsProcessed?: number
    totalRecords?: number
    errorsCount?: number
    warningsCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImportProgressCreateOrConnectWithoutBatchInput = {
    where: ImportProgressWhereUniqueInput
    create: XOR<ImportProgressCreateWithoutBatchInput, ImportProgressUncheckedCreateWithoutBatchInput>
  }

  export type ImportProgressCreateManyBatchInputEnvelope = {
    data: ImportProgressCreateManyBatchInput | ImportProgressCreateManyBatchInput[]
  }

  export type ImportErrorDetailCreateWithoutBatchInput = {
    id?: string
    rowNumber?: number | null
    columnName?: string | null
    errorType: string
    errorMessage: string
    rawValue?: string | null
    suggestedFix?: string | null
    severity?: string
    isResolved?: boolean
    createdAt?: Date | string
  }

  export type ImportErrorDetailUncheckedCreateWithoutBatchInput = {
    id?: string
    rowNumber?: number | null
    columnName?: string | null
    errorType: string
    errorMessage: string
    rawValue?: string | null
    suggestedFix?: string | null
    severity?: string
    isResolved?: boolean
    createdAt?: Date | string
  }

  export type ImportErrorDetailCreateOrConnectWithoutBatchInput = {
    where: ImportErrorDetailWhereUniqueInput
    create: XOR<ImportErrorDetailCreateWithoutBatchInput, ImportErrorDetailUncheckedCreateWithoutBatchInput>
  }

  export type ImportErrorDetailCreateManyBatchInputEnvelope = {
    data: ImportErrorDetailCreateManyBatchInput | ImportErrorDetailCreateManyBatchInput[]
  }

  export type CaseActivityUpsertWithWhereUniqueWithoutImportBatchInput = {
    where: CaseActivityWhereUniqueInput
    update: XOR<CaseActivityUpdateWithoutImportBatchInput, CaseActivityUncheckedUpdateWithoutImportBatchInput>
    create: XOR<CaseActivityCreateWithoutImportBatchInput, CaseActivityUncheckedCreateWithoutImportBatchInput>
  }

  export type CaseActivityUpdateWithWhereUniqueWithoutImportBatchInput = {
    where: CaseActivityWhereUniqueInput
    data: XOR<CaseActivityUpdateWithoutImportBatchInput, CaseActivityUncheckedUpdateWithoutImportBatchInput>
  }

  export type CaseActivityUpdateManyWithWhereWithoutImportBatchInput = {
    where: CaseActivityScalarWhereInput
    data: XOR<CaseActivityUpdateManyMutationInput, CaseActivityUncheckedUpdateManyWithoutImportBatchInput>
  }

  export type UserUpsertWithoutImportBatchesInput = {
    update: XOR<UserUpdateWithoutImportBatchesInput, UserUncheckedUpdateWithoutImportBatchesInput>
    create: XOR<UserCreateWithoutImportBatchesInput, UserUncheckedCreateWithoutImportBatchesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutImportBatchesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutImportBatchesInput, UserUncheckedUpdateWithoutImportBatchesInput>
  }

  export type UserUpdateWithoutImportBatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importSessions?: ImportSessionUpdateManyWithoutUserNestedInput
    validationResults?: ValidationResultUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutImportBatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importSessions?: ImportSessionUncheckedUpdateManyWithoutUserNestedInput
    validationResults?: ValidationResultUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ImportProgressUpsertWithWhereUniqueWithoutBatchInput = {
    where: ImportProgressWhereUniqueInput
    update: XOR<ImportProgressUpdateWithoutBatchInput, ImportProgressUncheckedUpdateWithoutBatchInput>
    create: XOR<ImportProgressCreateWithoutBatchInput, ImportProgressUncheckedCreateWithoutBatchInput>
  }

  export type ImportProgressUpdateWithWhereUniqueWithoutBatchInput = {
    where: ImportProgressWhereUniqueInput
    data: XOR<ImportProgressUpdateWithoutBatchInput, ImportProgressUncheckedUpdateWithoutBatchInput>
  }

  export type ImportProgressUpdateManyWithWhereWithoutBatchInput = {
    where: ImportProgressScalarWhereInput
    data: XOR<ImportProgressUpdateManyMutationInput, ImportProgressUncheckedUpdateManyWithoutBatchInput>
  }

  export type ImportProgressScalarWhereInput = {
    AND?: ImportProgressScalarWhereInput | ImportProgressScalarWhereInput[]
    OR?: ImportProgressScalarWhereInput[]
    NOT?: ImportProgressScalarWhereInput | ImportProgressScalarWhereInput[]
    id?: StringFilter<"ImportProgress"> | string
    batchId?: StringFilter<"ImportProgress"> | string
    progressPercentage?: IntNullableFilter<"ImportProgress"> | number | null
    currentStep?: StringNullableFilter<"ImportProgress"> | string | null
    message?: StringNullableFilter<"ImportProgress"> | string | null
    recordsProcessed?: IntFilter<"ImportProgress"> | number
    totalRecords?: IntFilter<"ImportProgress"> | number
    errorsCount?: IntFilter<"ImportProgress"> | number
    warningsCount?: IntFilter<"ImportProgress"> | number
    createdAt?: DateTimeFilter<"ImportProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ImportProgress"> | Date | string
  }

  export type ImportErrorDetailUpsertWithWhereUniqueWithoutBatchInput = {
    where: ImportErrorDetailWhereUniqueInput
    update: XOR<ImportErrorDetailUpdateWithoutBatchInput, ImportErrorDetailUncheckedUpdateWithoutBatchInput>
    create: XOR<ImportErrorDetailCreateWithoutBatchInput, ImportErrorDetailUncheckedCreateWithoutBatchInput>
  }

  export type ImportErrorDetailUpdateWithWhereUniqueWithoutBatchInput = {
    where: ImportErrorDetailWhereUniqueInput
    data: XOR<ImportErrorDetailUpdateWithoutBatchInput, ImportErrorDetailUncheckedUpdateWithoutBatchInput>
  }

  export type ImportErrorDetailUpdateManyWithWhereWithoutBatchInput = {
    where: ImportErrorDetailScalarWhereInput
    data: XOR<ImportErrorDetailUpdateManyMutationInput, ImportErrorDetailUncheckedUpdateManyWithoutBatchInput>
  }

  export type ImportErrorDetailScalarWhereInput = {
    AND?: ImportErrorDetailScalarWhereInput | ImportErrorDetailScalarWhereInput[]
    OR?: ImportErrorDetailScalarWhereInput[]
    NOT?: ImportErrorDetailScalarWhereInput | ImportErrorDetailScalarWhereInput[]
    id?: StringFilter<"ImportErrorDetail"> | string
    batchId?: StringFilter<"ImportErrorDetail"> | string
    rowNumber?: IntNullableFilter<"ImportErrorDetail"> | number | null
    columnName?: StringNullableFilter<"ImportErrorDetail"> | string | null
    errorType?: StringFilter<"ImportErrorDetail"> | string
    errorMessage?: StringFilter<"ImportErrorDetail"> | string
    rawValue?: StringNullableFilter<"ImportErrorDetail"> | string | null
    suggestedFix?: StringNullableFilter<"ImportErrorDetail"> | string | null
    severity?: StringFilter<"ImportErrorDetail"> | string
    isResolved?: BoolFilter<"ImportErrorDetail"> | boolean
    createdAt?: DateTimeFilter<"ImportErrorDetail"> | Date | string
  }

  export type DailyImportBatchCreateWithoutUserInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    activities?: CaseActivityCreateNestedManyWithoutImportBatchInput
    progress?: ImportProgressCreateNestedManyWithoutBatchInput
    errorDetails?: ImportErrorDetailCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchUncheckedCreateWithoutUserInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    activities?: CaseActivityUncheckedCreateNestedManyWithoutImportBatchInput
    progress?: ImportProgressUncheckedCreateNestedManyWithoutBatchInput
    errorDetails?: ImportErrorDetailUncheckedCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchCreateOrConnectWithoutUserInput = {
    where: DailyImportBatchWhereUniqueInput
    create: XOR<DailyImportBatchCreateWithoutUserInput, DailyImportBatchUncheckedCreateWithoutUserInput>
  }

  export type DailyImportBatchCreateManyUserInputEnvelope = {
    data: DailyImportBatchCreateManyUserInput | DailyImportBatchCreateManyUserInput[]
  }

  export type ImportSessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    status?: string
    startedAt?: Date | string
    lastActivity?: Date | string
    expiresAt?: Date | string | null
    metadata: JsonNullValueInput | InputJsonValue
  }

  export type ImportSessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    status?: string
    startedAt?: Date | string
    lastActivity?: Date | string
    expiresAt?: Date | string | null
    metadata: JsonNullValueInput | InputJsonValue
  }

  export type ImportSessionCreateOrConnectWithoutUserInput = {
    where: ImportSessionWhereUniqueInput
    create: XOR<ImportSessionCreateWithoutUserInput, ImportSessionUncheckedCreateWithoutUserInput>
  }

  export type ImportSessionCreateManyUserInputEnvelope = {
    data: ImportSessionCreateManyUserInput | ImportSessionCreateManyUserInput[]
  }

  export type ValidationResultCreateWithoutUserInput = {
    id?: string
    filename: string
    fileChecksum: string
    validationStatus: string
    totalRows: number
    validRows: number
    invalidRows: number
    errors: JsonNullValueInput | InputJsonValue
    warnings: JsonNullValueInput | InputJsonValue
    previewData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type ValidationResultUncheckedCreateWithoutUserInput = {
    id?: string
    filename: string
    fileChecksum: string
    validationStatus: string
    totalRows: number
    validRows: number
    invalidRows: number
    errors: JsonNullValueInput | InputJsonValue
    warnings: JsonNullValueInput | InputJsonValue
    previewData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type ValidationResultCreateOrConnectWithoutUserInput = {
    where: ValidationResultWhereUniqueInput
    create: XOR<ValidationResultCreateWithoutUserInput, ValidationResultUncheckedCreateWithoutUserInput>
  }

  export type ValidationResultCreateManyUserInputEnvelope = {
    data: ValidationResultCreateManyUserInput | ValidationResultCreateManyUserInput[]
  }

  export type DailyImportBatchUpsertWithWhereUniqueWithoutUserInput = {
    where: DailyImportBatchWhereUniqueInput
    update: XOR<DailyImportBatchUpdateWithoutUserInput, DailyImportBatchUncheckedUpdateWithoutUserInput>
    create: XOR<DailyImportBatchCreateWithoutUserInput, DailyImportBatchUncheckedCreateWithoutUserInput>
  }

  export type DailyImportBatchUpdateWithWhereUniqueWithoutUserInput = {
    where: DailyImportBatchWhereUniqueInput
    data: XOR<DailyImportBatchUpdateWithoutUserInput, DailyImportBatchUncheckedUpdateWithoutUserInput>
  }

  export type DailyImportBatchUpdateManyWithWhereWithoutUserInput = {
    where: DailyImportBatchScalarWhereInput
    data: XOR<DailyImportBatchUpdateManyMutationInput, DailyImportBatchUncheckedUpdateManyWithoutUserInput>
  }

  export type DailyImportBatchScalarWhereInput = {
    AND?: DailyImportBatchScalarWhereInput | DailyImportBatchScalarWhereInput[]
    OR?: DailyImportBatchScalarWhereInput[]
    NOT?: DailyImportBatchScalarWhereInput | DailyImportBatchScalarWhereInput[]
    id?: StringFilter<"DailyImportBatch"> | string
    importDate?: DateTimeFilter<"DailyImportBatch"> | Date | string
    filename?: StringFilter<"DailyImportBatch"> | string
    fileSize?: IntFilter<"DailyImportBatch"> | number
    fileChecksum?: StringFilter<"DailyImportBatch"> | string
    totalRecords?: IntFilter<"DailyImportBatch"> | number
    successfulRecords?: IntFilter<"DailyImportBatch"> | number
    failedRecords?: IntFilter<"DailyImportBatch"> | number
    errorLogs?: JsonFilter<"DailyImportBatch">
    status?: StringFilter<"DailyImportBatch"> | string
    estimatedCompletionTime?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    processingStartTime?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    userConfig?: JsonFilter<"DailyImportBatch">
    validationWarnings?: JsonFilter<"DailyImportBatch">
    createdAt?: DateTimeFilter<"DailyImportBatch"> | Date | string
    completedAt?: DateTimeNullableFilter<"DailyImportBatch"> | Date | string | null
    createdBy?: StringFilter<"DailyImportBatch"> | string
  }

  export type ImportSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ImportSessionWhereUniqueInput
    update: XOR<ImportSessionUpdateWithoutUserInput, ImportSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ImportSessionCreateWithoutUserInput, ImportSessionUncheckedCreateWithoutUserInput>
  }

  export type ImportSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ImportSessionWhereUniqueInput
    data: XOR<ImportSessionUpdateWithoutUserInput, ImportSessionUncheckedUpdateWithoutUserInput>
  }

  export type ImportSessionUpdateManyWithWhereWithoutUserInput = {
    where: ImportSessionScalarWhereInput
    data: XOR<ImportSessionUpdateManyMutationInput, ImportSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ImportSessionScalarWhereInput = {
    AND?: ImportSessionScalarWhereInput | ImportSessionScalarWhereInput[]
    OR?: ImportSessionScalarWhereInput[]
    NOT?: ImportSessionScalarWhereInput | ImportSessionScalarWhereInput[]
    id?: StringFilter<"ImportSession"> | string
    userId?: StringFilter<"ImportSession"> | string
    sessionToken?: StringFilter<"ImportSession"> | string
    status?: StringFilter<"ImportSession"> | string
    startedAt?: DateTimeFilter<"ImportSession"> | Date | string
    lastActivity?: DateTimeFilter<"ImportSession"> | Date | string
    expiresAt?: DateTimeNullableFilter<"ImportSession"> | Date | string | null
    metadata?: JsonFilter<"ImportSession">
  }

  export type ValidationResultUpsertWithWhereUniqueWithoutUserInput = {
    where: ValidationResultWhereUniqueInput
    update: XOR<ValidationResultUpdateWithoutUserInput, ValidationResultUncheckedUpdateWithoutUserInput>
    create: XOR<ValidationResultCreateWithoutUserInput, ValidationResultUncheckedCreateWithoutUserInput>
  }

  export type ValidationResultUpdateWithWhereUniqueWithoutUserInput = {
    where: ValidationResultWhereUniqueInput
    data: XOR<ValidationResultUpdateWithoutUserInput, ValidationResultUncheckedUpdateWithoutUserInput>
  }

  export type ValidationResultUpdateManyWithWhereWithoutUserInput = {
    where: ValidationResultScalarWhereInput
    data: XOR<ValidationResultUpdateManyMutationInput, ValidationResultUncheckedUpdateManyWithoutUserInput>
  }

  export type ValidationResultScalarWhereInput = {
    AND?: ValidationResultScalarWhereInput | ValidationResultScalarWhereInput[]
    OR?: ValidationResultScalarWhereInput[]
    NOT?: ValidationResultScalarWhereInput | ValidationResultScalarWhereInput[]
    id?: StringFilter<"ValidationResult"> | string
    userId?: StringFilter<"ValidationResult"> | string
    filename?: StringFilter<"ValidationResult"> | string
    fileChecksum?: StringFilter<"ValidationResult"> | string
    validationStatus?: StringFilter<"ValidationResult"> | string
    totalRows?: IntFilter<"ValidationResult"> | number
    validRows?: IntFilter<"ValidationResult"> | number
    invalidRows?: IntFilter<"ValidationResult"> | number
    errors?: JsonFilter<"ValidationResult">
    warnings?: JsonFilter<"ValidationResult">
    previewData?: JsonFilter<"ValidationResult">
    createdAt?: DateTimeFilter<"ValidationResult"> | Date | string
    expiresAt?: DateTimeFilter<"ValidationResult"> | Date | string
  }

  export type DailyImportBatchCreateWithoutProgressInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    activities?: CaseActivityCreateNestedManyWithoutImportBatchInput
    user: UserCreateNestedOneWithoutImportBatchesInput
    errorDetails?: ImportErrorDetailCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchUncheckedCreateWithoutProgressInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    createdBy: string
    activities?: CaseActivityUncheckedCreateNestedManyWithoutImportBatchInput
    errorDetails?: ImportErrorDetailUncheckedCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchCreateOrConnectWithoutProgressInput = {
    where: DailyImportBatchWhereUniqueInput
    create: XOR<DailyImportBatchCreateWithoutProgressInput, DailyImportBatchUncheckedCreateWithoutProgressInput>
  }

  export type DailyImportBatchUpsertWithoutProgressInput = {
    update: XOR<DailyImportBatchUpdateWithoutProgressInput, DailyImportBatchUncheckedUpdateWithoutProgressInput>
    create: XOR<DailyImportBatchCreateWithoutProgressInput, DailyImportBatchUncheckedCreateWithoutProgressInput>
    where?: DailyImportBatchWhereInput
  }

  export type DailyImportBatchUpdateToOneWithWhereWithoutProgressInput = {
    where?: DailyImportBatchWhereInput
    data: XOR<DailyImportBatchUpdateWithoutProgressInput, DailyImportBatchUncheckedUpdateWithoutProgressInput>
  }

  export type DailyImportBatchUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activities?: CaseActivityUpdateManyWithoutImportBatchNestedInput
    user?: UserUpdateOneRequiredWithoutImportBatchesNestedInput
    errorDetails?: ImportErrorDetailUpdateManyWithoutBatchNestedInput
  }

  export type DailyImportBatchUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    activities?: CaseActivityUncheckedUpdateManyWithoutImportBatchNestedInput
    errorDetails?: ImportErrorDetailUncheckedUpdateManyWithoutBatchNestedInput
  }

  export type DailyImportBatchCreateWithoutErrorDetailsInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    activities?: CaseActivityCreateNestedManyWithoutImportBatchInput
    user: UserCreateNestedOneWithoutImportBatchesInput
    progress?: ImportProgressCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchUncheckedCreateWithoutErrorDetailsInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
    createdBy: string
    activities?: CaseActivityUncheckedCreateNestedManyWithoutImportBatchInput
    progress?: ImportProgressUncheckedCreateNestedManyWithoutBatchInput
  }

  export type DailyImportBatchCreateOrConnectWithoutErrorDetailsInput = {
    where: DailyImportBatchWhereUniqueInput
    create: XOR<DailyImportBatchCreateWithoutErrorDetailsInput, DailyImportBatchUncheckedCreateWithoutErrorDetailsInput>
  }

  export type DailyImportBatchUpsertWithoutErrorDetailsInput = {
    update: XOR<DailyImportBatchUpdateWithoutErrorDetailsInput, DailyImportBatchUncheckedUpdateWithoutErrorDetailsInput>
    create: XOR<DailyImportBatchCreateWithoutErrorDetailsInput, DailyImportBatchUncheckedCreateWithoutErrorDetailsInput>
    where?: DailyImportBatchWhereInput
  }

  export type DailyImportBatchUpdateToOneWithWhereWithoutErrorDetailsInput = {
    where?: DailyImportBatchWhereInput
    data: XOR<DailyImportBatchUpdateWithoutErrorDetailsInput, DailyImportBatchUncheckedUpdateWithoutErrorDetailsInput>
  }

  export type DailyImportBatchUpdateWithoutErrorDetailsInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activities?: CaseActivityUpdateManyWithoutImportBatchNestedInput
    user?: UserUpdateOneRequiredWithoutImportBatchesNestedInput
    progress?: ImportProgressUpdateManyWithoutBatchNestedInput
  }

  export type DailyImportBatchUncheckedUpdateWithoutErrorDetailsInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    activities?: CaseActivityUncheckedUpdateManyWithoutImportBatchNestedInput
    progress?: ImportProgressUncheckedUpdateManyWithoutBatchNestedInput
  }

  export type UserCreateWithoutImportSessionsInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    importBatches?: DailyImportBatchCreateNestedManyWithoutUserInput
    validationResults?: ValidationResultCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutImportSessionsInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    importBatches?: DailyImportBatchUncheckedCreateNestedManyWithoutUserInput
    validationResults?: ValidationResultUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutImportSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutImportSessionsInput, UserUncheckedCreateWithoutImportSessionsInput>
  }

  export type UserUpsertWithoutImportSessionsInput = {
    update: XOR<UserUpdateWithoutImportSessionsInput, UserUncheckedUpdateWithoutImportSessionsInput>
    create: XOR<UserCreateWithoutImportSessionsInput, UserUncheckedCreateWithoutImportSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutImportSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutImportSessionsInput, UserUncheckedUpdateWithoutImportSessionsInput>
  }

  export type UserUpdateWithoutImportSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importBatches?: DailyImportBatchUpdateManyWithoutUserNestedInput
    validationResults?: ValidationResultUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutImportSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importBatches?: DailyImportBatchUncheckedUpdateManyWithoutUserNestedInput
    validationResults?: ValidationResultUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutValidationResultsInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    importBatches?: DailyImportBatchCreateNestedManyWithoutUserInput
    importSessions?: ImportSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutValidationResultsInput = {
    id?: string
    email: string
    name: string
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    importBatches?: DailyImportBatchUncheckedCreateNestedManyWithoutUserInput
    importSessions?: ImportSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutValidationResultsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutValidationResultsInput, UserUncheckedCreateWithoutValidationResultsInput>
  }

  export type UserUpsertWithoutValidationResultsInput = {
    update: XOR<UserUpdateWithoutValidationResultsInput, UserUncheckedUpdateWithoutValidationResultsInput>
    create: XOR<UserCreateWithoutValidationResultsInput, UserUncheckedCreateWithoutValidationResultsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutValidationResultsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutValidationResultsInput, UserUncheckedUpdateWithoutValidationResultsInput>
  }

  export type UserUpdateWithoutValidationResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importBatches?: DailyImportBatchUpdateManyWithoutUserNestedInput
    importSessions?: ImportSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutValidationResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    importBatches?: DailyImportBatchUncheckedUpdateManyWithoutUserNestedInput
    importSessions?: ImportSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CaseCreateManyOriginalCourtInput = {
    id?: string
    caseNumber: string
    courtName: string
    caseTypeId: string
    filedDate: Date | string
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
  }

  export type CaseUpdateWithoutOriginalCourtInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    caseType?: CaseTypeUpdateOneRequiredWithoutCasesNestedInput
    activities?: CaseActivityUpdateManyWithoutCaseNestedInput
    judgeAssignments?: CaseJudgeAssignmentUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutOriginalCourtInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    caseTypeId?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    activities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
    judgeAssignments?: CaseJudgeAssignmentUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateManyWithoutOriginalCourtInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    caseTypeId?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
  }

  export type CaseActivityCreateManyPrimaryJudgeInput = {
    id?: string
    caseId: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    importBatchId: string
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
  }

  export type CaseJudgeAssignmentCreateManyJudgeInput = {
    caseId: string
    assignedAt?: Date | string
    isPrimary?: boolean
  }

  export type CaseActivityUpdateWithoutPrimaryJudgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
    case?: CaseUpdateOneRequiredWithoutActivitiesNestedInput
    importBatch?: DailyImportBatchUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type CaseActivityUncheckedUpdateWithoutPrimaryJudgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    importBatchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseActivityUncheckedUpdateManyWithoutPrimaryJudgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    importBatchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseJudgeAssignmentUpdateWithoutJudgeInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    case?: CaseUpdateOneRequiredWithoutJudgeAssignmentsNestedInput
  }

  export type CaseJudgeAssignmentUncheckedUpdateWithoutJudgeInput = {
    caseId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CaseJudgeAssignmentUncheckedUpdateManyWithoutJudgeInput = {
    caseId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CaseCreateManyCaseTypeInput = {
    id?: string
    caseNumber: string
    courtName: string
    filedDate: Date | string
    originalCourtId?: string | null
    originalCaseNumber?: string | null
    originalYear?: number | null
    parties: JsonNullValueInput | InputJsonValue
    status?: string
    lastActivityDate?: Date | string | null
    totalActivities?: number
    hasLegalRepresentation?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caseidType?: string | null
    caseidNo?: string | null
    maleApplicant?: number
    femaleApplicant?: number
    organizationApplicant?: number
    maleDefendant?: number
    femaleDefendant?: number
    organizationDefendant?: number
  }

  export type CaseUpdateWithoutCaseTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    originalCourt?: CourtUpdateOneWithoutCasesNestedInput
    activities?: CaseActivityUpdateManyWithoutCaseNestedInput
    judgeAssignments?: CaseJudgeAssignmentUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutCaseTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCourtId?: NullableStringFieldUpdateOperationsInput | string | null
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
    activities?: CaseActivityUncheckedUpdateManyWithoutCaseNestedInput
    judgeAssignments?: CaseJudgeAssignmentUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateManyWithoutCaseTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseNumber?: StringFieldUpdateOperationsInput | string
    courtName?: StringFieldUpdateOperationsInput | string
    filedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    originalCourtId?: NullableStringFieldUpdateOperationsInput | string | null
    originalCaseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    originalYear?: NullableIntFieldUpdateOperationsInput | number | null
    parties?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastActivityDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalActivities?: IntFieldUpdateOperationsInput | number
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caseidType?: NullableStringFieldUpdateOperationsInput | string | null
    caseidNo?: NullableStringFieldUpdateOperationsInput | string | null
    maleApplicant?: IntFieldUpdateOperationsInput | number
    femaleApplicant?: IntFieldUpdateOperationsInput | number
    organizationApplicant?: IntFieldUpdateOperationsInput | number
    maleDefendant?: IntFieldUpdateOperationsInput | number
    femaleDefendant?: IntFieldUpdateOperationsInput | number
    organizationDefendant?: IntFieldUpdateOperationsInput | number
  }

  export type CaseActivityCreateManyCaseInput = {
    id?: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    primaryJudgeId: string
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    importBatchId: string
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
  }

  export type CaseJudgeAssignmentCreateManyCaseInput = {
    judgeId: string
    assignedAt?: Date | string
    isPrimary?: boolean
  }

  export type CaseActivityUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
    primaryJudge?: JudgeUpdateOneRequiredWithoutCaseActivitiesNestedInput
    importBatch?: DailyImportBatchUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type CaseActivityUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryJudgeId?: StringFieldUpdateOperationsInput | string
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    importBatchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseActivityUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryJudgeId?: StringFieldUpdateOperationsInput | string
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    importBatchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseJudgeAssignmentUpdateWithoutCaseInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    judge?: JudgeUpdateOneRequiredWithoutCaseAssignmentsNestedInput
  }

  export type CaseJudgeAssignmentUncheckedUpdateWithoutCaseInput = {
    judgeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CaseJudgeAssignmentUncheckedUpdateManyWithoutCaseInput = {
    judgeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CaseActivityCreateManyImportBatchInput = {
    id?: string
    caseId: string
    activityDate: Date | string
    activityType: string
    outcome: string
    reasonForAdjournment?: string | null
    nextHearingDate?: Date | string | null
    primaryJudgeId: string
    hasLegalRepresentation: boolean
    applicantWitnesses?: number
    defendantWitnesses?: number
    custodyStatus: string
    details?: string | null
    createdAt?: Date | string
    judge1?: string | null
    judge2?: string | null
    judge3?: string | null
    judge4?: string | null
    judge5?: string | null
    judge6?: string | null
    judge7?: string | null
    comingFor?: string | null
    legalRepString?: string | null
    custodyNumeric?: number | null
    otherDetails?: string | null
  }

  export type ImportProgressCreateManyBatchInput = {
    id?: string
    progressPercentage?: number | null
    currentStep?: string | null
    message?: string | null
    recordsProcessed?: number
    totalRecords?: number
    errorsCount?: number
    warningsCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImportErrorDetailCreateManyBatchInput = {
    id?: string
    rowNumber?: number | null
    columnName?: string | null
    errorType: string
    errorMessage: string
    rawValue?: string | null
    suggestedFix?: string | null
    severity?: string
    isResolved?: boolean
    createdAt?: Date | string
  }

  export type CaseActivityUpdateWithoutImportBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
    case?: CaseUpdateOneRequiredWithoutActivitiesNestedInput
    primaryJudge?: JudgeUpdateOneRequiredWithoutCaseActivitiesNestedInput
  }

  export type CaseActivityUncheckedUpdateWithoutImportBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryJudgeId?: StringFieldUpdateOperationsInput | string
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseActivityUncheckedUpdateManyWithoutImportBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: StringFieldUpdateOperationsInput | string
    activityDate?: DateTimeFieldUpdateOperationsInput | Date | string
    activityType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    reasonForAdjournment?: NullableStringFieldUpdateOperationsInput | string | null
    nextHearingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryJudgeId?: StringFieldUpdateOperationsInput | string
    hasLegalRepresentation?: BoolFieldUpdateOperationsInput | boolean
    applicantWitnesses?: IntFieldUpdateOperationsInput | number
    defendantWitnesses?: IntFieldUpdateOperationsInput | number
    custodyStatus?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    judge1?: NullableStringFieldUpdateOperationsInput | string | null
    judge2?: NullableStringFieldUpdateOperationsInput | string | null
    judge3?: NullableStringFieldUpdateOperationsInput | string | null
    judge4?: NullableStringFieldUpdateOperationsInput | string | null
    judge5?: NullableStringFieldUpdateOperationsInput | string | null
    judge6?: NullableStringFieldUpdateOperationsInput | string | null
    judge7?: NullableStringFieldUpdateOperationsInput | string | null
    comingFor?: NullableStringFieldUpdateOperationsInput | string | null
    legalRepString?: NullableStringFieldUpdateOperationsInput | string | null
    custodyNumeric?: NullableIntFieldUpdateOperationsInput | number | null
    otherDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ImportProgressUpdateWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableIntFieldUpdateOperationsInput | number | null
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    recordsProcessed?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    errorsCount?: IntFieldUpdateOperationsInput | number
    warningsCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportProgressUncheckedUpdateWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableIntFieldUpdateOperationsInput | number | null
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    recordsProcessed?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    errorsCount?: IntFieldUpdateOperationsInput | number
    warningsCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportProgressUncheckedUpdateManyWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableIntFieldUpdateOperationsInput | number | null
    currentStep?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    recordsProcessed?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    errorsCount?: IntFieldUpdateOperationsInput | number
    warningsCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportErrorDetailUpdateWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: NullableIntFieldUpdateOperationsInput | number | null
    columnName?: NullableStringFieldUpdateOperationsInput | string | null
    errorType?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    rawValue?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedFix?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportErrorDetailUncheckedUpdateWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: NullableIntFieldUpdateOperationsInput | number | null
    columnName?: NullableStringFieldUpdateOperationsInput | string | null
    errorType?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    rawValue?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedFix?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportErrorDetailUncheckedUpdateManyWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: NullableIntFieldUpdateOperationsInput | number | null
    columnName?: NullableStringFieldUpdateOperationsInput | string | null
    errorType?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    rawValue?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedFix?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyImportBatchCreateManyUserInput = {
    id?: string
    importDate: Date | string
    filename: string
    fileSize: number
    fileChecksum: string
    totalRecords: number
    successfulRecords: number
    failedRecords: number
    errorLogs: JsonNullValueInput | InputJsonValue
    status: string
    estimatedCompletionTime?: Date | string | null
    processingStartTime?: Date | string | null
    userConfig: JsonNullValueInput | InputJsonValue
    validationWarnings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ImportSessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    status?: string
    startedAt?: Date | string
    lastActivity?: Date | string
    expiresAt?: Date | string | null
    metadata: JsonNullValueInput | InputJsonValue
  }

  export type ValidationResultCreateManyUserInput = {
    id?: string
    filename: string
    fileChecksum: string
    validationStatus: string
    totalRows: number
    validRows: number
    invalidRows: number
    errors: JsonNullValueInput | InputJsonValue
    warnings: JsonNullValueInput | InputJsonValue
    previewData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type DailyImportBatchUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activities?: CaseActivityUpdateManyWithoutImportBatchNestedInput
    progress?: ImportProgressUpdateManyWithoutBatchNestedInput
    errorDetails?: ImportErrorDetailUpdateManyWithoutBatchNestedInput
  }

  export type DailyImportBatchUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activities?: CaseActivityUncheckedUpdateManyWithoutImportBatchNestedInput
    progress?: ImportProgressUncheckedUpdateManyWithoutBatchNestedInput
    errorDetails?: ImportErrorDetailUncheckedUpdateManyWithoutBatchNestedInput
  }

  export type DailyImportBatchUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    importDate?: DateTimeFieldUpdateOperationsInput | Date | string
    filename?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileChecksum?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    successfulRecords?: IntFieldUpdateOperationsInput | number
    failedRecords?: IntFieldUpdateOperationsInput | number
    errorLogs?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    estimatedCompletionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userConfig?: JsonNullValueInput | InputJsonValue
    validationWarnings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ImportSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ImportSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ImportSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ValidationResultUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileChecksum?: StringFieldUpdateOperationsInput | string
    validationStatus?: StringFieldUpdateOperationsInput | string
    totalRows?: IntFieldUpdateOperationsInput | number
    validRows?: IntFieldUpdateOperationsInput | number
    invalidRows?: IntFieldUpdateOperationsInput | number
    errors?: JsonNullValueInput | InputJsonValue
    warnings?: JsonNullValueInput | InputJsonValue
    previewData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationResultUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileChecksum?: StringFieldUpdateOperationsInput | string
    validationStatus?: StringFieldUpdateOperationsInput | string
    totalRows?: IntFieldUpdateOperationsInput | number
    validRows?: IntFieldUpdateOperationsInput | number
    invalidRows?: IntFieldUpdateOperationsInput | number
    errors?: JsonNullValueInput | InputJsonValue
    warnings?: JsonNullValueInput | InputJsonValue
    previewData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationResultUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileChecksum?: StringFieldUpdateOperationsInput | string
    validationStatus?: StringFieldUpdateOperationsInput | string
    totalRows?: IntFieldUpdateOperationsInput | number
    validRows?: IntFieldUpdateOperationsInput | number
    invalidRows?: IntFieldUpdateOperationsInput | number
    errors?: JsonNullValueInput | InputJsonValue
    warnings?: JsonNullValueInput | InputJsonValue
    previewData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}