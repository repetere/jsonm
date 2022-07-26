var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Data: () => Data,
  JSONModel: () => ModelX,
  Model: () => Model,
  ModelCategories: () => ModelCategories,
  ModelTypes: () => ModelTypes,
  ModelX: () => ModelX,
  autoAssignFeatureColumns: () => autoAssignFeatureColumns,
  createModelFitCallback: () => createModelFitCallback,
  getAutoFeatures: () => getAutoFeatures,
  getBackend: () => getBackend,
  getDataSet: () => getDataSet,
  getGeneratedStatefulFunction: () => getGeneratedStatefulFunction,
  getModel: () => getModel,
  getModelFromJSONM: () => getModelFromJSONM,
  getModelTrainingOptions: () => getModelTrainingOptions,
  getScikit: () => getScikit,
  setBackend: () => setBackend,
  setScikit: () => setScikit,
  sumPreviousRows: () => sumPreviousRows
});
module.exports = __toCommonJS(src_exports);

// src/model.ts
var JSONStackData = __toESM(require("@jsonstack/data"), 1);
var JSONStackDataTypes = __toESM(require("@jsonstack/data/src/DataSet"), 1);
var JSONStackModel = __toESM(require("@jsonstack/model"), 1);
var import_src = __toESM(require("promisie/src/index"), 1);

// src/constants.ts
var import_luxon = require("luxon");
var import_outlier = __toESM(require("outlier"), 1);
function getLuxonDateTime(options) {
  const { dateObject, dateFormat } = options;
  if (dateFormat === "js" && typeof dateObject === "object" || typeof dateObject === "object" && dateObject instanceof Date) {
    return {
      date: import_luxon.DateTime.fromJSDate(dateObject, { zone: options.time_zone }),
      format: "js"
    };
  } else if (typeof dateFormat === "string" && dateFormat !== "iso" && dateFormat !== "js") {
    return {
      date: import_luxon.DateTime.fromFormat(dateObject, dateFormat, { zone: options.time_zone }),
      format: dateFormat
    };
  } else {
    return {
      date: import_luxon.DateTime.fromISO(dateObject, { zone: options.time_zone }),
      format: "iso"
    };
  }
}
var generatedMonthNumbers = [];
var generatedWeekNumbers = [];
var generatedDayNumbers = [];
var generatedQuarterhourNumbers = [];
var generatedOrdinalDayNumbers = [];
var generatedHourNumbers = [];
var generatedMinuteNumbers = [];
var generatedSecondNumbers = [];
var generatedMockDateObject = {
  year: new Date().getFullYear(),
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  week: 1,
  weekday: 1,
  quarter_hour: 1,
  oridinalday: 1
};
var generatedMockDates = [generatedMockDateObject];
for (let i = 0; i <= 366; i++) {
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
function training_on_progress({ completion_percentage, loss, epoch, status, logs, defaultLog = true }) {
  if (defaultLog)
    console.log({ completion_percentage, loss, epoch, status, logs });
}
var mockDates = generatedMockDates;
function getPartialHour(minute) {
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
function getQuarterHour(parsedDate) {
  if (typeof parsedDate.hour === "undefined" || typeof parsedDate.minute === "undefined")
    throw new ReferenceError("both hour and minute are required");
  return parsedDate.hour * 4 + getPartialHour(parsedDate.minute);
}
function getParsedDate(date, options) {
  const luxonDate = import_luxon.DateTime.fromJSDate(date, options);
  const parsedDate = Object.assign({}, luxonDate.toObject());
  parsedDate.week = luxonDate.weekNumber;
  parsedDate.ordinal_day = luxonDate.ordinal;
  parsedDate.weekday = luxonDate.weekday;
  parsedDate.days_in_month = luxonDate.daysInMonth;
  parsedDate.weekend = luxonDate.weekday === 6 || luxonDate.weekday === 7 ? true : false;
  parsedDate.quarter_hour = getQuarterHour(parsedDate);
  return parsedDate;
}
function getLocalParsedDate({ date, time_zone, dimension }) {
  const end_date = import_luxon.DateTime.fromJSDate(date).plus({
    [timeProperty[dimension]]: 1
  }).toJSDate();
  const startOriginDate = import_luxon.DateTime.fromJSDate(date, { zone: time_zone });
  const endOriginDate = import_luxon.DateTime.fromJSDate(end_date, { zone: time_zone });
  const startDate = import_luxon.DateTime.fromJSDate(date);
  const endDate = import_luxon.DateTime.fromJSDate(end_date);
  const { year, month, day, ordinal, weekday, hour, minute, second } = startOriginDate;
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    days_in_month: startOriginDate.daysInMonth,
    ordinal_day: ordinal,
    week: startOriginDate.weekNumber,
    weekday,
    weekend: startOriginDate.weekday >= 6,
    origin_time_zone: time_zone,
    start_origin_date_string: startOriginDate.toFormat(prettyTimeStringOutputFormat),
    start_gmt_date_string: startDate.toJSDate().toUTCString(),
    end_origin_date_string: endOriginDate.toFormat(prettyTimeStringOutputFormat),
    end_gmt_date_string: endDate.toJSDate().toUTCString()
  };
}
var prettyTimeStringOutputFormat = "ccc, dd LLL yyyy TTT";
var timeProperty = {
  ["monthly" /* MONTHLY */]: "months",
  ["weekly" /* WEEKLY */]: "weeks",
  ["daily" /* DAILY */]: "days",
  ["hourly" /* HOURLY */]: "hours"
};
var durationToDimensionProperty = {
  "years": "yearly" /* YEARLY */,
  "weeks": "weekly" /* WEEKLY */,
  "months": "monthly" /* MONTHLY */,
  "days": "daily" /* DAILY */,
  "hours": "hourly" /* HOURLY */
};
var ISOOptions = {
  includeOffset: false,
  suppressMilliseconds: true
};
var dimensionDurations = ["years", "months", "weeks", "days", "hours"];
var flattenDelimiter = "+=+";
function getOpenHour(options = {}) {
  return 1;
}
function getIsOutlier({ outlier_property } = {}) {
  if (outlier_property) {
    const data = this.data;
    const outlier = (0, import_outlier.default)(data.map((datum2) => datum2[outlier_property]));
    const datum = this.datum;
    const dataPoint = datum[outlier_property];
    return outlier.testOutlier(dataPoint) ? 1 : -1;
  } else {
    return 0;
  }
}
function addMockDataToDataSet(DataSet3, { mockEncodedData = [], includeConstants = true }) {
  const newMockData = new Array().concat(mockEncodedData, includeConstants ? mockDates : []);
  DataSet3.data = DataSet3.data.concat(newMockData);
  return DataSet3;
}
function removeMockDataFromDataSet(DataSet3, { mockEncodedData = [], includeConstants = true }) {
  const newMockData = new Array().concat(mockEncodedData, includeConstants ? mockDates : []);
  DataSet3.data.splice(DataSet3.data.length - newMockData.length, newMockData.length);
  return DataSet3;
}
function removeEvaluationData(evaluation) {
  evaluation.actuals = void 0;
  delete evaluation.actuals;
  evaluation.estimates = void 0;
  delete evaluation.estimates;
  return evaluation;
}

// src/features.ts
var import_luxon2 = require("luxon");
function getUniqueYears({ start, end, time_zone }) {
  if (!time_zone)
    throw new ReferenceError("Missing required timezone");
  let startDate = import_luxon2.DateTime.fromISO(start, { zone: time_zone }).set({ month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
  const endDate = import_luxon2.DateTime.fromISO(end, { zone: time_zone }).set({ month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false)
      throw new SyntaxError("Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)");
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ years: 1 });
  } while (startDate <= endDate);
  return uniqueDates;
}
function getUniqueMonths({ start, end, time_zone }) {
  if (!time_zone)
    throw new ReferenceError("Missing required timezone");
  let startDate = import_luxon2.DateTime.fromISO(start, { zone: time_zone }).set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
  const endDate = import_luxon2.DateTime.fromISO(end, { zone: time_zone }).set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false)
      throw new SyntaxError("Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)");
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ months: 1 });
  } while (startDate <= endDate);
  return uniqueDates;
}
function getUniqueWeeks({ start, end, weekday = "monday", time_zone }) {
  if (!time_zone)
    throw new ReferenceError("Missing required timezone");
  const weekdayNumbers = {
    monday: 1,
    "1": 1,
    tuesday: 2,
    "2": 1,
    wednesday: 3,
    "3": 1,
    thursday: 4,
    "4": 1,
    friday: 5,
    "5": 1,
    saturday: 6,
    "6": 1,
    sunday: 7,
    "7": 1,
    default: 1
  };
  const weekdayString = weekday.toString().toLowerCase();
  const weekdayNumber = weekdayNumbers[weekdayString];
  if (!weekdayNumber)
    throw new ReferenceError(`Invalid weekday (${weekday}), must be either 1-7 or monday-sunday`);
  let startLuxon = import_luxon2.DateTime.fromISO(start, { zone: time_zone }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  let endLuxon = import_luxon2.DateTime.fromISO(end, { zone: time_zone }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  let startDate = weekdayNumber >= startLuxon.weekday ? startLuxon.plus({ days: weekdayNumber - startLuxon.weekday }) : startLuxon.minus({ days: startLuxon.weekday - weekdayNumber });
  const endDate = weekdayNumber >= endLuxon.weekday ? endLuxon.plus({ days: weekdayNumber - endLuxon.weekday }) : endLuxon.minus({ days: endLuxon.weekday - weekdayNumber });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false)
      throw new SyntaxError("Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)");
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ days: 7 });
  } while (startDate <= endDate);
  return uniqueDates;
}
function getUniqueDays({ start, end, time_zone }) {
  if (!time_zone)
    throw new ReferenceError("Missing required timezone");
  let startDate = import_luxon2.DateTime.fromISO(start, { zone: time_zone }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const endDate = import_luxon2.DateTime.fromISO(end, { zone: time_zone }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false)
      throw new SyntaxError("Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)");
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ days: 1 });
  } while (startDate <= endDate);
  return uniqueDates;
}
function getUniqueHours({ start, end, time_zone }) {
  if (!time_zone)
    throw new ReferenceError("Missing required timezone");
  let startDate = import_luxon2.DateTime.fromISO(start, { zone: time_zone }).set({ minute: 0, second: 0, millisecond: 0 });
  const endDate = import_luxon2.DateTime.fromISO(end, { zone: time_zone }).set({ minute: 0, second: 0, millisecond: 0 });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false)
      throw new SyntaxError("Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)");
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ hours: 1 });
  } while (startDate <= endDate);
  return uniqueDates;
}
function getUniqueMinutes({ start, end, time_zone }) {
  if (!time_zone)
    throw new ReferenceError("Missing required timezone");
  let startDate = import_luxon2.DateTime.fromISO(start, { zone: time_zone }).set({ second: 0, millisecond: 0 });
  const endDate = import_luxon2.DateTime.fromISO(end, { zone: time_zone }).set({ second: 0, millisecond: 0 });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false)
      throw new SyntaxError("Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)");
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ minutes: 1 });
  } while (startDate <= endDate);
  return uniqueDates;
}
function getUniqueSeconds({ start, end, time_zone }) {
  if (!time_zone)
    throw new ReferenceError("Missing required timezone");
  let startDate = import_luxon2.DateTime.fromISO(start, { zone: time_zone }).set({ millisecond: 0 });
  const endDate = import_luxon2.DateTime.fromISO(end, { zone: time_zone }).set({ millisecond: 0 });
  const uniqueDates = [];
  do {
    if (startDate.isValid === false)
      throw new SyntaxError("Date format is invalid, must be an ISO Date (ISO 8601 e.g. 2019-03-21T11:42:00 - YYYY-MM-DDTHH:mm:ss)");
    uniqueDates.push(startDate.toJSDate());
    startDate = startDate.plus({ seconds: 1 });
  } while (startDate <= endDate);
  return uniqueDates;
}
var dimensionDates = {
  ["yearly" /* YEARLY */]: getUniqueYears,
  ["monthly" /* MONTHLY */]: getUniqueMonths,
  ["weekly" /* WEEKLY */]: getUniqueWeeks,
  ["daily" /* DAILY */]: getUniqueDays,
  ["hourly" /* HOURLY */]: getUniqueHours,
  ["minutely" /* MINUTELY */]: getUniqueMinutes,
  ["secondly" /* SECONDLY */]: getUniqueSeconds
};
function getEncodedFeatures({ DataSet: DataSet3, features = [] }) {
  if (DataSet3.encoders.size) {
    const featuresCopy = new Array().concat(features);
    const encodedFeatures = [];
    for (let encode of DataSet3.encoders.keys()) {
      if (features.includes(encode)) {
        const existingIndex = featuresCopy.indexOf(encode);
        featuresCopy.splice(existingIndex, 1);
        encodedFeatures.push(...DataSet3.encoders.get(encode).labels.map((label) => `${DataSet3.encoders.get(encode).prefix}${label}`));
      }
    }
    return Array.from(new Set(encodedFeatures.concat(featuresCopy)));
  }
  return features;
}
function getAutoFeatures({ variables, datum }) {
  return variables.map((variable) => {
    const autofeature = {
      feature_field_name: variable,
      feature_field_type: "auto-detect" /* AUTO */
    };
    if (typeof datum[variable] === "number")
      autofeature.feature_field_type = "number" /* NUMBER */;
    else if (typeof datum[variable] === "boolean")
      autofeature.feature_field_type = "boolean" /* BOOLEAN */;
    else if (typeof datum[variable] === "string")
      autofeature.feature_field_type = "text-encoded" /* TEXT */;
    return autofeature;
  });
}
function autoAssignFeatureColumns({ independent_variables, dependent_variables, datum, input_independent_features, output_dependent_features, training_feature_column_options = {}, preprocessing_feature_column_options = {} }) {
  const autoFeatureFilter = (autoFeature) => Object.keys(training_feature_column_options).includes(autoFeature.feature_field_name) === false;
  const input_auto_features = new Array().concat(
    independent_variables && independent_variables.length && datum ? getAutoFeatures({ variables: independent_variables, datum }) : [],
    input_independent_features || []
  );
  const output_auto_features = new Array().concat(
    dependent_variables && dependent_variables.length && datum ? getAutoFeatures({ variables: dependent_variables, datum }) : [],
    output_dependent_features || []
  );
  const model_auto_features = new Array().concat(input_auto_features, output_auto_features);
  model_auto_features.filter(autoFeatureFilter).forEach((auto_feature) => {
    if (auto_feature.feature_field_type === "text-encoded" /* TEXT */) {
      training_feature_column_options[auto_feature.feature_field_name] = ["onehot"];
    } else if (auto_feature.feature_field_type === "text-label" /* LABEL */) {
      training_feature_column_options[auto_feature.feature_field_name] = ["label"];
    } else if (auto_feature.feature_field_type === "boolean" /* BOOLEAN */) {
      training_feature_column_options[auto_feature.feature_field_name] = ["label", { binary: true }];
    } else if (["number" /* NUMBER */, "auto-detect" /* AUTO */].includes(auto_feature.feature_field_type)) {
      training_feature_column_options[auto_feature.feature_field_name] = ["scale", "standard"];
      preprocessing_feature_column_options[auto_feature.feature_field_name] = ["median"];
    }
  });
  return {
    x_raw_independent_features: input_auto_features.map((af) => af.feature_field_name),
    y_raw_dependent_labels: output_auto_features.map((af) => af.feature_field_name),
    training_feature_column_options,
    preprocessing_feature_column_options
  };
}

