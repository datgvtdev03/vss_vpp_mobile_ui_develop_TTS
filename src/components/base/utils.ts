type PrependNextNum<A extends Array<unknown>> = A["length"] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A["length"] ? 0 : 1];

export type Enumerate<N extends number> = EnumerateInternal<
  [],
  N
> extends (infer E)[]
  ? E
  : never;

export type Range<FROM extends number, TO extends number> = Exclude<
  Enumerate<TO>,
  Enumerate<FROM>
>;

export type Layout = string | number | number[];

export type DateTime = {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second: number;
};
const compareDateTime = (d1: DateTime, d2: DateTime): number => {
  const numD1 = d1.year * 10000 + d1.month * 100 + d1.day;
  const numD2 = d2.year * 10000 + d2.month * 100 + d2.day;
  return numD1 - numD2;
};

export const checkIfDateIsInRange = (
  start: DateTime | undefined,
  end: DateTime | undefined,
  date: DateTime
): boolean => {
  const isBeforeStartDate = start ? compareDateTime(start, date) > 0 : false;
  const isAfterEndDate = end ? compareDateTime(date, end) > 0 : false;
  return isBeforeStartDate || isAfterEndDate;
};
