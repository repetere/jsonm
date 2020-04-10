
import { DateTime, } from 'luxon';

export type UniqueDateOptions = {
  start: string;
  end: string;
  time_zone: string;
  weekday?: string | number;
}

/**
 * Returns an array of JavaScript Dates by Month within a range of ISO dates 
 * @example
getUniqueMonths({ start: '2018-01-01', end: '2018-03-01', time_zone: 'America/Los_Angeles', }) => [  
  2018-01-01T08:00:00.000Z,
  2018-02-01T08:00:00.000Z,
  2018-03-01T08:00:00.000Z ]
 * @param {String} options.start - start of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.end - end of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.time_zone - valid IANA time_zone e.g. America/Los_Angeles 
 * @returns {Date[]} Array of JavaScript Dates
 */
export function getUniqueMonths({ start, end, time_zone, }:UniqueDateOptions):Date[] {
  if (!time_zone) throw new ReferenceError('Missing required timezone');
  let startDate = DateTime.fromISO(start, { zone: time_zone, }).set({ day: 1, hour:0, minute:0, second:0, millisecond:0, });
  const endDate = DateTime.fromISO(end, { zone: time_zone, }).set({ day: 1, hour:0, minute:0, second:0, millisecond:0, });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false) throw new SyntaxError('Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)');
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ months: 1, });
  } while (startDate <= endDate);
  return uniqueDates;
}

/**
 * Returns an array of JavaScript Dates by Weeks within a range of ISO dates 
 * @example
getUniqueMonths({ start: '2018-01-01', end: '2018-01-31', weekday:'monday', time_zone: 'America/Los_Angeles', }) => [  
  2018-01-01T08:00:00.000Z,
  2018-01-08T08:00:00.000Z,
  2018-01-15T08:00:00.000Z,
  2018-01-22T08:00:00.000Z,
  2018-01-29T08:00:00.000Z ]]
 * @param {String} options.start - start of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.end - end of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.time_zone - valid IANA time_zone e.g. America/Los_Angeles 
 * @param {String|Number} options.weekday - 'monday' or '1'
 * @returns {Date[]} Array of JavaScript Dates
 */
export function getUniqueWeeks({ start, end, weekday = 'monday', time_zone, }:UniqueDateOptions):Date[] {
  if (!time_zone) throw new ReferenceError('Missing required timezone');
  const weekdayNumbers: { [index: string]: number;} = {
    monday: 1,
    '1':1,
    tuesday: 2,
    '2':1,
    wednesday: 3,
    '3':1,
    thursday: 4,
    '4':1,
    friday: 5,
    '5':1,
    saturday: 6,
    '6':1,
    sunday: 7,
    '7':1,
    default: 1,
  };
  const weekdayString = weekday.toString().toLowerCase();
  const weekdayNumber = weekdayNumbers[weekdayString];
  if (!weekdayNumber) throw new ReferenceError(`Invalid weekday (${weekday}), must be either 1-7 or monday-sunday`);
  // start = DateTime.fromJSDate(new Date(start), { zone: time_zone, });
  // end = DateTime.fromJSDate(new Date(end), { zone: time_zone, });
  let startLuxon = DateTime.fromISO(start, { zone: time_zone, }).set({ hour:0, minute:0, second:0, millisecond:0, });
  let endLuxon = DateTime.fromISO(end, { zone: time_zone, }).set({ hour:0, minute:0, second:0, millisecond:0, });
  let startDate = (weekdayNumber >= startLuxon.weekday)
    ? startLuxon.plus({ days: weekdayNumber - startLuxon.weekday, })
    : startLuxon.minus({ days: startLuxon.weekday - weekdayNumber, });
  const endDate = (weekdayNumber >= endLuxon.weekday)
    ? endLuxon.plus({ days: weekdayNumber - endLuxon.weekday, })
    : endLuxon.minus({ days: endLuxon.weekday - weekdayNumber, });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false) throw new SyntaxError('Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)');
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ days: 7, });
  } while (startDate <= endDate);
  return uniqueDates;
}

