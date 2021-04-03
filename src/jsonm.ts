import { ModelX,ModelContext, ModelTypes, } from './model';
import { Data, DataSet, } from '@modelx/data/src/DataSet';
import { TrainingProgressCallback, } from './constants';

import { JDS, getDataSet, } from './dataset';
import { AutoFeature } from './features';
import { TensorScriptOptions } from '@modelx/model/src/model_interface';

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
  type: ModelTypes;
  dataset?: JDS | Data;
  on_progress?: TrainingProgressCallback;
}

export async function getModelFromJSONM(jml?: JML): Promise<ModelX> {
  const trainingData = Array.isArray(jml.dataset)
    ? jml.dataset
    : await getDataSet(jml.dataset);

  return new ModelX({
    trainingData,
    independent_variables: jml.inputs,
    input_independent_features: jml.input_transforms,
    dependent_variables: jml.outputs,
    output_dependent_features: jml.output_transforms,
    training_progress_callback: jml.on_progress,
    training_options: jml.training_options || getModelTrainingOptions(jml.options),
    model_type: jml.type,
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