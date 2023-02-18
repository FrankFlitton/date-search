import dayjs, { Dayjs } from "dayjs";

export const generateDateData = (start = "1980-1-1", n = 1000001) => {
  const results = [];
  for (let i = 0; i < n; i++) {
    // Date can take an int, 4.20 = April 20, 2000 00:00:00
    const val = dayjs(start).add(i, "day");
    results.push(val);
  }
  return results;
};

export type ExampleNested = {
  id: number,
  child: {
    date: Dayjs
  }
}

export const generateNestedDateData = (start = "1980-1-1", n = 1000001) => {
  const results: ExampleNested[] = [];
  for (let i = 0; i < n; i++) {
    // Date can take an int, 4.20 = April 20, 2000 00:00:00
    const date = dayjs(start).add(i, "day");
    results.push({
      id: i,
      child: {
        date
      }
    });
  }
  return results;
};
