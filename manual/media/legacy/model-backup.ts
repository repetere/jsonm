const periodic = require('periodicjs');
const luxon = require('luxon');
const flatten = require('flat');
const Promisie = require('promisie');
const scripts = require('../scripts');
const MS = require('modelscript/build/modelscript.cjs');
const TS = require('tensorscript-node/bundle/tensorscript.cjs');
const ISOOptions = {
  includeOffset: false,
  // suppressSeconds:true,
  suppressMilliseconds: true,
};
// const tf = require('@tensorflow/tfjs-node');
require('@tensorflow/tfjs-node');
const ConfusionMatrix = MS.ml.ConfusionMatrix;
const logger = periodic.logger;
let use_tensorflow_cplusplus = false;//typeof tf.tensor ==='function';
const CONSTANTS = require('./constants');
const Outlier = require('outlier');
const {
  performanceValues,
  prettyTimeStringOutputFormat,
  timeProperty,
  dateTimeProperty,
  featureTimeProperty,
  durationToDimensionProperty,
} = CONSTANTS;
const dimensionDates = {
  monthly: scripts.features.getUniqueMonths,
  weekly: scripts.features.getUniqueWeeks,
  daily: scripts.features.getUniqueDays,
  hourly: scripts.features.getUniqueHours,
};
const dimensionDurations = ['years', 'months', 'weeks', 'days', 'hours', ];
const flattenDelimiter = '+=+';

function addMockDataToDataSet(DataSet, { mockEncodedData = [], includeConstants = true, }) {
  const newMockData = [].concat(mockEncodedData, includeConstants ? CONSTANTS.mockDates : []);
  DataSet.data = DataSet.data.concat(newMockData);
  return DataSet;
}

function removeMockDataToDataSet(DataSet, { mockEncodedData = [], includeConstants = true, }) {
  const newMockData = [].concat(mockEncodedData, includeConstants ? CONSTANTS.mockDates : []);
  DataSet.data.splice(DataSet.data.length - newMockData.length, newMockData.length);
  return DataSet;
}

function removeEvaluationData(evaluation) {
  evaluation.actuals = undefined;
  delete evaluation.actuals;
  evaluation.estimates = undefined;
  delete evaluation.estimates;
  return evaluation;
}

function isClosedOnDay(options) {
  const {
    weekday,
    dayname,
    parsedDate,
    date,
    operations,
    zone,
  } = options;
  const opening_time = (operations && operations.business_hours && operations.business_hours[ dayname ] && typeof operations.business_hours[ dayname ].opening_time === 'string')
    ? JSON.parse(operations.business_hours[ dayname ].opening_time) : {};
  const closing_time = (operations && operations.business_hours && operations.business_hours[ dayname ] && typeof operations.business_hours[ dayname ].closing_time === 'string')
    ? JSON.parse(operations.business_hours[ dayname ].closing_time) : {};
  const weekdayLuxonStart = luxon.DateTime.fromObject(Object.assign({ zone,  }, parsedDate, opening_time)).toJSDate();
  const weekdayLuxonEnd = luxon.DateTime.fromObject(Object.assign({ zone, }, parsedDate, closing_time)).toJSDate();
  const dateFromOBJ = luxon.DateTime.fromObject(Object.assign({ zone, }, parsedDate)).toJSDate();
  if (!weekday) throw new Error('missing weekday');
  if (!parsedDate.weekday) throw new Error('missing parsedDate.weekday');
  const closed =  parsedDate.weekday === weekday && (operations.business_hours[ dayname ].closed
    || (date < weekdayLuxonStart
      || date > weekdayLuxonEnd));

  // if ([ 10, 11, 12, 22, 23, 0 ].includes(parsedDate.hour)) {
  //   console.log({
  //     parsedDate, dayname,
  //     date,
  //     weekdayLuxonStart, weekdayLuxonEnd,
  //     dateFromOBJ,
  //   },
  //     // 'operations', operations,
  //     { opening_time, closing_time, closed });
  //   console.log('date < weekdayLuxonStart', date < weekdayLuxonStart);
  //   console.log('date > weekdayLuxonEnd', date > weekdayLuxonEnd);
  // }
  // throw new Error('manual stop');
  return closed; 
}

