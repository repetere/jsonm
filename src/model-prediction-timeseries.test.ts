import { ModelX, ModelTypes, EvaluateRegressionModel, EvaluateClassificationModel, } from './model';
import  { Dimensions, getIsOutlier, mockDates } from './constants';
import { DataSet, } from '@modelx/data/src/index';
import { Faker, getData, getDatum, timeseriesSort, getMockClassification, getMockRegression, getMockTimeseries, } from './util';

describe('ModelX', () => {
  describe('async predictModel', () => {
    const timeseriesData = getMockTimeseries();
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
        next_value_functions: [
          {
            variable_name: 'type',
            function_body: 'return "withdrawal"';
          }
        ]
      });
      expect(m1.status.trained).toBe(false);
      const predictions = await m1.predictModel({ includeEvaluation: false, includeInputs: true });
      expect(m1.status.trained).toBe(true);
      expect(m1.Model.trained).toBe(true);
      // console.log({ predictions });

      // expect(predictions.length).toBe(prediction_inputs.length);
      // expect(predictions[0].input_1).toBe(prediction_inputs[0].input_1);
      // expect(predictions[0].output_1).toBeLessThanOrEqual(predictions[predictions.length - 1].output_1);
      // console.log('data.length',data.length)
    }, 15000);
  });
});