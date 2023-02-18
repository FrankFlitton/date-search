import {
  dateSearch,
  deepTimeComparator,
  defaultTimeComparator,
  parseToValidNumber,
  isDateType,
  DATE_TYPES,
  Comparator,
  DateSearchResult,
  DateSearchModes,
  DateSearchTargets,
} from "./dateSearch";

export {
  dateSearch,
  deepTimeComparator,
  defaultTimeComparator,
  parseToValidNumber,
  isDateType,
  DATE_TYPES,
  DateSearchModes,
};

export default dateSearch;

export type { Comparator, DateSearchResult, DateSearchTargets };
