# date-search
> npm package to search time series data

WIP, docs coming soon.

Usage

```js
import { dateSearch } from 'dateSearch';
```

```js
const bigDatesArray = [Date('2000-1-1'), Date(), Date(), ...];

const targetDate = Date('2000-1-1')

const result = dateSearch(bigDatesArray, targetDate)

result === targetDate // true
```

## Features
- custom comparators:
  - string referencing a value within an object or nested object.
  -  OR a custom comparison function.
- Date, timestamp string, and unix epocs excepted.
- Built with DayJS for MomentJS regression.
- Find exact or closest entry
