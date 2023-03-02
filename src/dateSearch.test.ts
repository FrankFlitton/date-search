import * as dayjs from "dayjs";
import { dateSearch, DateSearchModes, DateSearchResult, DateSearchTargets } from "./dateSearch";
import { generateDateData, generateNestedDateData } from "./generateData.mock";

const bigDatesArray = generateDateData();
const bigNestedArray = generateNestedDateData();

const invalidDate = dayjs.default(bigNestedArray[0].child.date).add(-1, "day");

const invalidDateResult: DateSearchResult<dayjs.Dayjs> = {
  index: null,
  value: null,
};

const validFirstDate: DateSearchResult<dayjs.Dayjs> = {
  index: 0,
  value: bigDatesArray[0],
};

describe("search with flat array", () => {
  it("should find first", () => {
    const result = dateSearch(bigDatesArray, validFirstDate.value);
    expect(result).toStrictEqual(validFirstDate);
  });
  it("should find, middle", () => {
    const validMiddleDate: DateSearchResult<dayjs.Dayjs> = {
      index: Math.floor((bigDatesArray.length - 1) / 2),
      value: bigDatesArray[Math.floor((bigDatesArray.length - 1) / 2)],
    };

    const result = dateSearch(bigDatesArray, validMiddleDate.value);
    expect(result).toStrictEqual(validMiddleDate);
  });
  it("should find, last", () => {
    const validEndDate: DateSearchResult<dayjs.Dayjs> = {
      index: bigDatesArray.length - 1,
      value: bigDatesArray[bigDatesArray.length - 1],
    };

    const result = dateSearch(bigDatesArray, validEndDate.value);
    expect(result).toStrictEqual(validEndDate);
  });
  it("should find, index part way through", () => {
    const validIndexDate: DateSearchResult<dayjs.Dayjs> = {
      index: 5,
      value: bigDatesArray[5],
    };

    const result = dateSearch(bigDatesArray, validIndexDate.value);
    expect(result).toStrictEqual(validIndexDate);
  });
  it("should not find, return null results", () => {
    const result = dateSearch(bigDatesArray, invalidDate);
    expect(result).toStrictEqual(invalidDateResult);
  });
});

describe("search with nested data", () => {
  it("should find with selector", () => {
    const result = dateSearch(
      bigNestedArray,
      bigNestedArray[0].child.date,
      "child.date"
    );
    expect(result).toStrictEqual({
      index: 0,
      value: bigNestedArray[0],
    });
  });
  it("should not find with selector", () => {
    const result = dateSearch(bigNestedArray, invalidDate, "child.date");
    expect(result).toStrictEqual(invalidDateResult);
  });
});

describe("search with nested data", () => {
  it("should find with selector", () => {
    const result = dateSearch(
      bigNestedArray,
      bigNestedArray[0].child.date,
      "child.date"
    );
    expect(result).toStrictEqual({
      index: 0,
      value: bigNestedArray[0],
    });
  });
  it("should not find with selector", () => {
    const result = dateSearch(bigNestedArray, invalidDate, "child.date");
    expect(result).toStrictEqual(invalidDateResult);
  });
});

const customFormatArray = bigDatesArray.map((d) => d.format("MM/DD/YYYY"));

const targetValNumber = parseInt(
  bigDatesArray[5].format("YYYY-DD-MM").split("-").join("")
);

const targetValNumberTimeOffset = parseInt(
  bigDatesArray[5].add(1, 'hour').format("YYYY-DD-MM").split("-").join("")
);

const validDateCustom = {
  index: 5,
  value: customFormatArray[5],
};

const customCompare = (targetVal: DateSearchTargets, searchVal: string) => {
  const tString = `${targetVal}`;
  const tD = tString.substring(4, 6);
  const tM = tString.substring(6, 8);
  const tY = tString.substring(0, 4);
  const t = dayjs.default(`${tY}-${tM}-${tD} 00:00`).unix();

  const sArray = searchVal.split("/");
  const s = dayjs
    .default(`${sArray[2]}-${sArray[0]}-${sArray[1]} 00:00`)
    .unix();

  console.log(
    `${tString}, ${tY}-${tM}-${tD}`,
    `${sArray[2]}-${sArray[0]}-${sArray[1]}`
  );

  return t - s;
};

describe("advanced searches", () => {
  it("custom comparator", () => {
    const result = dateSearch(
      customFormatArray,
      targetValNumber,
      customCompare,
      DateSearchModes.CLOSEST_FLOOR,
    );

    expect(result).toStrictEqual(validDateCustom);
  });
  it("custom comparator, round down", () => {
    const result = dateSearch(
      customFormatArray,
      targetValNumberTimeOffset,
      customCompare,
      DateSearchModes.CLOSEST_FLOOR,
    );

    expect(result).toStrictEqual(validDateCustom);
  });
});