// src/model.ts
var Luxon = __toESM(require("luxon"), 1);
var import_flat = __toESM(require("flat"), 1);
var import_ml_confusion_matrix = __toESM(require("ml-confusion-matrix"), 1);

// src/tensorflow_singleton.ts
var tf = null;
function setBackend(tfInput) {
  tf = tfInput;
}
function getBackend() {
  if (tf === null) {
    throw Error(`
============================
Howdy \u{1F44B}\u{1F44B}. Looks like you are running @jsonstack/jsonm but you haven't set a Tensorflow backend. 
To do so, simply import (or require) your tensorflow library, and call setBackend like so,

import * as tf from '@tensorflow/tfjs';
import * as jsm from '@jsonstack/jsonm';
jsm.setBackend(tf);

That will let @jsonstack/jsonm know you wish to use a tensorflow library to perform your calculations.
============================
    `);
  }
  return tf;
}
function createModelFitCallback(callbackFunctions) {
  const tf2 = getBackend();
  if (Array.isArray(callbackFunctions)) {
    return callbackFunctions;
  } else if (callbackFunctions) {
    return Object.keys(callbackFunctions).map((callbackFunctionName) => {
      return new tf2.CustomCallback({ [callbackFunctionName]: callbackFunctions[callbackFunctionName] });
    });
  } else
    return [];
}

// src/scikitjs_singleton.ts
var scikit = null;
function setScikit(scikitInput) {
  scikit = scikitInput;
}
function getScikit() {
  if (scikit === null) {
    throw Error(`
============================
Howdy \u{1F44B}\u{1F44B}. Looks like you are running @jsonstack/model but you haven't set a ScikitJS backend. 
To do so, simply import (or require) your scikit library, and call setScikit like so,

import * as tf from '@tensorflow/tfjs';
import * as scikit from 'scikitjs';
import * as jsm from '@jsonstack/model';
jsm.setBackend(tf);
jsm.setScikit(scikit);

That will let @jsonstack/model know you wish to use a scikitjs library to perform your calculations.
============================
    `);
  }
  return scikit;
}

