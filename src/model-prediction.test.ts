import { ModelX, ModelTypes, getGeneratedStatefulFunction, sumPreviousRows, } from './model';
import  { Dimensions, getIsOutlier, mockDates } from './constants';
import { DataSet, } from '@modelx/data/src/index';
import { Faker, getData, getDatum, timeseriesSort, getMockClassification, getMockRegression, getMockTimeseries, } from './util';

describe('ModelX', () => {
  describe('async predictModel', () => {
    const regressionData = getMockRegression();
    const classificationData = getMockClassification();
    it('should handle regression predictions', async () => {
      const { prediction_inputs, independent_variables, dependent_variables, data, } = regressionData;
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
        prediction_inputs,
        independent_variables,
        dependent_variables,
        training_options: {
          fit: {
            batchSize: data.length,
            epochs: 300,
          }
        },
        trainingData: data,
      });
      expect(m1.status.trained).toBe(false);
      const predictions = await m1.predictModel({ includeEvaluation: false, includeInputs: true });
      expect(m1.status.trained).toBe(true);
      expect(m1.Model.trained).toBe(true);
      // console.log({ predictions });
      expect(predictions.length).toBe(prediction_inputs.length);
      expect(predictions[0].input_1).toBe(prediction_inputs[0].input_1);
      expect(predictions[0].output_1).toBeLessThanOrEqual(predictions[predictions.length - 1].output_1);
      // console.log('data.length',data.length)
    },15000);
    it('should handle classification predictions', async () => {
      const { prediction_inputs, independent_variables, dependent_variables, data, } = classificationData;
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.CLASSIFICATION,
        prediction_inputs,
        independent_variables,
        dependent_variables,
        training_options: {
          fit: {
            batchSize: data.length,
            epochs: 300,
          }
        },
        trainingData: data,
      });
      expect(m1.status.trained).toBe(false);
      const predictions = await m1.predictModel({ includeEvaluation: false, includeInputs: true });
      // console.log('m1.trainDataSet',m1.trainDataSet);
      expect(m1.status.trained).toBe(true);
      expect(m1.Model.trained).toBe(true);
      // console.log({ predictions });
      expect(predictions.length).toBe(prediction_inputs.length);
      expect(predictions[0].animal).toBe('dog');
      expect(predictions[1].animal).toBe('cat');
      // expect(predictions[0].output_1).toBeLessThan(predictions[predictions.length - 1].output_1);
      // console.log('data.length',data.length)
    },15000);
    // it('should accept traningData via options', async () => {
    //   const {data, }=getMockRegression();
    //   const m1 = new ModelX({
    //     debug:false,
    //     model_type: ModelTypes.REGRESSION,
    //   });
    //   expect(m1.trainingData.length).toBe(0);
    //   await m1.getTrainingData({trainingData:data});
    //   expect(m1.trainingData.length).toBe(data.length);
    // });
    // it('should get trainingData via a getDataPromise function', async () => { 
    //   const {data, }=getMockRegression();
    //   const m1 = new ModelX({
    //     debug:false,
    //     model_type: ModelTypes.REGRESSION,
    //   });
    //   expect(m1.trainingData.length).toBe(0);
    //   async function getDataPromise() {
    //     return data;
    //   }
    //   await m1.getTrainingData({getDataPromise,});
    //   expect(m1.trainingData.length).toBe(data.length);
    // }); 
  });
  describe('async evaluateModel', () => {
    const regressionData = getMockRegression();
    const classificationData = getMockClassification();
    it('should handle regression evaluations', async () => {
      const { prediction_inputs, independent_variables, dependent_variables, data, } = regressionData;
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
        prediction_inputs,
        independent_variables,
        dependent_variables,
        training_options: {
          fit: {
            batchSize: data.length,
            epochs: 300,
          }
        },
        trainingData: data,
      });
      expect(m1.status.trained).toBe(false);
      const evaluation = await m1.evaluateModel({});
      console.log({ evaluation });
      expect(m1.status.trained).toBe(true);
      expect(m1.Model.trained).toBe(true);
      // console.log({ predictions });
      // expect(predictions.length).toBe(prediction_inputs.length);
      // expect(predictions[0].input_1).toBe(prediction_inputs[0].input_1);
      // expect(predictions[0].output_1).toBeLessThanOrEqual(predictions[predictions.length - 1].output_1);
      // console.log('data.length',data.length)
    },15000);
    it('should handle classification evaluations', async () => {
      const { prediction_inputs, independent_variables, dependent_variables, data, } = classificationData;
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.CLASSIFICATION,
        prediction_inputs,
        independent_variables,
        dependent_variables,
        training_options: {
          fit: {
            batchSize: data.length,
            epochs: 300,
          }
        },
        trainingData: data,
      });
      expect(m1.status.trained).toBe(false);
      const evaluation = await m1.evaluateModel({});
      // console.log('m1.trainDataSet',m1.trainDataSet);
      expect(m1.status.trained).toBe(true);
      expect(m1.Model.trained).toBe(true);
      console.log({ evaluation });
      // expect(predictions.length).toBe(prediction_inputs.length);
      // expect(predictions[0].animal).toBe('dog');
      // expect(predictions[1].animal).toBe('cat');
      // expect(predictions[0].output_1).toBeLessThan(predictions[predictions.length - 1].output_1);
      // console.log('data.length',data.length)
    },15000);
    // it('should accept traningData via options', async () => {
    //   const {data, }=getMockRegression();
    //   const m1 = new ModelX({
    //     debug:false,
    //     model_type: ModelTypes.REGRESSION,
    //   });
    //   expect(m1.trainingData.length).toBe(0);
    //   await m1.getTrainingData({trainingData:data});
    //   expect(m1.trainingData.length).toBe(data.length);
    // });
    // it('should get trainingData via a getDataPromise function', async () => { 
    //   const {data, }=getMockRegression();
    //   const m1 = new ModelX({
    //     debug:false,
    //     model_type: ModelTypes.REGRESSION,
    //   });
    //   expect(m1.trainingData.length).toBe(0);
    //   async function getDataPromise() {
    //     return data;
    //   }
    //   await m1.getTrainingData({getDataPromise,});
    //   expect(m1.trainingData.length).toBe(data.length);
    // }); 
  });
});