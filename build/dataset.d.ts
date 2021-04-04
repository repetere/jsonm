import { Data } from '@modelx/data/src/DataSet';
import { CSVOptions } from '@modelx/data/src/csv';
import { getFirstDataset } from './transforms';
export declare type DataSets = {
    [index: string]: Data;
};
export declare type genericFunction = (...args: any[]) => Promise<Data>;
export declare type reducerFunction = (datasetData: DataSets) => Promise<Data>;
export declare type Reducer = {
    reducer_function: string | reducerFunction | Array<string | reducerFunction>;
    name?: string;
    context?: any;
    datasets: Array<JDS | Data>;
};
export declare type JDS = {
    name?: string;
    id?: string;
    reducer?: Reducer;
    pre_transform?: string | genericFunction;
    post_transform?: string | genericFunction;
    data?: Data;
    _data_static?: Data;
    _data_url?: string;
    _data_csv?: string;
    _data_tsv?: string;
    _data_csv_options?: CSVOptions;
    _data_innodb?: string;
    _data_localstorage?: Data;
    _data_promise?: genericFunction;
};
export declare type ReducerFunctionData = {
    reducer_function: string | reducerFunction;
    name?: string;
    context?: any;
    index?: number;
};
export declare const defaultReducerContext: {
    Promisie: any;
    getFirstDataset: typeof getFirstDataset;
};
/**
 * Returns Data from JSON Dataset
 */
export declare function getDataSet(jds?: JDS | Data): Promise<Data>;
/**
 * Returns data from reducer functions
 * @example
await ReduceDataset({
  reducer_function: [
    async function getFirstData (datasets) { return this.context.getFirstDataset(datasets); },
    ` return this.context.getFirstDataset(datasets).map(datum =>({ ...datum, double_num: datum.num * 2, }));`
  ],
  datasets:[
    [{ num:1, some: 'val' }, { num:1, some: 'val' }, { num:1, some: 'val' }],
    [{ num:1, some1: 'val' }, { num:1, some1: 'val' }, { num:1, some1: 'val' }],
  ],
}); //=>
// [ { num: 1, some: 'val', double_num: 2 },
// { num: 1, some: 'val', double_num: 2 },
// { num: 1, some: 'val', double_num: 2 } ]
 */
export declare function ReduceDataset(reducer: Reducer): Promise<Data>;
/**
 * Returns a resolved object from an array of datasets
 * @example
 const dataset0 = [{ num:1, some1: 'val' }, { num:1, some1: 'val' }, { num:1, some1: 'val' }];
const dataset1 = {
  name: 'custom_name_2',
  data: [{ num:1, some2: 'val' }, { num:1, some2: 'val' }, { num:1, some2: 'val' }];
};
await ResolveDataset([dataset0,dataset1]) // => {
//  dataset_0:[{ num:1, some1: 'val' }, { num:1, some1: 'val' }, { num:1, some1: 'val' }],
//  custom_name_2: [{ num:1, some2: 'val' }, { num:1, some2: 'val' }, { num:1, some2: 'val' }],
//}
 */
export declare function ResolveDataset(datasets?: any[]): Promise<DataSets>;
/**
 * Returns an async reducer function that expects to be called with datasets. This is used to combine datasets into a single dataset
 * @example
const reductionFunc = getFunctionString({ reducer_function: 'return await Promise.resolve(datasets.dataset_0);', index:0, });
const datasets = { dataset_0: [{ x: 1, y: 2 }] };
await reductionFunc(datasets) // => { dataset_reduced: [{ x: 1, y: 2 }] }
 */
export declare function getFunctionString(reductionFunctionData: ReducerFunctionData): reducerFunction;