// src/model.ts
var ModelTypes = /* @__PURE__ */ ((ModelTypes3) => {
  ModelTypes3["FAST_FORECAST"] = "ai-fast-forecast";
  ModelTypes3["FORECAST"] = "ai-forecast";
  ModelTypes3["TIMESERIES_REGRESSION_FORECAST"] = "ai-timeseries-regression-forecast";
  ModelTypes3["LINEAR_REGRESSION"] = "ai-linear-regression";
  ModelTypes3["REGRESSION"] = "ai-regression";
  ModelTypes3["CLASSIFICATION"] = "ai-classification";
  ModelTypes3["LOGISTIC_CLASSIFICATION"] = "ai-logistic-classification";
  return ModelTypes3;
})(ModelTypes || {});
var ModelCategories = /* @__PURE__ */ ((ModelCategories2) => {
  ModelCategories2["PREDICTION"] = "regression";
  ModelCategories2["DECISION"] = "classification";
  ModelCategories2["FORECAST"] = "timeseries";
  ModelCategories2["RECOMMENDATION"] = "recommendation";
  ModelCategories2["REACTION"] = "reinforced";
  return ModelCategories2;
})(ModelCategories || {});
var modelMap = {
  "ai-fast-forecast": JSONStackModel.LSTMTimeSeries,
  "ai-forecast": JSONStackModel.LSTMMultivariateTimeSeries,
  "ai-timeseries-regression-forecast": JSONStackModel.MultipleLinearRegression,
  "ai-linear-regression": JSONStackModel.MultipleLinearRegression,
  "ai-regression": JSONStackModel.DeepLearningRegression,
  "ai-classification": JSONStackModel.DeepLearningClassification,
  "ai-logistic-classification": JSONStackModel.LogisticRegression
};
var modelCategoryMap = {
  ["ai-fast-forecast" /* FAST_FORECAST */]: "timeseries" /* FORECAST */,
  ["ai-forecast" /* FORECAST */]: "timeseries" /* FORECAST */,
  ["ai-timeseries-regression-forecast" /* TIMESERIES_REGRESSION_FORECAST */]: "timeseries" /* FORECAST */,
  ["ai-linear-regression" /* LINEAR_REGRESSION */]: "regression" /* PREDICTION */,
  ["ai-regression" /* REGRESSION */]: "regression" /* PREDICTION */,
  ["ai-classification" /* CLASSIFICATION */]: "classification" /* DECISION */,
  ["ai-logistic-classification" /* LOGISTIC_CLASSIFICATION */]: "classification" /* DECISION */
};
function getGeneratedStatefulFunction({ variable_name = "", function_body = "", props, function_name_prefix = "next_value_" }) {
  const func = Function("state", `'use strict';${function_body}`).bind({ props });
  Object.defineProperty(
    func,
    "name",
    {
      value: `${function_name_prefix}${variable_name}`
    }
  );
  return func;
}
function sumPreviousRows(options) {
  const { property, rows, offset = 1 } = options;
  const reverseTransform = Boolean(this.reverseTransform);
  const OFFSET = typeof this.offset === "number" ? this.offset : offset;
  const index = OFFSET;
  if (this.debug) {
    if (OFFSET < 1)
      throw new RangeError(`Offset must be larger than or equal to the default of 1 [property:${property}]`);
  }
  const begin = index;
  const end = rows + index;
  const sum = this.data.slice(begin, end).reduce((result, val) => {
    const value = reverseTransform ? this.DataSet.inverseTransformObject(val) : val;
    result = result + value[property];
    return result;
  }, 0);
  return sum;
}
var _ModelX = class {
  config;
  status;
  trainingData;
  removedFilterdtrainingData;
  use_empty_objects;
  use_preprocessing_on_trainning_data;
  use_next_value_functions_for_training_data;
  use_mock_encoded_data;
  validate_training_data;
  x_independent_features;
  y_dependent_labels;
  x_raw_independent_features;
  y_raw_dependent_labels;
  original_data_test;
  original_data_train;
  testDataSet;
  trainDataSet;
  prediction_inputs;
  prediction_options;
  x_indep_matrix_train;
  x_indep_matrix_test;
  y_dep_matrix_train;
  y_dep_matrix_test;
  Model;
  training_options;
  cross_validation_options;
  training_size_values;
  training_model_loss;
  preprocessing_feature_column_options;
  training_feature_column_options;
  training_data_filter_function_body;
  training_data_filter_function;
  training_progress_callback;
  prediction_inputs_next_value_functions;
  prediction_inputs_next_value_function;
  prediction_timeseries_time_zone;
  prediction_timeseries_date_feature;
  prediction_timeseries_date_format;
  retrain_forecast_model_with_predictions;
  prediction_timeseries_dimension_feature;
  prediction_timeseries_start_date;
  prediction_timeseries_end_date;
  dimension;
  entity;
  DataSet;
  forecastDates;
  emptyObject;
  mockEncodedData;
  debug;
  tf;
  scikit;
  auto_assign_features;
  independent_variables;
  dependent_variables;
  input_independent_features;
  output_dependent_features;
  max_evaluation_outputs;
  getTimeseriesDimension;
  constructor(configuration, options = {}) {
    this.debug = typeof configuration.debug === "boolean" ? configuration.debug : true;
    this.config = {
      use_cache: typeof configuration.use_cache === "boolean" ? configuration.use_cache : true,
      model_type: configuration.model_type || "ai-regression" /* REGRESSION */,
      use_mock_dates_to_fit_trainning_data: configuration.use_mock_dates_to_fit_trainning_data
    };
    this.config.model_category = modelCategoryMap[this.config.model_type];
    this.status = {
      trained: false,
      lastTrained: void 0
    };
    this.entity = configuration.entity || {};
    this.emptyObject = configuration.emptyObject || {};
    this.mockEncodedData = configuration.mockEncodedData || [];
    this.use_empty_objects = Boolean(Object.keys(this.emptyObject).length);
    this.use_mock_encoded_data = Boolean(this.mockEncodedData.length);
    this.dimension = configuration.dimension;
    this.training_data_filter_function_body = configuration.training_data_filter_function_body;
    this.training_data_filter_function = configuration.training_data_filter_function;
    this.trainingData = configuration.trainingData || [];
    this.removedFilterdtrainingData = [];
    this.DataSet = configuration.DataSet || new JSONStackData.DataSet();
    this.max_evaluation_outputs = configuration.max_evaluation_outputs || 5;
    this.testDataSet = configuration.testDataSet || new JSONStackData.DataSet();
    this.trainDataSet = configuration.trainDataSet || new JSONStackData.DataSet();
    this.x_indep_matrix_train = configuration.x_indep_matrix_train || [];
    this.x_indep_matrix_test = configuration.x_indep_matrix_test || [];
    this.y_dep_matrix_train = configuration.y_dep_matrix_train || [];
    this.y_dep_matrix_test = configuration.y_dep_matrix_test || [];
    this.x_independent_features = configuration.x_independent_features || [];
    this.x_raw_independent_features = configuration.x_raw_independent_features || [];
    this.y_dependent_labels = configuration.y_dependent_labels || [];
    this.y_raw_dependent_labels = configuration.y_raw_dependent_labels || [];
    this.auto_assign_features = typeof configuration.auto_assign_features === "boolean" ? configuration.auto_assign_features : true;
    this.independent_variables = configuration.independent_variables;
    this.dependent_variables = configuration.dependent_variables;
    this.input_independent_features = configuration.input_independent_features;
    this.output_dependent_features = configuration.output_dependent_features;
    this.use_next_value_functions_for_training_data = configuration.use_next_value_functions_for_training_data;
    this.training_size_values = configuration.training_size_values;
    this.cross_validation_options = {
      train_size: 0.7,
      ...configuration.cross_validation_options
    };
    this.preprocessing_feature_column_options = configuration.preprocessing_feature_column_options || {};
    this.training_feature_column_options = configuration.training_feature_column_options || {};
    const customFit = configuration.training_options && configuration.training_options.fit ? configuration.training_options.fit : {};
    this.training_options = {
      stateful: true,
      features: this.x_independent_features.length,
      ...configuration.training_options,
      fit: {
        epochs: 100,
        batchSize: 5,
        verbose: 0,
        callbacks: {},
        ...customFit
      }
    };
    this.training_progress_callback = configuration.training_progress_callback || training_on_progress;
    if (this.training_options && this.training_options.fit && this.training_options.fit.callbacks && this.training_options.fit.epochs) {
      this.training_options.fit.callbacks.onEpochEnd = (epoch, logs) => {
        const totalEpochs = this.training_options.fit ? this.training_options.fit.epochs : 0;
        const completion_percentage = epoch / totalEpochs || 0;
        this.training_model_loss = logs.loss;
        this.training_progress_callback({ completion_percentage, loss: logs.loss, epoch, logs, status: "training", defaultLog: this.debug });
      };
      this.training_options.fit.callbacks.onTrainEnd = (logs) => {
        const totalEpochs = this.training_options.fit ? this.training_options.fit.epochs : 0;
        const completion_percentage = 1;
        this.training_progress_callback({ completion_percentage, loss: this.training_model_loss || 0, epoch: totalEpochs, logs, status: "trained", defaultLog: this.debug });
      };
      this.training_options.fit.callbacks.onTrainBegin = (logs) => {
        const totalEpochs = this.training_options.fit ? this.training_options.fit.epochs : 0;
        const completion_percentage = 0;
        this.training_progress_callback({ completion_percentage, loss: logs.loss, epoch: totalEpochs, logs, status: "initializing", defaultLog: this.debug });
      };
    }
    this.prediction_options = configuration.prediction_options || {};
    this.prediction_inputs = configuration.prediction_inputs || [];
    this.prediction_timeseries_time_zone = configuration.prediction_timeseries_time_zone || "utc";
    this.prediction_timeseries_date_feature = configuration.prediction_timeseries_date_feature || "date";
    this.prediction_timeseries_date_format = configuration.prediction_timeseries_date_format;
    this.validate_training_data = typeof configuration.validate_training_data === "boolean" ? configuration.validate_training_data : true;
    this.retrain_forecast_model_with_predictions = configuration.retrain_forecast_model_with_predictions;
    this.use_preprocessing_on_trainning_data = typeof configuration.use_preprocessing_on_trainning_data !== "undefined" ? configuration.use_preprocessing_on_trainning_data : true;
    this.prediction_timeseries_start_date = configuration.prediction_timeseries_start_date;
    this.prediction_timeseries_end_date = configuration.prediction_timeseries_end_date;
    this.prediction_timeseries_dimension_feature = configuration.prediction_timeseries_dimension_feature || "dimension";
    this.prediction_inputs_next_value_functions = configuration.prediction_inputs_next_value_functions || configuration.next_value_functions || [];
    this.tf = getBackend();
    this.scikit = getScikit();
    this.scikit.setBackend(this.tf);
    JSONStackModel.setBackend(this.tf);
    JSONStackModel.setScikit(this.scikit);
    this.Model = configuration.Model || new JSONStackModel.TensorScriptModelInterface();
    this.original_data_test = [];
    this.original_data_train = [];
    this.forecastDates = [];
    this.getTimeseriesDimension = _ModelX.calcTimeseriesDimension.bind(this);
    return this;
  }
  static calcTimeseriesDimension(options = {}) {
    let timeseriesDataSetDateFormat = options.timeseries_date_format || this.prediction_timeseries_date_format;
    let timeseriesForecastDimension = options.dimension || this.dimension;
    let timeseriesDateFeature = options.timeseries_date_feature || this.prediction_timeseries_date_feature;
    let DataSetData = options.DataSetData || this.DataSet && this.DataSet.data || [];
    if (timeseriesForecastDimension && timeseriesDataSetDateFormat) {
      this.dimension = timeseriesForecastDimension;
      return {
        dimension: timeseriesForecastDimension,
        dateFormat: timeseriesDataSetDateFormat
      };
    }
    if (typeof timeseriesForecastDimension !== "string" && DataSetData && Array.isArray(DataSetData) && DataSetData.length) {
      if (DataSetData.length && DataSetData[0][this.prediction_timeseries_dimension_feature]) {
        timeseriesForecastDimension = DataSetData[0][this.prediction_timeseries_dimension_feature];
      }
      if (DataSetData.length > 1 && DataSetData[0][timeseriesDateFeature]) {
        const recentDateField = DataSetData[1][timeseriesDateFeature];
        const parsedRecentDateField = getLuxonDateTime({
          dateObject: recentDateField,
          dateFormat: timeseriesDataSetDateFormat
        });
        timeseriesDataSetDateFormat = parsedRecentDateField.format;
        const test_end_date = parsedRecentDateField.date;
        const test_start_date = getLuxonDateTime({
          dateObject: DataSetData[0][timeseriesDateFeature],
          dateFormat: timeseriesDataSetDateFormat
        }).date;
        const durationDifference = test_end_date.diff(test_start_date, dimensionDurations).toObject();
        const durationDimensions = Object.keys(durationDifference).filter((diffProp) => durationDifference[diffProp] === 1);
        if (durationDimensions.length === 1) {
          timeseriesForecastDimension = durationToDimensionProperty[durationDimensions[0]];
        }
      }
    }
    if (typeof timeseriesForecastDimension !== "string" || Object.keys(dimensionDates).indexOf(timeseriesForecastDimension) === -1)
      throw new ReferenceError(`Invalid timeseries dimension (${timeseriesForecastDimension})`);
    this.prediction_timeseries_date_format = timeseriesDataSetDateFormat;
    this.dimension = timeseriesForecastDimension;
    if (typeof timeseriesDataSetDateFormat === "undefined")
      throw new ReferenceError("Invalid timeseries date format");
    return {
      dimension: timeseriesForecastDimension,
      dateFormat: timeseriesDataSetDateFormat
    };
  }
  getForecastDates(options = {}) {
    const start = this.prediction_timeseries_start_date && this.prediction_timeseries_start_date instanceof Date ? Luxon.DateTime.fromJSDate(this.prediction_timeseries_start_date).toISO(ISOOptions) : this.prediction_timeseries_start_date;
    const end = this.prediction_timeseries_end_date instanceof Date ? Luxon.DateTime.fromJSDate(this.prediction_timeseries_end_date).toISO(ISOOptions) : this.prediction_timeseries_end_date;
    if (!this.dimension)
      throw ReferenceError("Forecasts require a timeseries dimension");
    else if (!start || !end)
      throw ReferenceError("Start and End Forecast Dates are required");
    this.forecastDates = dimensionDates[this.dimension]({
      start,
      end,
      time_zone: this.prediction_timeseries_time_zone
    });
    return this.forecastDates;
  }
  addMockData({ use_mock_dates = false } = {}) {
    if (use_mock_dates && this.use_mock_encoded_data && this.DataSet)
      this.DataSet = addMockDataToDataSet(this.DataSet, { includeConstants: true, mockEncodedData: this.mockEncodedData });
    else if (use_mock_dates && this.DataSet)
      this.DataSet = addMockDataToDataSet(this.DataSet, {});
    else if (this.use_mock_encoded_data && this.DataSet)
      this.DataSet = addMockDataToDataSet(this.DataSet, { includeConstants: false, mockEncodedData: this.mockEncodedData });
  }
  removeMockData({ use_mock_dates = false } = {}) {
    if (use_mock_dates && this.use_mock_encoded_data && this.DataSet)
      this.DataSet = removeMockDataFromDataSet(this.DataSet, { includeConstants: true, mockEncodedData: this.mockEncodedData });
    else if (use_mock_dates && this.DataSet)
      this.DataSet = removeMockDataFromDataSet(this.DataSet, {});
    else if (this.use_mock_encoded_data && this.DataSet)
      this.DataSet = removeMockDataFromDataSet(this.DataSet, { includeConstants: false, mockEncodedData: this.mockEncodedData });
  }
  getCrosstrainingData() {
    let test;
    let train;
    if (this.config.model_category === "timeseries") {
      const trainSizePercentage = this.cross_validation_options.train_size || 0.7;
      const train_size = this.training_size_values ? this.DataSet.data.length - this.training_size_values : parseInt((this.DataSet.data.length * trainSizePercentage).toString());
      test = this.DataSet.data.slice(train_size, this.DataSet.data.length);
      train = this.DataSet.data.slice(0, train_size);
    } else {
      const testTrainSplit = JSONStackData.cross_validation.train_test_split(this.DataSet.data, this.cross_validation_options);
      train = testTrainSplit.train;
      test = testTrainSplit.test;
    }
    return { test, train };
  }
  validateTrainingData({ cross_validate_training_data, inputMatrix } = {
    inputMatrix: void 0
  }) {
    const checkValidationData = inputMatrix ? inputMatrix : this.x_indep_matrix_train;
    const dataType = inputMatrix ? "Prediction" : "Trainning";
    checkValidationData.forEach((trainningData, i) => {
      trainningData.forEach((trainningVal, v) => {
        if (typeof trainningVal !== "number" || isNaN(trainningVal)) {
          throw new TypeError(`${dataType} data (${i}) has an invalid ${this.x_independent_features[v]}. Value: ${trainningVal}`);
        }
      });
    });
    return true;
  }
  async getTrainingData(options = {}) {
    if (options.trainingData) {
      this.trainingData = options.trainingData;
    } else if (typeof options.getDataPromise === "function") {
      this.trainingData = await options.getDataPromise({});
    }
  }
  async checkTrainingStatus(options = {}) {
    if (options.retrain || this.status.trained === false) {
      await this.getTrainingData(options);
      await this.trainModel(options);
    }
    return true;
  }
  async getDataSetProperties(options = {}) {
    const {
      nextValueIncludeForecastDate = true,
      nextValueIncludeForecastTimezone = true,
      nextValueIncludeForecastAssociations = true,
      nextValueIncludeDateProperty = true,
      nextValueIncludeParsedDate = true,
      nextValueIncludeLocalParsedDate = true,
      nextValueIncludeForecastInputs = true
    } = options;
    const props = { Luxon, JSONStackData };
    const nextValueFunctions = this.prediction_inputs_next_value_functions.reduce((functionsObject, func) => {
      functionsObject[func.variable_name] = getGeneratedStatefulFunction({
        ...func,
        props,
        function_name_prefix: "next_value_"
      });
      return functionsObject;
    }, {});
    const filterFunctionBody = `'use strict';
    ${this.training_data_filter_function_body}
    `;
    this.training_data_filter_function = this.training_data_filter_function_body ? Function("datum", "datumIndex", filterFunctionBody).bind({ props }) : this.training_data_filter_function;
    if (typeof this.training_data_filter_function === "function" && this.training_data_filter_function.name && this.training_data_filter_function.name.includes("anonymous"))
      Object.defineProperty(this.training_data_filter_function, "name", { value: "training_data_filter_function" });
    this.prediction_inputs_next_value_function = function nextValueFunction(state) {
      const lastDataRow = state.lastDataRow || {};
      const zone = lastDataRow.origin_time_zone || this.prediction_timeseries_time_zone;
      const date = state.forecastDate;
      state.sumPreviousRows = sumPreviousRows.bind({
        data: state.data,
        DataSet: state.DataSet,
        offset: state.existingDatasetObjectIndex,
        reverseTransform: state.reverseTransform
      });
      const helperNextValueData = {};
      if (nextValueIncludeForecastDate) {
        helperNextValueData[this.prediction_timeseries_date_feature] = state.forecastDate;
      }
      if (nextValueIncludeDateProperty) {
        helperNextValueData.date = state.forecastDate;
      }
      if (nextValueIncludeForecastTimezone) {
        helperNextValueData.origin_time_zone = lastDataRow.origin_time_zone;
      }
      if (nextValueIncludeForecastAssociations) {
        helperNextValueData.associated_data_location = lastDataRow.associated_data_location ? lastDataRow.associated_data_location.toString() : lastDataRow.associated_data_location;
        helperNextValueData.associated_data_product = lastDataRow.associated_data_product ? lastDataRow.associated_data_product.toString() : lastDataRow.associated_data_product;
        helperNextValueData.associated_data_entity = lastDataRow.associated_data_entity ? lastDataRow.associated_data_entity.toString() : lastDataRow.associated_data_entity;
        helperNextValueData.forecast_entity_type = lastDataRow.feature_entity_type ? lastDataRow.feature_entity_type.toString() : lastDataRow.forecast_entity_type;
        helperNextValueData.forecast_entity_title = lastDataRow.feature_entity_title ? lastDataRow.feature_entity_title.toString() : lastDataRow.forecast_entity_title;
        helperNextValueData.forecast_entity_name = lastDataRow.feature_entity_name ? lastDataRow.feature_entity_name.toString() : lastDataRow.forecast_entity_name;
        helperNextValueData.forecast_entity_id = lastDataRow.feature_entity_id ? lastDataRow.feature_entity_id.toString() : lastDataRow.forecast_entity_id;
      }
      if (nextValueIncludeParsedDate && state.forecastDate) {
        const parsedDate = getParsedDate(state.forecastDate, { zone });
        const isOpen = getOpenHour.bind({ entity: this.entity, dimension: this.dimension }, { date, parsedDate, zone });
        const isOutlier = getIsOutlier.bind({ entity: this.entity, data: state.data, datum: helperNextValueData });
        state.parsedDate = parsedDate;
        state.isOpen = isOpen;
        state.isOutlier = isOutlier;
        Object.assign(helperNextValueData, parsedDate);
      }
      if (nextValueIncludeLocalParsedDate) {
        Object.assign(helperNextValueData, getLocalParsedDate({ date: state.forecastDate, time_zone: zone, dimension: this.dimension }));
      }
      if (nextValueIncludeForecastInputs) {
        Object.assign(helperNextValueData, state.rawInputPredictionObject);
      }
      return Object.keys(nextValueFunctions).reduce((nextValueObject, functionName) => {
        nextValueObject[functionName] = nextValueFunctions[functionName](state);
        return nextValueObject;
      }, helperNextValueData);
    };
    if (this.config.model_category === "timeseries" /* FORECAST */) {
      this.dimension = this.getTimeseriesDimension(options).dimension;
    }
    if (this.dimension && this.config.model_category === "timeseries" /* FORECAST */ && this.prediction_inputs && this.prediction_inputs.length && (!this.prediction_timeseries_start_date || !this.prediction_timeseries_end_date)) {
      if (!this.prediction_timeseries_start_date)
        this.prediction_timeseries_start_date = this.prediction_inputs[0][this.prediction_timeseries_date_feature];
      if (!this.prediction_timeseries_end_date)
        this.prediction_timeseries_end_date = this.prediction_inputs[this.prediction_inputs.length - 1][this.prediction_timeseries_date_feature];
    }
    if (this.dimension && this.config.model_category === "timeseries" /* FORECAST */ && this.prediction_timeseries_start_date && this.prediction_timeseries_end_date) {
      this.getForecastDates();
    }
  }
  getForecastDatesFromPredictionInputs(options = {}) {
    const raw_prediction_inputs = options.prediction_inputs.map((predictionInput) => {
      const inputDate = predictionInput[this.prediction_timeseries_date_feature];
      const predictionDate = inputDate && inputDate instanceof Date ? inputDate : this.prediction_timeseries_date_format ? Luxon.DateTime.fromFormat(inputDate, this.prediction_timeseries_date_format).toJSDate() : inputDate;
      return {
        ...predictionInput,
        [this.prediction_timeseries_date_feature]: predictionDate
      };
    });
    const forecastDates = raw_prediction_inputs.map((rawInput) => rawInput[this.prediction_timeseries_date_feature]);
    return {
      forecastDates,
      raw_prediction_inputs
    };
  }
  async validateTimeseriesData(options = {}) {
    const { fixPredictionDates = true } = options;
    const dimension = this.dimension;
    let raw_prediction_inputs = options.prediction_inputs || await this.getPredictionData(options) || [];
    const lastOriginalDataSetIndex = this.DataSet.data.length - 1;
    const lastOriginalDataSetObject = this.DataSet.data[lastOriginalDataSetIndex];
    let forecastDates = this.forecastDates;
    if (options.set_forecast_dates_for_predictions && this.forecastDates.length < 1) {
      const transformedInputs = this.getForecastDatesFromPredictionInputs(options);
      forecastDates = transformedInputs.forecastDates;
      raw_prediction_inputs = transformedInputs.raw_prediction_inputs;
    }
    const datasetDateOptions = getLuxonDateTime({
      dateObject: lastOriginalDataSetObject[this.prediction_timeseries_date_feature],
      dateFormat: this.prediction_timeseries_date_format,
      time_zone: this.prediction_timeseries_time_zone
    });
    const lastOriginalForecastDateTimeLuxon = datasetDateOptions.date;
    const lastOriginalForecastDateTimeFormat = datasetDateOptions.format;
    const lastOriginalForecastDate = lastOriginalForecastDateTimeLuxon.toJSDate();
    const datasetDates = lastOriginalDataSetObject[this.prediction_timeseries_date_feature] instanceof Date ? this.DataSet.columnArray(this.prediction_timeseries_date_feature) : this.DataSet.columnArray(this.prediction_timeseries_date_feature).map((originalDateFormattedDate) => getLuxonDateTime({
      dateObject: originalDateFormattedDate,
      dateFormat: lastOriginalForecastDateTimeFormat,
      time_zone: this.prediction_timeseries_time_zone
    }).date.toJSDate());
    const firstDatasetDate = datasetDates[0];
    if (fixPredictionDates && typeof this.prediction_timeseries_start_date === "string")
      this.prediction_timeseries_start_date = Luxon.DateTime.fromISO(this.prediction_timeseries_start_date).toJSDate();
    if (fixPredictionDates && this.prediction_timeseries_start_date && this.prediction_timeseries_start_date < firstDatasetDate) {
      this.prediction_timeseries_start_date = firstDatasetDate;
      forecastDates = this.getForecastDates();
      console.log("modified", { forecastDates });
    }
    let forecastDateFirstDataSetDateIndex;
    if (forecastDates.length) {
      forecastDateFirstDataSetDateIndex = datasetDates.findIndex((DataSetDate) => DataSetDate.valueOf() === forecastDates[0].valueOf());
      if (forecastDateFirstDataSetDateIndex === -1) {
        const lastDataSetDate = datasetDates[datasetDates.length - 1];
        const firstForecastInputDate = forecastDates[0];
        const firstForecastDateFromInput = Luxon.DateTime.fromJSDate(lastDataSetDate, { zone: this.prediction_timeseries_time_zone }).plus({
          [timeProperty[dimension]]: 1
        });
        if (firstForecastDateFromInput.valueOf() === firstForecastInputDate.valueOf()) {
          forecastDateFirstDataSetDateIndex = datasetDates.length;
        }
      }
      if (forecastDateFirstDataSetDateIndex === -1)
        throw new RangeError(`Forecast Date Range (${this.prediction_timeseries_start_date} - ${this.prediction_timeseries_end_date}) must include an existing forecast date (${this.DataSet.data[0][this.prediction_timeseries_date_feature]} - ${this.DataSet.data[lastOriginalDataSetIndex][this.prediction_timeseries_date_feature]})`);
      if (raw_prediction_inputs.length) {
        if (raw_prediction_inputs[0][this.prediction_timeseries_date_feature] instanceof Date === false) {
          raw_prediction_inputs = raw_prediction_inputs.map((raw_input) => {
            return Object.assign({}, raw_input, {
              [this.prediction_timeseries_date_feature]: getLuxonDateTime({
                dateObject: raw_input[this.prediction_timeseries_date_feature],
                dateFormat: lastOriginalForecastDateTimeFormat,
                time_zone: this.prediction_timeseries_time_zone
              }).date.toJSDate()
            });
          });
        }
        const firstRawInputDate = raw_prediction_inputs[0][this.prediction_timeseries_date_feature];
        const firstForecastDate = forecastDates[0];
        let raw_prediction_input_dates = raw_prediction_inputs.map((raw_input) => raw_input[this.prediction_timeseries_date_feature]);
        if (fixPredictionDates && firstForecastDate > firstRawInputDate) {
          const matchingInputIndex = raw_prediction_input_dates.findIndex((inputPredictionDate) => inputPredictionDate.valueOf() === firstForecastDate.valueOf());
          raw_prediction_inputs = raw_prediction_inputs.slice(matchingInputIndex);
          raw_prediction_input_dates = raw_prediction_inputs.map((raw_input) => raw_input[this.prediction_timeseries_date_feature]);
        }
        const rawPredictionForecastDateIndex = forecastDates.findIndex((forecastDate) => forecastDate.valueOf() === raw_prediction_input_dates[0].valueOf());
        if (rawPredictionForecastDateIndex < 0)
          throw new RangeError(`Prediction Input First Date(${raw_prediction_input_dates[0]}) must be inclusive of forecastDates ( ${forecastDates[0]} - ${forecastDates[forecastDates.length - 1]})`);
      }
    }
    return { forecastDates, forecastDateFirstDataSetDateIndex, lastOriginalForecastDate, raw_prediction_inputs, dimension, datasetDates };
  }
  async getPredictionData(options = {}) {
    if (typeof options.getPredictionInputPromise === "function") {
      this.prediction_inputs = await options.getPredictionInputPromise({ ModelX: this });
    }
    return this.prediction_inputs;
  }
  async trainModel(options = {}) {
    const { cross_validate_training_data = true, use_next_value_functions_for_training_data = false, use_mock_dates_to_fit_trainning_data = false } = options;
    const modelObject = modelMap[this.config.model_type];
    const use_mock_dates = use_mock_dates_to_fit_trainning_data || this.config.use_mock_dates_to_fit_trainning_data;
    let trainingData = options.trainingData || this.trainingData || [];
    trainingData = new Array().concat(trainingData);
    let test;
    let train;
    this.status.trained = false;
    await this.getDataSetProperties({
      DataSetData: trainingData
    });
    if (typeof this.training_data_filter_function === "function" && use_next_value_functions_for_training_data === false) {
      trainingData = trainingData.filter(this.training_data_filter_function);
    }
    if (!use_next_value_functions_for_training_data && this.use_empty_objects) {
      trainingData = trainingData.map((trainningDatum) => ({
        ...this.emptyObject,
        ...trainningDatum
      }));
    }
    this.DataSet = new JSONStackData.DataSet(trainingData);
    if (this.auto_assign_features && (!this.x_independent_features || !this.x_independent_features.length) && !this.y_dependent_labels || !this.y_dependent_labels.length) {
      const autoFeatures = autoAssignFeatureColumns({
        input_independent_features: this.input_independent_features,
        output_dependent_features: this.output_dependent_features,
        independent_variables: this.independent_variables,
        dependent_variables: this.dependent_variables,
        training_feature_column_options: this.training_feature_column_options,
        preprocessing_feature_column_options: this.preprocessing_feature_column_options,
        datum: trainingData[0]
      });
      this.x_raw_independent_features = Array.from(new Set(new Array().concat(this.x_raw_independent_features, autoFeatures.x_raw_independent_features)));
      this.y_raw_dependent_labels = Array.from(new Set(new Array().concat(this.y_raw_dependent_labels, autoFeatures.y_raw_dependent_labels)));
      this.preprocessing_feature_column_options = {
        ...autoFeatures.preprocessing_feature_column_options,
        ...this.preprocessing_feature_column_options
      };
      this.training_feature_column_options = {
        ...autoFeatures.training_feature_column_options,
        ...this.training_feature_column_options
      };
    }
    if (this.use_preprocessing_on_trainning_data && this.preprocessing_feature_column_options && Object.keys(this.preprocessing_feature_column_options).length) {
      this.DataSet.fitColumns(this.preprocessing_feature_column_options);
    }
    if (use_next_value_functions_for_training_data || this.use_next_value_functions_for_training_data) {
      const trainingDates = trainingData.map((tdata) => tdata[this.prediction_timeseries_date_feature]);
      trainingData = trainingData.map((trainingDatum, dataIndex) => {
        if (this.prediction_timeseries_date_format)
          trainingDatum[this.prediction_timeseries_date_feature] = Luxon.DateTime.fromFormat(trainingDatum[this.prediction_timeseries_date_feature], this.prediction_timeseries_date_format).toJSDate();
        const forecastDate = trainingDatum[this.prediction_timeseries_date_feature];
        const forecastPredictionIndex = dataIndex;
        if (trainingDatum._id)
          trainingDatum._id = trainingDatum._id.toString();
        if (trainingDatum.feature_entity_id)
          trainingDatum.feature_entity_id = trainingDatum.feature_entity_id.toString();
        const trainningNextValueData = this.prediction_inputs_next_value_function ? this.prediction_inputs_next_value_function({
          rawInputPredictionObject: trainingDatum,
          forecastDate,
          forecastDates: trainingDates,
          forecastPredictionIndex,
          existingDatasetObjectIndex: dataIndex,
          unscaledLastForecastedValue: trainingData[dataIndex - 1],
          data: trainingData,
          DataSet: this.DataSet || new JSONStackData.DataSet(),
          lastDataRow: trainingData[trainingData.length - 1],
          reverseTransform: false
        }) : {};
        const calculatedDatum = this.use_empty_objects ? Object.assign(
          {},
          this.emptyObject,
          (0, import_flat.default)(trainingDatum, { maxDepth: 2, delimiter: flattenDelimiter }),
          (0, import_flat.default)(trainningNextValueData, { maxDepth: 2, delimiter: flattenDelimiter })
        ) : Object.assign({}, trainingDatum, trainningNextValueData);
        return calculatedDatum;
      });
      if (typeof this.training_data_filter_function === "function" && use_next_value_functions_for_training_data === true) {
        trainingData = trainingData.filter((datum, datumIndex) => {
          if (this.training_data_filter_function) {
            const removeValue = this.training_data_filter_function(datum, datumIndex);
            if (!removeValue)
              this.removedFilterdtrainingData.push(datum);
            return removeValue;
          }
        });
      }
      this.DataSet = new JSONStackData.DataSet(trainingData);
    }
    ["is_location_open", "is_open_hour", "is_location_open"].forEach((feat_col_option) => {
      if (this.training_feature_column_options[feat_col_option]) {
        this.training_feature_column_options[feat_col_option] = ["label", { binary: true }];
      }
    });
    this.addMockData({ use_mock_dates });
    this.DataSet.fitColumns(this.training_feature_column_options);
    this.removeMockData({ use_mock_dates });
    if (this.auto_assign_features && (!this.x_independent_features || !this.x_independent_features.length) && (!this.y_dependent_labels || !this.y_dependent_labels.length)) {
      this.x_independent_features = new Array().concat(this.x_independent_features, getEncodedFeatures({ DataSet: this.DataSet, features: this.x_raw_independent_features }));
      this.y_dependent_labels = new Array().concat(this.y_dependent_labels, getEncodedFeatures({ DataSet: this.DataSet, features: this.y_raw_dependent_labels }));
    }
    if (!this.x_independent_features || !this.x_independent_features.length)
      throw new ReferenceError("Missing Inputs (x_independent_features)");
    if (!this.y_dependent_labels || !this.y_dependent_labels.length)
      throw new ReferenceError("Missing Outputs (y_dependent_labels)");
    this.x_independent_features = Array.from(new Set(this.x_independent_features));
    this.y_dependent_labels = Array.from(new Set(this.y_dependent_labels));
    if (cross_validate_training_data) {
      let crosstrainingData = this.getCrosstrainingData();
      test = crosstrainingData.test;
      train = crosstrainingData.train;
      this.original_data_test = crosstrainingData.test;
      this.original_data_train = crosstrainingData.train;
      this.testDataSet = new JSONStackData.DataSet(test);
      this.trainDataSet = new JSONStackData.DataSet(train);
      this.x_indep_matrix_train = this.trainDataSet.columnMatrix(this.x_independent_features);
      this.x_indep_matrix_test = this.testDataSet.columnMatrix(this.x_independent_features);
      this.y_dep_matrix_train = this.trainDataSet.columnMatrix(this.y_dependent_labels);
      this.y_dep_matrix_test = this.testDataSet.columnMatrix(this.y_dependent_labels);
    } else {
      this.x_indep_matrix_train = this.DataSet.columnMatrix(this.x_independent_features);
      this.y_dep_matrix_train = this.DataSet.columnMatrix(this.y_dependent_labels);
    }
    this.Model = new modelObject(this.training_options, {});
    if (this.config.model_category === "timeseries") {
      const validationData = await this.validateTimeseriesData(options);
    }
    if (this.validate_training_data) {
      this.validateTrainingData({ cross_validate_training_data });
    }
    if (this.config.model_category === "timeseries" && this.config.model_type === "ai-fast-forecast") {
      await this.Model.train(this.x_indep_matrix_train, this.y_dep_matrix_train, void 0, void 0, void 0);
    } else {
      await this.Model.train(this.x_indep_matrix_train, this.y_dep_matrix_train, void 0, void 0, void 0);
    }
    this.status.trained = true;
    this.status.lastTrained = new Date();
    return this;
  }
  async predictModel(options = {}) {
    if (Array.isArray(options)) {
      const PredictionOptions = {
        prediction_inputs: options
      };
      options = PredictionOptions;
    }
    const { descalePredictions = true, includeInputs = true, includeEvaluation = false } = options;
    const predictionOptions = {
      probability: this.config.model_category === "classification" /* DECISION */ ? false : true,
      ...this.prediction_options,
      ...options.predictionOptions
    };
    let predictions;
    let newTransformedPredictions;
    let unscaledInputs;
    let __evaluation;
    let [trainingstatus, raw_prediction_inputs] = await Promise.all([
      this.checkTrainingStatus(options),
      options.prediction_inputs || await this.getPredictionData(options)
    ]);
    if (includeEvaluation) {
      let { test, train } = this.getCrosstrainingData();
      const testDataSet = new JSONStackDataTypes.DataSet(test);
      const x_indep_matrix_test = testDataSet.columnMatrix(this.x_independent_features);
      const y_dep_matrix_test = testDataSet.columnMatrix(this.y_dependent_labels);
      const evaluationOptions = Object.assign({}, options, {
        x_indep_matrix_test,
        y_dep_matrix_test
      });
      const primaryLabel = this.y_dependent_labels[0];
      const evaluation = await this.evaluateModel(evaluationOptions);
      __evaluation = Object.keys(evaluation).reduce((result, evaluationDependentLabel) => {
        const evalItem = removeEvaluationData(evaluation[evaluationDependentLabel]);
        if (evaluationDependentLabel === primaryLabel) {
          result = Object.assign({}, result, evalItem);
          if (this.y_dependent_labels.length > 1)
            result.data[evaluationDependentLabel] = evalItem;
        } else {
          result.data[evaluationDependentLabel] = evalItem;
        }
        return result;
      }, { data: {} });
    }
    if (this.config.model_category === "timeseries") {
      predictions = await this.timeseriesForecast(options);
    } else {
      unscaledInputs = raw_prediction_inputs;
      this.prediction_inputs = raw_prediction_inputs.map((prediction_value) => {
        const pred_val = this.use_empty_objects ? Object.assign(
          {},
          this.emptyObject,
          (0, import_flat.default)(prediction_value, { maxDepth: 2, delimiter: flattenDelimiter })
        ) : prediction_value;
        return this.DataSet.transformObject(pred_val, { checkColumnLength: false });
      });
      const inputMatrix = this.DataSet.columnMatrix(this.x_independent_features, this.prediction_inputs);
      if (this.validate_training_data) {
        this.validateTrainingData({ cross_validate_training_data: false, inputMatrix });
      }
      newTransformedPredictions = await this.Model.predict(inputMatrix, predictionOptions);
      predictions = this.DataSet.reverseColumnMatrix({ vectors: newTransformedPredictions, labels: this.y_dependent_labels });
    }
    if (descalePredictions) {
      const emptyPrediction = this.y_dependent_labels.reduce((result, label) => {
        result[label] = 0;
        return result;
      }, {});
      const dimension = this.dimension;
      predictions = predictions.map((val, i) => {
        const transformed = this.DataSet.inverseTransformObject(val, {});
        const is_location_open = transformed.is_location_open;
        let empty = {};
        if ((dimension === "hourly" || dimension === "daily") && this.entity && !is_location_open) {
          if (this.debug)
            console.info(`Manually fixing prediction on closed - ${dimension} ${transformed.date}`);
          empty = Object.assign({}, emptyPrediction);
        }
        const descaled = Object.assign(
          {},
          empty,
          transformed,
          includeInputs && this.config.model_category !== "timeseries" ? unscaledInputs[i] : {},
          includeEvaluation ? { __evaluation } : {}
        );
        return descaled;
      });
    } else if (includeInputs && this.config.model_category !== "timeseries") {
      predictions = predictions.map((val, i) => Object.assign(
        {},
        this.DataSet.inverseTransformObject(val, {}),
        includeInputs ? this.prediction_inputs[i] : {},
        includeEvaluation ? { __evaluation } : {}
      ));
    }
    if (this.use_empty_objects) {
      predictions = predictions.map((pred) => import_flat.default.unflatten(pred, { delimiter: flattenDelimiter }));
    }
    return predictions;
  }
  async retrainTimeseriesModel(options = {}) {
    const { inputMatrix, predictionMatrix, fitOptions } = options;
    const fit = {
      ...this.Model.settings.fit,
      ...fitOptions
    };
    const x_timeseries = inputMatrix;
    const y_timeseries = predictionMatrix;
    const x_matrix = x_timeseries;
    const y_matrix = y_timeseries;
    let yShape;
    this.Model;
    const timeseriesShape = typeof this.Model.getTimeseriesShape === "function" ? this.Model.getTimeseriesShape(x_matrix) : void 0;
    const x_matrix_timeseries = typeof timeseriesShape !== "undefined" ? this.Model.reshape(x_matrix, timeseriesShape) : x_matrix;
    const xs = this.Model.tf.tensor(x_matrix_timeseries, timeseriesShape);
    const ys = this.Model.tf.tensor(y_matrix, yShape);
    await this.Model.model.fit(xs, ys, fit);
    xs.dispose();
    ys.dispose();
    return this;
  }
  async timeseriesForecast(options = {}) {
    const retrain_forecast_model_with_predictions = this.retrain_forecast_model_with_predictions;
    const predictionOptions = Object.assign({
      probability: this.config.model_category === "classification" ? false : true
    }, this.prediction_options, options.predictionOptions);
    options.set_forecast_dates_for_predictions = true;
    const { forecastDates, forecastDateFirstDataSetDateIndex, lastOriginalForecastDate, raw_prediction_inputs, dimension, datasetDates } = await this.validateTimeseriesData(options);
    const forecasts = [];
    let forecastPredictionIndex = 0;
    const lastDatasetDate = datasetDates[datasetDates.length - 1];
    await import_src.default.each(forecastDates, 1, async (forecastDate) => {
      const existingDatasetObjectIndex = forecastDateFirstDataSetDateIndex + forecastPredictionIndex;
      const rawInputPredictionObject = raw_prediction_inputs[forecastPredictionIndex];
      let predictionMatrix;
      let predictionInput;
      let datasetScaledObject;
      let datasetUnscaledObject;
      let unscaledRawInputObject;
      let scaledRawInputObject;
      if (forecastDate <= lastOriginalForecastDate) {
        datasetScaledObject = this.DataSet.data[existingDatasetObjectIndex];
        datasetUnscaledObject = this.DataSet.inverseTransformObject(datasetScaledObject, {});
        predictionInput = [
          datasetScaledObject
        ];
      }
      const lastForecastedValue = forecasts.length ? forecasts[forecasts.length - 1] : {};
      let unscaledLastForecastedValue = Object.keys(lastForecastedValue).length ? this.DataSet.inverseTransformObject(lastForecastedValue, {}) : {};
      unscaledLastForecastedValue = this.y_dependent_labels.reduce((result, feature) => {
        if (typeof unscaledLastForecastedValue[feature] !== "undefined") {
          result[feature] = unscaledLastForecastedValue[feature];
        }
        return result;
      }, {});
      const unscaledDatasetData = [].concat(this.removedFilterdtrainingData, this.DataSet.data.map((scaledDatum) => {
        const unscaledDatum = this.DataSet.inverseTransformObject(scaledDatum, {});
        return unscaledDatum;
      }));
      const unscaledNextValueFunctionObject = Object.keys(this.prediction_inputs_next_value_functions).length > 0 ? this.prediction_inputs_next_value_function({
        rawInputPredictionObject,
        forecastDate,
        forecastDates,
        forecastPredictionIndex,
        existingDatasetObjectIndex: existingDatasetObjectIndex + this.removedFilterdtrainingData.length,
        unscaledLastForecastedValue,
        data: unscaledDatasetData,
        DataSet: this.DataSet,
        lastDataRow: Object.assign({}, this.DataSet.data[this.DataSet.data.length - 1], datasetUnscaledObject, rawInputPredictionObject, unscaledLastForecastedValue)
      }) : {};
      const parsedLocalDate = getLocalParsedDate({ date: forecastDate, time_zone: this.prediction_timeseries_time_zone, dimension });
      unscaledRawInputObject = this.use_empty_objects ? Object.assign(
        {},
        this.emptyObject,
        (0, import_flat.default)(datasetUnscaledObject || {}, { maxDepth: 2, delimiter: flattenDelimiter }),
        (0, import_flat.default)(unscaledNextValueFunctionObject || {}, { maxDepth: 2, delimiter: flattenDelimiter }),
        (0, import_flat.default)(rawInputPredictionObject || {}, { maxDepth: 2, delimiter: flattenDelimiter }),
        (0, import_flat.default)(unscaledLastForecastedValue, { maxDepth: 2, delimiter: flattenDelimiter }),
        (0, import_flat.default)(parsedLocalDate, { maxDepth: 2, delimiter: flattenDelimiter })
      ) : Object.assign({}, datasetUnscaledObject, unscaledNextValueFunctionObject, rawInputPredictionObject, unscaledLastForecastedValue, parsedLocalDate);
      scaledRawInputObject = this.DataSet.transformObject(unscaledRawInputObject, { checkColumnLength: false });
      predictionInput = [
        scaledRawInputObject
      ];
      if (predictionInput) {
        const inputMatrix = this.DataSet.columnMatrix(this.x_independent_features, predictionInput);
        if (this.validate_training_data) {
          this.validateTrainingData({ cross_validate_training_data: false, inputMatrix });
        }
        predictionMatrix = await this.Model.predict(inputMatrix, predictionOptions);
        if (retrain_forecast_model_with_predictions && forecastDate > lastDatasetDate) {
          await this.retrainTimeseriesModel({
            inputMatrix,
            predictionMatrix
          });
        }
        const newPredictionObject = this.DataSet.reverseColumnMatrix({ vectors: predictionMatrix, labels: this.y_dependent_labels })[0];
        const forecast = Object.assign(
          {},
          datasetScaledObject,
          scaledRawInputObject,
          newPredictionObject,
          parsedLocalDate,
          {
            [this.prediction_timeseries_date_feature]: forecastDate
          }
        );
        if (forecastDate > lastOriginalForecastDate) {
          this.DataSet.data.splice(existingDatasetObjectIndex, 0, forecast);
        }
        forecasts.push(forecast);
      }
      forecastPredictionIndex++;
      return predictionMatrix;
    });
    return forecasts;
  }
  evaluateClassificationAccuracy(options = {}) {
    const { dependent_feature_label, estimatesDescaled, actualsDescaled } = options;
    const estimates = JSONStackData.DataSet.columnArray(dependent_feature_label, { data: estimatesDescaled });
    const actuals = JSONStackData.DataSet.columnArray(dependent_feature_label, { data: actualsDescaled });
    const CM = import_ml_confusion_matrix.default.fromLabels(actuals, estimates);
    const accuracy = CM.getAccuracy();
    return {
      accuracy,
      matrix: CM.matrix,
      labels: CM.labels,
      actuals,
      estimates
    };
  }
  evaluateRegressionAccuracy(options = {}) {
    const { dependent_feature_label, estimatesDescaled, actualsDescaled } = options;
    const estimates = JSONStackData.DataSet.columnArray(dependent_feature_label, { data: estimatesDescaled });
    const actuals = JSONStackData.DataSet.columnArray(dependent_feature_label, { data: actualsDescaled });
    const standardError = JSONStackData.util.standardError(actuals, estimates);
    const rSquared = JSONStackData.util.rSquared(actuals, estimates);
    const adjustedRSquared = JSONStackData.util.adjustedRSquared({
      actuals,
      estimates,
      rSquared,
      sampleSize: actuals.length,
      independentVariables: this.x_independent_features.length
    });
    const hasZeroActual = Boolean(actuals.filter((a) => a === 0 || isNaN(a)).length);
    const originalMeanAbsolutePercentageError = JSONStackData.util.meanAbsolutePercentageError(actuals, estimates);
    const MAD = JSONStackData.util.meanAbsoluteDeviation(actuals, estimates);
    const MEAN = JSONStackData.util.mean(actuals);
    let metric = "meanAbsolutePercentageError";
    let reason = "Actuals do not contain Zero values";
    if (hasZeroActual) {
      metric = "MAD over MEAN ratio";
      reason = "Actuals contain Zero values";
    }
    let errorPercentage = hasZeroActual ? MAD / MEAN : originalMeanAbsolutePercentageError;
    if (errorPercentage < 0)
      errorPercentage = 0;
    if (errorPercentage > 1)
      errorPercentage = 1;
    const accuracyPercentage = 1 - errorPercentage;
    return {
      standardError,
      rSquared,
      adjustedRSquared,
      actuals,
      estimates,
      meanForecastError: JSONStackData.util.meanForecastError(actuals, estimates),
      meanAbsoluteDeviation: JSONStackData.util.meanAbsoluteDeviation(actuals, estimates),
      trackingSignal: JSONStackData.util.trackingSignal(actuals, estimates),
      meanSquaredError: JSONStackData.util.meanSquaredError(actuals, estimates),
      meanAbsolutePercentageError: errorPercentage,
      accuracyPercentage,
      metric,
      reason,
      originalMeanAbsolutePercentageError
    };
  }
  async evaluateModel(options = {}) {
    await this.checkTrainingStatus(options);
    const x_indep_matrix_test = options.x_indep_matrix_test || this.x_indep_matrix_test;
    const y_dep_matrix_test = options.y_dep_matrix_test || this.y_dep_matrix_test;
    const predictionOptions = Object.assign({
      probability: this.config.model_category === "classification" ? false : true
    }, this.prediction_options, options.predictionOptions);
    const estimatesPredictions = await this.Model.predict(x_indep_matrix_test, predictionOptions);
    const estimatedValues = this.DataSet.reverseColumnMatrix({ vectors: estimatesPredictions, labels: this.y_dependent_labels });
    const actualValues = this.DataSet.reverseColumnMatrix({ vectors: y_dep_matrix_test, labels: this.y_dependent_labels });
    const dimension = this.dimension;
    const emptyPrediction = this.y_dependent_labels.reduce((result, label) => {
      result[label] = 0;
      return result;
    }, {});
    const estimatesDescaled = estimatedValues.map((val, i) => {
      let inverseTransformedObject = this.DataSet.inverseTransformObject(val, {});
      if (this.config.model_category === "timeseries") {
        const scaledInput = x_indep_matrix_test[i];
        const [inputObject] = this.DataSet.reverseColumnMatrix({ vectors: [scaledInput], labels: this.x_independent_features });
        const inverseInputObject = this.DataSet.inverseTransformObject(inputObject, {});
        const is_location_open = inputObject.is_location_open;
        const { year, month, day, hour } = inverseInputObject;
        if ((dimension === "hourly" || dimension === "daily") && this.entity && !is_location_open) {
          console.info(`Manually fixing prediction on closed - ${dimension} ${year}-${month}-${day}T${hour}`);
          inverseTransformedObject = emptyPrediction;
        }
      }
      const formattedInverse = this.use_empty_objects ? import_flat.default.unflatten(inverseTransformedObject, { delimiter: flattenDelimiter }) : inverseTransformedObject;
      return formattedInverse;
    });
    const actualsDescaled = actualValues.map((val) => {
      const inverseTransformedObject = this.DataSet.inverseTransformObject(val, {});
      return this.use_empty_objects ? import_flat.default.unflatten(inverseTransformedObject, { delimiter: flattenDelimiter }) : inverseTransformedObject;
    });
    const evaluationDependentLabels = Array.isArray(this.y_raw_dependent_labels) && this.y_raw_dependent_labels.length ? this.y_raw_dependent_labels : this.y_dependent_labels;
    evaluationDependentLabels.splice(this.max_evaluation_outputs);
    if (this.config.model_category === "classification") {
      return evaluationDependentLabels.reduce((evaluation, dependent_feature_label) => {
        evaluation[dependent_feature_label] = this.evaluateClassificationAccuracy({ dependent_feature_label, estimatesDescaled, actualsDescaled });
        return evaluation;
      }, {});
    } else {
      return evaluationDependentLabels.reduce((evaluation, dependent_feature_label) => {
        evaluation[dependent_feature_label] = this.evaluateRegressionAccuracy({ dependent_feature_label, estimatesDescaled, actualsDescaled });
        return evaluation;
      }, {});
    }
  }
};
var ModelX = _ModelX;
__publicField(ModelX, "prediction_timeseries_date_format");
__publicField(ModelX, "prediction_timeseries_date_feature");
__publicField(ModelX, "dimension");
__publicField(ModelX, "prediction_timeseries_dimension_feature");

