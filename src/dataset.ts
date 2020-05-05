import { Data, } from '@modelx/data/src/DataSet';
import { getFirstDataset, } from './transforms'
import Promisie from 'promisie';
import fetch from 'node-fetch';

export type DataSets = { [index: string]: Data; };
export type genericFunction = (...args: any[]) => Promise<Data>;
export type reducerFunction = (datasetData:DataSets) => Promise<Data>;

export type Reducer = {
  reducer_function: string | reducerFunction | Array<string|reducerFunction>;
  name?: string;
  context?: any;
  datasets: Array<JDS|Data>;
}

export type JDS = {
  name?: string;
  id?: string;
  reducer?: Reducer;
  pre_transform?: string | genericFunction;
  post_transform?: string | genericFunction;
  data?: Data;
  _data_static?: Data;
  _data_url?: string;
  _data_innodb?: string;
  _data_localstorage?: Data;
  _data_promise?: genericFunction;
}

export type ReducerFunctionData = {
  reducer_function: string | reducerFunction;
  name?: string;
  context?: any;
  index?: number;
}

export const defaultReducerContext = {
  Promisie,
  getFirstDataset,
};

/**
 * Returns Data from JSON Dataset
 */
export async function getDataSet(jds: JDS | Data = {}): Promise<Data> {
  if (Array.isArray(jds)) return jds;
  const { reducer, data, _data_static, _data_promise, _data_url } = jds as JDS;
  let returnData=[];
  if (data) returnData = data;
  else if (_data_static) returnData = _data_static;
  else if (reducer) returnData = await ReduceDataset(reducer);
  else if (_data_promise) returnData = await _data_promise();
  else if (_data_url) {
    const response = await fetch(_data_url);
    returnData = await response.json();
  }
  return returnData;
}

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
export async function ReduceDataset(reducer: Reducer): Promise<Data> {
  const { name, } = reducer;
  const context = {
    context: {
      ...defaultReducerContext,
      name,
      ...reducer.context,
    }
  };
  const reducerFunctions = Array.isArray(reducer.reducer_function) ? reducer.reducer_function : [reducer.reducer_function];
  const reducerFunctionArray = reducerFunctions.map((reducer_function, index) => getFunctionString({ reducer_function, name, context, index }));
  const ReducerFunction = Promisie.pipe(reducerFunctionArray);
  const datasets = await ResolveDataset(reducer.datasets);
  const { dataset_reduced } = await ReducerFunction(datasets);
  return dataset_reduced;
}

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
export async function ResolveDataset(datasets=[]):Promise<DataSets> {
  let i = 0;
  let datasetData = {};
  if (datasets.length) {
    const datasetsOrderedArray = await Promisie.map(datasets, 10, async (jds) => {
      const dsDatum = {};
      if (Array.isArray(jds)) {
        dsDatum[`dataset_${i}`] = jds;
      } else {
        const data = await getDataSet(jds);
        dsDatum[jds.name || `dataset_${i}`] = data;
      }
      i++;
      return dsDatum;
    });
    datasetData = datasetsOrderedArray.reduce((result, orderedDataset) => { 
      const key = Object.keys(orderedDataset)[0];
      const val = orderedDataset[key];
      result[key] = val;
      return result;
    }, {});
  }
  return datasetData;
}

/**
 * Returns an async reducer function that expects to be called with datasets. This is used to combine datasets into a single dataset
 * @example
const reductionFunc = getFunctionString({ reducer_function: 'return await Promise.resolve(datasets.dataset_0);', index:0, });
const datasets = { dataset_0: [{ x: 1, y: 2 }] };
await reductionFunc(datasets) // => { dataset_reduced: [{ x: 1, y: 2 }] }
 */
export function getFunctionString(reductionFunctionData:ReducerFunctionData): reducerFunction{
  const { reducer_function, name, context, index, } = reductionFunctionData;

  if (typeof reducer_function === 'function') {
    const reduceFunction = async function getFunction(datasets) { 
      const dataset_reduced = await reducer_function.call(context,datasets);
      return { dataset_reduced };
    }.bind(context);
    Object.defineProperty(
      reduceFunction,
      'name',
      {
        value: reducer_function.name || 'ReducerFunction_' + index,
      }
    );
    return reduceFunction;
  } else {
    const functionBodyString = `'use strict'; 
    return async function getAsyncString(){
      try {
        const dataset_reduced = await (async function getReducerData(){
          ${reducer_function}
        }.bind(this))();
        return {dataset_reduced};
      } catch(e){
        throw e;
      }
    }.call(this /* ,options */);
    `;
    const stringFunction = Function('datasets', functionBodyString).bind(context);
    Object.defineProperty(
      stringFunction,
      'name',
      {
        value: name || 'ReducerFunction_' + index,
      }
    );
    return stringFunction;
  }
}