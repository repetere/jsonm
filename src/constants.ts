import { DateTime, DateTimeJSOptions, DateObject, } from 'luxon';
import Outlier from 'outlier';

export enum Dimensions {
  YEARLY='yearly',
  WEEKLY='weekly',
  MONTHLY='monthly',
  HOURLY='hourly',
  DAILY='daily',
  MINUTELY='minutely',
  SECONDLY='secondly',
}

export enum BooleanAnswer {
  UNKNOWN = -1,
  FALSE = 0,
  TRUE = 1,
}

export interface ParsedDate extends DateObject{
  hour?: number;
  minute?: number;
  week?: number; //weekNumber
  ordinal_day?: number; //ordinal
  days_in_month?: number; //daysInMonth
  weekend?: boolean;
  quarter_hour?: number;
}

export type Entity = {
  [index: string]: any;
}

export type LuxonDateTimeAndFormat = {
  date: DateTime;
  format: string;
}

export function getLuxonDateTime(options: { time_zone?: string; dateObject: Date|string; dateFormat?: string; }):LuxonDateTimeAndFormat {
  const { dateObject, dateFormat, } = options;
  if (dateFormat === 'js' && typeof dateObject === 'object' || (typeof dateObject === 'object' && dateObject instanceof Date)) {
    return {
      date: DateTime.fromJSDate(dateObject as Date, { zone: options.time_zone, }),
      format: 'js',
    };
  } else if (typeof dateFormat === 'string' && dateFormat !== 'iso' && dateFormat !== 'js') {
    return {
      date: DateTime.fromFormat(dateObject as string, dateFormat, { zone: options.time_zone, }),
      format: dateFormat,
    };
  } else {
    return {
      date: DateTime.fromISO(dateObject as string, { zone: options.time_zone, }),
      format: 'iso',
    };
  }
}

// const yearNumbers = [];
const generatedMonthNumbers = [];
const generatedWeekNumbers = [];
const generatedDayNumbers = [];
const generatedQuarterhourNumbers = [];
const generatedOrdinalDayNumbers = [];
const generatedHourNumbers = [];
const generatedMinuteNumbers = [];
const generatedSecondNumbers = [];
const generatedMockDateObject = {
  year: new Date().getFullYear(),
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  week: 1,
  weekday: 1,
  quarter_hour: 1,
  oridinalday:1,
};
const generatedMockDates = [generatedMockDateObject, ];

for (let i = 0; i <= 366; i++){
  const newMockDate = Object.assign({}, generatedMockDateObject);
  if (i >= 1 && i <= 12) {
    newMockDate.month = i;
    generatedMonthNumbers.push(i);
  }
  if (i >= 1 && i <= 52) {
    newMockDate.week = i;
    generatedWeekNumbers.push(i);
  }
  if (i >= 1 && i <= 7) {
    newMockDate.weekday = i;
    generatedDayNumbers.push(i);
  }
  if (i >= 1 && i <= 366) {
    newMockDate.oridinalday = i;
    generatedOrdinalDayNumbers.push(i);
  }
  if (i >= 1 && i <= 31) {
    newMockDate.day = i;
    generatedDayNumbers.push(i);
  }
  if (i >= 1 && i <= 96) {
    newMockDate.quarter_hour = i;
    generatedQuarterhourNumbers.push(i);
  }
  if (i <= 23) {
    newMockDate.hour = i;
    generatedHourNumbers.push(i);
  }
  if (i <= 59) {
    newMockDate.minute = i;
    generatedMinuteNumbers.push(i);
  }
  if (i <= 59) {
    newMockDate.second = i;
    generatedSecondNumbers.push(i);
  }
  generatedMockDates.push(newMockDate);
}

export const mockDates = generatedMockDates;

export function getPartialHour(minute:number):number {
  const partialHour = minute / 15;
  if (partialHour < 1) {
    return 1;
  } else if (partialHour < 2) {
    return 2;
  } else if (partialHour < 3) {
    return 3;
  } else {
    return 4;
  }
}

export function getQuarterHour(parsedDate: ParsedDate):number {
  if(typeof parsedDate.hour ==='undefined' || typeof parsedDate.minute ==='undefined') throw new ReferenceError('both hour and minute are required')
  return parsedDate.hour * 4 + getPartialHour(parsedDate.minute);
}

export function getParsedDate(date:Date, options:DateTimeJSOptions): ParsedDate {
  const luxonDate = DateTime.fromJSDate(date, options);
  const parsedDate:ParsedDate = Object.assign({}, luxonDate.toObject());
  parsedDate.week = luxonDate.weekNumber;
  parsedDate.ordinal_day = luxonDate.ordinal;
  parsedDate.weekday = luxonDate.weekday;
  parsedDate.days_in_month = luxonDate.daysInMonth;

  parsedDate.weekend = (luxonDate.weekday === 6 || luxonDate.weekday === 7) ? true : false;
  parsedDate.quarter_hour = getQuarterHour(parsedDate);
  return parsedDate;
}

export const prettyTimeStringOutputFormat = 'ccc, dd LLL yyyy TTT';

