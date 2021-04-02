import { ModelContext, ModelTypes } from './model';
import { Data } from '@modelx/data/src/DataSet';
import { TrainingProgressCallback } from './constants';
import { JDS } from './dataset';
import { AutoFeature } from './features';
export declare type JML = {
    options: {
        accuracy_target: number;
    };
    saved_model?: any;
    inputs: string[];
    outputs: string[];
    input_transforms?: AutoFeature[];
    output_transforms?: AutoFeature[];
    type: ModelTypes;
    dataset?: JDS | Data;
    on_progress?: TrainingProgressCallback;
};
export declare function getModelFromJSONM(jml?: JML): Promise<ModelContext>;
export declare const getModel: typeof getModelFromJSONM;
export declare function getModelTrainingOptions({ accuracy_target }: {
    accuracy_target: number;
}): {
    fit: {
        epochs: number;
        batchSize: number;
    };
};
