import * as dayjs from "dayjs";
import {
  dateSearch,
  dateSearchBetween,
  DateSearchModes,
  DateSearchResult,
  DateSearchTargets,
  defaultTimeComparator,
} from "./dateSearch";
import { generateDateData, generateNestedDateData } from "./generateData.mock";

const smallDatesArray = generateDateData("2020-1-1", 101);
const smallNestedArray = generateNestedDateData("2020-1-1", 101);
const bigDatesArray = generateDateData();
const bigNestedArray = generateNestedDateData();

const invalidDate = dayjs.default(bigNestedArray[0].child.date).add(-1, "day");

const invalidDateResult: DateSearchResult<dayjs.Dayjs> = {
  index: undefined,
  value: undefined,
};

const validstartDate: DateSearchResult<dayjs.Dayjs> = {
  index: 0,
  value: bigDatesArray[0],
};

// const invalidDateBetweenResult: DateSearchBetweenResult<dayjs.Dayjs> = {
//   startValue: undefined,
//   endValue: undefined,
//   array: [],
// };

describe("search with flat array", () => {
  it("should find first", () => {
    const result = dateSearch(bigDatesArray, validstartDate.value);
    expect(result).toStrictEqual(validstartDate);
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
      smallNestedArray,
      smallNestedArray[0].child.date,
      "child.date"
    );
    expect(result).toStrictEqual({
      index: 0,
      value: smallNestedArray[0],
    });
  });
  it("should not find with selector", () => {
    const result = dateSearch(smallNestedArray, invalidDate, "child.date");
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

const customFormatArray = bigDatesArray.map((d) =>
  d.format("MM/DD/YYYY HH:mm")
);

const targetValNumber = parseInt(
  bigDatesArray[5].format("YYYY-DD-MM").split("-").join("")
);

const targetValNumberTimeOffset = parseInt(
  bigDatesArray[5].add(1, "hour").format("YYYY-DD-MM-HH-mm").split("-").join("")
);

const validDateCustom = {
  index: 5,
  value: customFormatArray[5],
};

const validDateCustomCeil = {
  index: 6,
  value: customFormatArray[6],
};

const customCompare = (targetVal: DateSearchTargets, searchVal: string) => {
  const tString = `${targetVal}`;
  const tY = tString.substring(0, 4);
  const tD = tString.substring(4, 6);
  const tM = tString.substring(6, 8);
  const tH = tString.substring(8, 10) || "00";
  const tMin = tString.substring(8, 12) || "00";
  const tIsoString = `${tY}-${tM}-${tD} ${tH}:${tMin}`;
  const t = dayjs.default(tIsoString).unix();

  const sSplit = searchVal.split(" ");
  const sTArray = sSplit[1] ? sSplit[1].split(":") : ["00", "00"];
  const sDArray = sSplit[0].split("/");
  const sIsoString = `${sDArray[2]}-${sDArray[0]}-${sDArray[1]} ${sTArray[0]}:${sTArray[1]}`;
  const s = dayjs.default(sIsoString).unix();

  return t - s;
};

describe("custom comparator", () => {
  it("should find the element", () => {
    const result = dateSearch(
      customFormatArray,
      targetValNumber,
      customCompare
    );

    expect(result).toStrictEqual(validDateCustom);
  });
  it("should round down to the closest result", () => {
    const result = dateSearch(
      customFormatArray,
      targetValNumberTimeOffset,
      customCompare,
      DateSearchModes.CLOSEST_FLOOR
    );
    expect(result).toStrictEqual(validDateCustom);
  });
  it("round down, out of bounds first result", () => {
    const target = smallDatesArray[0].add(-1, "days");

    const result = dateSearch(
      smallDatesArray,
      target,
      defaultTimeComparator,
      DateSearchModes.CLOSEST_FLOOR
    );
    expect(result).toStrictEqual({
      index: 0,
      value: smallDatesArray[0],
    });
  });
  it("should round up to the closest result", () => {
    const result = dateSearch(
      customFormatArray,
      targetValNumberTimeOffset,
      customCompare,
      DateSearchModes.CLOSEST_CEIL
    );
    expect(result).toStrictEqual(validDateCustomCeil);
  });
  it("should not find element", () => {
    const invalidCustomDate = bigDatesArray[0]
      .add(-1, "days")
      .format("YYYY-DD-MM")
      .split("-")
      .join("");
    const result = dateSearch(
      customFormatArray,
      invalidCustomDate,
      customCompare
    );
    expect(result).toStrictEqual(invalidDateResult);
  });
});

describe("between", () => {
  it("first and last match", () => {
    const firstIndex = 10;
    const lastIndex = 80;
    const startValue = smallDatesArray[firstIndex];
    const endValue = smallDatesArray[lastIndex];

    const expected = {
      startValue: { index: firstIndex, value: startValue },
      endValue: { index: lastIndex, value: endValue },
      array: smallDatesArray.slice(firstIndex, lastIndex),
    };

    const result = dateSearchBetween(smallDatesArray, startValue, endValue);

    expect(result).toStrictEqual(expected);
  });
  it("first matches and last is out of bounds", () => {
    const firstIndex = 10;
    const lastIndex = smallDatesArray.length - 1;
    const startValue = smallDatesArray[firstIndex];
    const endValue = smallDatesArray[lastIndex];

    const errValue = endValue
      .add(1, "days")
      .format("YYYY-DD-MM")
      .split("-")
      .join("");

    const expected = {
      startValue: { index: firstIndex, value: startValue },
      endValue: { index: lastIndex, value: endValue },
      array: smallDatesArray.slice(firstIndex, lastIndex),
    };

    const result = dateSearchBetween(smallDatesArray, startValue, errValue);

    expect(result).toStrictEqual(expected);
  });
  it("first is out of bounds and last matches", () => {
    const firstIndex = 0;
    const lastIndex = 4;
    const startValue = smallDatesArray[firstIndex];
    const endValue = smallDatesArray[lastIndex];

    const errValue = smallDatesArray[firstIndex].add(-1, "days");

    const expected = {
      startValue: { index: firstIndex, value: startValue },
      endValue: { index: lastIndex, value: endValue },
      array: smallDatesArray.slice(firstIndex, lastIndex),
    };

    const result = dateSearchBetween(smallDatesArray, errValue, endValue);

    expect(result).toStrictEqual(expected);
  });
});
