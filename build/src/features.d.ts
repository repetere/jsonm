import * as JSONStackDataTypes from '@jsonstack/data/src/DataSet';
export declare type UniqueDateOptions = {
    start: string;
    end: string;
    time_zone: string;
    weekday?: string | number;
};
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
export declare function getUniqueYears({ start, end, time_zone, }: UniqueDateOptions): Date[];
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
export declare function getUniqueMonths({ start, end, time_zone, }: UniqueDateOptions): Date[];
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
export declare function getUniqueWeeks({ start, end, weekday, time_zone, }: UniqueDateOptions): Date[];
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
export declare function getUniqueDays({ start, end, time_zone, }: UniqueDateOptions): Date[];
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
export declare function getUniqueHours({ start, end, time_zone, }: UniqueDateOptions): Date[];
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
export declare function getUniqueMinutes({ start, end, time_zone, }: UniqueDateOptions): Date[];
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
export declare function getUniqueSeconds({ start, end, time_zone, }: UniqueDateOptions): Date[];
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
export declare function getEndDate(options: {
    start_date: Date;
    dimension: string;
    time_zone: string;
}): Date;
export declare const dimensionDates: {
    yearly: typeof getUniqueYears;
    monthly: typeof getUniqueMonths;
    weekly: typeof getUniqueWeeks;
    daily: typeof getUniqueDays;
    hourly: typeof getUniqueHours;
    minutely: typeof getUniqueMinutes;
    secondly: typeof getUniqueSeconds;
};
export declare function getEncodedFeatures({ DataSet, features, }: {
    DataSet: JSONStackDataTypes.DataSet;
    features?: string[];
}): any[];
export declare enum AutoFeatureTypes {
    TEXT = "text-encoded",
    LABEL = "text-label",
    BOOLEAN = "boolean",
    NUMBER = "number",
    AUTO = "auto-detect"
}
export declare type AutoFeature = {
    feature_field_type: AutoFeatureTypes;
    feature_field_name: string;
};
export declare type AutoFeatureAutoAssignmentOptions = {
    independent_variables?: string[];
    dependent_variables?: string[];
    datum?: JSONStackDataTypes.Datum;
    input_independent_features?: AutoFeature[];
    output_dependent_features?: AutoFeature[];
    training_feature_column_options?: JSONStackDataTypes.DataSetTransform;
    preprocessing_feature_column_options?: JSONStackDataTypes.DataSetTransform;
    features?: AutoFeature[];
};
export declare function getAutoFeatures({ variables, datum }: {
    variables: string[];
    datum: JSONStackDataTypes.Datum;
}): AutoFeature[];
export declare function autoAssignFeatureColumns({ independent_variables, dependent_variables, datum, input_independent_features, output_dependent_features, training_feature_column_options, preprocessing_feature_column_options, }: AutoFeatureAutoAssignmentOptions): {
    x_raw_independent_features: any[];
    y_raw_dependent_labels: any[];
    training_feature_column_options: JSONStackDataTypes.DataSetTransform;
    preprocessing_feature_column_options: JSONStackDataTypes.DataSetTransform;
};
