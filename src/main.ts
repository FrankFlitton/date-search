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
} from "./dateSearch";

// document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
//   <div class="card">
//   <button id="counter" type="button"></button>
//   </div>
//   `;
// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

export {
  dateSearch,
  deepTimeComparator,
  defaultTimeComparator,
  parseToValidNumber,
  isDateType,
  DATE_TYPES,
  DateSearchModes,
};

export type { Comparator, DateSearchResult };