// src/dataset.ts
var import_csv = require("@jsonstack/data/src/csv");

// src/transforms.ts
var Luxon2 = __toESM(require("luxon"), 1);
function getFirstDataset(datasets = {}) {
  return datasets[Object.keys(datasets)[0]] || [];
}

// src/dataset.ts
var import_src2 = __toESM(require("promisie/src/index"), 1);
var import_axios = __toESM(require("axios"), 1);
var defaultReducerContext = {
  Promisie: import_src2.default,
  getFirstDataset
};
async function getDataSet(jds = {}) {
  if (Array.isArray(jds))
    return jds;
  const { reducer, data, _data_static, _data_promise, _data_url, _data_csv, _data_tsv, _data_csv_options } = jds;
  let returnData = [];
  if (data)
    returnData = data;
  else if (_data_static)
    returnData = _data_static;
  else if (_data_csv)
    returnData = await (0, import_csv.loadCSV)(_data_csv, _data_csv_options);
  else if (_data_tsv)
    returnData = await (0, import_csv.loadTSV)(_data_tsv, _data_csv_options);
  else if (reducer)
    returnData = await ReduceDataset(reducer);
  else if (_data_promise)
    returnData = await _data_promise();
  else if (_data_url) {
    const response = await (0, import_axios.default)(_data_url);
    returnData = await response.data;
  }
  return returnData;
}
async function ReduceDataset(reducer) {
  const { name } = reducer;
  const context = {
    context: {
      ...defaultReducerContext,
      name,
      ...reducer.context
    }
  };
  const reducerFunctions = Array.isArray(reducer.reducer_function) ? reducer.reducer_function : [reducer.reducer_function];
  const reducerFunctionArray = reducerFunctions.map((reducer_function, index) => getFunctionString({ reducer_function, name, context, index }));
  const ReducerFunction = import_src2.default.pipe(reducerFunctionArray);
  const datasets = await ResolveDataset(reducer.datasets);
  const { dataset_reduced } = await ReducerFunction(datasets);
  return dataset_reduced;
}
async function ResolveDataset(datasets = []) {
  let i = 0;
  let datasetData = {};
  if (datasets.length) {
    const datasetsOrderedArray = await import_src2.default.map(datasets, 10, async (jds) => {
      const dsDatum = {};
      if (Array.isArray(jds)) {
        dsDatum[`dataset_${i}`] = jds;
      } else {
        const data = await getDataSet(jds);
        dsDatum[jds.name || `dataset_${i}`] = data;
      }
      i++;
      return dsDatum;
    });
    datasetData = datasetsOrderedArray.reduce((result, orderedDataset) => {
      const key = Object.keys(orderedDataset)[0];
      const val = orderedDataset[key];
      result[key] = val;
      return result;
    }, {});
  }
  return datasetData;
}
function getFunctionString(reductionFunctionData) {
  const { reducer_function, name, context, index } = reductionFunctionData;
  if (typeof reducer_function === "function") {
    const reduceFunction = async function getFunction(datasets) {
      const dataset_reduced = await reducer_function.call(context, datasets);
      return { dataset_reduced };
    }.bind(context);
    Object.defineProperty(
      reduceFunction,
      "name",
      {
        value: reducer_function.name || "ReducerFunction_" + index
      }
    );
    return reduceFunction;
  } else {
    const functionBodyString = `'use strict'; 
    return async function getAsyncString(){
      try {
        const dataset_reduced = await (async function getReducerData(){
          ${reducer_function}
        }.bind(this))();
        return {dataset_reduced};
      } catch(e){
        throw e;
      }
    }.call(this /* ,options */);
    `;
    const stringFunction = Function("datasets", functionBodyString).bind(context);
    Object.defineProperty(
      stringFunction,
      "name",
      {
        value: name || "ReducerFunction_" + index
      }
    );
    return stringFunction;
  }
}

