import * as ModelXData from '@modelx/data/src/index';
import * as ModelXDataTypes from '@modelx/data/src/DataSet';
import * as ModelXModel from '@modelx/model/src/index';
import * as ModelXModelTypes from '@modelx/model/src/model_interface';
import { ISOOptions, durationToDimensionProperty, BooleanAnswer, getOpenHour, getIsOutlier, Dimensions, Entity, ParsedDate, getLuxonDateTime, dimensionDurations, flattenDelimiter, addMockDataToDataSet, removeMockDataFromDataSet, training_on_progress, TrainingProgressCallback, } from './constants';
import { dimensionDates } from './features';
import * as Luxon from 'luxon';

export enum ModelTypes {
  FAST_FORECAST = 'ai-fast-forecast',
  FORECAST = 'ai-forecast',
  TIMESERIES_REGRESSION_FORECAST = 'ai-timeseries-regression-forecast',
  LINEAR_REGRESSION ='ai-linear-regression',
  REGRESSION = 'ai-regression',
  CLASSIFICATION = 'ai-classification',
  LOGISTIC_CLASSIFICATION='ai-logistic-classification'
}
export enum ModelCategories {
  PREDICTION='regression',
  DECISION ='classification',
  FORECAST='timeseries',
  RECOMMENDATION='recommendation',
  REACTION='reinforced',
}
export type GetDataSetProperties = {
  nextValueIncludeForecastDate?: boolean;
  nextValueIncludeForecastTimezone?: boolean;
  nextValueIncludeForecastAssociations?: boolean;
  nextValueIncludeDateProperty?: boolean;
  nextValueIncludeParsedDate?: boolean;
  nextValueIncludeLocalParsedDate?: boolean;
  nextValueIncludeForecastInputs?: boolean;
  dimension?: Dimensions;
  DataSetData?: ModelXDataTypes.Data;
};
export type ModelStatus = {
  trained: boolean;
  lastTrained?: Date;
};
export type ModelConfiguration = {
  preprocessing_feature_column_options?: ModelXDataTypes.DataSetTransform;
  training_feature_column_options?: ModelXDataTypes.DataSetTransform;
  use_preprocessing_on_trainning_data?: boolean;
  use_mock_dates_to_fit_trainning_data?: boolean;
  use_cache?: boolean;
  model_type: ModelTypes;
  model_category?: ModelCategories;
  next_value_functions?: GeneratedFunctionDefinitionsList;

  training_data_filter_function_body?: string;
  training_data_filter_function?: DataFilterFunction;
  training_size_values?: number;
  training_progress_callback?: TrainingProgressCallback;

  prediction_inputs?: ModelXDataTypes.Data;
  trainingData?: ModelXDataTypes.Data;

  prediction_inputs_next_value_functions?: GeneratedFunctionDefinitionsList;
  prediction_timeseries_time_zone?: string;
  prediction_timeseries_date_feature?: string;
  prediction_timeseries_date_format?: string;
  prediction_timeseries_dimension_feature?: string;
  prediction_timeseries_start_date?: Date;
  prediction_timeseries_end_date?: Date;
  dimension?: Dimensions;
  entity?: Entity;
  DataSet?: ModelXData.DataSet;
  emptyObject?: ModelXDataTypes.Datum;
  mockEncodedData?: ModelXDataTypes.Data;
  x_independent_features?: string[];
  y_dependent_labels?: string[];
  x_raw_independent_features?: string[];
  y_raw_dependent_labels?: string[];
  testDataSet?: ModelXData.DataSet;
  trainDataSet?: ModelXData.DataSet; 
  x_indep_matrix_train?: ModelXDataTypes.Matrix;
  x_indep_matrix_test?: ModelXDataTypes.Matrix;
  y_dep_matrix_train?: ModelXDataTypes.Matrix;
  y_dep_matrix_test?: ModelXDataTypes.Matrix;
  Model?: ModelXModel.TensorScriptModelInterface;
  training_options?: ModelXModelTypes.TensorScriptOptions;
  validate_training_data?: boolean;
  cross_validation_options?: CrossValidationOptions;
  debug?: boolean;
};
export type ModelOptions = {
  trainingData?: ModelXDataTypes.Data;
};
export interface ModelContext  {
  config: ModelConfiguration;
  status: ModelStatus;
  trainingData: ModelXDataTypes.Data;
  prediction_inputs_next_value_functions?: GeneratedFunctionDefinitionsList;
  training_data_filter_function_body?: string;
  dimension?: Dimensions;
  entity?: Entity;
  DataSet?: ModelXData.DataSet;
};
export type ModelTrainningOptions = {
  cross_validate_training_data?: boolean;
  use_next_value_functions_for_training_data?: boolean;
  use_mock_dates_to_fit_trainning_data?: boolean;
  trainingData?: ModelXDataTypes.Data;
  fixPredictionDates?: boolean;
  prediction_inputs?: ModelXDataTypes.Data;
  getPredictionInputPromise?: GetPredicitonData;
};
export const modelMap = {
  'ai-fast-forecast': ModelXModel.LSTMTimeSeries,
  'ai-forecast': ModelXModel.LSTMMultivariateTimeSeries,
  'ai-timeseries-regression-forecast': ModelXModel.MultipleLinearRegression,
  'ai-linear-regression': ModelXModel.MultipleLinearRegression,
  'ai-regression': ModelXModel.DeepLearningRegression,
  'ai-classification': ModelXModel.DeepLearningClassification,
  'ai-logistic-classification': ModelXModel.LogisticRegression,
};
export const modelCategoryMap = {
  [ModelTypes.FAST_FORECAST]: ModelCategories.FORECAST,
  [ModelTypes.FORECAST]: ModelCategories.FORECAST,
  [ModelTypes.TIMESERIES_REGRESSION_FORECAST]: ModelCategories.FORECAST,
  [ModelTypes.LINEAR_REGRESSION]: ModelCategories.PREDICTION,
  [ModelTypes.REGRESSION]: ModelCategories.PREDICTION,
  [ModelTypes.CLASSIFICATION]: ModelCategories.DECISION,
  [ModelTypes.LOGISTIC_CLASSIFICATION]: ModelCategories.DECISION,
};
export type CrossValidationOptions = {
  folds?: number,
  random_state?: number,
  test_size?: number,
  train_size?: number,
  return_array?: boolean,
  parse_int_train_size?: boolean,
}
export type GeneratedFunctionDefinitionsObject = {
  [index: string]: GeneratedStatefulFunctionObject;
}
export type GeneratedFunctionDefinitionsList = GeneratedStatefulFunctionObject[];
export type GeneratedStatefulFunctionState = any;
export type GeneratedStatefulFunctionProps = {
  Luxon: any;
  ModelXData: any;
};
export type GeneratedStatefulFunctionObject = {
  variable_name: string;
  function_body: string;
};
export type GeneratedStatefulFunctions = {
  [index: string]: GeneratedStatefulFunction;
}
export type GeneratedStatefulFunctionParams = {
  props?: GeneratedStatefulFunctionProps;
  function_name_prefix?: string;
} & GeneratedStatefulFunctionObject;
export type GeneratedStatefulFunction = (state: GeneratedStatefulFunctionState) => number;
export type SumPreviousRowsOptions = {
  property: string;
  rows: number;
  offset: number;
};
export type SumPreviousRowContext = {
  data: ModelXDataTypes.Data,
  DataSet: ModelXData.DataSet,
  offset: number,
  reverseTransform?: boolean,
  debug?: boolean;
};
export type ForecastPredictionNextValueState = {
  lastDataRow?: ModelXDataTypes.Datum;
  forecastDate?: Date;
  forecastDates?: Date[];
  forecastPredictionIndex?: number;
  sumPreviousRows?: sumPreviousRows;
  data: ModelXDataTypes.Data;
  DataSet: ModelXDataTypes.DataSet;
  existingDatasetObjectIndex: number;
  reverseTransform?: boolean;
  isOpen?: (...args:any[])=>BooleanAnswer;
  isOutlier?: (...args:any[])=>BooleanAnswer;
  parsedDate?: ParsedDate;
  rawInputPredictionObject?: ModelXDataTypes.Datum;
  unscaledLastForecastedValue?: ModelXDataTypes.Datum;
};
export type ForecastHelperNextValueData = {
  date?: Date;
  origin_time_zone?: string;
  associated_data_location?: string;
  associated_data_product?: string;
  associated_data_entity?: string;
  forecast_entity_type?: string;
  forecast_entity_title?: string;
  forecast_entity_name?: string;
  forecast_entity_id?: string;
} & ModelXDataTypes.Datum;
export type TimeseriesDimension = {
  dimension: Dimensions;
  dateFormat?: string;
}

