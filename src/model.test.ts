import { ModelX, ModelTypes, getGeneratedStatefulFunction, sumPreviousRows, } from './model';
import  { Dimensions, getIsOutlier, mockDates } from './constants';
import { DataSet, } from '@modelx/data/src/index';
import { Faker, getData, getDatum, timeseriesSort, getMockClassification, getMockRegression, getMockTimeseries, } from './util';

describe('Generated Functions', () => {
  describe('getGeneratedStatefulFunction', () => {
    it('should be a function', () => {
      expect(getGeneratedStatefulFunction).toHaveProperty('constructor');
    });
    it('should return a function', () => {
      const func = {
        variable_name: 'testFunction',
        function_body: 'return 3',
      };
      const generatedFunc = getGeneratedStatefulFunction({ ...func, props: { Luxon: {}, ModelXData: {} }, function_name_prefix: 'custom_prefix_' });
      expect(generatedFunc).toHaveProperty('constructor');
      expect(generatedFunc(true)).toBe(3);
    });
    it('should inject stateful information into the function execution context on this.props', () => {
      const func = {
        variable_name: 'testFunction',
        function_body: 'return 3+this.props.Luxon.someVal',
      };
      const props = { Luxon: { someVal: 3 }, ModelXData: {} };
      const generatedFunc = getGeneratedStatefulFunction({ ...func, props, function_name_prefix: 'custom_prefix_' });
      expect(generatedFunc(true)).toBe(6);
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
      expect(prev2).toBe(50);
      expect(sumPreviousRows.call({ data, }, { property, offset: 1, rows: 1 })).toBe(20);
      expect(sumPreviousRows.call({ data, }, { property, offset: 2, rows: 1 })).toBe(30);
      expect(sumPreviousRows.call({ data, }, { property, offset: 1, rows: 3 })).toBe(90);
      expect(() => { sumPreviousRows.call({ data, debug:true }, { property, offset: 0, rows: 3 }) }).toThrow('Offset must be larger');
    });
  });
});