/**
 * Returns an array of JavaScript Dates by Days within a range of ISO dates 
 * @example
getUniqueMonths({ start: '2018-01-01', end: '2018-01-31', weekday:'monday', time_zone: 'America/Los_Angeles', }) => [  
  2018-01-01T08:00:00.000Z,
  2018-01-02T08:00:00.000Z,
  ...
  2018-01-29T08:00:00.000Z,
  2018-01-30T08:00:00.000Z,
  2018-01-31T08:00:00.000Z ]]
 * @param {String} options.start - start of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.end - end of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.time_zone - valid IANA time_zone e.g. America/Los_Angeles 
 * @returns {Date[]} Array of JavaScript Dates
 */
export function getUniqueDays({ start, end, time_zone, }:UniqueDateOptions):Date[] {
  if (!time_zone) throw new ReferenceError('Missing required timezone');
  let startDate = DateTime.fromISO(start, { zone: time_zone, }).set({ hour: 0, minute: 0, second: 0, millisecond: 0, });
  const endDate = DateTime.fromISO(end, { zone: time_zone, }).set({ hour: 0, minute: 0, second: 0, millisecond: 0, });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false) throw new SyntaxError('Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)');

    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ days: 1, });
  } while (startDate <= endDate);
  // console.log({ uniqueDates });
  return uniqueDates;
}

/**
 * Returns an array of JavaScript Dates by Hours within a range of ISO dates 
 * @example
getUniqueMonths({ start: '2018-01-01', end: '2018-01-31', weekday:'monday', time_zone: 'America/Los_Angeles', }) => [  
  2018-01-01T00:08:00.000Z,
  2018-01-01T01:09:00.000Z,
  ...
  2018-01-01T21:00:00.000Z,
  2018-01-01T22:00:00.000Z,
  2018-01-01T23:00:00.000Z ]]
 * @param {String} options.start - start of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.end - end of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.time_zone - valid IANA time_zone e.g. America/Los_Angeles 
 * @returns {Date[]} Array of JavaScript Dates
 */
export function getUniqueHours({ start, end, time_zone, }:UniqueDateOptions):Date[] {
  if (!time_zone) throw new ReferenceError('Missing required timezone');
  let startDate = DateTime.fromISO(start, { zone: time_zone, }).set({ minute: 0, second: 0, millisecond: 0, });
  const endDate = DateTime.fromISO(end, { zone: time_zone, }).set({ minute: 0, second: 0, millisecond: 0, });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false) throw new SyntaxError('Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)');
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ hours: 1, });
  } while (startDate <= endDate);
  return uniqueDates;
}

/**
 * Returns an end date from a start date by dimension 
 * @example
getEndDate({ start: '2018-01-01', dimension: 'monthly', time_zone: 'America/Los_Angeles', }) => 2018-02-01T00:08:00.000Z
getEndDate({ start: '2018-01-01', dimension: 'weekly', time_zone: 'America/Los_Angeles', }) => 2018-01-08T00:08:00.000Z
getEndDate({ start: '2018-01-01', dimension: 'daily', time_zone: 'America/Los_Angeles', }) => 2018-01-02T00:08:00.000Z
getEndDate({ start: '2018-01-01', dimension: 'hourly', time_zone: 'America/Los_Angeles', }) => 2018-01-01T00:09:00.000Z
 * @param {Date} options.start_date - start of date 
 * @param {String} options.dimension - monthly, weekly, daily, hourly
 * @param {String} options.time_zone - valid IANA time_zone e.g. America/Los_Angeles 
 * @returns {Date} JavaScript end date
 */
export function getEndDate(options: { start_date: Date; dimension: string; time_zone:string;}):Date {
  const { start_date, dimension, time_zone, } = options;
  if (!time_zone) throw new ReferenceError('Missing required timezone');

  const start = DateTime.fromJSDate(start_date, { zone: time_zone, });
  let returnDate;

  switch (dimension) {
    case 'monthly':
      returnDate = start.plus({ months: 1, });
      break;
    case 'weekly':
      returnDate = start.plus({ weeks: 1, });
      break;
    case 'daily':
      returnDate = start.plus({ days: 1, });
      break;
    case 'hourly':
      returnDate = start.plus({ hours: 1, });
      break;
    default:
      throw new ReferenceError('Invalid dimension');
  }
  if (returnDate.isValid === false) throw new SyntaxError('Date format or time_zone is invalid, Date must be a JavaScript Date Object');

  return returnDate.toJSDate();
}

export const dimensionDates = {
  monthly: getUniqueMonths,
  weekly: getUniqueWeeks,
  daily: getUniqueDays,
  hourly: getUniqueHours,
};