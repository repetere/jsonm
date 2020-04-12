import * as ModelXData from '@modelx/data/src/index';
import * as ModelXDataTypes from '@modelx/data/src/DataSet';
import * as ModelXModel from '@modelx/model/src/index';
import * as ModelXModelTypes from '@modelx/model/src/model_interface';
import { BooleanAnswer, Dimensions, Entity, ParsedDate, TrainingProgressCallback } from './constants';
import { AutoFeature } from './features';
export declare enum ModelTypes {
    FAST_FORECAST = "ai-fast-forecast",
    FORECAST = "ai-forecast",
    TIMESERIES_REGRESSION_FORECAST = "ai-timeseries-regression-forecast",
    LINEAR_REGRESSION = "ai-linear-regression",
    REGRESSION = "ai-regression",
    CLASSIFICATION = "ai-classification",
    LOGISTIC_CLASSIFICATION = "ai-logistic-classification"
}
export declare enum ModelCategories {
    PREDICTION = "regression",
    DECISION = "classification",
    FORECAST = "timeseries",
    RECOMMENDATION = "recommendation",
    REACTION = "reinforced"
}
export declare type GetDataSetProperties = {
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
export declare type ModelStatus = {
    trained: boolean;
    lastTrained?: Date;
};
export declare type ModelConfiguration = {
    auto_assign_features?: boolean;
    independent_variables?: string[];
    dependent_variables?: string[];
    input_independent_features?: AutoFeature[];
    output_dependent_features?: AutoFeature[];
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
export declare type ModelOptions = {
    trainingData?: ModelXDataTypes.Data;
};
export interface ModelContext {
    config: ModelConfiguration;
    status: ModelStatus;
    trainingData: ModelXDataTypes.Data;
    prediction_inputs_next_value_functions?: GeneratedFunctionDefinitionsList;
    training_data_filter_function_body?: string;
    dimension?: Dimensions;
    entity?: Entity;
    DataSet?: ModelXData.DataSet;
}
export declare type ModelTrainningOptions = {
    cross_validate_training_data?: boolean;
    use_next_value_functions_for_training_data?: boolean;
    use_mock_dates_to_fit_trainning_data?: boolean;
    trainingData?: ModelXDataTypes.Data;
    fixPredictionDates?: boolean;
    prediction_inputs?: ModelXDataTypes.Data;
    getPredictionInputPromise?: GetPredicitonData;
};
export declare const modelMap: {
    'ai-fast-forecast': typeof ModelXModel.LSTMTimeSeries;
    'ai-forecast': typeof ModelXModel.LSTMMultivariateTimeSeries;
    'ai-timeseries-regression-forecast': typeof ModelXModel.MultipleLinearRegression;
    'ai-linear-regression': typeof ModelXModel.MultipleLinearRegression;
    'ai-regression': typeof ModelXModel.DeepLearningRegression;
    'ai-classification': typeof ModelXModel.DeepLearningClassification;
    'ai-logistic-classification': typeof ModelXModel.LogisticRegression;
};
export declare const modelCategoryMap: {
    [ModelTypes.FAST_FORECAST]: ModelCategories;
    [ModelTypes.FORECAST]: ModelCategories;
    [ModelTypes.TIMESERIES_REGRESSION_FORECAST]: ModelCategories;
    [ModelTypes.LINEAR_REGRESSION]: ModelCategories;
    [ModelTypes.REGRESSION]: ModelCategories;
    [ModelTypes.CLASSIFICATION]: ModelCategories;
    [ModelTypes.LOGISTIC_CLASSIFICATION]: ModelCategories;
};
export declare type CrossValidationOptions = {
    folds?: number;
    random_state?: number;
    test_size?: number;
    train_size?: number;
    return_array?: boolean;
    parse_int_train_size?: boolean;
};
export declare type GeneratedFunctionDefinitionsObject = {
    [index: string]: GeneratedStatefulFunctionObject;
};
export declare type GeneratedFunctionDefinitionsList = GeneratedStatefulFunctionObject[];
export declare type GeneratedStatefulFunctionState = any;
export declare type GeneratedStatefulFunctionProps = {
    Luxon: any;
    ModelXData: any;
};
export declare type GeneratedStatefulFunctionObject = {
    variable_name: string;
    function_body: string;
};
export declare type GeneratedStatefulFunctions = {
    [index: string]: GeneratedStatefulFunction;
};
export declare type GeneratedStatefulFunctionParams = {
    props?: GeneratedStatefulFunctionProps;
    function_name_prefix?: string;
} & GeneratedStatefulFunctionObject;
export declare type GeneratedStatefulFunction = (state: GeneratedStatefulFunctionState) => number;
export declare type SumPreviousRowsOptions = {
    property: string;
    rows: number;
    offset: number;
};
export declare type SumPreviousRowContext = {
    data: ModelXDataTypes.Data;
    DataSet: ModelXData.DataSet;
    offset: number;
    reverseTransform?: boolean;
    debug?: boolean;
};
export declare type ForecastPredictionNextValueState = {
    lastDataRow?: ModelXDataTypes.Datum;
    forecastDate?: Date;
    forecastDates?: Date[];
    forecastPredictionIndex?: number;
    sumPreviousRows?: sumPreviousRows;
    data: ModelXDataTypes.Data;
    DataSet: ModelXDataTypes.DataSet;
    existingDatasetObjectIndex: number;
    reverseTransform?: boolean;
    isOpen?: (...args: any[]) => BooleanAnswer;
    isOutlier?: (...args: any[]) => BooleanAnswer;
    parsedDate?: ParsedDate;
    rawInputPredictionObject?: ModelXDataTypes.Datum;
    unscaledLastForecastedValue?: ModelXDataTypes.Datum;
};
export declare type ForecastHelperNextValueData = {
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
export declare type TimeseriesDimension = {
    dimension: Dimensions;
    dateFormat?: string;
};
export interface GetPredicitonData {
    ({}: {}): Promise<ModelXDataTypes.Data>;
}
/**
 * returns a Datum used in next forecast prediction input
 */
export declare type ForecastPredictionInputNextValueFunction = (state: ForecastPredictionNextValueState) => ModelXDataTypes.Datum;
export declare type DataFilterFunction = (datum: ModelXDataTypes.Datum, datumIndex: number) => boolean;
/**
 * Takes an object that describes a function to be created from a function body string
 * @example
getGeneratedStatefulFunction({ variable_name='myFunctionName', function_body='return 3', function_name_prefix='customFunction_', }) =>
function customFunction_myFunctionName(state){
  'use strict';
  return 3;
}
 */
export declare function getGeneratedStatefulFunction({ variable_name, function_body, props, function_name_prefix, }: GeneratedStatefulFunctionParams): GeneratedStatefulFunction;
export interface sumPreviousRows {
    (options: SumPreviousRowsOptions): number;
}
export declare function sumPreviousRows(this: SumPreviousRowContext, options: SumPreviousRowsOptions): number;
export declare class ModelX implements ModelContext {
    config: ModelConfiguration;
    status: ModelStatus;
    trainingData: ModelXDataTypes.Data;
    removedFilterdtrainingData: ModelXDataTypes.Data;
    use_empty_objects: boolean;
    use_preprocessing_on_trainning_data: boolean;
    use_mock_encoded_data: boolean;
    validate_training_data: boolean;
    x_independent_features: string[];
    y_dependent_labels: string[];
    x_raw_independent_features: string[];
    y_raw_dependent_labels: string[];
    original_data_test: ModelXDataTypes.Data;
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
    auto_assign_features?: boolean;
    independent_variables?: string[];
    dependent_variables?: string[];
    input_independent_features?: AutoFeature[];
    output_dependent_features?: AutoFeature[];
    constructor(configuration: ModelConfiguration, options?: ModelOptions);
    /**
     * Attempts to automatically figure out the time dimension of each date feature (hourly, daily, etc) and the format of the date property (e.g. JS Date Object, or ISO String, etc) from the dataset data
     */
    getTimeseriesDimension(options?: {
        dimension?: Dimensions;
        DataSetData?: ModelXDataTypes.Datum;
    }): TimeseriesDimension;
    getForecastDates(options?: {}): Date[];
    addMockData({ use_mock_dates, }?: {
        use_mock_dates?: boolean;
    }): void;
    removeMockData({ use_mock_dates, }?: {
        use_mock_dates?: boolean;
    }): void;
    getCrosstrainingData(): {
        test: any;
        train: any;
    };
    validateTrainingData({ cross_validate_training_data, inputMatrix, }?: {
        cross_validate_training_data?: boolean;
        inputMatrix?: ModelXDataTypes.Matrix;
    }): boolean;
    getDataSetProperties(options?: GetDataSetProperties): Promise<void>;
    validateTimeseriesData(options?: {
        fixPredictionDates?: boolean;
        prediction_inputs?: ModelXDataTypes.Data;
        getPredictionInputPromise?: GetPredicitonData;
    }): Promise<{
        forecastDates: Date[];
        forecastDateFirstDataSetDateIndex: any;
        lastOriginalForecastDate: Date;
        raw_prediction_inputs: ModelXDataTypes.Datum[];
        dimension: Dimensions;
        datasetDates: any;
    }>;
    getPredictionData(options?: {
        getPredictionInputPromise?: GetPredicitonData;
    }): Promise<ModelXDataTypes.Datum[]>;
    /**
     *
     * @param options
     */
    trainModel(options?: ModelTrainningOptions): Promise<this>;
}
