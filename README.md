# date-search

> Universal time series search

[
![npm](https://img.shields.io/npm/v/date-search?color=red)
![npm](https://img.shields.io/npm/dw/date-search)
![npm bundle size gzip](https://img.shields.io/bundlephobia/minzip/date-search?label=gzip)
](https://www.npmjs.com/package/date-search)

Search through your time series data with javascript. Find a value or its closest match through a list of dates or data frames. Dates can be represented as date string or number format that dateJS can parse.

For advanced use cases, you can provide a custom comparison function for non-standard formats.

## Documentation

For detailed documentation: [https://date-search.netlify.app](https://date-search.netlify.app)

## Installation

```js
npm i date-search
```

## Usage

Use the `dateSearch` function to quickly find if your target date is present.

```js
import { dateSearch } from 'date-search'; // or use require

const bigSortedDatesArray = [Date('2000-1-1'), Date('2000-1-2'), Date('2000-1-3')];
const targetDate = '2000-1-1';

const {index, value} =  dateSearch(
  bigSortedDatesArray,
  targetDate
);
targetDate === value; // true
index; // 0

```

The `dateSearchBetween` will return the closest matching results inclusive of the target start and end search dates.

```js
import { dateSearchBetween } from 'date-search'; // or use require

const bigSortedDatesArray = [Date('2000-1-1'), Date(), Date(), ...];

const startDate = '2000-1-13';
const endDate = '2000-1-23';

const {startValue, endValue, array} =  dateSearchBetween(
  bigSortedDatesArray,
  targetDate
);
array.length; // 11

```

## Features

- Date, timestamp string, and unix date numbers excepted.
- Custom comparators:
  - String referencing a value within an object or nested object.
  - Custom comparison function and date parsing.
- Get segment of array that matches between two dates.
- Built with DayJS for MomentJS regression and more reliable date parsing.
- Fuzzy search: find the exact or closest item.
- Written in typescript with type documentation.

## Advanced Usage

The search algo accepts these parameters:

### array

A typed array of dates or nested objects containing dates. These should be sorted by oldest to most recent.

### target

The value the algo is searching for. This should be the date that is being searched for. Valid inputs include `string`, `number`, `Date`, and `Dayjs` objects. `null` can be supplied but the module will throw an error.

### comparator (optional)

#### ComparatorFn

Uses the builtin `defaultTimeComparator` by default if no value is provided. It returns a positive or negative number that indicates which side of the array to search next.

```js
dayjs.extend(customParseFormat)

dateSearch(
  array: [{id: 123, child: {date: '12-25-1995'}}, ...],
  target: '12-25-1995',
  comparator: (a, b) => dayJS(a, "MM-DD-YYYY").unix() - dayJS(b, "MM-DD-YYYY").unix(),
)
```

#### string

Points to a nested key of an object containing the date value. It uses the same comparison logic as the `defaultTimeComparator` once the values are parsed.

```js
dateSearch(
  array: [{id: 123, child: {date: '2020-1-1'}}, ...],
  target: '2020-1-1',
  comparator: 'child.date',
  dateSearchMode: DateSearchModes.EXACT
)
```

### dateSearchMode

#### EXACT

Find the exact value. Returns `null` if not found.

```js
dateSearch(
  array: [{id: 123, child: {date: '2020-1-1'}}, ...],
  target: '1995-1-1',
  comparator: defaultTimeComparator,
  dateSearchMode: DateSearchModes.EXACT
) // not found, null is returned
```

#### CLOSEST_FLOOR

Find the closest index, rounding down. The first element is used if the `target` value is lower than the first `array` element.

```js
dateSearch(
  array: ['2020-1-1', '2020-2-1', '2020-5-1', ...],
  target: '1995-3-1',
  comparator: defaultTimeComparator,
  dateSearchMode: DateSearchModes.CLOSEST_FLOOR
) // returns index 1, value of 2020-2-1
```

#### CLOSEST_CEIL

Find the closest index, rounding up. The last element is used if the `target` value is greater than the last `array` element.

```js
dateSearch(
  array: ['2020-1-1', '2020-2-1', '2020-5-1', ...],
  target: '1995-3-1',
  comparator: defaultTimeComparator,
  dateSearchMode: DateSearchModes.CLOSEST_CEIL
) // returns index 2, value of 2020-2-1
```
