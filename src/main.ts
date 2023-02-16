import { setupCounter } from "./counter";
import {
  dateSearch,
  deepTimeComparator,
  defaultTimeComparator,
  parseToValidNumber,
  isDateType,
  DATE_TYPES,
  Comparator,
  DateSearchResult,
  DATE_SEARCH_MODES,
} from "./dateSearch";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="card">
    <button id="counter" type="button"></button>
  </div>
`;

export {
  dateSearch,
  deepTimeComparator,
  defaultTimeComparator,
  parseToValidNumber,
  isDateType,
  DATE_TYPES,
  DATE_SEARCH_MODES,
};

export type { Comparator, DateSearchResult };

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
