import { ModelX, ModelTypes, EvaluateRegressionModel, EvaluateClassificationModel, } from './model';
import  { Dimensions, getIsOutlier, mockDates } from './constants';
import { DataSet, } from '@modelx/data/src/index';
import { Faker, getData, getDatum, timeseriesSort, getMockClassification, getMockRegression, getMockTimeseries, } from './util';

describe('ModelX', () => {
  /*
  describe('evaluateClassificationAccuracy', () => {
    it('should return classification accuracy', () => {
      const testClassification = {
        dependent_feature_label: 'testClassification',
        estimatesDescaled: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(v => ({ testClassification: v })),
        actualsDescaled: [0, 2, 0, 4, 0, 6, 0, 8, 0, 0].map(v => ({ testClassification: v })),
      };
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.CLASSIFICATION,
      });
      const evaluation = m1.evaluateClassificationAccuracy(testClassification);
      expect(evaluation.accuracy).toBe(0.5);
      // console.log('evaluation', evaluation);
    });
    it('should return regression accuracy', () => { 
      const testRegression = {
        dependent_feature_label: 'testRegression',
        estimatesDescaled: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => ({ testRegression: v })),
        actualsDescaled: [9, 20, 31, 40, 49, 60, 71, 80, 89, 101].map(v => ({ testRegression: v })),
      };
      
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
      });
      const evaluation = m1.evaluateRegressionAccuracy(testRegression);
      expect(evaluation.accuracyPercentage).toBeGreaterThanOrEqual(0.98);
      // console.log('evaluation', evaluation);
    });
  });
  */
  describe('async predictModel', () => {
    const regressionData = getMockRegression();
    const classificationData = getMockClassification();
    const timeseriesData = getMockTimeseries();
    /*
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
    }, 15000);
    */
    it('should handle timeseries predictions', async () => {
      const { prediction_inputs, independent_variables, dependent_variables,timeseriesData:data, } = timeseriesData;
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
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
      console.log({ predictions });

      // expect(predictions.length).toBe(prediction_inputs.length);
      // expect(predictions[0].input_1).toBe(prediction_inputs[0].input_1);
      // expect(predictions[0].output_1).toBeLessThanOrEqual(predictions[predictions.length - 1].output_1);
      // console.log('data.length',data.length)
    }, 15000);
    /*
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
    */
  });
  /*
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
      const evaluation = await m1.evaluateModel({}) as EvaluateRegressionModel;
      // console.log({ evaluation });
      expect(m1.status.trained).toBe(true);
      expect(m1.Model.trained).toBe(true);
      expect(evaluation.output_1.standardError).toBeGreaterThan(0);

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
      const evaluation = await m1.evaluateModel({}) as EvaluateClassificationModel;
      // console.log('evaluation.animal',evaluation.animal);
      expect(m1.status.trained).toBe(true);
      expect(m1.Model.trained).toBe(true);
      expect(evaluation.animal.accuracy).toBeGreaterThan(0);
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
  */
});