import { Data, } from '@jsonstack/data/src/DataSet';
import { dimensionDates, } from './features';
import { Dimensions, } from './constants';
import { DataSets, } from './dataset';
// import Promisie from 'promisie';
import * as Luxon from 'luxon';
import { dataset0 } from './util';

// const _pipe = (a, b) => (arg) => b(a(arg));
// const pipe = (...ops) => ops.reduce(_pipe);

export type CombineDatasetOptions = {
  datasets?: DataSets;
  field?: string;
  defaultObject?: any;
  includeEmptyDates?: boolean;
  dateFormat?: string; 
  date_field?: string;
  time_zone?:string; 
  dimension?:Dimensions; 
  start_date?:string; 
  end_date?:string; 
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
export function getFirstDataset(datasets:DataSets = {}):Data {
  return datasets[Object.keys(datasets)[0]] || [];
}

/**
 * sets a dates dataset based on a date range
 */
export function _helper_setEmptyDates({ dimension, start_date, end_date, time_zone, defaultObject, datasetsProperties, datasets, field, }: { dimension: Dimensions; start_date: string; end_date: string; time_zone: string; defaultObject?: any; datasetsProperties: string[]; datasets: DataSets; field: string; }){
  const dates = dimensionDates[ dimension ]({ start: start_date, end: end_date, time_zone, }).map(date => {
    return Object.assign({}, defaultObject, {
      date,
    });
  });
  datasets = Object.keys(datasets).reduce((updatedDatasetData, datasetDataProperty) => { 
    updatedDatasetData[ datasetDataProperty ] = datasets[ datasetDataProperty ].map(datum => { 
      if (datum[field]) {
        const ISODateField = datum[ field ];
        const updatedField = { [ field ]: Luxon.DateTime.fromISO(ISODateField, { zone: time_zone ||datum.time_zone, }).toJSDate(), };
        // console.log(datum._id, 'datum[ field ]', datum[field], { ISODateField, datasetDataProperty, updatedField, datum });
        return {
          ...datum,
          ...updatedField
        };
      } else {
        return datum;
      }
    });
    return updatedDatasetData;
  }, {});
  // console.log('post dates', dates);
  datasets.dates = dates;
  datasetsProperties.splice(0, 0, 'dates');
  return dates;
}

/**
 * Mutates combined dataset to formate date field based on Luxon dateFormat
 */
export function _helper_formatDateField({ combined, date_field, dateFormat }: { combined: Data; date_field: string; dateFormat: string;}) {
  const isJSDate = (combined[0][date_field] instanceof Date);
    for (let i = 0; i < combined.length; i++){
      combined[i][date_field] = (isJSDate)
        ? Luxon.DateTime.fromJSDate(combined[i][date_field]).toFormat(dateFormat)
        : Luxon.DateTime.fromISO(combined[i][date_field]).toFormat(dateFormat);
    }
}

/**
 * Returns the first dataset that contains the field to combine on as the base dataset
 */
export function _helper_getBaseDataset({datasetsProperties, field, datasets}) {
  let baseDataset = [];
  let baseDatasetPropertyName;
  datasetsProperties.some((datasetsProperty) => {
    let datasetDatum = datasets[datasetsProperty];
    if (datasetDatum.filter(dataSetDatumRow => typeof dataSetDatumRow[ field ] !== 'undefined').length) {
      baseDataset = datasetDatum;
      baseDatasetPropertyName = datasetsProperty;
      return datasetsProperty;
    }
  });
  return { baseDataset, baseDatasetPropertyName, };
}

export function combineDatasetsOnField({ datasets, field, defaultObject = {}, includeEmptyDates = false, dateFormat, date_field, time_zone, dimension, start_date, end_date, }:CombineDatasetOptions ={}) {
  if (!field) throw ReferenceError('In order to combine datasets, a field parameter is required');
  // let datasets = datasets;
  const datasetsProperties = Object.keys(datasets);
  const { baseDataset, baseDatasetPropertyName, } = _helper_getBaseDataset({ datasetsProperties, field, datasets });

  if (includeEmptyDates) {
    const dates = _helper_setEmptyDates({ dimension, start_date, end_date, time_zone, defaultObject, datasetsProperties, datasets, field, });
    datasets.dates = dates;
  }

  let maxObjKeysLength = (baseDataset && baseDataset.length && typeof baseDataset[ 0 ] === 'object') ? Object.keys(baseDataset[ 0 ]).length : 0;
  let maxObjKeysLengthIndex = 0;
  
  const combined = baseDataset.reduce((combinedDataset, row, rowIndex) => {
    let combinedRow = {
      ...defaultObject,
      ...row,
    };
    datasetsProperties.filter(datasetsPropertyName => datasetsPropertyName !== baseDatasetPropertyName).forEach(datasetsPropertyName => {

      const matchingRow = datasets[ datasetsPropertyName ].find(dsRow => {
        return (dsRow[field] === row[field] ||
          (dsRow[field] && row[field] && dsRow[field].toString() === row[field].toString()));
      });
      if (matchingRow) {
        Object.keys(matchingRow).reduce((result, key) => {
          if (typeof matchingRow[key] !== 'undefined') {
            result[key] = matchingRow[key];
          }
          return result;
        }, combinedRow);
        // Object.assign(combinedRow,matchingRow)
      }
    });
    if (Object.keys(combinedRow).length > maxObjKeysLength) {
      maxObjKeysLength = Object.keys(combinedRow).length;
      maxObjKeysLengthIndex = rowIndex;
    }
    combinedDataset.push(combinedRow);
    return combinedDataset;
  }, []);
  // console.log('combined',combined);
  if (maxObjKeysLengthIndex !== 0) {//fix first data row to have all data properties for table display
    const emtpyObject = Object.keys(combined[ maxObjKeysLengthIndex ]).reduce((blankObj, prop) => {
      blankObj[ prop ] = undefined;
      return blankObj;
    }, {});
    combined[ 0 ] = Object.assign({}, emtpyObject, combined[ 0 ]);
  }
  if (date_field && dateFormat) _helper_formatDateField({ combined, date_field, dateFormat });

  return combined;
}