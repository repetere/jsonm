import * as JSONStackData from '@jsonstack/data';
import * as JSONStackDataTypes from '@jsonstack/data/src/DataSet';
import * as JSONStackModel from '@jsonstack/model';
import * as JSONStackModelTypes from '@jsonstack/model/src/model_interface';
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
    DataSetData?: JSONStackDataTypes.Data;
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
    preprocessing_feature_column_options?: JSONStackDataTypes.DataSetTransform;
    training_feature_column_options?: JSONStackDataTypes.DataSetTransform;
    use_preprocessing_on_trainning_data?: boolean;
    use_mock_dates_to_fit_trainning_data?: boolean;
    use_next_value_functions_for_training_data?: boolean;
    use_cache?: boolean;
    model_type: ModelTypes;
    model_category?: ModelCategories;
    next_value_functions?: GeneratedFunctionDefinitionsList;
    training_data_filter_function_body?: string;
    training_data_filter_function?: DataFilterFunction;
    training_size_values?: number;
    training_progress_callback?: TrainingProgressCallback;
    prediction_options?: PredictModelConfig;
    prediction_inputs?: JSONStackDataTypes.Data;
    trainingData?: JSONStackDataTypes.Data;
    retrain_forecast_model_with_predictions?: boolean;
    prediction_inputs_next_value_functions?: GeneratedFunctionDefinitionsList;
    prediction_timeseries_time_zone?: string;
    prediction_timeseries_date_feature?: string;
    prediction_timeseries_date_format?: string;
    prediction_timeseries_dimension_feature?: string;
    prediction_timeseries_start_date?: Date | string;
    prediction_timeseries_end_date?: Date | string;
    dimension?: Dimensions;
    entity?: Entity;
    DataSet?: JSONStackData.DataSet;
    emptyObject?: JSONStackDataTypes.Datum;
    mockEncodedData?: JSONStackDataTypes.Data;
    x_independent_features?: string[];
    y_dependent_labels?: string[];
    x_raw_independent_features?: string[];
    y_raw_dependent_labels?: string[];
    testDataSet?: JSONStackData.DataSet;
    trainDataSet?: JSONStackData.DataSet;
    x_indep_matrix_train?: JSONStackDataTypes.Matrix;
    x_indep_matrix_test?: JSONStackDataTypes.Matrix;
    y_dep_matrix_train?: JSONStackDataTypes.Matrix;
    y_dep_matrix_test?: JSONStackDataTypes.Matrix;
    Model?: JSONStackModel.TensorScriptModelInterface;
    training_options?: JSONStackModelTypes.TensorScriptOptions;
    validate_training_data?: boolean;
    cross_validation_options?: CrossValidationOptions;
    debug?: boolean;
    max_evaluation_outputs?: number;
};
export declare type ModelOptions = {
    trainingData?: JSONStackDataTypes.Data;
};
export interface ModelContext {
    config: ModelConfiguration;
    status: ModelStatus;
    trainingData: JSONStackDataTypes.Data;
    prediction_inputs_next_value_functions?: GeneratedFunctionDefinitionsList;
    training_data_filter_function_body?: string;
    dimension?: Dimensions;
    entity?: Entity;
    DataSet?: JSONStackData.DataSet;
}
export interface timeseriesCalculation {
    (options: {
        dimension?: Dimensions;
        DataSetData?: JSONStackDataTypes.Datum;
        timeseries_date_format?: string;
        timeseries_date_feature?: string;
    }): TimeseriesDimension;
}
export declare type ModelTrainningOptions = {
    cross_validate_training_data?: boolean;
    use_next_value_functions_for_training_data?: boolean;
    use_mock_dates_to_fit_trainning_data?: boolean;
    trainingData?: JSONStackDataTypes.Data;
    fixPredictionDates?: boolean;
    prediction_inputs?: JSONStackDataTypes.Data;
    getPredictionInputPromise?: GetPredicitonData;
    retrain?: boolean;
};
export declare type retrainTimeseriesModel = {
    inputMatrix?: JSONStackModelTypes.Matrix;
    predictionMatrix?: JSONStackModelTypes.Matrix;
    fitOptions?: {
        [index: string]: any;
    };
};
export declare const modelMap: {
    'ai-fast-forecast': any;
    'ai-forecast': any;
    'ai-timeseries-regression-forecast': any;
    'ai-linear-regression': any;
    'ai-regression': any;
    'ai-classification': any;
    'ai-logistic-classification': any;
};
export declare const modelCategoryMap: {
    "ai-fast-forecast": ModelCategories;
    "ai-forecast": ModelCategories;
    "ai-timeseries-regression-forecast": ModelCategories;
    "ai-linear-regression": ModelCategories;
    "ai-regression": ModelCategories;
    "ai-classification": ModelCategories;
    "ai-logistic-classification": ModelCategories;
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
    JSONStackData: any;
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
    data: JSONStackDataTypes.Data;
    DataSet: JSONStackData.DataSet;
    offset: number;
    reverseTransform?: boolean;
    debug?: boolean;
};
export declare type ForecastPredictionNextValueState = {
    lastDataRow?: JSONStackDataTypes.Datum;
    forecastDate?: Date;
    forecastDates?: Date[];
    forecastPredictionIndex?: number;
    sumPreviousRows?: sumPreviousRows;
    data: JSONStackDataTypes.Data;
    DataSet: JSONStackDataTypes.DataSet;
    existingDatasetObjectIndex: number;
    reverseTransform?: boolean;
    isOpen?: (...args: any[]) => BooleanAnswer;
    isOutlier?: (...args: any[]) => BooleanAnswer;
    parsedDate?: ParsedDate;
    rawInputPredictionObject?: JSONStackDataTypes.Datum;
    unscaledLastForecastedValue?: JSONStackDataTypes.Datum;
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
} & JSONStackDataTypes.Datum;
export declare type TimeseriesDimension = {
    dimension: Dimensions;
    dateFormat?: string;
};
export declare type PredictModelOptions = {
    descalePredictions?: boolean;
    includeInputs?: boolean;
    includeEvaluation?: boolean;
    predictionOptions?: PredictionOptions;
    prediction_inputs?: JSONStackDataTypes.Data;
    retrain?: boolean;
    getPredictionInputPromise?: GetPredicitonData;
};
export declare type EvaluateModelOptions = {
    x_indep_matrix_test?: JSONStackDataTypes.Matrix;
    y_dep_matrix_test?: JSONStackDataTypes.Matrix;
    predictionOptions?: PredictionOptions;
    retrain?: boolean;
};
export declare type EvaluationAccuracyOptions = {
    dependent_feature_label?: string;
    estimatesDescaled?: JSONStackDataTypes.Data;
    actualsDescaled?: JSONStackDataTypes.Data;
};
export declare type PredictModelConfig = {
    probability?: boolean;
};
export declare type ClassificationEvaluation = {
    accuracy: number;
    matrix: JSONStackDataTypes.Matrix;
    labels: string[];
    actuals: JSONStackDataTypes.Vector;
    estimates: JSONStackDataTypes.Vector;
};
export declare type RegressionEvaluation = {
    standardError: number;
    rSquared: number;
    adjustedRSquared: number;
    actuals: JSONStackDataTypes.Vector;
    estimates: JSONStackDataTypes.Vector;
    meanForecastError: number;
    meanAbsoluteDeviation: number;
    trackingSignal: number;
    meanSquaredError: number;
    meanAbsolutePercentageError: number;
    accuracyPercentage: number;
    metric: string;
    reason: string;
    originalMeanAbsolutePercentageError: number;
};
export declare type EvaluateClassificationModel = {
    [index: string]: ClassificationEvaluation;
};
export declare type EvaluateRegressionModel = {
    [index: string]: RegressionEvaluation;
};
export declare type ValidateTimeseriesDataOptions = {
    fixPredictionDates?: boolean;
    prediction_inputs?: JSONStackDataTypes.Data;
    getPredictionInputPromise?: GetPredicitonData;
    predictionOptions?: PredictionOptions;
    set_forecast_dates_for_predictions?: boolean;
};
export declare type PredictionOptions = {
    [index: string]: any;
};
export interface GetPredicitonData {
    ({}: {}): Promise<JSONStackDataTypes.Data>;
}
/**
 * returns a Datum used in next forecast prediction input
 */
