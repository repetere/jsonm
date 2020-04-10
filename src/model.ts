import * as ModelXData from '@modelx/data/src/index';
import * as ModelXDataTypes from '@modelx/data/src/DataSet';
import * as ModelXModel from '@modelx/model/src/index';
import { ISOOptions, durationToDimensionProperty, BooleanAnswer, getOpenHour, getIsOutlier, Dimensions, Entity, ParsedDate, getLuxonDateTime, dimensionDurations, flattenDelimiter, } from './constants';
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
};
export type ModelStatus = {
  trained: boolean;
  lastTrained?: Date;
};
export type ModelConfiguration = {
  use_mock_dates_to_fit_trainning_data?: boolean;
  use_cache?: boolean;
  model_type: ModelTypes;
  model_category?: ModelCategories;
  prediction_inputs_next_value_functions?: GeneratedFunctionDefinitionsList;
  next_value_functions?: GeneratedFunctionDefinitionsList;
  training_data_filter_function_body?: string;
  training_data_filter_function?: DataFilterFunction;
  prediction_timeseries_time_zone?: string;
  prediction_timeseries_date_feature?: string;
  prediction_timeseries_date_format?: string;
  prediction_timeseries_dimension_feature?: string;
  prediction_timeseries_start_date?: Date;
  prediction_timeseries_end_date?: Date;
  dimension?: Dimensions;
  entity?: Entity;
  DataSet?: ModelXData.DataSet;
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
  cross_validate_trainning_data?: boolean;
  use_next_value_functions_for_training_data?: boolean;
  use_mock_dates_to_fit_trainning_data?: boolean;
  trainingData?: ModelXDataTypes.Data;
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
  sumPreviousRows?: sumPreviousRows;
  data: ModelXDataTypes.Data;
  DataSet: ModelXData.DataSet;
  existingDatasetObjectIndex: number;
  reverseTransform?: boolean;
  isOpen?: (...args:any[])=>BooleanAnswer;
  isOutlier?: (...args:any[])=>BooleanAnswer;
  parsedDate?: ParsedDate;
  rawInputPredictionObject?: ModelXDataTypes.Datum;
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
/**
 * returns a Datum used in next forecast prediction input
 */
export type ForecastPredictionInputNextValueFunction = (state: ForecastPredictionNextValueState) => ModelXDataTypes.Datum;
export type DataFilterFunction = (this: { props:GeneratedStatefulFunctionProps,}, datum:ModelXDataTypes.Datum, datumIndex:number) => boolean;

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

export class Model implements ModelContext {
  config: ModelConfiguration;
  status: ModelStatus;
  trainingData: ModelXDataTypes.Data;
  prediction_inputs_next_value_functions: GeneratedFunctionDefinitionsList;
  training_data_filter_function_body?: string;
  training_data_filter_function?: DataFilterFunction;
  prediction_inputs_next_value_function?: ForecastPredictionInputNextValueFunction;
  prediction_timeseries_time_zone: string;
  prediction_timeseries_date_feature: string;
  prediction_timeseries_date_format?: string;
  prediction_timeseries_dimension_feature: string;
  prediction_timeseries_start_date?: Date | string;
  prediction_timeseries_end_date?: Date | string;
  dimension?: Dimensions;
  entity?: Entity;
  DataSet?: ModelXData.DataSet;
  forecastDates: Date[];

  constructor(configuration: ModelConfiguration, options:ModelOptions = {}) {
    this.config = {
      use_cache: true,
      model_type: ModelTypes.REGRESSION,
      ...configuration,
    };
    this.config.model_category = modelCategoryMap[this.config.model_type];
    this.status = {
      trained: false,
      lastTrained: undefined,
    };
    // this.modelDocument = Object.assign({ model_options: {}, model_configuration: {}, }, configuration.modelDocument);
    this.entity = configuration.entity || {};
    // this.emptyObject = configuration.emptyObject || {};
    // this.mockEncodedData = configuration.mockEncodedData || {};
    // this.use_empty_objects = Boolean(Object.keys(this.emptyObject).length);
    // this.use_mock_encoded_data = Boolean(this.mockEncodedData.length);
    this.dimension = configuration.dimension;
    this.training_data_filter_function_body = configuration.training_data_filter_function_body;
    this.training_data_filter_function = configuration.training_data_filter_function;
    this.trainingData = options.trainingData || [];
    // this.removedFilterdtrainingData = [];
    this.DataSet = configuration.DataSet;
    // this.max_evaluation_outputs = configuration.max_evaluation_outputs || 5;
    // this.testDataSet = configuration.testDataSet || {};
    // this.trainDataSet = configuration.trainDataSet || {};
    // this.x_indep_matrix_train = configuration.x_indep_matrix_train || [];
    // this.x_indep_matrix_test = configuration.x_indep_matrix_test || [];
    // this.y_dep_matrix_train = configuration.y_dep_matrix_train || [];
    // this.y_dep_matrix_test = configuration.y_dep_matrix_test || [];
    // this.x_independent_features = configuration.x_independent_features || [];
    // this.x_raw_independent_features = configuration.x_raw_independent_features || [];
    // this.y_dependent_labels = configuration.y_dependent_labels || [];
    // this.y_raw_dependent_labels = configuration.y_raw_dependent_labels || [];
    // this.training_size_values = configuration.training_size_values;
    // this.cross_validation_options = Object.assign({ train_size: 0.7, }, configuration.cross_validation_options);
    // this.preprocessing_feature_column_options = configuration.preprocessing_feature_column_options || {};
    // this.trainning_feature_column_options = configuration.trainning_feature_column_options || {};
    // this.trainning_options = Object.assign({
    //   fit: {
    //     epochs: 100,
    //     batchSize: 5,
    //   },
    //   stateful: true,
    //   features: this.x_independent_features.length,
    // }, configuration.trainning_options);
    // this.prediction_options = configuration.prediction_options || [];
    // this.prediction_inputs = configuration.prediction_inputs || [];
    this.prediction_timeseries_time_zone = configuration.prediction_timeseries_time_zone || 'utc';
    this.prediction_timeseries_date_feature = configuration.prediction_timeseries_date_feature || 'date';
    this.prediction_timeseries_date_format = configuration.prediction_timeseries_date_format;
    // this.validate_trainning_data = typeof configuration.validate_trainning_data === 'boolean' ? configuration.validate_trainning_data : true;
    // this.retrain_forecast_model_with_predictions = configuration.retrain_forecast_model_with_predictions || this.modelDocument.model_configuration.retrain_forecast_model_with_predictions;
    // this.use_preprocessing_on_trainning_data = configuration.use_preprocessing_on_trainning_data || this.modelDocument.model_configuration.use_preprocessing_on_trainning_data;
    // this.use_mock_dates_to_fit_trainning_data = configuration.use_mock_dates_to_fit_trainning_data || this.modelDocument.model_options.use_mock_dates_to_fit_trainning_data;
    // this.use_next_value_functions_for_training_data = configuration.use_next_value_functions_for_training_data || this.modelDocument.model_options.use_next_value_functions_for_training_data;
    this.prediction_timeseries_start_date = configuration.prediction_timeseries_start_date;
    this.prediction_timeseries_end_date = configuration.prediction_timeseries_end_date;
    this.prediction_timeseries_dimension_feature = configuration.prediction_timeseries_dimension_feature || 'dimension';
    this.prediction_inputs_next_value_functions = configuration.prediction_inputs_next_value_functions || configuration.next_value_functions || [];
    // this.Model = configuration.Model || [];
    this.forecastDates = [];
    // if (typeof options.use_tensorflow_cplusplus === 'boolean') {
    //   use_tensorflow_cplusplus = options.use_tensorflow_cplusplus;
    // }
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
      : undefined;
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
    if (this.dimension && this.config.model_category === ModelCategories.FORECAST && this.prediction_timeseries_start_date && this.prediction_timeseries_end_date) {
      this.getForecastDates();
    }
  }
  /**
   * 
   * @param options 
   */
  async trainModel(options:ModelTrainningOptions = {}) {
    const { cross_validate_trainning_data=true, use_next_value_functions_for_training_data=false, use_mock_dates_to_fit_trainning_data=false, } = options;
    const modelObject = modelMap[this.config.model_type];
    const use_mock_dates = use_mock_dates_to_fit_trainning_data || this.config.use_mock_dates_to_fit_trainning_data;
    let trainingData = options.trainingData || this.trainingData || [];
    // if (!Array.isArray(trainingData) || !trainingData.length) trainingData = [];
    trainingData = new Array().concat(trainingData);
    // const use_next_val_functions = (typeof this.use_next_value_functions_for_training_data !== 'undefined')
    //   ? this.use_next_value_functions_for_training_data
    //   : use_next_value_functions_for_training_data
    let test;
    let train;
    this.status.trained = false;
    await this.getDataSetProperties({
      DataSetData: trainingData,
    });
    if (typeof this.training_data_filter_function === 'function' && use_next_value_functions_for_training_data === false) {
      trainingData = trainingData.filter((datum, datumIndex) => this.training_data_filter_function(datum, datumIndex));
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
      if (typeof this.training_data_filter_function === 'function' && use_next_value_functions_for_training_data===true) {
        trainingData = trainingData.filter((datum, datumIndex) => {
          const removeValue = this.training_data_filter_function(datum, datumIndex);
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
}