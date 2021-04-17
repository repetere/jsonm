import { getFunctionString, ResolveDataset, ReduceDataset, getDataSet, } from './dataset';
// import { Data, } from '@jsonstack/data/src/DataSet';
import { Dimensions, } from './constants';
import { dataset0, dataset1, dataset2, dataset3, dataset4, } from './util';
import { getFirstDataset, combineDatasetsOnField, _helper_getBaseDataset, _helper_formatDateField, _helper_setEmptyDates, } from './transforms';
/*
import { toBeWithinRange, } from '@jsonstack/model/src/jest.test';
chai.use(sinonChai);		 expect.extend({ toBeWithinRange });
*/

const mock_dsets = {
  ds1: [{ selector: 'base-1st', data: 'from ds1 1st' }, { selector: 'base-2nd', data: 'from ds1 2nd' }],
  ds2: [{ selector: 'base-1st', data: 'from ds2 1st' }, { selector: 'base-3rd', unique_field:'yep', data: 'from ds2 2nd' }],
  ds3: [{ selector: 'base-1st', data: 'from ds3 1st' }, { selector: 'base-2nd', data: 'from ds3 2nd' }],
};

describe('JSON Dataset Transforms', () => {
  describe('getFirstDataset', () => {
    it('should return empty data', async() => {
      const empty = getFirstDataset();
      expect(empty).toMatchObject([]);
    });
    it('should return the first dataset', () => {
      const datasets = { dataset0, dataset1, };
      const firstDS = getFirstDataset(datasets);
      expect(firstDS).toMatchObject(dataset0);
    });
  });
  describe('combineDatasetsOnField', () => {
    it('should throw an error if missing field param', () => {
      expect(() => {
        combineDatasetsOnField();
      }).toThrow('In order to combine datasets, a field parameter is required');
    })
    it('should combine dataset on a field', async () => {
      const datasetsArray = [dataset0, dataset1, dataset2, dataset3, dataset4];
      const datasets = await ResolveDataset(datasetsArray);
      const combined = combineDatasetsOnField({ datasets, field: 'num', });
      expect(combined).toEqual(expect.arrayContaining([{
        num: 1,
        some: 'val dataset0 1',
        some1: 'val dataset1',
        some2: 'val custom_name_2',
        some3: 'val dataset3 1',
        some4: 'val dataset4'
      }]));
      // console.log({ combined });
    });
  });
  describe('_helper_getBaseDataset', () => { 
    const datasetsProperties = Object.keys(mock_dsets);
    it('should return base dataset from datasets', () => {
      const { baseDataset, baseDatasetPropertyName, } = _helper_getBaseDataset({ datasets: mock_dsets, datasetsProperties, field: 'selector' });
      expect(baseDataset).toMatchObject(mock_dsets.ds1);
      expect(baseDatasetPropertyName).toEqual('ds1');
    });
    it('should return dataset from specific unique field', () => {
      const { baseDatasetPropertyName, } = _helper_getBaseDataset({ datasets: mock_dsets, datasetsProperties, field: 'unique_field' });
      expect(baseDatasetPropertyName).toEqual('ds2');
      // console.log({ baseDataset, baseDatasetPropertyName, });
    });
  });
  describe('_helper_formatDateField', () => {
    it('should return a combined dataset with formatted dates', () => {
      const combined = dataset0.map((d, i) => ({ ...d, date: new Date(`March ${(i+3)}, 2020`) }));
      _helper_formatDateField({ date_field: 'date', dateFormat: 'DDDD', combined });
      expect(combined[0].date).toMatch(/Tuesday/gi);
    });
    it('should return a combined dataset with string formatted dates', () => {
      const combined = dataset0.map((d, i) => ({ ...d, date: new Date(`March ${(i+3)}, 2020`).toISOString() }));
      _helper_formatDateField({ date_field: 'date', dateFormat: 'DDDD', combined });
      expect(combined[0].date).toMatch(/Tuesday/gi);
    });
  });
  describe('_helper_setEmptyDates', () => {
    it('should include dates from start_date to end_date', () => {
      const dimension = Dimensions.DAILY;
      const start_date = '2020-02-28';
      const end_date = '2020-03-04';
      const time_zone = 'America/New_York';
      const ds1 = dataset0.map((d, i) => ({ ...d, date: new Date(`March ${(i + 3)}, 2020`).toISOString(), }));
      const ds2 = dataset1.map((d, i) => ({ ...d, date: new Date(`March ${(i + 3)}, 2020`).toISOString(), }));
      const datasets = { ds1, ds2 };
      const field = 'date';
      const datasetsProperties = Object.keys(datasets);
      const defaultObject = { test: true };

      const dates = _helper_setEmptyDates({ dimension, start_date, end_date, time_zone, datasetsProperties, datasets, field, defaultObject, });
      expect(dates.length).toBe(6);
      expect(Object.keys(dates[0])).toEqual(expect.arrayContaining(['test', 'date']));
    });
  });


  
})