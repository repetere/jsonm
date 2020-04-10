import { Model, ModelTypes, getGeneratedStatefulFunction, sumPreviousRows, } from './model';
import  { Dimensions, getIsOutlier } from './constants';

import chai from 'chai';
// import path from 'path';
const expect = chai.expect;

describe('Generated Functions', () => {
  describe('getGeneratedStatefulFunction', () => {
    it('should be a function', () => {
      expect(getGeneratedStatefulFunction).to.be.a('function');
    });
    it('should return a function', () => {
      const func = {
        variable_name: 'testFunction',
        function_body: 'return 3',
      };
      const generatedFunc = getGeneratedStatefulFunction({ ...func, props: { Luxon: {}, ModelXData: {} }, function_name_prefix: 'custom_prefix_' });
      expect(generatedFunc).to.be.a('function');
      expect(generatedFunc(true)).to.eql(3);
    });
    it('should inject stateful information into the function execution context on this.props', () => {
      const func = {
        variable_name: 'testFunction',
        function_body: 'return 3+this.props.Luxon.someVal',
      };
      const props = { Luxon: { someVal: 3 }, ModelXData: {} };
      const generatedFunc = getGeneratedStatefulFunction({ ...func, props, function_name_prefix: 'custom_prefix_' });
      expect(generatedFunc(true)).to.eql(6);
    });
  });
  describe('sumPreviousRows', () => {
    it('should summarize data from previous rows', () => {
      const data = [
        {label:'current', value:10},
        {label:'prev 1', value:20},
        {label:'prev 2', value:30},
        {label:'prev 3', value:40},
        {label:'prev 4', value:50},
        {label:'prev 5', value:60},
        {label:'prev 6', value:70},
        {label:'prev 7', value:80},
        {label:'prev 8', value:90},
        {label:'prev 9', value:100},
      ];  
      const property = 'value';
      const prev2 = sumPreviousRows.call({ data, }, { property, offset: 1, rows: 2 });
      expect(prev2).to.eql(50);
      expect(sumPreviousRows.call({ data, }, { property, offset: 1, rows: 1 })).to.eql(20);
      expect(sumPreviousRows.call({ data, }, { property, offset: 2, rows: 1 })).to.eql(30);
      expect(sumPreviousRows.call({ data, }, { property, offset: 1, rows: 3 })).to.eql(90);
      expect(() => { sumPreviousRows.call({ data, }, { property, offset: 0, rows: 3 }) }).to.throw('Offset must be larger');
    });
  });
});

describe('Model', () => {
  // beforeAll(async function () {
  //   return true;
  // },5000);
  describe('constructor', () => {
    it('should export a named module class', () => {
      // tf.setBackend('tensorflow')
      // console.log(tf.getBackend());

      // const TSM = new TensorScriptModelInterface({},{tf});
      // const TSMConfigured = new TensorScriptModelInterface({ test: 'prop', });
      // expect(TensorScriptModelInterface).to.be.a('function');
      // expect(TSM).to.be.instanceOf(TensorScriptModelInterface);
      // expect(TSMConfigured.settings.test).to.eql('prop');
    });
  });
  describe('getTimeseriesDimension', () => {
    it('should return dimension and format if set correctly', () => {
      const m1 = new Model({
        model_type: ModelTypes.REGRESSION,
        prediction_timeseries_date_format:'ff',
      });
      const m2 = new Model({
        model_type: ModelTypes.REGRESSION,
        dimension: Dimensions.MONTHLY,
        prediction_timeseries_date_format:'ff',
      });
      // console.log({m1})
      expect(m1.getTimeseriesDimension({dimension:Dimensions.YEARLY})).to.eql({
        dimension: Dimensions.YEARLY,
        dateFormat: 'ff',
      });
      expect(m2.getTimeseriesDimension({})).to.eql({
        dimension: Dimensions.MONTHLY,
        dateFormat: 'ff',
      });
    });
    it('should return error without a date format ', () => {
      const m1 = new Model({
        model_type: ModelTypes.REGRESSION,
      });
      const m2 = new Model({
        model_type: ModelTypes.REGRESSION,
        dimension: Dimensions.MONTHLY,
      });
      // console.log({m1})
      expect(() => {
        m1.getTimeseriesDimension({ dimension: Dimensions.YEARLY })
      }).to.throw(/Invalid timeseries dimension/);
      expect(() => {
        m2.getTimeseriesDimension({});
      }).to.throw(/Invalid timeseries date format/);
    });
    it('should return dimension and format from dataset', () => {
      const m1 = new Model({
        model_type: ModelTypes.REGRESSION,
        prediction_timeseries_date_format:'ff',
      });
      // console.log({ m1 })
      const DataSetData = [{ dimension: 'monthly', }];
      expect(m1.getTimeseriesDimension({
        DataSetData,
      })).to.eql({
        dimension: Dimensions.MONTHLY,
        dateFormat: 'ff',
      });
    });
    it('should calculate and return dimension and format from dataset', () => {
      const m1 = new Model({
        model_type: ModelTypes.REGRESSION,
        prediction_timeseries_date_format:'iso',
      });
      const DataSetData = [
        {
          date:'2020-02-01',
        },
        {
          date:'2020-03-01',
        },
        {
          date:'2020-04-01',
        },
      ];
      expect(m1.getTimeseriesDimension({
        DataSetData,
      })).to.eql({
        dimension: Dimensions.MONTHLY,
        dateFormat: 'iso',
      });
      const m2 = new Model({
        model_type: ModelTypes.REGRESSION,
      });
      const DataSetData2 = [
        {
          date: new Date('2020-02-01'),
        },
        {
          date: new Date('2020-02-02'),
        },
        {
          date: new Date('2020-02-03'),
        },
      ];
      expect(m2.getTimeseriesDimension({
        DataSetData:DataSetData2,
      })).to.eql({
        dimension: Dimensions.DAILY,
        dateFormat: 'js',
      });
    });
  });
});