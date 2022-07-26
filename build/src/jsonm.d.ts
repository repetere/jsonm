import { ModelX, ModelTypes, ModelConfiguration } from './model';
import { Data, Datum } from '@jsonstack/data';
import { TrainingProgressCallback } from './constants';
import { JDS } from './dataset';
import { AutoFeature } from './features';
import { TensorScriptOptions } from '@jsonstack/model/src/model_interface';
export declare const ModelToTypeMap: {
    regression: string;
    prediction: string;
    classification: string;
    description: string;
    forecast: string;
};
export declare type JML = {
    options?: {
        accuracy_target: number;
    };
    saved_model?: any;
    inputs: string[];
    outputs: string[];
    training_options?: TensorScriptOptions;
    input_transforms?: AutoFeature[];
    output_transforms?: AutoFeature[];
    type?: string;
    model_type?: string;
    dataset?: JDS | Data;
    on_progress?: TrainingProgressCallback;
    model_options?: Partial<ModelConfiguration>;
    forecast_date_field?: string;
    forecast_date_format?: string;
    forecast_date_time_zone?: string;
};
export declare type ModelDataOptions = {
    inputs: string[];
    outputs: string[];
    data: JDS | Data;
};
export declare function getModelFromJSONM(jml?: JML): Promise<ModelX>;
export declare const getModel: typeof getModelFromJSONM;
/**
 * Splits into training and prediction data
 * @param options.inputs - list of inputs
 * @param options.outputs - list of outputs
 * @param options.data - data to split into training and prediction data
 * @returns two objects (trainingData and predictionData)
 */
export declare function splitTrainingPredictionData(options?: ModelDataOptions): Promise<{
    trainingData: Data;
    predictionData: Data;
}>;
export declare function getModelTrainingOptions({ accuracy_target }?: {
    accuracy_target?: number;
}): {
    fit: {
        epochs: number;
        batchSize: number;
    };
};
export declare function getInputs(jml?: JML): string[];
export declare function getDateField(DataRow?: Datum): "date" | "Date";
export declare function getModelOptions(jml?: JML, datum?: Datum): {
    auto_assign_features?: boolean;
    independent_variables?: string[];
    dependent_variables?: string[];
    input_independent_features?: AutoFeature[];
    output_dependent_features?: AutoFeature[];
    preprocessing_feature_column_options?: import("@jsonstack/data/src/DataSet").DataSetTransform;
    training_feature_column_options?: import("@jsonstack/data/src/DataSet").DataSetTransform;
    use_preprocessing_on_trainning_data?: boolean;
    use_mock_dates_to_fit_trainning_data?: boolean;
    use_next_value_functions_for_training_data?: boolean;
    use_cache?: boolean;
    model_type?: ModelTypes;
    model_category?: import("./model").ModelCategories;
    next_value_functions?: import("./model").GeneratedFunctionDefinitionsList;
    training_data_filter_function_body?: string;
    training_data_filter_function?: import("./model").DataFilterFunction;
    training_size_values?: number;
    training_progress_callback?: TrainingProgressCallback;
    prediction_options?: import("./model").PredictModelConfig;
    prediction_inputs?: import("@jsonstack/data/src/DataSet").Data;
    trainingData?: import("@jsonstack/data/src/DataSet").Data;
    retrain_forecast_model_with_predictions?: boolean;
    prediction_inputs_next_value_functions?: import("./model").GeneratedFunctionDefinitionsList;
    prediction_timeseries_time_zone?: string;
    prediction_timeseries_date_feature?: string;
    prediction_timeseries_date_format?: string;
    prediction_timeseries_dimension_feature?: string;
    prediction_timeseries_start_date?: string | Date;
    prediction_timeseries_end_date?: string | Date;
    dimension?: import("./constants").Dimensions;
    entity?: import("./constants").Entity;
    DataSet?: any;
    emptyObject?: import("@jsonstack/data/src/DataSet").Datum;
    mockEncodedData?: import("@jsonstack/data/src/DataSet").Data;
    x_independent_features?: string[];
    y_dependent_labels?: string[];
    x_raw_independent_features?: string[];
    y_raw_dependent_labels?: string[];
    testDataSet?: any;
    trainDataSet?: any;
    x_indep_matrix_train?: import("@jsonstack/data/src/DataSet").Matrix;
    x_indep_matrix_test?: import("@jsonstack/data/src/DataSet").Matrix;
    y_dep_matrix_train?: import("@jsonstack/data/src/DataSet").Matrix;
    y_dep_matrix_test?: import("@jsonstack/data/src/DataSet").Matrix;
    Model?: any;
    training_options?: TensorScriptOptions;
    validate_training_data?: boolean;
    cross_validation_options?: import("./model").CrossValidationOptions;
    debug?: boolean;
    max_evaluation_outputs?: number;
};