describe('ModelX', () => {
  // beforeAll(async function () {
  //   return true;
  // },5000);
  describe('constructor', () => {
    it('should export a named module class', () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        prediction_timeseries_date_format:'ff',
      });
      expect(m1).toBeInstanceOf(ModelX);
      expect(m1).toHaveProperty('constructor');

    });
  });
  describe('getTimeseriesDimension', () => {
    it('should return dimension and format if set correctly', () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        prediction_timeseries_date_format:'ff',
      });
      const m2 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        dimension: Dimensions.MONTHLY,
        prediction_timeseries_date_format:'ff',
      });
      // console.log({m1})
      expect(m1.getTimeseriesDimension({dimension:Dimensions.YEARLY})).toMatchObject({
        dimension: Dimensions.YEARLY,
        dateFormat: 'ff',
      });
      expect(m2.getTimeseriesDimension({})).toMatchObject({
        dimension: Dimensions.MONTHLY,
        dateFormat: 'ff',
      });
    });
    it('should return error without a date format ', () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
      });
      const m2 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        dimension: Dimensions.MONTHLY,
      });
      // console.log({m1})
      expect(() => {
        m1.getTimeseriesDimension({  })
      }).toThrow(/Invalid timeseries dimension/);
      expect(() => {
        m2.getTimeseriesDimension({});
      }).toThrow(/Invalid timeseries date format/);
    });
    it('should return dimension and format from dataset', () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        prediction_timeseries_date_format:'ff',
      });
      // console.log({ m1 })
      const DataSetData = [{ dimension: 'monthly', }];
      expect(m1.getTimeseriesDimension({
        DataSetData,
      })).toMatchObject({
        dimension: Dimensions.MONTHLY,
        dateFormat: 'ff',
      });
    });
    it('should calculate and return dimension and format from dataset', () => {
      const m1 = new ModelX({
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
      })).toMatchObject({
        dimension: Dimensions.MONTHLY,
        dateFormat: 'iso',
      });
      const m2 = new ModelX({
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
      })).toMatchObject({
        dimension: Dimensions.DAILY,
        dateFormat: 'js',
      });
    });
  });
  describe('getForecastDates', () => {
    it('should return range of dates', () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        prediction_timeseries_start_date: new Date('2020-04-01'),
        prediction_timeseries_end_date: new Date('2020-04-03'),
        dimension: Dimensions.DAILY,
      });

      // console.log({m1})
      const dates = m1.getForecastDates({ dimension: Dimensions.YEARLY });
      expect(dates.length).toBe(3);
    });
    it('should throw error with missing dimension', () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        prediction_timeseries_start_date: new Date('2020-04-01'),
        prediction_timeseries_end_date: new Date('2020-04-03'),
      });
      expect(() => {
        m1.getForecastDates({});
      }).toThrow('Forecasts require a timeseries dimension');
    });
    it('should throw error with missing dimension', () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        dimension: Dimensions.DAILY,
      });
      expect(() => {
        m1.getForecastDates({});
      }).toThrow('Start and End Forecast Dates are required');
    });
  }); 
  describe('addMockData', () => {
    it('should add mock data', () => {
      const data = getData(2);
      const mockEncodedData = getData(1);
      const DS = new DataSet(data);
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        DataSet: DS,
        mockEncodedData,
      });
      // console.log('BEFORE m1.DataSet.data', m1.DataSet.data);
      m1.addMockData();
      // console.log('AFTER m1.DataSet.data', m1.DataSet.data);
      expect(m1.DataSet.data.length).toBe(data.length+mockEncodedData.length);
    });
    it('should add mock data and mock dates', () => {
      const data = getData(2);
      const mockEncodedData = getData(1);
      const DS = new DataSet(data);
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        DataSet: DS,
        mockEncodedData,
      });
      m1.addMockData({use_mock_dates:true});
      expect(m1.DataSet.data.length).toBe(data.length+mockEncodedData.length+mockDates.length);
    });
    it('should add mock dates', () => {
      const data = getData(2);
      const DS = new DataSet(data);
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        DataSet: DS,
      });
      m1.addMockData({use_mock_dates:true});
      expect(m1.DataSet.data.length).toBe(data.length+mockDates.length);
    });
  });
  describe('removeMockData', () => {
    it('should remove mock data', () => {
      const data = getData(2);
      const mockEncodedData = getData(1);
      const DS = new DataSet(data.concat(mockEncodedData));
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        DataSet: DS,
        mockEncodedData,
      });
      // console.log('BEFORE m1.DataSet.data', m1.DataSet.data);
      m1.removeMockData();
      // console.log('AFTER m1.DataSet.data', m1.DataSet.data);
      expect(m1.DataSet.data.length).toBe(data.length);
    });
    it('should remove mock data and mock dates', () => {
      const data = getData(2);
      const mockEncodedData = getData(1);
      const DS = new DataSet(data.concat(mockEncodedData, mockDates));
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        DataSet: DS,
        mockEncodedData,
      });
      m1.removeMockData({use_mock_dates:true});
      expect(m1.DataSet.data.length).toBe(data.length);
    });
    it('should remove mock dates', () => {
      const data = getData(2);
      const DS = new DataSet(data.concat(mockDates));
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        DataSet: DS,
      });
      m1.removeMockData({use_mock_dates:true});
      expect(m1.DataSet.data.length).toBe(data.length);
    });
  });
  describe('getCrosstrainingData', () => {
    it('should return test and train data', () => {
      const data = getData(10);
      const DS = new DataSet(data);
      const train_size = 0.6;
      const dataTrainSize = Math.round(data.length * train_size);
      const dataTestSize = Math.round(data.length * (1-train_size));
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        DataSet: DS,
        cross_validation_options: {
          train_size,
        }
      });
      // console.log({ m1 })
      const { test, train } = m1.getCrosstrainingData();
      // console.log({ test, train });
      expect(dataTrainSize).toBe(train.length);
      expect(dataTestSize).toBe(test.length);
      // m1.removeMockData({use_mock_dates:true});
      // expect(m1.DataSet.data.length).toBe(data.length);
    });
    it('should return test and train data sorted for timeseries. The split data should split original data in sorted order', () => {
      const data = getData(10).sort((a, b) => a.date.valueOf() - b.date.valueOf());
      // console.log({ data });
      const DS = new DataSet(data);
      const train_size = 0.8;
      const dataTrainSize = Math.round(data.length * train_size);
      const dataTestSize = Math.round(data.length * (1-train_size));
      const m1 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: DS,
        cross_validation_options: {
          train_size,
        }
      });
      // console.log({ m1 })
      const { test, train } = m1.getCrosstrainingData();
      // console.log({ test, });
      expect(dataTrainSize).toBe(train.length);
      expect(dataTestSize).toBe(test.length);
      expect(test[0].date).toBe(data[dataTrainSize].date);
      // m1.removeMockData({use_mock_dates:true});
      // expect(m1.DataSet.data.length).toBe(data.length);
    });
  });
  describe('validateTrainingData', () => {
    it('should not throw error if input matrix is all numerical', () => {
      const inputMatrix = [
        [1, 0, 1, 0],
        [0, 0, 0, 1],
        [1, 0, 0, 1],
      ];
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        x_indep_matrix_train: inputMatrix,
      });
      expect(m1.validateTrainingData()).toBeTruthy;
      expect(m1.validateTrainingData({ inputMatrix, })).toBeTruthy;
    });
    it('should throw errors if input matrix is not all numerical', () => {
      const inputMatrixUndef = [
        [1, 0, 1, undefined],
        [0, 0, 0, 1],
        [1, 0, 0, 1],
      ];
      const inputMatrixNaN = [
        [1, 0, 1, NaN],
        [0, 0, 0, 1],
        [1, 0, 0, 1],
      ];
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
      });
      expect(() => {
        m1.validateTrainingData({ inputMatrix: inputMatrixUndef, })
      }).toThrow();
      expect(() => {
        m1.validateTrainingData({ inputMatrix: inputMatrixNaN, })
      }).toThrow();
    });
  });
  describe('async getPredictionData', () => {
    const predictionMatrix = [
      [1, 0, 1, 0],
      [0, 0, 0, 1],
      [1, 0, 0, 1],
    ];
    it('should get predictions from a promise', async () => { 
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
      });
      const getPredictionInputPromise = async function () {
        return predictionMatrix;
      }
      const predictionInputs = await m1.getPredictionData({ getPredictionInputPromise });
      expect(predictionInputs).toBe(predictionMatrix);
    });
    it('should return prediction inputs if not passed a custom function', async () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        prediction_inputs: predictionMatrix,
      });
      const predictionInputs = await m1.getPredictionData();
      expect(predictionInputs).toBe(predictionMatrix);
    });
  });  
  describe('async validateTimeseriesData', () => {
    const timeseriesData = [
      getDatum(new Date('2020-04-04T00:00:00.000Z')),
      getDatum(new Date('2020-04-05T00:00:00.000Z')),
      getDatum(new Date('2020-04-06T00:00:00.000Z')),
      getDatum(new Date('2020-04-07T00:00:00.000Z')),
      getDatum(new Date('2020-04-08T00:00:00.000Z')),
      getDatum(new Date('2020-04-09T00:00:00.000Z')),
      getDatum(new Date('2020-04-10T00:00:00.000Z')),
      getDatum(new Date('2020-04-11T00:00:00.000Z')),
    ].sort(timeseriesSort);
    // console.log({ timeseriesData });
    it('should validate timeseries data that input predictions start within the timeseries range', async () => {
      const prediction_inputs = [
        getDatum(new Date('2020-04-11T00:00:00.000Z')),
        getDatum(new Date('2020-04-12T00:00:00.000Z')),
        // getDatum(new Date('2020-04-13T00:00:00.000Z')),
      ].sort(timeseriesSort);
      const m1 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: new DataSet([].concat(timeseriesData)),
        prediction_inputs,
        prediction_timeseries_start_date: prediction_inputs[0],
      });
      m1.forecastDates = timeseriesData.map(t => t.date);
      const validatedTimeseriesData = await m1.validateTimeseriesData();
      expect(validatedTimeseriesData).toBeTruthy;
    });
    it('should throw an error if prediction inputs are not inclusive of forecastDates', async () => {
      const prediction_inputs = [
        getDatum(new Date('2020-04-12T00:00:00.000Z')),
        getDatum(new Date('2020-04-13T00:00:00.000Z')),
      ].sort(timeseriesSort);
      const m1 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: new DataSet([].concat(timeseriesData)),
        prediction_inputs,
        prediction_timeseries_start_date: prediction_inputs[0],
      });
      m1.forecastDates = timeseriesData.map(t => t.date);
      expect(m1.validateTimeseriesData()).rejects.toThrow(/must be inclusive of forecastDates/);
    });
    it('should fix prediction inputs to only predict inputs inclusive of forecastDates', async () => {
      const prediction_inputs = [
        getDatum(new Date('2020-04-02T00:00:00.000Z')),
        getDatum(new Date('2020-04-03T00:00:00.000Z')),
        getDatum(new Date('2020-04-04T00:00:00.000Z')),
        getDatum(new Date('2020-04-05T00:00:00.000Z')),
      ].sort(timeseriesSort);
      const m1 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: new DataSet([].concat(timeseriesData)),
        prediction_inputs,
        prediction_timeseries_start_date: prediction_inputs[0],
      });
      m1.forecastDates = timeseriesData.map(t => t.date);
      const validatedTimeseriesData = await m1.validateTimeseriesData();
      expect(validatedTimeseriesData.raw_prediction_inputs.length).toBe(2);


      const prediction_inputs2 = [
        getDatum(new Date('2020-04-04T00:00:00.000Z')),
        getDatum(new Date('2020-04-05T00:00:00.000Z')),
      ].sort(timeseriesSort);
      const m2 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: new DataSet([].concat(timeseriesData)),
        prediction_inputs: prediction_inputs2,
        prediction_timeseries_start_date: prediction_inputs2[0],
      });
      m2.forecastDates = timeseriesData.map(t => t.date);
      const validatedTimeseriesData2 = await m2.validateTimeseriesData({ fixPredictionDates: false, });
      expect(validatedTimeseriesData2.raw_prediction_inputs.length).toBe(2);

      const prediction_inputs3 = [
        getDatum(new Date('2020-04-04T00:00:00.000Z')),
        getDatum(new Date('2020-04-05T00:00:00.000Z')),
      ].sort(timeseriesSort);
      const m3 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: new DataSet([].concat(timeseriesData)),
        prediction_inputs: prediction_inputs3,
      });
      m3.forecastDates = timeseriesData.map(t => t.date);
      const validatedTimeseriesData3 = await m2.validateTimeseriesData();
      expect(validatedTimeseriesData3.raw_prediction_inputs.length).toBe(2);
      // console.log({ validatedTimeseriesData });
    });
  });
  describe('async getDataSetProperties', () => {
    const timeseriesData = [
      getDatum(new Date('2020-04-04T00:00:00.000Z')),
      getDatum(new Date('2020-04-05T00:00:00.000Z')),
      getDatum(new Date('2020-04-06T00:00:00.000Z')),
      getDatum(new Date('2020-04-07T00:00:00.000Z')),
      getDatum(new Date('2020-04-08T00:00:00.000Z')),
      getDatum(new Date('2020-04-09T00:00:00.000Z')),
      getDatum(new Date('2020-04-10T00:00:00.000Z')),
      getDatum(new Date('2020-04-11T00:00:00.000Z')),
    ].sort(timeseriesSort);
    it('should convert prediction next value functions ', async () => {
      const prediction_inputs_next_value_functions = [
        {
          variable_name: 'type',
          function_body: 'return "deposit"',
        },
        {
          variable_name: 'gen_type',
          function_body: 'return "deposit generated"',
        },
      ];
      const training_data_filter_function_body = 'return true;';
      const m1 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: new DataSet([].concat(timeseriesData)),
        prediction_inputs_next_value_functions,
        training_data_filter_function_body,
        // prediction_inputs,
        // prediction_timeseries_start_date: prediction_inputs[0],
      });
      await m1.getDataSetProperties();
      expect(m1.dimension).toBe(Dimensions.DAILY);
      expect(m1.training_data_filter_function).toHaveProperty('constructor');
      expect(m1.prediction_inputs_next_value_function).toHaveProperty('constructor');
    });
    it('should create Forecast Dates ', async () => {
      const prediction_inputs = [
        getDatum(new Date('2020-04-12T00:00:00.000Z')),
        getDatum(new Date('2020-04-13T00:00:00.000Z')),
      ].sort(timeseriesSort);
      const m1 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: new DataSet([].concat(timeseriesData)),
        prediction_inputs,
        prediction_timeseries_start_date: prediction_inputs[0].date,
        prediction_timeseries_end_date: prediction_inputs[1].date,
      });
      await m1.getDataSetProperties();
      expect(m1.forecastDates.length).toBe(2);
    });
    it('should create start and end prediction forecast Dates ', async () => {
      const prediction_inputs = [
        getDatum(new Date('2020-04-12T00:00:00.000Z')),
        getDatum(new Date('2020-04-13T00:00:00.000Z')),
      ].sort(timeseriesSort);
      const m1 = new ModelX({
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        DataSet: new DataSet([].concat(timeseriesData)),
        prediction_inputs,
      });
      await m1.getDataSetProperties();
      expect(m1.prediction_timeseries_start_date).toBeInstanceOf(Date);
      expect(m1.prediction_timeseries_end_date).toBeInstanceOf(Date);
      // expect(m1.training_data_filter_function).toHaveProperty('constructor');
      // expect(m1.prediction_inputs_next_value_function).toHaveProperty('constructor');
      // m1.forecastDates = timeseriesData.map(t => t.date);
      // console.log({ m1 });
    });
  });
  describe('async trainModel', () => {
    const timeseriesData = [
      getDatum(new Date('2020-04-04T00:00:00.000Z'),{amount:407}),
      getDatum(new Date('2020-04-05T00:00:00.000Z'),{amount:408}),
      getDatum(new Date('2020-04-06T00:00:00.000Z'),{amount:409}),
      getDatum(new Date('2020-04-07T00:00:00.000Z'),{amount:410}),
      getDatum(new Date('2020-04-08T00:00:00.000Z'),{amount:411}),
      getDatum(new Date('2020-04-09T00:00:00.000Z'),{amount:412}),
      getDatum(new Date('2020-04-10T00:00:00.000Z'),{amount:413}),
      getDatum(new Date('2020-04-11T00:00:00.000Z'),{amount:414}),
      getDatum(new Date('2020-04-12T00:00:00.000Z'),{amount:415}),
      getDatum(new Date('2020-04-13T00:00:00.000Z'),{amount:416}),
      getDatum(new Date('2020-04-14T00:00:00.000Z'),{amount:417}),
      getDatum(new Date('2020-04-15T00:00:00.000Z'),{amount:418}),
      getDatum(new Date('2020-04-16T00:00:00.000Z'),{amount:419}),
      getDatum(new Date('2020-04-17T00:00:00.000Z'),{amount:420}),
      getDatum(new Date('2020-04-18T00:00:00.000Z'),{amount:421}),
      getDatum(new Date('2020-04-19T00:00:00.000Z'),{amount:422}),
      getDatum(new Date('2020-04-20T00:00:00.000Z'),{amount:423}),
      getDatum(new Date('2020-04-21T00:00:00.000Z'),{amount:424}),
      getDatum(new Date('2020-04-22T00:00:00.000Z'),{amount:425}),
      getDatum(new Date('2020-04-23T00:00:00.000Z'),{amount:426}),
    ].sort(timeseriesSort);
    const data = [
      { input_1: 1, input_2: 10, input_3: 100, ignored_1: 1, output_1: 1000, output_2: 10000, },
      { input_1: 2, input_2: 20, input_3: 200, ignored_1: 2, output_1: 2000, output_2: 20000, },
      { input_1: 3, input_2: 30, input_3: 300, ignored_1: 3, output_1: 3000, output_2: 30000, },
      { input_1: 4, input_2: 40, input_3: 400, ignored_1: 4, output_1: 4000, output_2: 40000, },
      { input_1: 5, input_2: 50, input_3: 500, ignored_1: 5, output_1: 5000, output_2: 50000, },
      { input_1: 6, input_2: 60, input_3: 600, ignored_1: 6, output_1: 6000, output_2: 60000, },
      { input_1: 7, input_2: 70, input_3: 700, ignored_1: 7, output_1: 7000, output_2: 70000, },
      { input_1: 8, input_2: 80, input_3: 800, ignored_1: 8, output_1: 8000, output_2: 80000, },
      { input_1: 9, input_2: 90, input_3: 900, ignored_1: 9, output_1: 9000, output_2: 90000, },
    ];
    const independentVariables = [
      'input_1',
      'input_2',
      'input_3',
    ];
    const dependentVariables = [
      'output_1',
      'output_2',
    ];
    const featureColumns = [].concat(independentVariables, dependentVariables);
    const training_feature_column_options = featureColumns
      .reduce((result, val) => {
        result[ val ] = ['scale', 'standard', ];
        return result;
      }, {});
    it('should throw an error if missing inputs and outputs', async () => {
      const m1 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        trainingData: data,
      });
      const m2 = new ModelX({
        model_type: ModelTypes.REGRESSION,
        trainingData: data,
        preprocessing_feature_column_options: {
          ignored_1:['scale', 'standard', ],
        },
        x_independent_features: ['input_1'],
      });
      expect(m1.trainModel()).rejects.toThrow(/Missing Inputs/);
      expect(m2.trainModel()).rejects.toThrow(/Missing Outputs/);
    });
    it('should train a model', async () => {
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
        trainingData: data,
        training_data_filter_function: function (datum, dataIndex) {
          if (datum.input_1 === 5) return false;
          return true;
        },
        training_feature_column_options,
        x_independent_features: independentVariables,
        y_dependent_labels: dependentVariables,
      });
      await m1.trainModel();
      // console.log({ m1 });
      expect(m1.Model.trained).toBe(true);
      expect(m1.Model.compiled).toBe(true);
    }, 120000);
    it('should train a forecast model', async () => {
      const independent_variables = [
        'year',
        'month',
        'day',
        'late_payments',
      ];
      const dependent_variables = [
        'amount',
      ];
      const training_feature_column_options = {
        // amount: ['scale', 'standard',],
        year: ['onehot',],
        month: ['onehot',],
        day: ['onehot',],
      };
      const m1 = new ModelX({
        debug: false,
        use_mock_dates_to_fit_trainning_data: true,
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        trainingData: timeseriesData,
        training_feature_column_options,
        independent_variables,
        dependent_variables,
        // x_independent_features: independentVariables,
        // y_dependent_labels: dependentVariables,
      });
      await m1.trainModel();
      // console.log({ m1 });
      expect(m1.Model.trained).toBe(true);
      expect(m1.Model.compiled).toBe(true);
      expect(m1.x_raw_independent_features).toMatchObject(['year', 'month', 'day', 'late_payments']);
      expect(m1.y_raw_dependent_labels).toMatchObject(['amount']);
      expect(m1.preprocessing_feature_column_options).toMatchObject({ amount: ['median'] });
      expect(m1.training_feature_column_options).toMatchObject({
        year: ['onehot'],
        month: ['onehot'],
        day: ['onehot'],
        late_payments: ['label', { binary: true }],
        amount: ['scale', 'standard']
      });
      expect(m1.y_dependent_labels).toMatchObject(['amount']);
      // expect(m1.x_independent_features).toMatchObject(['year_2020', 'month_4', 'month_1', 'month_2', 'month_3', 'month_5', 'month_6', 'month_7', 'month_8', 'month_9', 'month_10', 'month_11', 'month_12', 'day_3', 'day_4', 'day_5', 'day_6', 'day_7', 'day_8', 'day_9', 'day_10', 'day_11', 'day_12', 'day_13', 'day_14', 'day_15', 'day_16', 'day_17', 'day_18', 'day_19', 'day_20', 'day_21', 'day_22', 'day_1', 'day_2', 'day_23', 'day_24', 'day_25', 'day_26', 'day_27', 'day_28', 'day_29', 'day_30', 'day_31', 'late_payments']);
    }, 120000);
  });
  describe('async getTrainingData', () => {
    it('should do nothing if no training data is passed', async () => {
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
      });
      expect(m1.trainingData.length).toBe(0);
      await m1.getTrainingData();
      expect(m1.trainingData.length).toBe(0);
    });
    it('should accept traningData via options', async () => {
      const {data, }=getMockRegression();
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
      });
      expect(m1.trainingData.length).toBe(0);
      await m1.getTrainingData({trainingData:data});
      expect(m1.trainingData.length).toBe(data.length);
    });
    it('should get trainingData via a getDataPromise function', async () => { 
      const {data, }=getMockRegression();
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
      });
      expect(m1.trainingData.length).toBe(0);
      async function getDataPromise() {
        return data;
      }
      await m1.getTrainingData({getDataPromise,});
      expect(m1.trainingData.length).toBe(data.length);
    }); 
  });
  describe('async checkTrainingStatus', () => {
    it('should return true if model is already trained', async () => {
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
      });
      m1.status.trained = true;
      m1.getTrainingData = jest.fn();
      m1.trainModel = jest.fn();
      const trainingStatus = await m1.checkTrainingStatus();
      expect(trainingStatus).toBe(true);
      expect(m1.getTrainingData).toBeCalledTimes(0);
      expect(m1.trainModel).toBeCalledTimes(0);
    });
    it('should retrain on demand if model is not trained', async () => {
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
      });
      // m1.status.trained = true;
      m1.getTrainingData = jest.fn();
      m1.trainModel = jest.fn();
      
      const trainingStatus = await m1.checkTrainingStatus();
      expect(trainingStatus).toBe(true);
      expect(m1.getTrainingData).toBeCalledTimes(1);
      expect(m1.trainModel).toBeCalledTimes(1);
      m1.status.trained = true;

      const trainingStatus2 = await m1.checkTrainingStatus();
      expect(trainingStatus2).toBe(true);
      expect(m1.getTrainingData).toBeCalledTimes(1);
      expect(m1.trainModel).toBeCalledTimes(1);

      const trainingStatus3 = await m1.checkTrainingStatus({ retrain: true });
      expect(trainingStatus3).toBe(true);
      expect(m1.getTrainingData).toBeCalledTimes(2);
      expect(m1.trainModel).toBeCalledTimes(2);
    });
  });
});