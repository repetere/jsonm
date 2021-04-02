import { ModelX, } from './model';
import { getDataSet, } from './dataset';
export async function getModelFromJSONM(jml) {
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
        training_options: getModelTrainingOptions(jml.options),
        model_type: jml.type,
    });
}
export const getModel = getModelFromJSONM;
export function getModelTrainingOptions({ accuracy_target }) {
    return {
        fit: {
            epochs: 300,
            batchSize: 20,
        },
    };
}
