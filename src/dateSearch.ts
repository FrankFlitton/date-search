import * as dayjs from "dayjs";
import get from "lodash.get";
import isEmpty from "lodash.isempty";

/**
 * Compares the two values as a number
 */
type Comparator<T> = (a: T, b: T) => number;

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
      dayjs.default(b as dayjs.Dayjs).unix() -
      dayjs.default(a as dayjs.Dayjs).unix()
    );
  }
  return parseToValidNumber(b) - parseToValidNumber(a);
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

export function dateSearch<T>(
  array: T[],
  target: T,
  comparator: Comparator<T> | string = defaultTimeComparator
): T | null {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison =
      typeof comparator === "string"
        ? deepTimeComparator(
            target,
            array[mid],
            comparator,
            defaultTimeComparator
          )
        : comparator(target, array[mid]);

    if (comparison === 0) {
      return array[mid];
    } else if (comparison < 0) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return null;
}

export default dateSearch;
