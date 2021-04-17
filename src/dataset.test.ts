import { getFunctionString, ResolveDataset, ReduceDataset, getDataSet, } from './dataset';
import { Data, } from '@jsonstack/data/src/DataSet';
import { dataset0, dataset1, dataset2, dataset3, dataset4, } from './util';
/*
import { toBeWithinRange, } from '@jsonstack/model/src/jest.test';
chai.use(sinonChai);		 expect.extend({ toBeWithinRange });
*/

describe('JSON Dataset', () => {
  describe('getDataSet', () => {
    it('should return empty data', async() => {
      const empty = await getDataSet();
      expect(empty).toMatchObject([]);
    });
    it('should return data array', async () => {
      const returnedData = await getDataSet(dataset0);
      expect(returnedData).toMatchObject(dataset0);
    });
    it('should return data passed from data property', async () => {
      const returnedData = await getDataSet({ data: dataset1 });
      expect(returnedData).toMatchObject(dataset1);
    });
    it('should return data passed from _data_static property', async () => {
      const returnedData = await getDataSet({ _data_static: dataset1 });
      expect(returnedData).toMatchObject(dataset1);
    });
    it('should return async data passed from _data_promise property', async () => {
      const returnedData = await getDataSet( dataset4 );
      expect(returnedData).toEqual(expect.arrayContaining([
        { num:1, some4: 'val dataset4' }
      ]));
    });
    it('should return async data passed from _data_url property', async () => {
      const returnedData = await getDataSet({ _data_url: 'https://jsonplaceholder.typicode.com/posts' });
      expect(returnedData[0]).toHaveProperty('id');
    });
    it('should return data from a reducer', async () => {
      const datasets = [dataset0, dataset1, dataset2, dataset3, dataset4];
      const reducer = {
        reducer_function: function getFirstData(datasets) {
            const firstDataset = this.context.getFirstDataset(datasets);
            return firstDataset;
          },
        datasets,
      }
      const returnedData = await getDataSet({
        reducer
      });
      expect(returnedData).toMatchObject(dataset0);
    });
    it('should return data from nested reducers', async () => {
      function getFirstData(datasets) {
        // console.log('this.context', this.context);
        // console.log('reducer name:', this.context.name);
        const firstDataset = this.context.getFirstDataset(datasets);
        return firstDataset;
      }
      const JDS = {
        reducer: {
          name:'outer reducer',
          reducer_function: getFirstData,
          datasets: [
            {
              reducer: {
                name:'dataset 4 reducer',
                reducer_function: getFirstData,
                datasets: [dataset4],
              }
            },
            {
              reducer: {
                name:'dataset 3 reducer',
                reducer_function: getFirstData,
                datasets: [dataset3],
              }
            }
          ],
        }
      };
      
      const returnedData = await getDataSet(JDS);
      // console.log({ returnedData });
      expect(returnedData).toEqual(expect.arrayContaining([
        { num:1, some4: 'val dataset4' }
      ]));

    });
  });
  describe('ReduceDataset', () => {
    it('should reduce dataset with a single reducer', async () => {
      const datasets = [dataset0, dataset1, dataset2, dataset3, dataset4];
      const reducedDataset = await ReduceDataset({
        reducer_function: `
return this.context.getFirstDataset(datasets);
`,
        datasets,
      });
      expect(reducedDataset).toMatchObject( dataset0);
    });
    it('should reduce a dataset with multiple reducers', async () => {
      const datasets = [dataset0, dataset1, dataset2, dataset3, dataset4];
      const reducedDataset = await ReduceDataset({
        reducer_function: [
          async function getFirstData (datasets) {
            const firstDataset = this.context.getFirstDataset(datasets);
            return firstDataset;
          },
          `
return this.context.getFirstDataset(datasets).map(datum =>({
  ...datum,
  double_num: datum.num * 2,
}));
`
],
        datasets,
      });
      // console.log({ reducedDataset });
      expect(reducedDataset).toEqual(expect.arrayContaining([{ num: 1, some: 'val dataset0 1', double_num: 2 }]));
    });
  });
  
  describe('ResolveDataset', () => {
    it('should resolve an array of json datasets', async () => {
      const datasets = [dataset0, dataset1, dataset2, dataset3, dataset4];
      const datasetData = await ResolveDataset(datasets);
      expect(Object.keys(datasetData)).toEqual(expect.arrayContaining(['dataset_0', 'dataset_1', 'custom_name_2', 'async dataset']));
      expect(datasetData['async dataset'][0]).toMatchObject({ num: 1, some4: 'val dataset4' });
      expect(datasetData.dataset_1).toMatchObject(dataset1);
      // console.log({ datasetData });
    });
    it('should handle emtpry datasets', async () => {
      const datasetData = await ResolveDataset();
      expect(datasetData).toMatchObject({});
    });
  });

  describe('getFunctionString', () => {
    it('should return the same function if a function is the reducer_function', () => {
      const myFunc = (): Promise<Data> => Promise.resolve([{}]);
      const context = {};
      expect(getFunctionString({ reducer_function: myFunc, index: 0, context }).toString()).toMatch(myFunc.bind(context).toString());
    });
    it('should turn a string into a function', async () => {
      const myFunc = `return datasets.dataset_0;`;
      const datasets = { dataset_0: [{ x: 1, y: 2 }] };
      const index = 0;
      const reductionFunc = getFunctionString({ reducer_function: myFunc, index, });
      const calcDS = await reductionFunc(datasets);
      expect(typeof reductionFunc).toBe('function');
      expect(reductionFunc(datasets)).toBeInstanceOf(Promise);
      expect(calcDS).toMatchObject({ dataset_reduced: datasets.dataset_0 });
      expect(reductionFunc.name).toBe(`ReducerFunction_${index}`);
    });
  });
  
})