export interface GetPredicitonData{
  ({ }): Promise<ModelXDataTypes.Data>;
}
/**
 * returns a Datum used in next forecast prediction input
 */
export type ForecastPredictionInputNextValueFunction = (state: ForecastPredictionNextValueState) => ModelXDataTypes.Datum;
export type DataFilterFunction = (datum:ModelXDataTypes.Datum, datumIndex:number) => boolean;

/**
 * Takes an object that describes a function to be created from a function body string
 * @example 
getGeneratedStatefulFunction({ variable_name='myFunctionName', function_body='return 3', function_name_prefix='customFunction_', }) => 
function customFunction_myFunctionName(state){ 
  'use strict';
  return 3;
}
 */
export function getGeneratedStatefulFunction({ variable_name='', function_body='', props, function_name_prefix='next_value_', }:GeneratedStatefulFunctionParams):GeneratedStatefulFunction {
  const func = Function('state', `'use strict';${function_body}`).bind({ props, });
  Object.defineProperty(
    func,
    'name',
    {
      value: `${function_name_prefix}${variable_name}`,
    });
    return func;
}
export interface sumPreviousRows{
  (options: SumPreviousRowsOptions): number;
}
  
export function sumPreviousRows(this: SumPreviousRowContext, options: SumPreviousRowsOptions): number {
  const { property, rows, offset = 1, } = options;
  const reverseTransform = Boolean(this.reverseTransform);
  const OFFSET = (typeof this.offset === 'number') ? this.offset : offset;
  const index = OFFSET; //- 1;
  // console.log({index,OFFSET,'index-rows':index-rows})
  // if (this.debug) {
    if (OFFSET < 1) throw new RangeError(`Offset must be larger than or equal to the default of 1 [property:${property}]`);
    // if (index-rows < 0) throw new RangeError(`previous index must be greater than 0 [index-rows:${index-rows}]`);
  // }
  const begin = index;
  const end = rows+index;
  const sum = this.data
    .slice(begin, end)
    // .slice(index-rows, index)
    // .slice(index, rows + index)
    .reduce((result, val) => {
      //@ts-ignore
      const value = (reverseTransform) ? this.DataSet.inverseTransformObject(val) : val;
      // console.log({ value, result, });
      result = result + value[ property ];
      return result;
    }, 0);
  // const sumSet = this.data
  //   .slice(begin, end).map(ss => ss[ property ]);
  // console.log('this.data.length', this.data.length,'this.data.map(d=>d[property])',this.data.map(d=>d[property]), { sumSet, property, offset, rows, sum, reverseTransform, index, begin, end, });

  return sum;
}