export declare type ForecastPredictionInputNextValueFunction = (state: ForecastPredictionNextValueState) => JSONStackDataTypes.Datum;
export declare type DataFilterFunction = (datum: JSONStackDataTypes.Datum, datumIndex: number) => boolean;
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
    trainingData: JSONStackDataTypes.Data;
    removedFilterdtrainingData: JSONStackDataTypes.Data;
    use_empty_objects: boolean;
    use_preprocessing_on_trainning_data: boolean;
    use_next_value_functions_for_training_data: boolean;
    use_mock_encoded_data: boolean;
    validate_training_data: boolean;
    x_independent_features: string[];
    y_dependent_labels: string[];
    x_raw_independent_features: string[];
    y_raw_dependent_labels: string[];
    original_data_test: JSONStackDataTypes.Data;
    original_data_train: JSONStackDataTypes.Data;
    testDataSet: JSONStackData.DataSet;
    trainDataSet: JSONStackData.DataSet;
    prediction_inputs?: JSONStackDataTypes.Data;
    prediction_options?: PredictModelConfig;
    x_indep_matrix_train: JSONStackDataTypes.Matrix;
    x_indep_matrix_test: JSONStackDataTypes.Matrix;
    y_dep_matrix_train: JSONStackDataTypes.Matrix;
    y_dep_matrix_test: JSONStackDataTypes.Matrix;
    Model: JSONStackModel.TensorScriptModelInterface | JSONStackModel.LSTMTimeSeries;
    training_options: JSONStackModelTypes.TensorScriptOptions;
    cross_validation_options: CrossValidationOptions;
    training_size_values?: number;
    training_model_loss?: number;
    preprocessing_feature_column_options: JSONStackDataTypes.DataSetTransform;
    training_feature_column_options: JSONStackDataTypes.DataSetTransform;
    training_data_filter_function_body?: string;
    training_data_filter_function?: DataFilterFunction;
    training_progress_callback: TrainingProgressCallback;
    prediction_inputs_next_value_functions: GeneratedFunctionDefinitionsList;
    prediction_inputs_next_value_function?: ForecastPredictionInputNextValueFunction;
    prediction_timeseries_time_zone: string;
    prediction_timeseries_date_feature: string;
    prediction_timeseries_date_format?: string;
    retrain_forecast_model_with_predictions?: boolean;
    prediction_timeseries_dimension_feature: string;
    prediction_timeseries_start_date?: Date | string;
    prediction_timeseries_end_date?: Date | string;
    dimension?: Dimensions;
    entity?: Entity;
    DataSet: JSONStackData.DataSet;
    forecastDates: Date[];
    emptyObject: JSONStackDataTypes.Datum;
    mockEncodedData: JSONStackDataTypes.Data;
    debug: boolean;
    tf: any;
    scikit: any;
    auto_assign_features?: boolean;
    independent_variables?: string[];
    dependent_variables?: string[];
    input_independent_features?: AutoFeature[];
    output_dependent_features?: AutoFeature[];
    max_evaluation_outputs: number;
    static prediction_timeseries_date_format: string;
    static prediction_timeseries_date_feature: string;
    static dimension: Dimensions;
    static prediction_timeseries_dimension_feature: string;
    getTimeseriesDimension: timeseriesCalculation;
    constructor(configuration: ModelConfiguration, options?: ModelOptions);
    /**
     * Attempts to automatically figure out the time dimension of each date feature (hourly, daily, etc) and the format of the date property (e.g. JS Date Object, or ISO String, etc) from the dataset data
     */
    static calcTimeseriesDimension(options?: {
        dimension?: Dimensions;
        DataSetData?: JSONStackDataTypes.Datum;
        timeseries_date_format?: string;
        timeseries_date_feature?: string;
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
        inputMatrix?: JSONStackDataTypes.Matrix;
    }): boolean;
    getTrainingData(options?: {
        trainingData?: JSONStackDataTypes.Data;
        retrain?: boolean;
        getDataPromise?: GetPredicitonData;
    }): Promise<void>;
    checkTrainingStatus(options?: {
        retrain?: boolean;
    }): Promise<boolean>;
    getDataSetProperties(options?: GetDataSetProperties): Promise<void>;
    getForecastDatesFromPredictionInputs(options?: ValidateTimeseriesDataOptions): {
        forecastDates: any[];
        raw_prediction_inputs: {
            [x: string]: any;
        }[];
    };
    validateTimeseriesData(options?: ValidateTimeseriesDataOptions): Promise<{
        forecastDates: Date[];
        forecastDateFirstDataSetDateIndex: any;
        lastOriginalForecastDate: Date;
        raw_prediction_inputs: JSONStackDataTypes.Data;
        dimension: Dimensions;
        datasetDates: any;
    }>;
    getPredictionData(options?: {
        getPredictionInputPromise?: GetPredicitonData;
    }): Promise<JSONStackDataTypes.Data>;
    /**
     *
     * @param options
     */
    trainModel(options?: ModelTrainningOptions): Promise<this>;
    predictModel(options?: PredictModelOptions | JSONStackDataTypes.Data): Promise<any>;
    retrainTimeseriesModel(options?: retrainTimeseriesModel): Promise<this>;
    timeseriesForecast(options?: ValidateTimeseriesDataOptions): Promise<any[]>;
    evaluateClassificationAccuracy(options?: EvaluationAccuracyOptions): {
        accuracy: any;
        matrix: any;
        labels: any;
        actuals: any;
        estimates: any;
    };
    evaluateRegressionAccuracy(options?: EvaluationAccuracyOptions): RegressionEvaluation;
    evaluateModel(options?: EvaluateModelOptions): Promise<EvaluateClassificationModel | EvaluateRegressionModel>;
}