function getOpenHour(options) {
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

function getIsOutlier({ outlier_property, }) {
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

function sumPreviousRows(options) {
  const { property, rows, offset = 1, } = options;
  const reverseTransform = Boolean(this.reverseTransform);
  const OFFSET = (typeof this.offset === 'number') ? this.offset : offset;
  const index = OFFSET; //- 1;
  if (this.debug) {
    if (OFFSET < 1) throw new RangeError(`Offset must be larger than the default of 1 [property:${property}]`);
    if (index-rows < 1) throw new RangeError(`previous index must be greater than 0 [index-rows:${index-rows}]`);
  }
  const sum = this.data
    .slice(index-rows, index)
    // .slice(index, rows + index)
    .reduce((result, val) => {
      const value = (reverseTransform) ? this.DataSet.inverseTransformObject(val) : val;
      // console.log({ value, result, });
      result = result + value[ property ];
      return result;
    }, 0);
  const sumSet = this.data
    .slice(index - rows, index).map(ss => ss[ property ]);
  // console.log('this.data.length', this.data.length,'this.data.map(d=>d[property])',this.data.map(d=>d[property]), { sumSet, property, offset, rows, sum, reverseTransform, });

  return sum;
}

function getLocalParsedDate(options) {
  const { date, time_zone, dimension, } = options;
  //modelDoc.dimension
  const end_date = luxon.DateTime.fromJSDate(date).plus({
    [ timeProperty[ dimension ] ]: 1,
  }).toJSDate();
  const startOriginDate = luxon.DateTime.fromJSDate(date, { zone:time_zone, });
  const endOriginDate = luxon.DateTime.fromJSDate(end_date, { zone:time_zone, });
  const startDate = luxon.DateTime.fromJSDate(date);
  const endDate = luxon.DateTime.fromJSDate(end_date);
  const { year, month, day, ordinal, weekday, hour, minute, second, } = startOriginDate;

  return {
    year, month, day, hour, minute, second,
    days_in_month: startOriginDate.daysInMonth,
    ordinal_day: ordinal,
    week: startOriginDate.weekNumber,
    weekday: weekday,
    weekend: (startOriginDate.weekday >= 6),
    origin_time_zone: time_zone,
    start_origin_date_string: startOriginDate.toFormat(prettyTimeStringOutputFormat),
    // start_local_date_string,
    start_gmt_date_string: startDate.toJSDate().toUTCString(),
    end_origin_date_string: endOriginDate.toFormat(prettyTimeStringOutputFormat),
    // end_local_date_string,
    end_gmt_date_string: endDate.toJSDate().toUTCString(),
  };
}

class RepetereModel {
  static getModelMap(modelType) {
    const modelMap = {
      'ai-fast-forecast': TS.LSTMTimeSeries,
      'ai-forecast': TS.LSTMMultivariateTimeSeries,
      'ai-timeseries-regression-forecast': TS.MultipleLinearRegression,
      'ai-linear-regression': TS.MultipleLinearRegression,
      'ai-regression': TS.DeepLearningRegression,
      'ai-classification': TS.DeepLearningClassification,
      'ai-logistic-classification': TS.LogisticRegression,
      'ml-regression': MS.ml.Regression.MultivariateLinearRegression,
      'ml-timeseries-regression-forecast': MS.ml.Regression.MultivariateLinearRegression,
      'ml-recommendations': MS,
    };
    return modelMap[ modelType ];
  }
  static getDateFunctionFromFormat(format) {
    const dateFunctionMap = {
      'js': luxon.DateTime.fromJSDate,
      'iso': luxon.DateTime.fromISO,
    };
    return dateFunctionMap[ format ] || luxon.DateTime.fromFormat;
  }
  static getLuxonDateTime(options) {
    const { dateObject, dateFormat, } = options;
    if (dateFormat === 'js' && typeof dateObject === 'object' || (typeof dateObject === 'object' && dateObject instanceof Date)) {
      return {
        date: luxon.DateTime.fromJSDate(dateObject, { zone: options.time_zone, }),
        format: 'js',
      };
    } else if (typeof dateFormat === 'string' && dateFormat !== 'iso' && dateFormat !== 'js') {
      return {
        date: luxon.DateTime.fromFormat(dateObject, dateFormat, { zone: options.time_zone, }),
        format: dateFormat,
      };
    } else {
      return {
        date: luxon.DateTime.fromISO(dateObject, { zone: options.time_zone, }),
        format: 'iso',
      };
    }
  }
  constructor(parameters = {}, options = {}) {
    this.config = Object.assign({
      use_cache: true,
      model_type:(parameters.modelDocument && parameters.modelDocument.model_configuration &&parameters.modelDocument.model_configuration.model_type)?parameters.modelDocument.model_configuration.model_type:'ai-regression',
      model_category:(parameters.modelDocument && parameters.modelDocument.model_configuration &&parameters.modelDocument.model_configuration.model_category)?parameters.modelDocument.model_configuration.model_category:'regression', // classification, timeseries
    }, options);
    this.status = {
      trained: false,
      lastTrained: undefined,
    };
    this.modelDocument = Object.assign({ model_options: {}, model_configuration: {}, }, parameters.modelDocument);
    this.entity = parameters.entity || {};
    this.emptyObject = parameters.emptyObject || {};
    this.mockEncodedData = parameters.mockEncodedData || {};
    this.use_empty_objects = Boolean(Object.keys(this.emptyObject).length);
    this.use_mock_encoded_data = Boolean(this.mockEncodedData.length);
    this.dimension = this.modelDocument.dimension;
    this.trainning_data_filter_function_body = parameters.trainning_data_filter_function ||this.modelDocument.trainning_data_filter_function;
    this.trainingData = parameters.trainingData || [];
    this.removedFilterdtrainingData = [];
    this.DataSet = parameters.DataSet || {};
    this.max_evaluation_outputs = parameters.max_evaluation_outputs || 5;
    this.testDataSet = parameters.testDataSet || {};
    this.trainDataSet = parameters.trainDataSet || {};
    this.x_indep_matrix_train = parameters.x_indep_matrix_train || [];
    this.x_indep_matrix_test = parameters.x_indep_matrix_test || [];
    this.y_dep_matrix_train = parameters.y_dep_matrix_train || [];
    this.y_dep_matrix_test = parameters.y_dep_matrix_test || [];
    this.x_independent_features = parameters.x_independent_features || [];
    this.x_raw_independent_features = parameters.x_raw_independent_features || [];
    this.y_dependent_labels = parameters.y_dependent_labels || [];
    this.y_raw_dependent_labels = parameters.y_raw_dependent_labels || [];
    this.training_size_values = parameters.training_size_values;
    this.cross_validation_options = Object.assign({ train_size: 0.7, }, parameters.cross_validation_options);
    this.preprocessing_feature_column_options = parameters.preprocessing_feature_column_options || {};
    this.trainning_feature_column_options = parameters.trainning_feature_column_options || {};
    this.trainning_options = Object.assign({
      fit: {
        epochs: 100,
        batchSize: 5,
      },
      stateful: true,
      features: this.x_independent_features.length,
    }, parameters.trainning_options);
    this.prediction_options = parameters.prediction_options || [];
    this.prediction_inputs = parameters.prediction_inputs || [];
    this.prediction_timeseries_time_zone = parameters.prediction_timeseries_time_zone || this.entity.time_zone_name || 'utc';
    this.prediction_timeseries_date_feature = parameters.prediction_timeseries_date_feature || 'date';
    this.prediction_timeseries_date_format = parameters.prediction_timeseries_date_format;
    this.validate_trainning_data = typeof parameters.validate_trainning_data === 'boolean' ? parameters.validate_trainning_data : true;
    this.retrain_forecast_model_with_predictions = parameters.retrain_forecast_model_with_predictions || this.modelDocument.model_configuration.retrain_forecast_model_with_predictions;
    this.use_preprocessing_on_trainning_data = parameters.use_preprocessing_on_trainning_data || this.modelDocument.model_configuration.use_preprocessing_on_trainning_data;
    this.use_mock_dates_to_fit_trainning_data = parameters.use_mock_dates_to_fit_trainning_data || this.modelDocument.model_options.use_mock_dates_to_fit_trainning_data;
    this.use_next_value_functions_for_training_data = parameters.use_next_value_functions_for_training_data || this.modelDocument.model_options.use_next_value_functions_for_training_data;
    this.prediction_timeseries_start_date = parameters.prediction_timeseries_start_date;
    this.prediction_timeseries_end_date = parameters.prediction_timeseries_end_date;
    this.prediction_timeseries_dimension_feature = parameters.prediction_timeseries_dimension_feature || 'dimension';
    this.prediction_inputs_next_value_functions = parameters.prediction_inputs_next_value_functions = parameters.next_value_functions || this.modelDocument.next_value_functions || [];
    this.Model = parameters.Model || [];
    this.forecastDates = [];
    if (typeof options.use_tensorflow_cplusplus === 'boolean') {
      use_tensorflow_cplusplus = options.use_tensorflow_cplusplus;
    }
    return this;
  }
  evaluateClassificationAccuracy(options = {}) {
    const { dependent_feature_label, estimatesDescaled, actualsDescaled, } = options;
    const estimates = MS.DataSet.columnArray(dependent_feature_label, { data: estimatesDescaled, });
    const actuals = MS.DataSet.columnArray(dependent_feature_label, { data: actualsDescaled, });
    const CM = ConfusionMatrix.fromLabels(actuals, estimates);
    const accuracy = CM.getAccuracy();
    return {
      accuracy,
      matrix: CM.matrix,
      labels: CM.labels,
      actuals, estimates,
    };
  }
  evaluateRegressionAccuracy(options = {}) {
    const { dependent_feature_label, estimatesDescaled, actualsDescaled, } = options;
    const estimates = MS.DataSet.columnArray(dependent_feature_label, { data: estimatesDescaled, });
    const actuals = MS.DataSet.columnArray(dependent_feature_label, { data: actualsDescaled, });
    const standardError = MS.util.standardError(actuals, estimates);
    const rSquared = MS.util.rSquared(actuals, estimates);
    const adjustedRSquared = MS.util.adjustedRSquared({
      actuals,
      estimates,
      rSquared,
      independentVariables: this.x_independent_features.length,
    });
    const hasZeroActual = Boolean(actuals.filter(a => a === 0 || isNaN(a)).length);
    const originalMeanAbsolutePercentageError = MS.util.meanAbsolutePercentageError(actuals, estimates);
    const MAD = MS.util.meanAbsoluteDeviation(actuals, estimates);
    const MEAN = MS.util.mean(actuals);
    let metric = 'meanAbsolutePercentageError';
    let reason = 'Actuals do not contain Zero values';
    if (hasZeroActual) {
      metric = 'MAD over MEAN ratio';
      reason = 'Actuals contain Zero values';
    }
    let errorPercentage = (hasZeroActual) ? (MAD / MEAN) : originalMeanAbsolutePercentageError;
    if (errorPercentage < 0) errorPercentage = 0;
    if (errorPercentage > 1) errorPercentage = 1;
    const accuracyPercentage = 1 - errorPercentage;

    return {
      standardError, rSquared, adjustedRSquared, actuals, estimates,
      meanForecastError: MS.util.meanForecastError(actuals, estimates),
      meanAbsoluteDeviation: MS.util.meanAbsoluteDeviation(actuals, estimates),
      trackingSignal: MS.util.trackingSignal(actuals, estimates),
      meanSquaredError: MS.util.meanSquaredError(actuals, estimates),
      meanAbsolutePercentageError: errorPercentage,
      accuracyPercentage,
      metric,
      reason,
      originalMeanAbsolutePercentageError,
    };
  }
  getTimeseriesDimension(options) {
    let timeseriesDataSetDateFormat = this.prediction_timeseries_date_format;
    let timeseriesForecastDimension = options.dimension || this.dimension;
    let DataSetData = options.DataSetData || this.DataSet.data;
    if (timeseriesForecastDimension && timeseriesDataSetDateFormat) {
      this.dimension = timeseriesForecastDimension;
      return {
        dimension: timeseriesForecastDimension,
        dateFormat: timeseriesDataSetDateFormat,
      };
    }
    if (typeof timeseriesForecastDimension !== 'string' && DataSetData && Array.isArray(DataSetData) && DataSetData.length) {
      if (DataSetData[ 0 ].dimension) {
        timeseriesForecastDimension = DataSetData[ 0 ][this.prediction_timeseries_dimension_feature];
      } else if (DataSetData.length > 1 && DataSetData[ 0 ][ this.prediction_timeseries_date_feature ]) {
        const recentDateField = DataSetData[ 1 ][ this.prediction_timeseries_date_feature ];
        const parsedRecentDateField = RepetereModel.getLuxonDateTime({
          dateObject: recentDateField,
          dateFormat: this.prediction_timeseries_date_format,
        });
        timeseriesDataSetDateFormat = parsedRecentDateField.format;
        const test_end_date = parsedRecentDateField.date;
        const test_start_date = RepetereModel.getLuxonDateTime({
          dateObject: DataSetData[ 0 ][ this.prediction_timeseries_date_feature ],
          dateFormat: this.prediction_timeseries_date_format,
        }).date;
        // console.log({parsedRecentDateField})

        const durationDifference = test_end_date.diff(test_start_date, dimensionDurations).toObject(); 
        // timeseriesForecastDimension
        const durationDimensions = Object.keys(durationDifference).filter(diffProp => durationDifference[ diffProp ] === 1);
        // console.log({ test_start_date, test_end_date, durationDifference, durationDimensions, durationToDimensionProperty, });
        if (durationDimensions.length === 1) {
          timeseriesForecastDimension = durationToDimensionProperty[ durationDimensions[ 0 ]];
        }
      }
    }
    if (typeof timeseriesForecastDimension !== 'string' || Object.keys(dimensionDates).indexOf(timeseriesForecastDimension) === -1) throw new ReferenceError(`Invalid timeseries dimension (${timeseriesForecastDimension})`);
    this.prediction_timeseries_date_format = timeseriesDataSetDateFormat;
    this.dimension = timeseriesForecastDimension;
    return {
      dimension: timeseriesForecastDimension,
      dateFormat: timeseriesDataSetDateFormat,
    };
    // console.log({timeseriesForecastDimension})
  }
  getForecastDates(options = {}) {
    const start = (this.prediction_timeseries_start_date instanceof Date)
      ? luxon.DateTime.fromJSDate(this.prediction_timeseries_start_date).toISO(ISOOptions)
      : this.prediction_timeseries_start_date;
    const end = (this.prediction_timeseries_end_date instanceof Date)
      ? luxon.DateTime.fromJSDate(this.prediction_timeseries_end_date).toISO(ISOOptions)
      : this.prediction_timeseries_end_date;
    this.forecastDates = dimensionDates[ this.dimension ]({
      start,
      end,
      time_zone: this.prediction_timeseries_time_zone,
    });
    return this.forecastDates;
  }
  getCrosstrainingData(options = {}) {
    let test;
    let train;
    // console.log('getCrosstrainingData', {
    //   model_category: this.config.model_category,
    //   cross_validation_options: this.cross_validation_options,
    //   'this.DataSet.data.length':this.DataSet.data.length,
    // })
    if (this.config.model_category === 'timeseries') {
      // console.log('this.cross_validation_options',this.cross_validation_options)
      const trainSizePercentage = this.cross_validation_options.train_size || 0.7;
      // console.log('this.training_size_values ', this.training_size_values, { trainSizePercentage, });
      const train_size = (this.training_size_values)
        ? this.DataSet.data.length - this.training_size_values
        : parseInt(this.DataSet.data.length * trainSizePercentage);
      // console.log({ train_size, });
      // const test_size = this.DataSet.data.length - train_size;
      test = this.DataSet.data.slice(train_size, this.DataSet.data.length);
      // test.forEach(t => {
      //   console.log('test',{
      //     is_location_open:t.is_location_open,
      //     hour:t.hour,
      //     date:t.date,
      //   })
      // })
      train = this.DataSet.data.slice(0, train_size);
    } else {
      const testTrainSplit = MS.cross_validation.train_test_split(this.DataSet.data, this.cross_validation_options);
      train = testTrainSplit.train;
      test = testTrainSplit.test;
    }
    return { test, train, };
  }
  setClosedPredictionValues({ dimension, is_location_open, date='', predictionMatrix, }) {
    if ((dimension === 'hourly' || dimension === 'daily') && this.entity && !is_location_open) {
      // console.log('before predictionMatrix', predictionMatrix);
      periodic.logger.silly(`Manually fixing prediction on closed - ${dimension} ${date}`);
      predictionMatrix = predictionMatrix.map(() => 0);
      // console.log('after predictionMatrix', predictionMatrix);

    }
    return predictionMatrix;
  }
  addMockData({ use_mock_dates = false, }) {
    if (use_mock_dates && this.use_mock_encoded_data) this.DataSet = addMockDataToDataSet(this.DataSet, { includeConstants: true, mockEncodedData: this.mockEncodedData, }); 
    else if (use_mock_dates) this.DataSet = addMockDataToDataSet(this.DataSet, {});
    else if (this.use_mock_encoded_data) this.DataSet = addMockDataToDataSet(this.DataSet, { includeConstants: false, mockEncodedData: this.mockEncodedData, });
  }
  removeMockData({ use_mock_dates = false, }) {
    if (use_mock_dates && this.use_mock_encoded_data) this.DataSet = removeMockDataToDataSet(this.DataSet, { includeConstants: true, mockEncodedData: this.mockEncodedData, }); 
    else if (use_mock_dates) this.DataSet = removeMockDataToDataSet(this.DataSet, {});
    else if (this.use_mock_encoded_data) this.DataSet = removeMockDataToDataSet(this.DataSet, { includeConstants: false, mockEncodedData: this.mockEncodedData, });
  }
  validatetrainingData({ cross_validate_trainning_data, inputMatrix, }) {
    const checkValidationData = (inputMatrix) ? inputMatrix : this.x_indep_matrix_train;
    const dataType = (inputMatrix) ? 'Prediction' : 'Trainning';
    checkValidationData.forEach((trainingData, i) => { 
      // console.log({ trainingData, i });
      trainingData.forEach((trainningVal, v) => {
        if (typeof trainningVal !== 'number' || isNaN(trainningVal)) {
          // console.error(`Trainning data (${i}) has an invalid ${this.x_independent_features[ v ]}. Value: ${trainningVal}`);
          const originalData = (inputMatrix)
            ? inputMatrix[ i ]
            : (cross_validate_trainning_data)
              ? this.original_data_test[ i ]
              : this.trainingData[ i ];
          const [scaledTrainningValue, ] = this.DataSet.reverseColumnMatrix({ vectors: [trainingData, ], labels: this.x_independent_features, });
          const inverseTransformedObject = this.DataSet.inverseTransformObject(scaledTrainningValue);
          // console.log({ i, trainningVal, v, scaledTrainningValue, inverseTransformedObject, originalData, });
          periodic.logger.error('INVALID '+dataType+' DATA', {
            model: this.modelDocument.title,
            entity: this.entity.title,
            tranning_data_index: i,
            feature:this.x_independent_features[ v ],
            scaledTrainningValue,
            inverseTransformedObject,
            originalData,
          });
          throw new TypeError(`${dataType} data (${i}) has an invalid ${this.x_independent_features[ v ]}. Value: ${trainningVal}`);
        }
      });
    });
  }
  async validateTimeseriesData(options = {}) {
    const { fixPredictionDates = true, } = options;
    const dimension = this.dimension;
    let raw_prediction_inputs = options.prediction_inputs || await this.getPredictionData(options) || [];
    // console.log('ORIGINAL raw_prediction_inputs', raw_prediction_inputs);

    const lastOriginalDataSetIndex = this.DataSet.data.length - 1;
    const lastOriginalDataSetObject = this.DataSet.data[ lastOriginalDataSetIndex ];
    let forecastDates = this.forecastDates;
    const datasetDateOptions = RepetereModel.getLuxonDateTime({
      dateObject: lastOriginalDataSetObject[ this.prediction_timeseries_date_feature ],
      dateFormat: this.prediction_timeseries_date_format,
      time_zone: this.prediction_timeseries_time_zone,
    });
    const lastOriginalForecastDateTimeLuxon = datasetDateOptions.date;
    const lastOriginalForecastDateTimeFormat = datasetDateOptions.format;
    const lastOriginalForecastDate = lastOriginalForecastDateTimeLuxon.toJSDate();
    const datasetDates = (lastOriginalDataSetObject[ this.prediction_timeseries_date_feature ] instanceof Date)
      ? this.DataSet.columnArray(this.prediction_timeseries_date_feature)
      : this.DataSet.columnArray(this.prediction_timeseries_date_feature).map(originalDateFormattedDate => RepetereModel.getLuxonDateTime({
        dateObject: originalDateFormattedDate,
        dateFormat: lastOriginalForecastDateTimeFormat,
        time_zone: this.prediction_timeseries_time_zone,
      }).date.toJSDate());
    const firstDatasetDate = datasetDates[ 0 ];
    // console.log({ fixPredictionDates, forecastDates, datasetDates, firstDatasetDate, });
    if (fixPredictionDates && typeof this.prediction_timeseries_start_date === 'string') this.prediction_timeseries_start_date = luxon.DateTime.fromISO(this.prediction_timeseries_start_date).toJSDate();
    if (fixPredictionDates && this.prediction_timeseries_start_date < firstDatasetDate) { 
      this.prediction_timeseries_start_date = firstDatasetDate;
      forecastDates = this.getForecastDates();
      // console.log('modified',{ forecastDates, });
    } 
    let forecastDateFirstDataSetDateIndex = datasetDates.findIndex(DataSetDate => DataSetDate.valueOf() === forecastDates[0].valueOf());
    // const forecastDateLastDataSetDateIndex = forecastDates.findIndex(forecastDate => forecastDate.valueOf() === lastOriginalForecastDate.valueOf());
    if(forecastDateFirstDataSetDateIndex === -1){
      const lastDataSetDate = datasetDates[ datasetDates.length - 1 ];
      const firstForecastInputDate = forecastDates[ 0 ];
      const firstForecastDateFromInput = luxon.DateTime.fromJSDate(lastDataSetDate, { zone:this.prediction_timeseries_time_zone, }).plus({ [ timeProperty[ dimension ] ]: 1, });
      // console.log({ lastDataSetDate, firstForecastInputDate, firstForecastDateFromInput, dimension, });
      // console.log('timeProperty[ dimension ]', timeProperty[ dimension ], 'lastDataSetDate.valueOf()', lastDataSetDate.valueOf(), 'firstForecastInputDate.valueOf()', firstForecastInputDate.valueOf(), 'firstForecastDateFromInput.valueOf()', firstForecastDateFromInput.valueOf());
      if (firstForecastDateFromInput.valueOf() === firstForecastInputDate.valueOf()) {
        forecastDateFirstDataSetDateIndex = datasetDates.length;
      }
    }
    if (forecastDateFirstDataSetDateIndex === -1) throw new RangeError(`Forecast Date Range (${this.prediction_timeseries_start_date} - ${this.prediction_timeseries_end_date}) must include an existing forecast date (${this.DataSet.data[ 0 ][ this.prediction_timeseries_date_feature ]} - ${this.DataSet.data[ lastOriginalDataSetIndex ][ this.prediction_timeseries_date_feature ]})`);
    //ensure prediction input dates are dates
    if (raw_prediction_inputs.length) {
      if (raw_prediction_inputs[ 0 ][ this.prediction_timeseries_date_feature ] instanceof Date === false) {
        raw_prediction_inputs = raw_prediction_inputs.map(raw_input => {
          return Object.assign({}, raw_input, {
            [ this.prediction_timeseries_date_feature ]: RepetereModel.getLuxonDateTime({
              dateObject: raw_input[ this.prediction_timeseries_date_feature ],
              dateFormat: lastOriginalForecastDateTimeFormat,
              time_zone: this.prediction_timeseries_time_zone,
            }).date.toJSDate(),
          });
        });
      }
      const firstRawInputDate = raw_prediction_inputs[ 0 ][ this.prediction_timeseries_date_feature ];
      const firstForecastDate = forecastDates[ 0 ];
      const raw_prediction_input_dates = raw_prediction_inputs.map(raw_input => raw_input[ this.prediction_timeseries_date_feature ]);
      if (fixPredictionDates && firstForecastDate > firstRawInputDate) {
        // console.log('FIX INPUTS');
        const matchingInputIndex = raw_prediction_input_dates.findIndex(inputPredictionDate => inputPredictionDate.valueOf() === firstForecastDate.valueOf());
        // const updated_raw_prediction_input_dates = raw_prediction_input_dates.slice(matchingInputIndex);
        raw_prediction_inputs = raw_prediction_inputs.slice(matchingInputIndex);
        // console.log({ matchingInputIndex, updated_raw_prediction_input_dates, forecastDates });
      }
      // console.log({ firstRawInputDate, firstForecastDate, datasetDates, forecastDates, raw_prediction_input_dates, });
      if (raw_prediction_inputs[ 0 ][ this.prediction_timeseries_date_feature ].valueOf() !== forecastDates[ 0 ].valueOf()) throw new RangeError(`Prediction input dates (${raw_prediction_inputs[ 0 ][ this.prediction_timeseries_date_feature ]} to ${raw_prediction_inputs[ raw_prediction_inputs.length - 1 ][ this.prediction_timeseries_date_feature ]}) must match forecast date range (${forecastDates[ 0 ]} to ${forecastDates[ forecastDates.length - 1 ]})`);
    }
    //      this.prediction_inputs = raw_prediction_inputs.map(prediction_value=>this.DataSet.transformObject(prediction_value));
    return { forecastDates, forecastDateFirstDataSetDateIndex, lastOriginalForecastDate, raw_prediction_inputs, dimension, datasetDates, };
  }
  async checkTrainingStatus(options = {}) {
    if (options.retrain || this.status.trained===false) {
      await this.gettrainingData(options);
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
      nextValueIncludeForecastInputs = true,
      // trainingData,
    } = options;
   
    const props = { luxon, MS, };
    const nextValueFunctions = this.prediction_inputs_next_value_functions.reduce((functionsObject, func) => {
      functionsObject[ func.variable_name ] = Function('state', `'use strict';${func.function_body}`).bind({ props, });
      Object.defineProperty(
        functionsObject[ func.variable_name ],
        'name',
        {
          value: `next_value_${func.variable_name}`,
        });
      return functionsObject;
    }, {});
    const filterFunctionBody = `'use strict';
    ${this.trainning_data_filter_function_body}
    `;
    this.trainning_data_filter_function = (this.trainning_data_filter_function_body)
      ? Function('datum', 'datumIndex', filterFunctionBody).bind({ props, })
      : undefined;
    this.prediction_inputs_next_value_function = function nextValueFunction(state) {
      const lastDataRow = state.lastDataRow || {};
      const zone = lastDataRow.origin_time_zone || this.prediction_timeseries_time_zone;
      const date = state.forecastDate;
      // const isOutlierValue = () => 0;
      state.sumPreviousRows = sumPreviousRows.bind({
        data: state.data,
        DataSet: state.DataSet,
        offset: state.existingDatasetObjectIndex,
        reverseTransform: state.reverseTransform,
      });
      const helperNextValueData = {};
      if (nextValueIncludeForecastDate) {
        helperNextValueData[ this.prediction_timeseries_date_feature ] = state.forecastDate;
      }
      if (nextValueIncludeDateProperty) {
        helperNextValueData.date = state.forecastDate;
      }
      if (nextValueIncludeForecastTimezone) {
        helperNextValueData.origin_time_zone = lastDataRow.origin_time_zone;
      }
      if (nextValueIncludeForecastAssociations) {
        helperNextValueData.associated_data_location = lastDataRow.associated_data_location
          ? lastDataRow.associated_data_location.toString()
          : lastDataRow.associated_data_location;
        helperNextValueData.associated_data_product = lastDataRow.associated_data_product
          ? lastDataRow.associated_data_product.toString()
          : lastDataRow.associated_data_product;
        helperNextValueData.associated_data_entity = lastDataRow.associated_data_entity
          ? lastDataRow.associated_data_entity.toString()
          : lastDataRow.associated_data_entity;
        helperNextValueData.forecast_entity_type = lastDataRow.feature_entity_type
          ? lastDataRow.feature_entity_type.toString()
          : lastDataRow.forecast_entity_type;
        helperNextValueData.forecast_entity_title = lastDataRow.feature_entity_title
          ? lastDataRow.feature_entity_title.toString()
          : lastDataRow.forecast_entity_title;
        helperNextValueData.forecast_entity_name = lastDataRow.feature_entity_name
          ? lastDataRow.feature_entity_name.toString()
          : lastDataRow.forecast_entity_name;
        helperNextValueData.forecast_entity_id = lastDataRow.feature_entity_id
          ? lastDataRow.feature_entity_id.toString()
          : lastDataRow.forecast_entity_id;
      }
      if (nextValueIncludeParsedDate) {
        const parsedDate = CONSTANTS.getParsedDate(state.forecastDate, { zone, });
        const isOpen = getOpenHour.bind({ entity: this.entity,  dimension: this.dimension, }, { date, parsedDate, zone, });
        const isOutlier = getIsOutlier.bind({ entity: this.entity, data: state.data, datum:helperNextValueData, });
        state.parsedDate = parsedDate;
        state.isOpen = isOpen;
        state.isOutlier = isOutlier;
        Object.assign(helperNextValueData, parsedDate); // const parsedDate = CONSTANTS.getParsedDate(date, { zone, });
        // console.log({parsedDate,date,state})
      }
      if (nextValueIncludeLocalParsedDate) {
        Object.assign(helperNextValueData, getLocalParsedDate({ date: state.forecastDate, time_zone: zone, dimension: this.dimension, }));
      }
      if (nextValueIncludeForecastInputs) {
        Object.assign(helperNextValueData, state.rawInputPredictionObject);//inputs
      }
      return Object.keys(nextValueFunctions).reduce((nextValueObject, functionName) => {
      /*
        this.props = {
          forecastDate,
          luxon,
        }
        state = {
              DataSet: this.DataSet,
              rawInputPredictionObject,
              forecastDate,
              forecastDates,
              forecastPredictionIndex,
              unscaledLastForecastedValue,
            }
        */
        nextValueObject[ functionName ] = nextValueFunctions[ functionName ](state);
        return nextValueObject;
      }, helperNextValueData);
    };
    if (this.config.model_category === 'timeseries') {
      this.dimension = this.getTimeseriesDimension(options).dimension;
    }
    if (this.dimension && this.config.model_category === 'timeseries' && this.prediction_timeseries_start_date && this.prediction_timeseries_end_date) {
      this.getForecastDates();
    }
  }
  async gettrainingData(options = {}) {
    if (options.trainingData) {
      this.trainingData = options.trainingData;
    } else if (typeof options.getDataPromise === 'function') {
      this.trainingData = await options.getDataPromise();
    }
  }
  async getPredictionData(options = {}) {
    if (typeof options.getPredictionInputPromise === 'function') {
      this.prediction_inputs = await options.getPredictionInputPromise();
    }
    return this.prediction_inputs;
  }
  async trainModel(options = {}) {
    const { cross_validate_trainning_data=true, use_next_value_functions_for_training_data=false, use_mock_dates_to_fit_trainning_data=false, } = options;
    const modelObject = RepetereModel.getModelMap(this.config.model_type);
    const use_mock_dates = use_mock_dates_to_fit_trainning_data || this.use_mock_dates_to_fit_trainning_data;
    let trainingData = options.trainingData || this.trainingData;
    trainingData = [].concat(trainingData);
    // const use_next_val_functions = (typeof this.use_next_value_functions_for_training_data !== 'undefined')
    //   ? this.use_next_value_functions_for_training_data
    //   : use_next_value_functions_for_training_data
    let test;
    let train;
    this.status.trained = false;
    await this.getDataSetProperties({
      DataSetData: trainingData,
    });
    if (typeof this.trainning_data_filter_function === 'function' && use_next_value_functions_for_training_data === false) {
      trainingData = trainingData.filter((datum, datumIndex) => this.trainning_data_filter_function(datum, datumIndex));
    }
    // console.log({ trainingData });
    if (!use_next_value_functions_for_training_data && this.use_empty_objects) {
      trainingData = trainingData.map(trainningDatum => Object.assign({}, this.emptyObject, trainningDatum));
    }
    this.DataSet = new MS.DataSet(trainingData);
    if (this.use_preprocessing_on_trainning_data && this.preprocessing_feature_column_options && Object.keys(this.preprocessing_feature_column_options).length) {
      this.DataSet.fitColumns(this.preprocessing_feature_column_options);
    }
    if (use_next_value_functions_for_training_data) {
      const trainingDates = trainingData.map(tdata => tdata[ this.prediction_timeseries_date_feature ]);
      trainingData = trainingData.map((trainingDatum, dataIndex) => {
        const forecastDate = trainingDatum[ this.prediction_timeseries_date_feature ];
        const forecastPredictionIndex = dataIndex;
        if (trainingDatum._id) trainingDatum._id = trainingDatum._id.toString();
        if (trainingDatum.feature_entity_id) trainingDatum.feature_entity_id = trainingDatum.feature_entity_id.toString();
        const trainningNextValueData = this.prediction_inputs_next_value_function({
          rawInputPredictionObject: trainingDatum,
          forecastDate,
          forecastDates: trainingDates,
          forecastPredictionIndex,
          existingDatasetObjectIndex: dataIndex,
          unscaledLastForecastedValue: trainingData[ dataIndex - 1 ],
          // data: this.DataSet.data.splice(forecastDateFirstDataSetDateIndex, 0, forecasts),
          data: trainingData,
          DataSet: this.DataSet,
          lastDataRow: trainingData[ trainingData.length - 1 ],
          reverseTransform: false,
        });
        // console.log({ forecastPredictionIndex, forecastDate, trainningNextValueData });
        const calculatedDatum = this.use_empty_objects
          ? Object.assign({},
            this.emptyObject,
            flatten(trainingDatum, { maxDepth: 2, delimiter:flattenDelimiter, }),
            flatten(trainningNextValueData, { maxDepth: 2, delimiter:flattenDelimiter, })
          )
          : Object.assign({}, trainingDatum, trainningNextValueData);
        // console.log({dataIndex,calculatedDatum});
        return calculatedDatum;
      });
      if (typeof this.trainning_data_filter_function === 'function' && use_next_value_functions_for_training_data===true) {
        trainingData = trainingData.filter((datum, datumIndex) => {
          const removeValue = this.trainning_data_filter_function(datum, datumIndex);
          if (!removeValue) this.removedFilterdtrainingData.push(datum);
          return removeValue;
        });
      }
      // console.log('trainModel trainingData[0]', trainingData[0]);
      // console.log('trainModel trainingData[trainingData.length-1]', trainingData[trainingData.length-1]);
      // console.log('trainModel trainingData.length', trainingData.length);
      // console.log('trainModel this.forecastDates', this.forecastDates);
      this.DataSet = new MS.DataSet(trainingData);
    }

    // console.log('this.preprocessingColumnOptions', this.preprocessingColumnOptions);
   
    ['is_location_open', 'is_open_hour', 'is_location_open',].forEach(feat_col_option => {
      if (this.trainning_feature_column_options[ feat_col_option ]) {
        this.trainning_feature_column_options[ feat_col_option ] = ['label', { binary: true, },];
      }
    });
    // console.log('AFTER this.trainning_feature_column_options', this.trainning_feature_column_options);


    this.addMockData({ use_mock_dates, });
    this.DataSet.fitColumns(this.trainning_feature_column_options);
    this.removeMockData({ use_mock_dates, });
    // console.log('this.DataSet', this.DataSet);
    // console.log('this.use_preprocessing_on_trainning_data', this.use_preprocessing_on_trainning_data);
    // console.log('this.preprocessing_feature_column_options', this.preprocessing_feature_column_options);
    this.x_independent_features = Array.from(new Set(this.x_independent_features));
    // console.log('AFTER this.x_independent_features', this.x_independent_features);
    this.y_dependent_labels = Array.from(new Set(this.y_dependent_labels));
    // console.log('AFTER this.y_dependent_labels', this.y_dependent_labels);
    // console.log('this.y_dependent_labels', this.y_dependent_labels);
    // console.log('IN MODEL trainingData.length', trainingData.length);
    // throw new Error('SHOULD NOT GET TO ADD MOCK DATA');
    // console.log({ cross_validate_trainning_data });
    // Object.defineProperty(this, 'x_indep_matrix_train', {
    //   writable: false,
    //   configurable: false,
    // });

    if (cross_validate_trainning_data) {
      let crosstrainingData = this.getCrosstrainingData(options);
      test = crosstrainingData.test;
      train = crosstrainingData.train;
      this.original_data_test = crosstrainingData.test;
      this.original_data_train = crosstrainingData.train;
      // console.log('IN MODEL test.length', test.length);
      // console.log('IN MODEL train.length', train.length);
      // Object.defineProperty(this.x_indep_matrix_train, '', {
      //   writable: false,
      //   configurable: false,
        
      // })
      this.testDataSet = new MS.DataSet(test);
      this.trainDataSet = new MS.DataSet(train);
      this.x_indep_matrix_train = this.trainDataSet.columnMatrix(this.x_independent_features);
      this.x_indep_matrix_test = this.testDataSet.columnMatrix(this.x_independent_features);
      this.y_dep_matrix_train = this.trainDataSet.columnMatrix(this.y_dependent_labels);
      this.y_dep_matrix_test = this.testDataSet.columnMatrix(this.y_dependent_labels);
    } else {
      this.x_indep_matrix_train = this.DataSet.columnMatrix(this.x_independent_features);
      this.y_dep_matrix_train = this.DataSet.columnMatrix(this.y_dependent_labels);
    }
    if (use_tensorflow_cplusplus) {
      this.Model = new modelObject(this.trainning_options, {
        // tf,  // tf - can switch to tensorflow gpu here
      });
      use_tensorflow_cplusplus = true;
    } else { 
      this.Model = new modelObject(this.trainning_options, { });
      use_tensorflow_cplusplus = true;
    }
    if (this.config.model_category === 'timeseries') {
      const validationData = await this.validateTimeseriesData(options);
    }
    if (this.validate_trainning_data) {
      this.validatetrainingData({ cross_validate_trainning_data, });
    }
    if (this.config.model_category === 'timeseries' && this.config.model_type==='ai-fast-forecast') {
      await this.Model.train(this.x_indep_matrix_train);
    } else {
      // console.log('this.DataSet.data',this.DataSet.data)
      // console.log('this.x_indep_matrix_train',this.x_indep_matrix_train)
      // console.log('this.x_indep_matrix_train[0]', this.x_indep_matrix_train[ 0 ]);
      // console.log('this.x_indep_matrix_train[this.x_indep_matrix_train.length-1]', this.x_indep_matrix_train[this.x_indep_matrix_train.length-1 ]);
      // console.log('this.y_dep_matrix_train[0]', this.y_dep_matrix_train[ 0 ]);
      // console.log('this.y_dep_matrix_train[this.y_dep_matrix_train.length-1]', this.y_dep_matrix_train[this.y_dep_matrix_train.length-1 ]);
      // console.log('this.y_dep_matrix_train',this.y_dep_matrix_train)
      // console.log('this.x_independent_features',this.x_independent_features)
      // console.log('this.y_dependent_labels',this.y_dependent_labels)
      // console.log('this.trainning_feature_column_options',this.trainning_feature_column_options)
      // console.log('this.validate_trainning_data',this.validate_trainning_data)
      await this.Model.train(this.x_indep_matrix_train, this.y_dep_matrix_train);
    }
    this.status.trained = true;
    return this;
  }
  async retrainTimeseriesModel(options = {}) {
    const { inputMatrix, predictionMatrix, fitOptions, } = options;
    const fit = Object.assign({}, this.Model.settings.fit, fitOptions);
    // const look_back
    const x_timeseries = inputMatrix;
    const y_timeseries = predictionMatrix;
    const x_matrix = x_timeseries;
    const y_matrix = y_timeseries;
    let yShape;
    //_samples, _timeSteps, _features
    const timeseriesShape = (typeof this.Model.getTimeseriesShape === 'function')
      ? this.Model.getTimeseriesShape(x_matrix)
      : undefined;
    const x_matrix_timeseries = (typeof timeseriesShape !== 'undefined')
      ? this.Model.reshape(x_matrix, timeseriesShape)
      : x_matrix;
    const xs = this.Model.tf.tensor(x_matrix_timeseries, timeseriesShape);
    const ys = this.Model.tf.tensor(y_matrix, yShape);
    // this.Model.model.reset_states();
    await this.Model.model.fit(xs, ys, fit);
    // this.model.summary();
    xs.dispose();
    ys.dispose();
    return this;
  }
  async evaluateModel(options = {}) {
    await this.checkTrainingStatus(options);
    const x_indep_matrix_test = options.x_indep_matrix_test || this.x_indep_matrix_test;
    const y_dep_matrix_test = options.y_dep_matrix_test || this.y_dep_matrix_test;
    const predictionOptions = Object.assign({
      probability: this.config.model_category === 'classification'
        ? false
        : true,
    }, this.prediction_options, options.predictionOptions);
    const estimatesPredictions = await this.Model.predict(x_indep_matrix_test, predictionOptions);
    const estimatedValues = this.DataSet.reverseColumnMatrix({ vectors: estimatesPredictions, labels: this.y_dependent_labels, });
    const actualValues = this.DataSet.reverseColumnMatrix({ vectors: y_dep_matrix_test, labels: this.y_dependent_labels, });
    const dimension = this.dimension;
    const emptyPrediction = this.y_dependent_labels.reduce((result, label) => {
      result[ label ] = 0;
      return result;
    }, {});
    const estimatesDescaled = estimatedValues.map((val, i) => {
      let inverseTransformedObject = this.DataSet.inverseTransformObject(val);
      if (this.config.model_category === 'timeseries') {
        const scaledInput = x_indep_matrix_test[ i ];
        const [inputObject,] = this.DataSet.reverseColumnMatrix({ vectors: [scaledInput,], labels: this.x_independent_features, }); 
        // console.log({ scaledInput, inputObject });
        const inverseInputObject = this.DataSet.inverseTransformObject(inputObject);
        // console.log({ inverseInputObject });
        const is_location_open = inputObject.is_location_open;
        const { year, month, day, hour, } = inverseInputObject;
        // console.log({
        //   'inverseInputObject.is_location_open':inverseInputObject.is_location_open,
        //   'inputObject.is_location_open':inputObject.is_location_open,
        //   year, month, day, hour,
        //   is_location_open,
        // });
        
        if ((dimension === 'hourly' || dimension === 'daily') && this.entity && !is_location_open) {
          // console.log('before predictionMatrix', predictionMatrix);
          periodic.logger.silly(`Manually fixing prediction on closed - ${dimension} ${year}-${month}-${day}T${hour}`);
          inverseTransformedObject = emptyPrediction;
          // inverseTransformedObject = Object.keys(inverseInputObject).reduce((result, prop) => {
          //   result[ prop ] = (inverseTransformedObject[prop]<0)?0:inverseTransformedObject[prop];
          //   return result;
          // }, {});
          //   console.log('after predictionMatrix', predictionMatrix);
    
        }
      }


      const formattedInverse =  this.use_empty_objects
        ? flatten.unflatten(inverseTransformedObject, { maxDepth: 2, delimiter:flattenDelimiter, })
        : inverseTransformedObject;
      return formattedInverse;
    });
    const actualsDescaled = actualValues.map(val => {
      const inverseTransformedObject = this.DataSet.inverseTransformObject(val);
      return this.use_empty_objects
        ? flatten.unflatten(inverseTransformedObject, { maxDepth: 2, delimiter:flattenDelimiter, })
        : inverseTransformedObject;
    });

    const evaluationDependentLabels = Array.isArray(this.y_raw_dependent_labels) && this.y_raw_dependent_labels.length
      ? this.y_raw_dependent_labels
      : this.y_dependent_labels;
    evaluationDependentLabels.splice(this.max_evaluation_outputs);
    if (this.config.model_category === 'classification') {
      return evaluationDependentLabels.reduce((evaluation, dependent_feature_label)=>{
        evaluation[ dependent_feature_label ] = this.evaluateClassificationAccuracy({ dependent_feature_label, estimatesDescaled, actualsDescaled, });
        return evaluation;
      }, {});
    } else {
      return evaluationDependentLabels.reduce((evaluation, dependent_feature_label)=>{
        evaluation[ dependent_feature_label ] = this.evaluateRegressionAccuracy({ dependent_feature_label, estimatesDescaled, actualsDescaled, });
        return evaluation;
      }, {});
    }
  }
  async timeseriesForecast(options = {}) {
    const { validateSequentialDataSet, } = options;
    const retrain_forecast_model_with_predictions = this.retrain_forecast_model_with_predictions;
    const predictionOptions = Object.assign({ probability: this.config.model_category === 'classification'
      ? false
      : true,
    }, this.prediction_options, options.predictionOptions);
    
    const { forecastDates, forecastDateFirstDataSetDateIndex, lastOriginalForecastDate, raw_prediction_inputs, dimension, datasetDates, } = await this.validateTimeseriesData(options);

    const forecasts = [];
    let forecastPredictionIndex = 0;
    const lastDatasetDate = datasetDates[ datasetDates.length - 1 ];

    //checkt dataset data for sequential
    await Promisie.each(forecastDates, 1, async (forecastDate) => {
      const existingDatasetObjectIndex = forecastDateFirstDataSetDateIndex + forecastPredictionIndex;
      const rawInputPredictionObject = raw_prediction_inputs[ forecastPredictionIndex ];
      let predictionMatrix;
      let predictionInput;
      let datasetScaledObject;
      let datasetUnscaledObject;
      let unscaledRawInputObject;
      let scaledRawInputObject;
      if (forecastDate <= lastOriginalForecastDate) {
        datasetScaledObject = this.DataSet.data[ existingDatasetObjectIndex ];
        datasetUnscaledObject = this.DataSet.inverseTransformObject(datasetScaledObject);
        predictionInput = [
          datasetScaledObject,
        ];
      }
      const lastForecastedValue = (forecasts.length)
        ? forecasts[ forecasts.length - 1 ]
        : {};
      let unscaledLastForecastedValue = (Object.keys(lastForecastedValue).length)
        ? this.DataSet.inverseTransformObject(lastForecastedValue)
        : {};
      unscaledLastForecastedValue = this.y_dependent_labels.reduce((result, feature) => {
        if (typeof unscaledLastForecastedValue[ feature ] !== 'undefined') {
          result[ feature ] = unscaledLastForecastedValue[ feature ];
        }
        return result;
      }, {});
      const unscaledDatasetData = [].concat(this.removedFilterdtrainingData, this.DataSet.data.map(scaledDatum => {
        const unscaledDatum = this.DataSet.inverseTransformObject(scaledDatum);
        // console.log({ unscaledDatum });
        return unscaledDatum;
      }));
      const unscaledNextValueFunctionObject = (Object.keys(this.prediction_inputs_next_value_functions).length > 0)
        ? this.prediction_inputs_next_value_function({
          rawInputPredictionObject,
          forecastDate,
          forecastDates,
          forecastPredictionIndex,
          existingDatasetObjectIndex:existingDatasetObjectIndex+this.removedFilterdtrainingData.length,
          unscaledLastForecastedValue,
          // data: this.DataSet.data.splice(forecastDateFirstDataSetDateIndex, 0, forecasts),
          data: unscaledDatasetData, //this.DataSet.data,
          DataSet: this.DataSet,
          lastDataRow: Object.assign({}, this.DataSet.data[ this.DataSet.data.length - 1 ], datasetUnscaledObject, rawInputPredictionObject, unscaledLastForecastedValue),
        })
        : {};
      const parsedLocalDate = getLocalParsedDate({ date: forecastDate, time_zone: this.prediction_timeseries_time_zone, dimension, });

      unscaledRawInputObject = this.use_empty_objects
        ? Object.assign({},
          this.emptyObject,
          flatten(datasetUnscaledObject || {}, { maxDepth: 2, delimiter:flattenDelimiter, }),
          flatten(unscaledNextValueFunctionObject || {}, { maxDepth: 2, delimiter:flattenDelimiter, }),
          flatten(rawInputPredictionObject || {}, { maxDepth: 2, delimiter:flattenDelimiter, }),
          flatten(unscaledLastForecastedValue, { maxDepth: 2, delimiter:flattenDelimiter, }),
          flatten(parsedLocalDate, { maxDepth: 2, delimiter: flattenDelimiter, }),
        )
        : Object.assign({}, datasetUnscaledObject, unscaledNextValueFunctionObject, rawInputPredictionObject, unscaledLastForecastedValue, parsedLocalDate);

      scaledRawInputObject = this.DataSet.transformObject(unscaledRawInputObject, { checkColumnLength: false, });
      
      predictionInput = [
        scaledRawInputObject,
      ];
      
      if (predictionInput) {
        const inputMatrix = this.DataSet.columnMatrix(this.x_independent_features, predictionInput);
        if (this.validate_trainning_data) {
          this.validatetrainingData({ cross_validate_trainning_data: false, inputMatrix, });
        }
        predictionMatrix = await this.Model.predict(inputMatrix, predictionOptions);
        if (retrain_forecast_model_with_predictions && forecastDate > lastDatasetDate) {
          await this.retrainTimeseriesModel({
            inputMatrix,
            predictionMatrix,
            // fitOptions,
          });
        }
        
        const newPredictionObject = this.DataSet.reverseColumnMatrix({ vectors: predictionMatrix, labels: this.y_dependent_labels, })[ 0 ];
        const forecast = Object.assign({}, datasetScaledObject, scaledRawInputObject, newPredictionObject,
          parsedLocalDate,
          {
            [ this.prediction_timeseries_date_feature ]: forecastDate,
          });

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
  async predictModel(options = {}) {
    const { descalePredictions = true, includeInputs = false, includeEvaluation = true, } = options;
    const predictionOptions = Object.assign({
      probability: this.config.model_category === 'classification'
        ? false
        : true,
    }, this.prediction_options, options.predictionOptions);
    let predictions;
    let newTransformedPredictions;
    let unscaledInputs;
    let __evaluation;
    let [trainingstatus, raw_prediction_inputs, ] = await Promise.all([
      this.checkTrainingStatus(options),
      options.prediction_inputs || await this.getPredictionData(options),
    ]);
    if (includeEvaluation) {
      let { test, train, } = this.getCrosstrainingData(options);
      const testDataSet = new MS.DataSet(test);
      const x_indep_matrix_test = testDataSet.columnMatrix(this.x_independent_features);
      const y_dep_matrix_test = testDataSet.columnMatrix(this.y_dependent_labels);
      const evaluationOptions = Object.assign({}, options, {
        x_indep_matrix_test,
        y_dep_matrix_test,
      });
      const primaryLabel = this.y_dependent_labels[ 0 ];
      const evaluation = await this.evaluateModel(evaluationOptions);
      __evaluation = Object.keys(evaluation).reduce((result, evaluationDependentLabel) => {
        const evalItem = removeEvaluationData(evaluation[ evaluationDependentLabel ]);
        if (evaluationDependentLabel === primaryLabel) {
          result = Object.assign({}, result, evalItem);
          if (this.y_dependent_labels.length > 1) result.data[ evaluationDependentLabel ] = evalItem;
        } else {
          result.data[ evaluationDependentLabel ] = evalItem;
        }
        return result;
      }, { data: {}, });
    }
    if (this.config.model_category === 'timeseries') {
      predictions = await this.timeseriesForecast(options);
    } else {
      // console.log({ raw_prediction_inputs, options });
      unscaledInputs = raw_prediction_inputs;
      /*
      unscaledRawInputObject = this.use_empty_objects
        ? Object.assign({},
          this.emptyObject,
          flatten(datasetUnscaledObject, { maxDepth: 2, delimiter:flattenDelimiter, }),
          flatten(unscaledNextValueFunctionObject, { maxDepth: 2, delimiter:flattenDelimiter, }),
          flatten(rawInputPredictionObject, { maxDepth: 2, delimiter:flattenDelimiter, }),
          flatten(unscaledLastForecastedValue, { maxDepth: 2, delimiter:flattenDelimiter, }),
          flatten(parsedLocalDate, { maxDepth: 2, delimiter: flattenDelimiter, }),
        )
        : Object.assign({}, datasetUnscaledObject, unscaledNextValueFunctionObject, rawInputPredictionObject, unscaledLastForecastedValue, parsedLocalDate);
      */
      this.prediction_inputs = raw_prediction_inputs.map(prediction_value => { 
        const pred_val = this.use_empty_objects
          ? Object.assign({},
            this.emptyObject,
            flatten(prediction_value, { maxDepth: 2, delimiter: flattenDelimiter, })
          )
          : prediction_value;
        return this.DataSet.transformObject(pred_val, { checkColumnLength: false, });
      });
      const inputMatrix = this.DataSet.columnMatrix(this.x_independent_features, this.prediction_inputs);
      if (this.validate_trainning_data) {
        this.validatetrainingData({ cross_validate_trainning_data: false, inputMatrix, });
      }
      newTransformedPredictions = await this.Model.predict(inputMatrix, predictionOptions);
      predictions = this.DataSet.reverseColumnMatrix({ vectors: newTransformedPredictions, labels: this.y_dependent_labels, });
    }
    if (descalePredictions) {
      const emptyPrediction = this.y_dependent_labels.reduce((result, label) => {
        result[ label ] = 0;
        return result;
      }, {});
      const dimension = this.dimension;

      predictions = predictions.map((val, i) => {
        const transformed = this.DataSet.inverseTransformObject(val);
        const is_location_open = transformed.is_location_open;
        let empty = {};
        if ((dimension === 'hourly' || dimension === 'daily') && this.entity && !is_location_open) {
          periodic.logger.silly(`Manually fixing prediction on closed - ${dimension} ${transformed.date}`);
          empty = Object.assign({}, emptyPrediction);
        }
        // console.log({ transformed, empty });
        const descaled = Object.assign(
          {},
          transformed,
          empty,
          (includeInputs && this.config.model_category !== 'timeseries') ? unscaledInputs[ i ] : {},
          { __evaluation, },
        );
        return descaled;
      });
    } else if (includeInputs && this.config.model_category !== 'timeseries') {
      predictions = predictions.map((val, i) => Object.assign(
        {},
        this.DataSet.inverseTransformObject(val),
        includeInputs ? this.prediction_inputs[ i ] : {},
        { __evaluation, },
      ));
    }
    if (this.use_empty_objects) {
      predictions = predictions.map(pred => flatten.unflatten(pred, { maxDepth: 2, delimiter: flattenDelimiter, }));
    }
    // console.log({ predictions });
    return predictions;
  }
  async runModel(options = {}) {
    const { reevaluate, } = options;
    let evaluation;
    await this.checkTrainingStatus(options);
    if (reevaluate) {
      evaluation = await this.evaluateModel(options);
    }
    const model = await this.Model;
    return {
      model,
      evaluation,
    };
  }
}

module.exports = {
  RepetereModel,
  addMockDataToDataSet,
  removeMockDataToDataSet,
  flattenDelimiter,
  isClosedOnDay,
  getOpenHour,
  getIsOutlier,
};