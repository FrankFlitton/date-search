import * as dayjs from "dayjs";
import { dateSearch } from "./dateSearch";
import { generateDateData } from "./generateData";

const bigDatesArray = generateDateData();
const validDate = bigDatesArray[0];
const validMiddleDate =
  bigDatesArray[Math.floor((bigDatesArray.length - 1) / 2)];
const validEndDate = bigDatesArray[bigDatesArray.length - 1];
const invalidDate = dayjs.default("1970-1-1");

describe("search with flat array", () => {
  it("should not find", () => {
    expect(dateSearch(bigDatesArray, validDate)).toStrictEqual(validDate);
  });
  it("should find, middle", () => {
    expect(dateSearch(bigDatesArray, validMiddleDate)).toStrictEqual(
      validMiddleDate
    );
  });
  it("should find, last", () => {
    expect(dateSearch(bigDatesArray, validEndDate)).toStrictEqual(
      validEndDate
    );
  });
  it("should find, first element", () => {
    expect(dateSearch(bigDatesArray, invalidDate)).toStrictEqual(null);
  });
});
