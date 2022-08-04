import { ModelX, ModelContext, ModelTypes, ModelConfiguration, } from './model';
import { Data, Datum, DataSet, util as DataSetUtil } from '@jsonstack/data';
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
  on_progress?:TrainingProgressCallback,
}

export type getSpreadsheetDatasetOptions={
  on_progress?:TrainingProgressCallback,
  columnLabels?:string[]
}

export type columnStat ={
  label: string,
  labelValues: any[],
  dataType:string,
  mean?: number,
  min?:number,
  max?:number,
  values:number
}

export type getInputsOutputsFromDatasetOptions ={
  dataset:Data,
  labels:string[],
  inputs?:string[],
  outputs?:string[],
  forceStats?:boolean,
  on_progress?:TrainingProgressCallback,
}

export async function getModelFromJSONM(jml?: JML): Promise<ModelX> {
  const trainingData = Array.isArray(jml.dataset)
    ? jml.dataset
    : await getDataSet(jml.dataset);
  if(jml.outputs.length<1) throw new RangeError('Every model requires at least one output')
  if(jml.inputs.length<1) throw new RangeError('Every model requires at least one input')

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

/**
 * Splits into training and prediction data
 * @param options.inputs - list of inputs
 * @param options.outputs - list of outputs
 * @param options.data - data to split into training and prediction data
 * @returns two objects (trainingData and predictionData)
 */
 export async function splitTrainingPredictionData(options?:ModelDataOptions): Promise<{trainingData:Data, predictionData: Data}>{
  if(typeof options?.on_progress==='function') options.on_progress({
    status: 'preprocessing',
    loss: undefined,
    completion_percentage: undefined,
    epoch: undefined,
    logs: undefined,
    defaultLog: {
      detail: 'generating training data'
    }
  }) 
  const dataset = await getDataSet(options?.data);
  const {trainingData, predictionData} = dataset.reduce((result,datum,idx)=>{
    if(options?.outputs?.filter((output)=> isEmpty(datum[output])
    ).length) result.predictionData.push({...datum,__original_dataset_index: idx});
    else result.trainingData.push({...datum,__original_dataset_index: idx});
    return result;
  },{trainingData:[],predictionData:[],})
  return {trainingData,predictionData}
}


/**
 * function that tests for empty values
 * @param val 
 * @returns {boolean}
 */
export function isEmpty(val):boolean{
  return val === undefined || val === null || val==='';
}

/**
 * returns inputs and outputs from json data and labels by iterating through the data, if there are rows with missing values it assumes that those are output columns
 * e.g.,
 * labels = ['col1','col2','col3','col4','col5']
 * dataset = [ 
 *   {col1:1, col2:2, col3:3, col4:4, col5: 5}, 
 *   {col1:10, col2:20, col3:30, col4:undefined, col5: undefined}, 
 * ]
 * 
 * it will assume
 * inputs=['col1','col2','col3']
 * outputs=['col4','col5']
 * 
 * if forcestats is set, it will run stats on each column like  mean, min, max
 * @param param0 
 * @returns 
 */

export function getInputsOutputsFromDataset({dataset, labels, inputs=[],outputs=[], forceStats=false, on_progress}:getInputsOutputsFromDatasetOptions){
  if(typeof on_progress==='function') on_progress({
    status: 'preprocessing',
    loss: undefined,
    completion_percentage: undefined,
    epoch: undefined,
    logs: undefined,
    defaultLog: {
      detail: 'configuring inputs and outputs'
    }
  }) 
  if(inputs?.length && outputs?.length && forceStats===false){
    return {
      inputs,
      outputs,
      columns: undefined
    }
  } else{
      const columns:columnStat[] = labels.reduce((stats:columnStat[],label)=>{
        const labelValues = DataSet.columnArray(label,{
          data: dataset,
          filter: val=> !isEmpty(val)
        });
        const dataType = typeof labelValues[0];
        const mean = dataType==='number'?DataSetUtil.mean(labelValues):undefined;
        const min = DataSetUtil.min(labelValues);
        const max = DataSetUtil.max(labelValues);
        stats.push({
          label,
          labelValues,
          dataType,
          mean,
          min,
          max,
          values: labelValues.length
        });
        return stats;
      },[]);
      const maxColumnValue = columns.sort((a,b)=>b.values-a.values)[0].values;
      const [derivedInputs,derivedOutputs]:[string[],string[]] = columns.reduce((result,columnStat)=>{
        
        if(columnStat.values<maxColumnValue) result[1].push(columnStat.label);
        else result[0].push(columnStat.label);
        result[0]//inputs
        result[1]//outputs
        return result;
      },[[],[]] as [string[],string[]]);
      // console.log({columns,inputs,outputs})
      return {
        columns,
        inputs:derivedInputs,
        outputs:derivedOutputs,
      };  
  }
}

/**
 * takes data from a spreadsheet and return an object for preprocessing. The input data usually includes the header, e.g., 
 * [
 *  ['col1','col2','col3'],
 *  [1,  2,  3,  ]
 *  [10, 20, 30, ]
 * ] 
 * 
 * and returns
 * 
 * {
 *  labels:[ 'col1', 'col2', 'col3', ],
 *  vectors: [ [1,2,3], [10,20,30], ]
 *  dataset: [ {col1: 1, col2: 2, col3: 3,}, {col1: 10, col2: 20, col3: 30}, ] 
 * }
 * @param data 
 * @returns {{vectors:number[][],labels:string[],dataset:object[]}}
 */
export function getSpreadsheetDataset(data, options?:getSpreadsheetDatasetOptions){
  if(typeof options?.on_progress==='function') options.on_progress({
    status: 'preprocessing',
    loss: undefined,
    completion_percentage: undefined,
    epoch: undefined,
    logs: undefined,
    defaultLog: {
      detail: 'converting spreadsheet data into json dataset'
    }
  }) 
  let derivedLabels:string[]=[];
  let labelsAsFirstRow = options?.columnLabels
    ? false 
    : true;
  const vectors = data.concat([]);

  if(data?.length>0 && !options?.columnLabels &&(typeof data[0][0] === typeof data[1][0])){ 
    labelsAsFirstRow = false;
    derivedLabels = data[0].reduce((result,item,index)=>{
      result.push(`column_${index+1}`)
      return result;
    },[]);
  } else if(!options?.columnLabels) derivedLabels = vectors?.splice(0,1)[0] as string[];
  
  const labels = options?.columnLabels || derivedLabels;
  const dataset = DataSet.reverseColumnMatrix({labels,vectors});
  return {
    vectors,
    labels,
    dataset,
    labelsAsFirstRow,
  }
}