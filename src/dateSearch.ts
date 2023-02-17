import * as dayjs from "dayjs";
import get from "lodash.get";
import isEmpty from "lodash.isempty";

/**
 * Search result format returned by the search.
 */
export type DateSearchResult<T> = {
  index: number | null;
  value: T | null;
};

/**
 * Valid date inputs to provide to the `target` parameter. If the value is falsy an error will be thrown.
 */
export type DateSearchTargets = string | number | Date | dayjs.Dayjs | null;

/**
 * Compares the two values numerically
 */
export type Comparator<T> = (targetVal: DateSearchTargets, searchVal: T) => number;

/**
 * JS primitives that can describe a date. DayJS is used to parse them to Date objects.
 *
 * Only "string", "number", "Date" objects are valid.
 */
export const DATE_TYPES = ["string", "number", "Date"];

/**
 * Determines if dayJS can parse the input value.
 * @param x any input type
 * @returns boolean
 */
export const isDateType = <T>(x: T) => {
  const xType = typeof x;
  if (DATE_TYPES.indexOf(xType)) {
    return true;
  } else {
    return !!dayjs.default(x as dayjs.Dayjs).isValid();
  }
};

/**
 * Fallback, try to make a numeric representation of a non-standard input
 * Arrays, Strings or objects use length.
 *
 * Worst case, this allows for graceful failure and allows the algo to continue if invalid data is provided.
 *
 * @param x
 * @returns number
 */
export const parseToValidNumber = <T>(x: T) => {
  const isArrayOrObject = typeof x === "object" && isEmpty(x);
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

/**
 * Compares two times/dates and determine which direction to search.
 *
 * @param a Date
 * @param b Date
 * @returns number
 */
export function defaultTimeComparator<T>(
  targetVal: DateSearchTargets,
  searchVal: T
) {
  if (isDateType(targetVal) && isDateType(searchVal)) {
    return (
      dayjs.default(targetVal as dayjs.Dayjs).unix() -
      dayjs.default(searchVal as dayjs.Dayjs).unix()
    );
  }
  return parseToValidNumber(targetVal) - parseToValidNumber(searchVal);
}

/**
 * Compare nested data that contains a date/time stamp.
 *
 * @param target searched for value
 * @param search compared value
 * @param stringPath deep pointer to key in nested objects
 * @param comparator comparison fn
 * @returns number
 */
export function deepTimeComparator<T>(
  target: DateSearchTargets,
  search: T,
  stringPath = "value",
  comparator: Comparator<T> = defaultTimeComparator
) {
  const searchVal = get(search, stringPath);
  return comparator(target, searchVal);
}

/**
 * Modify return value when search is complete.
 * - EXACT: null if not found
 * - CLOSEST_FLOOR: closest value in array rounding down or first item
 * - CLOSEST_CEIL: closest value in array rounding up or last item
 */
export enum DateSearchModes {
  EXACT,
  CLOSEST_FLOOR,
  CLOSEST_CEIL,
}

/**
 * Binary Search for dates or time series data.
 *
 * @param array Sorted array containing date/time values
 * @param target date/time value
 * @param comparator string pointing to a nested key or comparator function
 * @param dateSearchMode Exact or fuzzy search
 * @returns
 */
export function dateSearch<T>(
  array: T[],
  target: DateSearchTargets,
  comparator: Comparator<T> | null | string = defaultTimeComparator,
  dateSearchMode: DateSearchModes = DateSearchModes.EXACT
): DateSearchResult<T> {

  if (!target) throw Error('No valid date target value provided.')

  const comparisonFn = (mid: number) => {
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

  const fallbackIndex = Math.floor((right + left) / 2);

  switch (dateSearchMode) {
    case DateSearchModes.EXACT:
      return {
        index: null,
        value: null,
      };
    case DateSearchModes.CLOSEST_FLOOR:
      const floor = Math.max(0, fallbackIndex);
      return {
        index: floor,
        value: array[floor],
      };
    case DateSearchModes.CLOSEST_CEIL:
      const next = fallbackIndex + 1;
      const ceil = Math.min(next, array.length - 1);
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
