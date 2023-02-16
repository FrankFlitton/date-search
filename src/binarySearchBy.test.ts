import * as dayjs from "dayjs";
import { dateSearch, DateSearchResult } from "./dateSearch";
import { generateDateData } from "./generateData";

const bigDatesArray = generateDateData();

const validDate: DateSearchResult<dayjs.Dayjs> = {
  index: 0,
  value: bigDatesArray[0],
};

const validMiddleDate: DateSearchResult<dayjs.Dayjs> = {
  index: Math.floor((bigDatesArray.length - 1) / 2),
  value: bigDatesArray[Math.floor((bigDatesArray.length - 1) / 2)],
};

const validEndDate: DateSearchResult<dayjs.Dayjs> = {
  index: bigDatesArray.length - 1,
  value: bigDatesArray[bigDatesArray.length - 1],
};

const validIndexDate: DateSearchResult<dayjs.Dayjs> = {
  index: 5,
  value: bigDatesArray[5],
};

const invalidDateResult: DateSearchResult<dayjs.Dayjs> = {
  index: null,
  value: null,
};

const invalidDate = dayjs.default("1970-1-1");

describe("search with flat array", () => {
  it("should find first", () => {
    const result = dateSearch(bigDatesArray, validDate.value);
    expect(result).toStrictEqual(validDate);
  });
  it("should find, middle", () => {
    const result = dateSearch(bigDatesArray, validMiddleDate.value);
    expect(result).toStrictEqual(validMiddleDate);
  });
  it("should find, last", () => {
    const result = dateSearch(bigDatesArray, validEndDate.value);
    expect(result).toStrictEqual(validEndDate);
  });
  it("should find, index part way through", () => {
    const result = dateSearch(bigDatesArray, validIndexDate.value);
    expect(result).toStrictEqual(validIndexDate);
  });
  it("should not find, return null results", () => {
    const result = dateSearch(bigDatesArray, invalidDate);
    expect(result).toStrictEqual(invalidDateResult);
  });
});
