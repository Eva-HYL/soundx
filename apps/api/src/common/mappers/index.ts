import { Decimal } from '@prisma/client/runtime/library';

/** BigInt → string（Prisma 返回值中的主键、外键）。 */
export const bigintToString = (v: bigint | null | undefined): string | null =>
  v === null || v === undefined ? null : v.toString();

/** Decimal → 两位小数字符串（金额默认）。scale 由列定义决定。 */
export const decimalToString = (v: Decimal | null | undefined, scale = 2): string | null =>
  v === null || v === undefined ? null : v.toFixed(scale);

/** UPPER_SNAKE 枚举值 → lower_snake 字面量。 */
export const enumToLower = <T extends string>(v: T | null | undefined): string | null =>
  v === null || v === undefined ? null : v.toLowerCase();

/** lower_snake 字面量 → UPPER_SNAKE（供写入 Prisma 用）。 */
export const enumToUpper = <T extends string>(v: T): string => v.toUpperCase();

/** ISO8601 时间字符串（Date → string）。 */
export const dateToIso = (v: Date | null | undefined): string | null =>
  v === null || v === undefined ? null : v.toISOString();