export class ModelX implements ModelContext {
  config: ModelConfiguration;
  status: ModelStatus;
  trainingData: ModelXDataTypes.Data;
  removedFilterdtrainingData: ModelXDataTypes.Data;
  use_empty_objects: boolean;
  use_preprocessing_on_trainning_data: boolean;
  use_mock_encoded_data: boolean;
  validate_training_data:  boolean;
  x_independent_features: string[];
  y_dependent_labels: string[];
  x_raw_independent_features: string[];
  y_raw_dependent_labels: string[];
  original_data_test:ModelXDataTypes.Data;
  original_data_train: ModelXDataTypes.Data;
  testDataSet: ModelXData.DataSet;
  trainDataSet: ModelXData.DataSet; 

  prediction_inputs?: ModelXDataTypes.Data;

  x_indep_matrix_train: ModelXDataTypes.Matrix;
  x_indep_matrix_test: ModelXDataTypes.Matrix;
  y_dep_matrix_train: ModelXDataTypes.Matrix;
  y_dep_matrix_test: ModelXDataTypes.Matrix;
  Model: ModelXModel.TensorScriptModelInterface;
  training_options: ModelXModelTypes.TensorScriptOptions;
  cross_validation_options: CrossValidationOptions;
  training_size_values?: number;
  training_model_loss?: number;

  preprocessing_feature_column_options: ModelXDataTypes.DataSetTransform;
  training_feature_column_options: ModelXDataTypes.DataSetTransform;
  training_data_filter_function_body?: string;
  training_data_filter_function?: DataFilterFunction;
  training_progress_callback: TrainingProgressCallback;
  prediction_inputs_next_value_functions: GeneratedFunctionDefinitionsList;
  prediction_inputs_next_value_function?: ForecastPredictionInputNextValueFunction;
  prediction_timeseries_time_zone: string;
  prediction_timeseries_date_feature: string;
  prediction_timeseries_date_format?: string;
  prediction_timeseries_dimension_feature: string;
  prediction_timeseries_start_date?: Date | string;
  prediction_timeseries_end_date?: Date | string;
  dimension?: Dimensions;
  entity?: Entity;
  DataSet: ModelXData.DataSet;
  forecastDates: Date[];
  emptyObject: ModelXDataTypes.Datum;
  mockEncodedData: ModelXDataTypes.Data;
  debug: boolean;

