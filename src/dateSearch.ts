import * as dayjs from "dayjs";
import get from "lodash.get";
import isEmpty from "lodash.isempty";

/**
 * Compares the two values as a number
 */
export type Comparator<T> = (a: T, b: T) => number;

export type DateSearchResult<T> = {
  index: number | null;
  value: T | null;
};

export const DATE_TYPES = ["string", "number", "Date"];
export const isDateType = <T>(x: T) => {
  const xType = typeof x;
  if (DATE_TYPES.indexOf(xType)) {
    return true;
  } else {
    return !!dayjs.default(x as dayjs.Dayjs).isValid();
  }
};

export const parseToValidNumber = <T>(x: T) => {
  const isArrayOrObject = isEmpty(x);
  let l = -1;
  if (isArrayOrObject) {
    l = Array.isArray(x) ? x.length : Object.keys(x as Object).length;
  }

  const lengthOrString = l || x;
  const n = parseFloat(
    `${lengthOrString?.toString ? lengthOrString.toString() : x}`
  );
  const validN = Number.isFinite(n) ? n : 0;
  return validN;
};

export function defaultTimeComparator<T>(a: T, b: T) {
  if (isDateType(a) && isDateType(b)) {
    return (
      dayjs.default(a as dayjs.Dayjs).unix() -
      dayjs.default(b as dayjs.Dayjs).unix()
    );
  }
  return parseToValidNumber(a) - parseToValidNumber(b);
}

export function deepTimeComparator<T>(
  target: T,
  search: T,
  stringPath = "value",
  comparator: Comparator<T> = defaultTimeComparator
) {
  const targetVal = get(target, stringPath);
  const searchVal = get(search, stringPath);
  return comparator(targetVal, searchVal);
}

export const DATE_SEARCH_MODES = {
  EXACT: "exact",
  CLOSEST_FLOOR: "floor",
  CLOSEST_CEIL: "ceil",
};

export function dateSearch<T>(
  array: T[],
  target: T,
  comparator: Comparator<T> | null | string = defaultTimeComparator,
  dateSearchMode = DATE_SEARCH_MODES.EXACT
): DateSearchResult<T> {
  const comparisonFn = (mid: number) => {
    console.log(mid)
    if (typeof comparator === "string") {
      const keyPointer = comparator;
      return deepTimeComparator(
        target,
        array[mid],
        keyPointer,
        defaultTimeComparator
      );
    }
    return !!comparator
      ? comparator(target, array[mid])
      : defaultTimeComparator(target, array[mid]);
  };

  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = comparisonFn(mid);
    if (comparison === 0) {
      return {
        index: mid,
        value: array[mid],
      };
    } else if (comparison < 0) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  switch (dateSearchMode) {
    case DATE_SEARCH_MODES.EXACT:
      return {
        index: null,
        value: null,
      };
    case DATE_SEARCH_MODES.CLOSEST_FLOOR:
      return {
        index: left,
        value: array[left],
      };
    case DATE_SEARCH_MODES.CLOSEST_CEIL:
      const next = left + 1;
      const last = array.length - 1;
      const ceil = next <= array.length - 1 ? next : last;
      return {
        index: ceil,
        value: array[ceil],
      };
    default:
      return {
        index: null,
        value: null,
      };
  }
}

export default dateSearch;
