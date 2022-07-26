import { ModelX, ModelContext, ModelTypes, ModelConfiguration, } from './model';
import { Data, Datum, } from '@jsonstack/data';
import { TrainingProgressCallback, } from './constants';

import { JDS, getDataSet, } from './dataset';
import { AutoFeature } from './features';
import { TensorScriptOptions } from '@jsonstack/model/src/model_interface';

export const ModelToTypeMap = {
  'regression':'ai-linear-regression',
  'prediction':'ai-regression',
  'classification':'ai-classification',
  'description':'ai-classification',
  'forecast':'ai-timeseries-regression-forecast',
}

export type JML = {
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
  forecast_date_field?:string;
  forecast_date_format?:string;
  forecast_date_time_zone?:string;
}

export type ModelDataOptions = {
  inputs: string[];
  outputs: string[];
  data: JDS | Data;
}

export async function getModelFromJSONM(jml?: JML): Promise<ModelX> {
  const trainingData = Array.isArray(jml.dataset)
    ? jml.dataset
    : await getDataSet(jml.dataset);

  return new ModelX({
    trainingData,
    independent_variables: getInputs(jml),
    input_independent_features: jml.input_transforms,
    dependent_variables: jml.outputs,
    output_dependent_features: jml.output_transforms,
    training_progress_callback: jml.on_progress,
    training_options: jml.training_options || getModelTrainingOptions(jml.options),
    model_type: jml.model_type || ModelToTypeMap[jml.type] || jml.type,
    ...getModelOptions(jml,trainingData[0]),
  });
}

export const getModel = getModelFromJSONM;

/**
 * Splits into training and prediction data
 * @param options.inputs - list of inputs
 * @param options.outputs - list of outputs
 * @param options.data - data to split into training and prediction data
 * @returns two objects (trainingData and predictionData)
 */
export async function splitTrainingPredictionData(options?:ModelDataOptions): Promise<{trainingData:Data, predictionData: Data}>{
  const dataset = await getDataSet(options?.data);
  const {trainingData, predictionData} = dataset.reduce((result,datum)=>{
    if(options?.outputs?.filter((output)=>datum[output]===undefined || datum[output]===null
    ).length) result.predictionData.push(datum);
    else result.trainingData.push(datum);
    return result;
  },{trainingData:[],predictionData:[],})
  return {trainingData,predictionData}
}

export function getModelTrainingOptions({ accuracy_target }: { accuracy_target?: number;} ={}) {
  return {
    fit: {
      epochs: 300,
      batchSize: 20,
    },
  };
}

export function getInputs(jml?:JML){
  if(jml?.type==='forecast') return Array.from(new Set(jml.inputs.concat(['year','month','day'])))
  else return jml.inputs;
}

export function getDateField(DataRow?: Datum){
  if(DataRow?.Date) return 'Date'
  else return 'date'
}

export function getModelOptions(jml?:JML,datum?:Datum){
  const defaultModelOptions:Partial<ModelConfiguration> = {}
  if(!jml?.model_options && jml?.type==='forecast'){
    defaultModelOptions.prediction_timeseries_time_zone = jml?.forecast_date_time_zone;
    defaultModelOptions.prediction_timeseries_date_feature = jml?.forecast_date_field || getDateField(datum);
    defaultModelOptions.prediction_timeseries_date_format = jml?.forecast_date_format;
    defaultModelOptions.validate_training_data = true;
    // use_mock_dates_to_fit_trainning_data

    defaultModelOptions.retrain_forecast_model_with_predictions = true;
    defaultModelOptions.use_next_value_functions_for_training_data = true;
    defaultModelOptions.use_mock_dates_to_fit_trainning_data = true;
    defaultModelOptions.use_preprocessing_on_trainning_data = true;
    defaultModelOptions.training_feature_column_options = {
      year: ['onehot',],
      month: ['onehot',],
      day: ['onehot',],
    }
  }
  return {
    ...defaultModelOptions,
    ...jml?.model_options,
  }
}