  constructor(configuration: ModelConfiguration, options: ModelOptions = {}) {
    this.debug = typeof configuration.debug === 'boolean' ? configuration.debug : true;
    this.config = {
      use_cache: typeof configuration.use_cache === 'boolean' ? configuration.use_cache : true,
      model_type: configuration.model_type || ModelTypes.REGRESSION,
      use_mock_dates_to_fit_trainning_data: configuration.use_mock_dates_to_fit_trainning_data,
    };
    this.config.model_category = modelCategoryMap[this.config.model_type];
    this.status = {
      trained: false,
      lastTrained: undefined,
    };
    // this.modelDocument = Object.assign({ model_options: {}, model_configuration: {}, }, configuration.modelDocument);
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
    this.DataSet = configuration.DataSet || new ModelXData.DataSet();
    // this.max_evaluation_outputs = configuration.max_evaluation_outputs || 5;
    this.testDataSet = configuration.testDataSet || new ModelXData.DataSet();
    this.trainDataSet = configuration.trainDataSet || new ModelXData.DataSet();
    this.x_indep_matrix_train = configuration.x_indep_matrix_train || [];
    this.x_indep_matrix_test = configuration.x_indep_matrix_test || [];
    this.y_dep_matrix_train = configuration.y_dep_matrix_train || [];
    this.y_dep_matrix_test = configuration.y_dep_matrix_test || [];
    this.x_independent_features = configuration.x_independent_features || [];
    this.x_raw_independent_features = configuration.x_raw_independent_features || [];
    this.y_dependent_labels = configuration.y_dependent_labels || [];
    this.y_raw_dependent_labels = configuration.y_raw_dependent_labels || [];
    this.training_size_values = configuration.training_size_values;
    this.cross_validation_options = {
      train_size: 0.7,
      ...configuration.cross_validation_options,
    };
    this.preprocessing_feature_column_options = configuration.preprocessing_feature_column_options || {};
    this.training_feature_column_options = configuration.training_feature_column_options || {};
    const customFit = (configuration.training_options && configuration.training_options.fit) ? configuration.training_options.fit : {};
    this.training_options = {
      stateful: true,
      features: this.x_independent_features.length,
      ...configuration.training_options,
      fit: {
        epochs: 100,
        batchSize: 5,
        verbose: 0,
        callbacks: {
          // onTrainBegin: function(logs: any){
          //   console.log('onTrainBegin', { logs });
          // },
          // onTrainEnd: function(logs: any){
          //   console.log('onTrainBegin', { logs });
          // },
          // onEpochBegin: function(epoch, logs){
          //   console.log('onEpochBegin', { epoch, logs });
          // },
          // onEpochEnd: function(epoch, logs){
          //   console.log('onEpochEnd', { epoch, logs });
          // },
          // onBatchBegin: function(batch, logs){
          //   console.log('onBatchBegin', { batch, logs });
          // },
          // onBatchEnd: function(batch, logs){
          //   console.log('onBatchEnd', { batch, logs });
          // },
          // onYield: function(epoch, batch, logs){
          //   console.log('onYield', { epoch, batch, logs });
          // }
        },
        ...customFit,
      },
    };
    this.training_progress_callback = configuration.training_progress_callback || training_on_progress;
    if (this.training_options && this.training_options.fit && this.training_options.fit.callbacks && this.training_options.fit.epochs) {
      this.training_options.fit.callbacks.onEpochEnd = (epoch, logs) => {
        const totalEpochs = (this.training_options.fit)?this.training_options.fit.epochs as number:0;
        const completion_percentage = (epoch / totalEpochs) || 0;
        this.training_model_loss = logs.loss;
        this.training_progress_callback({ completion_percentage, loss: logs.loss, epoch, logs, status: 'training', defaultLog: this.debug, });
      }
      this.training_options.fit.callbacks.onTrainEnd = (logs) => {
        const totalEpochs = (this.training_options.fit)?this.training_options.fit.epochs as number:0;
        const completion_percentage= 1;
        this.training_progress_callback({ completion_percentage, loss: this.training_model_loss||0, epoch:totalEpochs, logs, status:'trained', defaultLog: this.debug, });
      }
      this.training_options.fit.callbacks.onTrainBegin = (logs) => {
        const totalEpochs = (this.training_options.fit)?this.training_options.fit.epochs as number:0;
        const completion_percentage= 0;
        this.training_progress_callback({ completion_percentage, loss: logs.loss, epoch:totalEpochs, logs, status:'initializing', defaultLog: this.debug, });
      }
    }
    // this.prediction_options = configuration.prediction_options || [];
    this.prediction_inputs = configuration.prediction_inputs || [];
    this.prediction_timeseries_time_zone = configuration.prediction_timeseries_time_zone || 'utc';
    this.prediction_timeseries_date_feature = configuration.prediction_timeseries_date_feature || 'date';
    this.prediction_timeseries_date_format = configuration.prediction_timeseries_date_format;
    this.validate_training_data = typeof configuration.validate_training_data === 'boolean' ? configuration.validate_training_data : true;
    // this.retrain_forecast_model_with_predictions = configuration.retrain_forecast_model_with_predictions || this.modelDocument.model_configuration.retrain_forecast_model_with_predictions;
    this.use_preprocessing_on_trainning_data = typeof configuration.use_preprocessing_on_trainning_data !== 'undefined'
      ? configuration.use_preprocessing_on_trainning_data
      : true;
    // this.use_mock_dates_to_fit_trainning_data = configuration.use_mock_dates_to_fit_trainning_data || this.modelDocument.model_options.use_mock_dates_to_fit_trainning_data;
    // this.use_next_value_functions_for_training_data = configuration.use_next_value_functions_for_training_data || this.modelDocument.model_options.use_next_value_functions_for_training_data;
    this.prediction_timeseries_start_date = configuration.prediction_timeseries_start_date;
    this.prediction_timeseries_end_date = configuration.prediction_timeseries_end_date;
    this.prediction_timeseries_dimension_feature = configuration.prediction_timeseries_dimension_feature || 'dimension';
    this.prediction_inputs_next_value_functions = configuration.prediction_inputs_next_value_functions || configuration.next_value_functions || [];
    this.Model = configuration.Model || new ModelXModel.TensorScriptModelInterface();
    this.original_data_test = [];
    this.original_data_train = [];
    this.forecastDates = [];
    return this;
  }
  /**
   * Attempts to automatically figure out the time dimension of each date feature (hourly, daily, etc) and the format of the date property (e.g. JS Date Object, or ISO String, etc) from the dataset data
   */
  getTimeseriesDimension(options: { dimension?: Dimensions; DataSetData?: ModelXDataTypes.Datum } = {}): TimeseriesDimension {
    let timeseriesDataSetDateFormat = this.prediction_timeseries_date_format;
    //@ts-ignore
    let timeseriesForecastDimension = options.dimension || this.dimension;
    //@ts-ignore
    let DataSetData:ModelXDataTypes.Datum = options.DataSetData || this.DataSet && this.DataSet.data ||[];
    if (timeseriesForecastDimension && timeseriesDataSetDateFormat) {
      this.dimension = timeseriesForecastDimension;
      return {
        dimension: timeseriesForecastDimension,
        dateFormat: timeseriesDataSetDateFormat,
      };
    }
    if (typeof timeseriesForecastDimension !== 'string' && DataSetData && Array.isArray(DataSetData) && DataSetData.length) {
      // console.log({
      //   options, DataSetData, durationToDimensionProperty,
      // });
      if (DataSetData.length && DataSetData[0][this.prediction_timeseries_dimension_feature]) {
        timeseriesForecastDimension = DataSetData[0][this.prediction_timeseries_dimension_feature];
      } 
      if (DataSetData.length > 1 && DataSetData[0][this.prediction_timeseries_date_feature]) {
        const recentDateField = DataSetData[ 1 ][ this.prediction_timeseries_date_feature ];
        const parsedRecentDateField = getLuxonDateTime({
          dateObject: recentDateField,
          dateFormat: this.prediction_timeseries_date_format,
        });
        timeseriesDataSetDateFormat = parsedRecentDateField.format;
        const test_end_date = parsedRecentDateField.date;
        const test_start_date = getLuxonDateTime({
          dateObject: DataSetData[ 0 ][ this.prediction_timeseries_date_feature ],
          dateFormat: this.prediction_timeseries_date_format,
        }).date;
        // console.log({parsedRecentDateField})

        //@ts-ignore
        const durationDifference = test_end_date.diff(test_start_date, dimensionDurations).toObject(); 
        // timeseriesForecastDimension
        const durationDimensions:string[] = Object.keys(durationDifference).filter(diffProp => durationDifference[ diffProp ] === 1);
        // console.log({
        //   // test_start_date, test_end_date,
        //   durationDifference, durationDimensions,
        // });
        if (durationDimensions.length === 1) {
          timeseriesForecastDimension = durationToDimensionProperty[ durationDimensions[0] as 'years'|'months'|'weeks'|'days'|'hours'] as Dimensions;
        }
      }
    }
    if (typeof timeseriesForecastDimension !== 'string' || Object.keys(dimensionDates).indexOf(timeseriesForecastDimension) === -1) throw new ReferenceError(`Invalid timeseries dimension (${timeseriesForecastDimension})`);
    this.prediction_timeseries_date_format = timeseriesDataSetDateFormat;
    this.dimension = timeseriesForecastDimension as Dimensions;
    if (typeof timeseriesDataSetDateFormat === 'undefined') throw new ReferenceError('Invalid timeseries date format');
    return {
      dimension: timeseriesForecastDimension,
      dateFormat: timeseriesDataSetDateFormat,
    };
    // console.log({timeseriesForecastDimension})
  }
  getForecastDates(options = {}) {
    const start = (this.prediction_timeseries_start_date  && this.prediction_timeseries_start_date instanceof Date)
      ? Luxon.DateTime.fromJSDate(this.prediction_timeseries_start_date).toISO(ISOOptions)
      : this.prediction_timeseries_start_date;
    const end = (this.prediction_timeseries_end_date instanceof Date)
      ? Luxon.DateTime.fromJSDate(this.prediction_timeseries_end_date).toISO(ISOOptions)
      : this.prediction_timeseries_end_date;
    if (!this.dimension) throw ReferenceError('Forecasts require a timeseries dimension');
    else if (!start || !end) throw ReferenceError('Start and End Forecast Dates are required');
    
    this.forecastDates = dimensionDates[ this.dimension ]({
      start,
      end,
      time_zone: this.prediction_timeseries_time_zone,
    });
    return this.forecastDates;
  }
  addMockData({ use_mock_dates = false, } = {}) {
    if (use_mock_dates && this.use_mock_encoded_data && this.DataSet) this.DataSet = addMockDataToDataSet(this.DataSet, { includeConstants: true, mockEncodedData: this.mockEncodedData, }); 
    else if (use_mock_dates &&  this.DataSet) this.DataSet = addMockDataToDataSet(this.DataSet, {});
    else if (this.use_mock_encoded_data &&  this.DataSet) this.DataSet = addMockDataToDataSet(this.DataSet, { includeConstants: false, mockEncodedData: this.mockEncodedData, });
  }
  removeMockData({ use_mock_dates = false, } = {}) {
    if (use_mock_dates && this.use_mock_encoded_data && this.DataSet) this.DataSet = removeMockDataFromDataSet(this.DataSet, { includeConstants: true, mockEncodedData: this.mockEncodedData, }); 
    else if (use_mock_dates && this.DataSet) this.DataSet = removeMockDataFromDataSet(this.DataSet, {});
    else if (this.use_mock_encoded_data && this.DataSet) this.DataSet = removeMockDataFromDataSet(this.DataSet, { includeConstants: false, mockEncodedData: this.mockEncodedData, });
  }
  getCrosstrainingData() {
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
        : parseInt((this.DataSet.data.length * trainSizePercentage).toString());
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
      // : {train:ModelXDataTypes.Data,test:ModelXDataTypes.Data}
      const testTrainSplit = ModelXData.cross_validation.train_test_split(this.DataSet.data, this.cross_validation_options) as {train:ModelXDataTypes.Data,test:ModelXDataTypes.Data};
      train = testTrainSplit.train;
      test = testTrainSplit.test;
    }
    return { test, train, };
  }
  
  validateTrainingData({ cross_validate_training_data, inputMatrix, }: { cross_validate_training_data?: boolean; inputMatrix?: ModelXDataTypes.Matrix; } = {
    inputMatrix:undefined,
  }) {
    const checkValidationData = (inputMatrix) ? inputMatrix : this.x_indep_matrix_train;
    const dataType = (inputMatrix) ? 'Prediction' : 'Trainning';
    checkValidationData.forEach((trainningData, i) => { 
      // console.log({ trainningData, i });
      trainningData.forEach((trainningVal, v) => {
        if (typeof trainningVal !== 'number' || isNaN(trainningVal)) {
          // // console.error(`Trainning data (${i}) has an invalid ${this.x_independent_features[ v ]}. Value: ${trainningVal}`);
          // const originalData = (inputMatrix)
          //   ? inputMatrix[ i ]
          //   : (cross_validate_training_data)
          //     ? this.original_data_test[ i ]
          //     : this.trainingData[ i ];
          // const [scaledTrainningValue, ] = this.DataSet.reverseColumnMatrix({ vectors: [trainningData, ], labels: this.x_independent_features, });
          // const inverseTransformedObject = this.DataSet.inverseTransformObject(scaledTrainningValue, {});
          // // console.log({ i, trainningVal, v, scaledTrainningValue, inverseTransformedObject, originalData, });

          throw new TypeError(`${dataType} data (${i}) has an invalid ${this.x_independent_features[ v ]}. Value: ${trainningVal}`);
        }
      });
    });
    return true;
  }
  
  async getDataSetProperties(options :GetDataSetProperties= {}) {
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
   
    const props = { Luxon, ModelXData, };
    const nextValueFunctions = this.prediction_inputs_next_value_functions.reduce((functionsObject:GeneratedStatefulFunctions, func:GeneratedStatefulFunctionObject) => {
      functionsObject[func.variable_name] = getGeneratedStatefulFunction({
        ...func,
        props,
        function_name_prefix: 'next_value_',
      });
      return functionsObject;
    }, {});
    const filterFunctionBody = `'use strict';
    ${this.training_data_filter_function_body}
    `;
    this.training_data_filter_function = (this.training_data_filter_function_body)
      ? Function('datum', 'datumIndex', filterFunctionBody).bind({ props, })
      : this.training_data_filter_function;
    if (typeof this.training_data_filter_function === 'function' && this.training_data_filter_function.name && this.training_data_filter_function.name.includes('anonymous')) Object.defineProperty(this.training_data_filter_function, 'name', { value: 'training_data_filter_function' });
    this.prediction_inputs_next_value_function = function nextValueFunction(state:ForecastPredictionNextValueState) {
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
      const helperNextValueData:ForecastHelperNextValueData = {};
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
      if (nextValueIncludeParsedDate && state.forecastDate) {
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
    if (this.config.model_category === ModelCategories.FORECAST) {
      this.dimension = this.getTimeseriesDimension(options).dimension;
    }
    // console.log('this', this);
    // if (this.dimension && this.config.model_category === ModelCategories.FORECAST && this.prediction_inputs &&!this.prediction_inputs.length) {
    //   console.log('SET FORECAST DATES')
    //   this.prediction_inputs = this.trainingData;
    //   this.getForecastDates();
    // }
    if (this.dimension && this.config.model_category === ModelCategories.FORECAST && this.prediction_inputs && this.prediction_inputs.length && (!this.prediction_timeseries_start_date || !this.prediction_timeseries_end_date)) {
      if (!this.prediction_timeseries_start_date) this.prediction_timeseries_start_date = this.prediction_inputs[0][this.prediction_timeseries_date_feature];
      if (!this.prediction_timeseries_end_date) this.prediction_timeseries_end_date = this.prediction_inputs[this.prediction_inputs.length - 1][this.prediction_timeseries_date_feature];
      //  || !this.prediction_timeseries_end_date
      // this.getForecastDates();
    }
    if (this.dimension && this.config.model_category === ModelCategories.FORECAST && this.prediction_timeseries_start_date && this.prediction_timeseries_end_date) {
      this.getForecastDates();
    }
  }
  async validateTimeseriesData(options: {
    fixPredictionDates?: boolean;
    prediction_inputs?: ModelXDataTypes.Data;
    getPredictionInputPromise?: GetPredicitonData;
  } = {}) {
    const { fixPredictionDates = true, } = options;
    const dimension = this.dimension as Dimensions;
    let raw_prediction_inputs = options.prediction_inputs || await this.getPredictionData(options) || [];
    // console.log('ORIGINAL raw_prediction_inputs', raw_prediction_inputs);
    // console.log('this.DataSet', this.DataSet);

    const lastOriginalDataSetIndex = this.DataSet.data.length - 1;
    const lastOriginalDataSetObject = this.DataSet.data[ lastOriginalDataSetIndex ];
    let forecastDates = this.forecastDates;
    const datasetDateOptions = getLuxonDateTime({
      dateObject: lastOriginalDataSetObject[ this.prediction_timeseries_date_feature ],
      dateFormat: this.prediction_timeseries_date_format,
      time_zone: this.prediction_timeseries_time_zone,
    });
    const lastOriginalForecastDateTimeLuxon = datasetDateOptions.date;
    const lastOriginalForecastDateTimeFormat = datasetDateOptions.format;
    const lastOriginalForecastDate = lastOriginalForecastDateTimeLuxon.toJSDate();
    const datasetDates = (lastOriginalDataSetObject[ this.prediction_timeseries_date_feature ] instanceof Date)
      ? this.DataSet.columnArray(this.prediction_timeseries_date_feature)
      : this.DataSet.columnArray(this.prediction_timeseries_date_feature).map((originalDateFormattedDate:Date|string) => getLuxonDateTime({
        dateObject: originalDateFormattedDate,
        dateFormat: lastOriginalForecastDateTimeFormat,
        time_zone: this.prediction_timeseries_time_zone,
      }).date.toJSDate());
    const firstDatasetDate = datasetDates[ 0 ];
    // console.log({ fixPredictionDates, forecastDates, datasetDates, firstDatasetDate, });
    if (fixPredictionDates && typeof this.prediction_timeseries_start_date === 'string') this.prediction_timeseries_start_date = Luxon.DateTime.fromISO(this.prediction_timeseries_start_date).toJSDate();
    if (fixPredictionDates && this.prediction_timeseries_start_date && this.prediction_timeseries_start_date < firstDatasetDate) { 
      this.prediction_timeseries_start_date = firstDatasetDate;
      forecastDates = this.getForecastDates();
      console.log('modified',{ forecastDates, });
    } 
    // console.log({ forecastDates, });
    let forecastDateFirstDataSetDateIndex;
    if (forecastDates.length) {
      forecastDateFirstDataSetDateIndex = datasetDates.findIndex((DataSetDate: Date) => DataSetDate.valueOf() === forecastDates[0].valueOf());
      // console.log({ forecastDateFirstDataSetDateIndex });
      // const forecastDateLastDataSetDateIndex = forecastDates.findIndex(forecastDate => forecastDate.valueOf() === lastOriginalForecastDate.valueOf());
      if(forecastDateFirstDataSetDateIndex === -1){
        const lastDataSetDate = datasetDates[ datasetDates.length - 1 ];
        const firstForecastInputDate = forecastDates[ 0 ];
        const firstForecastDateFromInput = Luxon.DateTime.fromJSDate(lastDataSetDate, { zone:this.prediction_timeseries_time_zone, }).plus({ [ timeProperty[ dimension ] ]: 1, });
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
          raw_prediction_inputs = raw_prediction_inputs.map((raw_input:ModelXDataTypes.Datum) => {
            return Object.assign({}, raw_input, {
              [ this.prediction_timeseries_date_feature ]: getLuxonDateTime({
                dateObject: raw_input[ this.prediction_timeseries_date_feature ],
                dateFormat: lastOriginalForecastDateTimeFormat,
                time_zone: this.prediction_timeseries_time_zone,
              }).date.toJSDate(),
            });
          });
        }
        const firstRawInputDate = raw_prediction_inputs[ 0 ][ this.prediction_timeseries_date_feature ];
        const firstForecastDate = forecastDates[ 0 ];
        let raw_prediction_input_dates = raw_prediction_inputs.map((raw_input:ModelXDataTypes.Datum) => raw_input[ this.prediction_timeseries_date_feature ]);
        if (fixPredictionDates && firstForecastDate > firstRawInputDate) {
          // console.log('FIX INPUTS');
          const matchingInputIndex = raw_prediction_input_dates.findIndex((inputPredictionDate:Date) => inputPredictionDate.valueOf() === firstForecastDate.valueOf());
          // const updated_raw_prediction_input_dates = raw_prediction_input_dates.slice(matchingInputIndex);
          raw_prediction_inputs = raw_prediction_inputs.slice(matchingInputIndex);
          raw_prediction_input_dates = raw_prediction_inputs.map((raw_input:ModelXDataTypes.Datum) => raw_input[ this.prediction_timeseries_date_feature ]);

          // console.log({
          //   matchingInputIndex,
          //   // updated_raw_prediction_input_dates,
          //   forecastDates
          // });
        }
        // console.log({ firstRawInputDate, firstForecastDate, datasetDates, forecastDates, raw_prediction_input_dates, });

        //make sure forecast prediction is inclusive of original dataset
        const rawPredictionForecastDateIndex = forecastDates.findIndex((forecastDate: Date) => forecastDate.valueOf() === raw_prediction_input_dates[0].valueOf());
        // console.log({ rawPredictionForecastDateIndex, raw_prediction_input_dates, });
        if (rawPredictionForecastDateIndex < 0) throw new RangeError(`Prediction Input First Date(${raw_prediction_input_dates[0]}) must be inclusive of forecastDates ( ${forecastDates[0]} - ${forecastDates[forecastDates.length - 1]})`);
        // if (raw_prediction_inputs[ 0 ][ this.prediction_timeseries_date_feature ].valueOf() !== forecastDates[ 0 ].valueOf()) throw new RangeError(`Prediction input dates (${raw_prediction_inputs[ 0 ][ this.prediction_timeseries_date_feature ]} to ${raw_prediction_inputs[ raw_prediction_inputs.length - 1 ][ this.prediction_timeseries_date_feature ]}) must match forecast date range (${forecastDates[ 0 ]} to ${forecastDates[ forecastDates.length - 1 ]})`);
      }
      //      this.prediction_inputs = raw_prediction_inputs.map(prediction_value=>this.DataSet.transformObject(prediction_value));
    }
    
    return { forecastDates, forecastDateFirstDataSetDateIndex, lastOriginalForecastDate, raw_prediction_inputs, dimension, datasetDates, };
  }
  async getPredictionData(options:{getPredictionInputPromise?:GetPredicitonData} = {}) {
    if (typeof options.getPredictionInputPromise === 'function') {
      this.prediction_inputs = await options.getPredictionInputPromise({ModelX:this});
    }
    return this.prediction_inputs;
  }
  /**
   * 
   * @param options 
   */
  async trainModel(options:ModelTrainningOptions = {}) {
    const { cross_validate_training_data=true, use_next_value_functions_for_training_data=false, use_mock_dates_to_fit_trainning_data=false, } = options;
    const modelObject = modelMap[this.config.model_type];
    const use_mock_dates = use_mock_dates_to_fit_trainning_data || this.config.use_mock_dates_to_fit_trainning_data;
    let trainingData = options.trainingData || this.trainingData || [];
    // if (!Array.isArray(trainingData) || !trainingData.length) trainingData = [];
    trainingData = new Array().concat(trainingData) as ModelXDataTypes.Data;
    // const use_next_val_functions = (typeof this.use_next_value_functions_for_training_data !== 'undefined')
    //   ? this.use_next_value_functions_for_training_data
    //   : use_next_value_functions_for_training_data
    // console.log('before',{ trainingData });

    let test;
    let train;
    this.status.trained = false;
    await this.getDataSetProperties({
      DataSetData: trainingData,
    });
    // console.log('after getDataSetProperties',{ trainingData });

    if (typeof this.training_data_filter_function === 'function' && use_next_value_functions_for_training_data === false) {
      console.log('this.training_data_filter_function',this.training_data_filter_function)
      trainingData = trainingData.filter(this.training_data_filter_function);
    } 
    if (!use_next_value_functions_for_training_data && this.use_empty_objects) {
      trainingData = trainingData.map(trainningDatum => ({
        ...this.emptyObject,
        ...trainningDatum,
      }));
    }
    // console.log('after',{ trainingData });
    this.DataSet = new ModelXData.DataSet(trainingData);

    // console.log('this.DataSet', this.DataSet);
    if (this.use_preprocessing_on_trainning_data && this.preprocessing_feature_column_options && Object.keys(this.preprocessing_feature_column_options).length) {
      this.DataSet.fitColumns(this.preprocessing_feature_column_options);
    }
    if (use_next_value_functions_for_training_data) {
      const trainingDates:Date[] = trainingData.map(tdata => tdata[ this.prediction_timeseries_date_feature ]);
      trainingData = trainingData.map((trainingDatum, dataIndex) => {
        const forecastDate = trainingDatum[ this.prediction_timeseries_date_feature ];
        const forecastPredictionIndex = dataIndex;
        if (trainingDatum._id) trainingDatum._id = trainingDatum._id.toString();
        if (trainingDatum.feature_entity_id) trainingDatum.feature_entity_id = trainingDatum.feature_entity_id.toString();
        const trainningNextValueData = this.prediction_inputs_next_value_function
          ? this.prediction_inputs_next_value_function({
            rawInputPredictionObject: trainingDatum,
            forecastDate,
            forecastDates: trainingDates,
            forecastPredictionIndex,
            existingDatasetObjectIndex: dataIndex,
            unscaledLastForecastedValue: trainingData[dataIndex - 1],
            // data: this.DataSet.data.splice(forecastDateFirstDataSetDateIndex, 0, forecasts),
            data: trainingData,
            DataSet: this.DataSet||new ModelXData.DataSet(),
            lastDataRow: trainingData[trainingData.length - 1],
            reverseTransform: false,
          })
          : {};
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
      if (typeof this.training_data_filter_function === 'function' && use_next_value_functions_for_training_data===true) {
        trainingData = trainingData.filter((datum, datumIndex) => {
          if (this.training_data_filter_function) {
            const removeValue = this.training_data_filter_function(datum, datumIndex);
            if (!removeValue) this.removedFilterdtrainingData.push(datum);
            return removeValue;
          }
        });
      }
      // console.log('trainModel trainingData[0]', trainingData[0]);
      // console.log('trainModel trainingData[trainingData.length-1]', trainingData[trainingData.length-1]);
      // console.log('trainModel trainingData.length', trainingData.length);
      // console.log('trainModel this.forecastDates', this.forecastDates);
      this.DataSet = new ModelXData.DataSet(trainingData);
    }

    // console.log('this.preprocessingColumnOptions', this.preprocessingColumnOptions);
   
    ['is_location_open', 'is_open_hour', 'is_location_open',].forEach(feat_col_option => {
      if (this.training_feature_column_options[ feat_col_option ]) {
        this.training_feature_column_options[ feat_col_option ] = ['label', { binary: true, },];
      }
    });
    // console.log('AFTER this.training_feature_column_options', this.training_feature_column_options);


    this.addMockData({ use_mock_dates, });
    this.DataSet.fitColumns(this.training_feature_column_options);
    this.removeMockData({ use_mock_dates, });
    // console.log('this.DataSet', this.DataSet);
    // console.log('this.use_preprocessing_on_trainning_data', this.use_preprocessing_on_trainning_data);
    // console.log('this.preprocessing_feature_column_options', this.preprocessing_feature_column_options);
    if (!this.x_independent_features || !this.x_independent_features.length) throw new ReferenceError('Missing Inputs (x_independent_features)');
    if (!this.y_dependent_labels || !this.y_dependent_labels.length) throw new ReferenceError('Missing Outputs (y_dependent_labels)');
    this.x_independent_features = Array.from(new Set(this.x_independent_features));
    // console.log('AFTER this.x_independent_features', this.x_independent_features);
    this.y_dependent_labels = Array.from(new Set(this.y_dependent_labels));
    // console.log('AFTER this.y_dependent_labels', this.y_dependent_labels);
    // console.log('this.y_dependent_labels', this.y_dependent_labels);
    // console.log('IN MODEL trainingData.length', trainingData.length);
    // throw new Error('SHOULD NOT GET TO ADD MOCK DATA');
    // console.log({ cross_validate_training_data });
    // Object.defineProperty(this, 'x_indep_matrix_train', {
    //   writable: false,
    //   configurable: false,
    // });

    if (cross_validate_training_data) {
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
      this.testDataSet = new ModelXData.DataSet(test);
      this.trainDataSet = new ModelXData.DataSet(train);
      this.x_indep_matrix_train = this.trainDataSet.columnMatrix(this.x_independent_features);
      this.x_indep_matrix_test = this.testDataSet.columnMatrix(this.x_independent_features);
      this.y_dep_matrix_train = this.trainDataSet.columnMatrix(this.y_dependent_labels);
      this.y_dep_matrix_test = this.testDataSet.columnMatrix(this.y_dependent_labels);
    } else {
      this.x_indep_matrix_train = this.DataSet.columnMatrix(this.x_independent_features);
      this.y_dep_matrix_train = this.DataSet.columnMatrix(this.y_dependent_labels);
    }
    this.Model = new modelObject(this.training_options, { });
    if (this.config.model_category === 'timeseries') {
      const validationData = await this.validateTimeseriesData(options);
    }
    if (this.validate_training_data) {
      this.validateTrainingData({ cross_validate_training_data, });
    }
    if (this.config.model_category === 'timeseries' && this.config.model_type === 'ai-fast-forecast') {
      // console.log('this.DataSet.data',this.DataSet.data)
      // console.log('this.x_indep_matrix_train',this.x_indep_matrix_train)
      // console.log('this.x_indep_matrix_train[0]', this.x_indep_matrix_train[ 0 ]);
      // console.log('this.x_indep_matrix_train[this.x_indep_matrix_train.length-1]', this.x_indep_matrix_train[this.x_indep_matrix_train.length-1 ]);
      // console.log('this.x_independent_features',this.x_independent_features)
      // console.log('this.training_feature_column_options',this.training_feature_column_options)
      // console.log('this.validate_training_data',this.validate_training_data)
      await this.Model.train(this.x_indep_matrix_train, this.y_dep_matrix_train);
    } else {
      console.log('this.DataSet.data',this.DataSet.data)
      console.log('this.x_indep_matrix_train',this.x_indep_matrix_train)
      console.log('this.x_indep_matrix_train[0]', this.x_indep_matrix_train[ 0 ]);
      console.log('this.x_indep_matrix_train[this.x_indep_matrix_train.length-1]', this.x_indep_matrix_train[this.x_indep_matrix_train.length-1 ]);
      console.log('this.y_dep_matrix_train[0]', this.y_dep_matrix_train[ 0 ]);
      console.log('this.y_dep_matrix_train[this.y_dep_matrix_train.length-1]', this.y_dep_matrix_train[this.y_dep_matrix_train.length-1 ]);
      console.log('this.y_dep_matrix_train',this.y_dep_matrix_train)
      console.log('this.x_independent_features',this.x_independent_features)
      console.log('this.y_dependent_labels',this.y_dependent_labels)
      console.log('this.training_feature_column_options',this.training_feature_column_options)
      console.log('this.validate_training_data',this.validate_training_data)
      await this.Model.train(this.x_indep_matrix_train, this.y_dep_matrix_train);
    }
    this.status.trained = true;
    return this;
  }
}