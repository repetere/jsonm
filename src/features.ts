
import { DateTime, } from 'luxon';
import { Dimensions, } from './constants';
import * as ModelXData from '@modelx/data/src/index';
import * as ModelXDataTypes from '@modelx/data/src/DataSet';
export type UniqueDateOptions = {
  start: string;
  end: string;
  time_zone: string;
  weekday?: string | number;
}

/**
 * Returns an array of JavaScript Dates by Month within a range of ISO dates 
 * @example
getUniqueYears({ start: '2018-01-01', end: '2018-03-01', time_zone: 'America/Los_Angeles', }) => [  
  2017-01-01T08:00:00.000Z,
  2018-01-01T08:00:00.000Z,
  2019-01-01T08:00:00.000Z ]
 * @param {String} options.start - start of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.end - end of date range (ISO Date String) e.g. 2018-05-31
 * @param {String} options.time_zone - valid IANA time_zone e.g. America/Los_Angeles 
 * @returns {Date[]} Array of JavaScript Dates
 */
export function getUniqueYears({ start, end, time_zone, }:UniqueDateOptions):Date[] {
  if (!time_zone) throw new ReferenceError('Missing required timezone');
  let startDate = DateTime.fromISO(start, { zone: time_zone, }).set({ month: 1, day: 1, hour:0, minute:0, second:0, millisecond:0, });
  const endDate = DateTime.fromISO(end, { zone: time_zone, }).set({ month: 1, day: 1, hour:0, minute:0, second:0, millisecond:0, });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false) throw new SyntaxError('Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)');
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ years: 1, });
  } while (startDate <= endDate);
  return uniqueDates;
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
getUniqueHours({ start: '2018-01-01', end: '2018-01-31', weekday:'monday', time_zone: 'America/Los_Angeles', }) => [  
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
 * Returns an array of JavaScript Dates by Hours within a range of ISO dates 
 * @example
getUniqueHours({ start: '2018-01-01', end: '2018-01-31', weekday:'monday', time_zone: 'America/Los_Angeles', }) => [  
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
export function getUniqueMinutes({ start, end, time_zone, }:UniqueDateOptions):Date[] {
  if (!time_zone) throw new ReferenceError('Missing required timezone');
  let startDate = DateTime.fromISO(start, { zone: time_zone, }).set({ second: 0, millisecond: 0, });
  const endDate = DateTime.fromISO(end, { zone: time_zone, }).set({ second: 0, millisecond: 0, });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false) throw new SyntaxError('Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)');
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ minutes: 1, });
  } while (startDate <= endDate);
  return uniqueDates;
}

