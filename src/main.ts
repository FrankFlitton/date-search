import { setupCounter } from "./counter";
import {
  dateSearch,
  deepTimeComparator,
  defaultTimeComparator,
  parseToValidNumber,
  isDateType,
  DATE_TYPES,
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
};

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
