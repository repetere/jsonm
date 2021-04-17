import { Data } from '@jsonstack/data/src/DataSet';
import { Dimensions } from './constants';
import { DataSets } from './dataset';
export declare type CombineDatasetOptions = {
    datasets?: DataSets;
    field?: string;
    defaultObject?: any;
    includeEmptyDates?: boolean;
    dateFormat?: string;
    date_field?: string;
    time_zone?: string;
    dimension?: Dimensions;
    start_date?: string;
    end_date?: string;
};
/**
 * Returns first dataset in datasets object passed to reducer functions
 * @example
const datasets = {
  dataset_1:[{some:'data',}],
  dataset_2:[{some_two:'data',}],
  dataset_3:[{some_three:'data',}],
}
getFirstDataset(datasets) //=> [{some:'data',}]
 */
export declare function getFirstDataset(datasets?: DataSets): Data;
/**
 * sets a dates dataset based on a date range
 */
export declare function _helper_setEmptyDates({ dimension, start_date, end_date, time_zone, defaultObject, datasetsProperties, datasets, field, }: {
    dimension: Dimensions;
    start_date: string;
    end_date: string;
    time_zone: string;
    defaultObject?: any;
    datasetsProperties: string[];
    datasets: DataSets;
    field: string;
}): any[];
/**
 * Mutates combined dataset to formate date field based on Luxon dateFormat
 */
export declare function _helper_formatDateField({ combined, date_field, dateFormat }: {
    combined: Data;
    date_field: string;
    dateFormat: string;
}): void;
/**
 * Returns the first dataset that contains the field to combine on as the base dataset
 */
export declare function _helper_getBaseDataset({ datasetsProperties, field, datasets }: {
    datasetsProperties: any;
    field: any;
    datasets: any;
}): {
    baseDataset: any[];
    baseDatasetPropertyName: any;
};
export declare function combineDatasetsOnField({ datasets, field, defaultObject, includeEmptyDates, dateFormat, date_field, time_zone, dimension, start_date, end_date, }?: CombineDatasetOptions): any;