/**
 * Returns an array of JavaScript Dates by Hours within a range of ISO dates 
 * @example
getUniqueSeconds({ start: '2018-01-01', end: '2018-01-31', weekday:'monday', time_zone: 'America/Los_Angeles', }) => [  
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
export function getUniqueSeconds({ start, end, time_zone, }:UniqueDateOptions):Date[] {
  if (!time_zone) throw new ReferenceError('Missing required timezone');
  let startDate = DateTime.fromISO(start, { zone: time_zone, }).set({ millisecond: 0, });
  const endDate = DateTime.fromISO(end, { zone: time_zone, }).set({ millisecond: 0, });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false) throw new SyntaxError('Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)');
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ seconds: 1, });
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
    case 'yearly':
      returnDate = start.plus({ years: 1, });
      break;
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
    case 'minutely':
      returnDate = start.plus({ minutes: 1, });
      break;
    case 'secondly':
      returnDate = start.plus({ seconds: 1, });
      break;
    default:
      throw new ReferenceError('Invalid dimension');
  }
  if (returnDate.isValid === false) throw new SyntaxError('Date format or time_zone is invalid, Date must be a JavaScript Date Object');

  return returnDate.toJSDate();
}

export const dimensionDates = {
  [Dimensions.YEARLY]: getUniqueYears,
  [Dimensions.MONTHLY]: getUniqueMonths,
  [Dimensions.WEEKLY]: getUniqueWeeks,
  [Dimensions.DAILY]: getUniqueDays,
  [Dimensions.HOURLY]: getUniqueHours,
  [Dimensions.MINUTELY]: getUniqueMinutes,
  [Dimensions.SECONDLY]: getUniqueSeconds,
};
export function getEncodedFeatures({ DataSet, encoded, }: {DataSet:ModelXDataTypes.DataSet,encoded?:string[]}) {
  try {
    if (!encoded) {
      return ([]);
    } else {
      const encodedFeatures = encoded.reduce((results, encode) => {
        results.push(...DataSet.encoders.get(encode).labels.map(label => `${DataSet.encoders.get(encode).prefix}${label}`));
        return results;
      }, []);
      return (encodedFeatures);
    }
  } catch (e) {
    throw (e);
  }
}

export enum AutoFeatureTypes{
  TEXT = 'text-encoded',
  LABEL = 'text-label',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  AUTO = 'auto-detect',
}
export type AutoFeature = {
  feature_field_type: AutoFeatureTypes;
  feature_field_name: string;
};
export type AutoFeatureAutoAssignmentOptions = {
  independentVariables?: string[];
  dependentVariables?: string[];
  datum?: ModelXDataTypes.Datum;
  input_independent_features?: AutoFeature[];
  output_dependent_features?: AutoFeature[];
  training_feature_column_options?: ModelXDataTypes.DataSetTransform;
  preprocessing_feature_column_options?: ModelXDataTypes.DataSetTransform;
  features?: AutoFeature[];
};

export function getAutoFeatures({ variables, datum }: { variables: string[]; datum: ModelXDataTypes.Datum; }): AutoFeature[]{
  return variables.map(variable => { 
    const autofeature = {
      feature_field_name: variable,
      feature_field_type: AutoFeatureTypes.AUTO,
    };
    if (typeof datum[variable] === 'number') autofeature.feature_field_type= AutoFeatureTypes.NUMBER;
    else if (typeof datum[variable] === 'boolean') autofeature.feature_field_type= AutoFeatureTypes.BOOLEAN;
    else if (typeof datum[variable] === 'string') autofeature.feature_field_type= AutoFeatureTypes.TEXT;

    return autofeature;
  });
}

export function autoAssignFeatureColumns({ independentVariables, dependentVariables, datum, input_independent_features, output_dependent_features, training_feature_column_options = {}, preprocessing_feature_column_options = {}, }:AutoFeatureAutoAssignmentOptions) {
  const input_auto_features = new Array().concat(
    (independentVariables && independentVariables.length && datum)
      ? getAutoFeatures({ variables: independentVariables, datum, })
      : [],
    input_independent_features || []);
  const output_auto_features = new Array().concat(
    (dependentVariables && dependentVariables.length && datum)
      ? getAutoFeatures({ variables: dependentVariables, datum, })
      : [],
    output_dependent_features || []);
  console.log('input_auto_features',input_auto_features)
  console.log('output_auto_features',output_auto_features)
  const model_auto_features = new Array().concat(input_auto_features, output_auto_features);
  model_auto_features.forEach((auto_feature:AutoFeature) => {
    if (auto_feature.feature_field_type === AutoFeatureTypes.TEXT) {
      training_feature_column_options[auto_feature.feature_field_name] = ['onehot'];
    } else if (auto_feature.feature_field_type === AutoFeatureTypes.LABEL) {
      training_feature_column_options[auto_feature.feature_field_name] = ['label'];
    } else if (auto_feature.feature_field_type === AutoFeatureTypes.BOOLEAN) {
      training_feature_column_options[auto_feature.feature_field_name] = ['label', { binary: true, },];
    } else if ([AutoFeatureTypes.NUMBER, AutoFeatureTypes.AUTO,].includes(auto_feature.feature_field_type)) {
      training_feature_column_options[auto_feature.feature_field_name] = ['scale', 'standard',];
      preprocessing_feature_column_options[auto_feature.feature_field_name] = ['median',];
    }
  });
  return {
    x_raw_independent_features: input_auto_features.map(af => af.feature_field_name),
    y_raw_dependent_labels: output_auto_features.map(af => af.feature_field_name),
    training_feature_column_options,
    preprocessing_feature_column_options,
  };
}
