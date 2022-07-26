export declare type TrainingProgressUpdate = {
    completion_percentage?: number;
    loss?: number;
    epoch?: number;
    logs: {
        loss: number;
    };
    status?: string;
    batch?: number;
    defaultLog?: boolean;
};
export declare type TrainingProgressCallback = (...args: any[]) => void;
export declare type CustomCallbackFunctions = {
    [index: string]: TrainingProgressCallback;
};
export declare function setBackend(tfInput: any): void;
export declare function getBackend(): any;
export declare function createModelFitCallback(callbackFunctions?: CustomCallbackFunctions | any[]): any[];