// src/jsonm.ts
var ModelToTypeMap = {
  "regression": "ai-linear-regression",
  "prediction": "ai-regression",
  "classification": "ai-classification",
  "description": "ai-classification",
  "forecast": "ai-timeseries-regression-forecast"
};
async function getModelFromJSONM(jml) {
  const trainingData = Array.isArray(jml.dataset) ? jml.dataset : await getDataSet(jml.dataset);
  return new ModelX({
    trainingData,
    independent_variables: getInputs(jml),
    input_independent_features: jml.input_transforms,
    dependent_variables: jml.outputs,
    output_dependent_features: jml.output_transforms,
    training_progress_callback: jml.on_progress,
    training_options: jml.training_options || getModelTrainingOptions(jml.options),
    model_type: jml.model_type || ModelToTypeMap[jml.type] || jml.type,
    ...getModelOptions(jml, trainingData[0])
  });
}
var getModel = getModelFromJSONM;
function getModelTrainingOptions({ accuracy_target } = {}) {
  return {
    fit: {
      epochs: 300,
      batchSize: 20
    }
  };
}
function getInputs(jml) {
  if (jml?.type === "forecast")
    return Array.from(new Set(jml.inputs.concat(["year", "month", "day"])));
  else
    return jml.inputs;
}
function getDateField(DataRow) {
  if (DataRow?.Date)
    return "Date";
  else
    return "date";
}
function getModelOptions(jml, datum) {
  const defaultModelOptions = {};
  if (!jml?.model_options && jml?.type === "forecast") {
    defaultModelOptions.prediction_timeseries_time_zone = jml?.forecast_date_time_zone;
    defaultModelOptions.prediction_timeseries_date_feature = jml?.forecast_date_field || getDateField(datum);
    defaultModelOptions.prediction_timeseries_date_format = jml?.forecast_date_format;
    defaultModelOptions.validate_training_data = true;
    defaultModelOptions.retrain_forecast_model_with_predictions = true;
    defaultModelOptions.use_next_value_functions_for_training_data = true;
    defaultModelOptions.use_mock_dates_to_fit_trainning_data = true;
    defaultModelOptions.use_preprocessing_on_trainning_data = true;
    defaultModelOptions.training_feature_column_options = {
      year: ["onehot"],
      month: ["onehot"],
      day: ["onehot"]
    };
  }
  return {
    ...defaultModelOptions,
    ...jml?.model_options
  };
}

// src/index.ts
var Data = __toESM(require("@jsonstack/data"), 1);
var Model = __toESM(require("@jsonstack/model"), 1);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Data,
  JSONModel,
  Model,
  ModelCategories,
  ModelTypes,
  ModelX,
  autoAssignFeatureColumns,
  createModelFitCallback,
  getAutoFeatures,
  getBackend,
  getDataSet,
  getGeneratedStatefulFunction,
  getModel,
  getModelFromJSONM,
  getModelTrainingOptions,
  getScikit,
  setBackend,
  setScikit,
  sumPreviousRows
});