export const timeProperty = {
  weekly:'weeks',
  monthly:'months',
  hourly:'hours',
  daily:'days',
};

export const durationToDimensionProperty = {
  'years':Dimensions.YEARLY,
  'weeks':Dimensions.WEEKLY,
  'months':Dimensions.MONTHLY,
  'days':Dimensions.DAILY,
  'hours': Dimensions.HOURLY,
};

export const featureTimeProperty = {
  weekly:'week',
  monthly:'month',
  hourly:'hour',
  daily:'day',
};

export const dateTimeProperty = {
  weekly:'weekNumber',
  monthly:'month',
  hourly:'hour',
  daily:'day',
};

export const performanceValues = {
  monthly: 6,
  weekly: 26,
  daily: 30,
  hourly: 48,
};

export const ISOOptions = {
  includeOffset: false,
  // suppressSeconds:true,
  suppressMilliseconds: true,
};
export const monthNumbers = generatedMonthNumbers;
export const weekNumbers = generatedWeekNumbers;
export const dayNumbers = generatedDayNumbers;
export const quarterhourNumbers = generatedQuarterhourNumbers;
export const ordinalDayNumbers = generatedOrdinalDayNumbers;
export const hourNumbers = generatedHourNumbers;
export const minuteNumbers = generatedMinuteNumbers;
export const secondNumbers = generatedSecondNumbers;
export const mockDateObject = generatedMockDateObject;
export const dimensionDurations = ['years', 'months', 'weeks', 'days', 'hours', ];
export const flattenDelimiter = '+=+';

export function getOpenHour(options):BooleanAnswer {
  const { date, parsedDate, zone, } = options;
  const entity = this.entity || {};
  const dimension = this.dimension;
  const operations = entity.operations;
  const closed = 0;
  const opened = 1;
  let openFromCustomClosed = 1;
  let openFromCustomOpened = 0;
  if (!operations) throw new Error(`${entity.name} is missing operation details`);
  if (!operations.launch_date) throw new Error(`${entity.name} is missing a launch date`);
  if (!operations.is_24_hours && (!operations.business_hours || Object.keys(operations.business_hours).length<7)) throw new Error(`${entity.name} is missing business hours`);
  if (operations.override && operations.override.hours && operations.override.hours.closed_times) {
    operations.override.hours.closed_times.forEach(closed => {
      const closedStart = luxon.DateTime.fromISO(closed.close_start, { zone, }).toJSDate();
      const closedEnd = luxon.DateTime.fromISO(closed.close_end, { zone, }).toJSDate();
      if (date >= closedStart && date < closedEnd) {
        openFromCustomClosed = 0;
        return closed;
      }
    });
  }
  if (operations.business_hours) {
    let regular_closed = 0;
    if (dimension === 'hourly') {
      if (parsedDate.weekday === 1 && isClosedOnDay({ weekday: 1, dayname: 'monday', parsedDate, date, operations, zone, })) regular_closed = 1;
      if (parsedDate.weekday === 2 && isClosedOnDay({ weekday: 2, dayname: 'tuesday', parsedDate, date, operations, zone, })) regular_closed = 1;
      if (parsedDate.weekday === 3 && isClosedOnDay({ weekday: 3, dayname: 'wednesday', parsedDate, date, operations, zone, })) regular_closed = 1;
      if (parsedDate.weekday === 4 && isClosedOnDay({ weekday: 4, dayname: 'thursday', parsedDate, date, operations, zone, })) regular_closed = 1;
      if (parsedDate.weekday === 5 && isClosedOnDay({ weekday: 5, dayname: 'friday', parsedDate, date, operations, zone, })) regular_closed = 1;
      if (parsedDate.weekday === 6 && isClosedOnDay({ weekday: 6, dayname: 'saturday', parsedDate, date, operations, zone, })) regular_closed = 1;
      if (parsedDate.weekday === 7 && isClosedOnDay({ weekday: 7, dayname: 'sunday', parsedDate, date, operations, zone, })) regular_closed = 1;
    }
    // if (operations.custom_times) {
    if (operations.override && operations.override.hours && operations.override.hours.custom_times) {  
      operations.override.hours.custom_times.forEach(open => {
        const openStart = luxon.DateTime.fromISO(open.custom_open, { zone, }).toJSDate();
        const openEnd = luxon.DateTime.fromISO(open.custom_close, { zone, }).toJSDate();
        if (date >= openStart && openEnd) {
          // console.log('custom open date');
          openFromCustomOpened = 1;
          regular_closed = opened;
          return opened;
        }
      });
    }
    
    if (regular_closed === 1) return closed;
  }
  
  return (openFromCustomClosed && opened) || openFromCustomOpened;
}

export function getIsOutlier({ outlier_property, }):BooleanAnswer {
  if (outlier_property) {
    const data = this.data;
    const outlier = Outlier(data.map(datum => datum[ outlier_property ]));
    const datum = this.datum;
    const dataPoint = datum[ outlier_property ];
    return outlier.testOutlier(dataPoint) ? 1 : -1;
  } else {
    return function noOutlier() {
      return 0; 
    };
  }
}