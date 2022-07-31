import { TrainingProgressCallback } from './constants';
// import { getDate } from '../index';
import { getDateField, getInputs, getModelOptions, getModelTrainingOptions, splitTrainingPredictionData } from './jsonm';
import { ModelTypes } from './model';
import { toBeWithinRange, } from './jest.test';
expect.extend({ toBeWithinRange });

describe('JSONM',()=>{
  describe('getModelTrainingOptions',()=>{
    it('should run without errors',()=>{
      const modelOptions = getModelTrainingOptions()
      expect(modelOptions).toMatchObject({
        fit: {
          epochs: 300,
          batchSize: 20,
        }
      })
    })
  })
  describe('getDateField',()=>{
    it('should return default date',()=>{
      const dateField = getDateField()
      expect(dateField).toBe('date')
    })
    it('should return date from training data',()=>{
      const dateField = getDateField({Date:new Date()})
      expect(dateField).toBe('Date')
    })
  })
  describe('getModelOptions',()=>{
    it('should return default options',()=>{
      const defaultOptions = getModelOptions()
      //@ts-ignore
      const defaultOptions1 = getModelOptions({model_options:{validate_training_data:true, }});
      //@ts-ignore
      const defaultOptions2 = getModelOptions({type:'forecast'});
      expect(defaultOptions).toMatchObject({})
      expect(defaultOptions1).toMatchObject({validate_training_data:true, })
      expect(defaultOptions2).toMatchObject({
        prediction_timeseries_time_zone: undefined,
        prediction_timeseries_date_feature: 'date',
        prediction_timeseries_date_format: undefined,
        use_mock_dates_to_fit_trainning_data:true,
        validate_training_data: true,
        retrain_forecast_model_with_predictions: true,
        use_preprocessing_on_trainning_data: true,
        training_feature_column_options: {
          year: ['onehot',],
          month: ['onehot',],
          day: ['onehot',],
        }
      })
    })
  })
  describe('getInputs',()=>{
    it('should add date inputs',()=>{
      const defaultInputs = getInputs({type:'forecast',inputs:['x'],outputs:[]})
      expect(defaultInputs).toMatchObject([ 'x', 'year', 'month', 'day' ]);
    })
    it('should not modify non forecast inputs',()=>{
      const regressionInputs = getInputs({type:'regression',inputs:['x1','x2'],outputs:[]})
      expect(regressionInputs).toMatchObject([ 'x1', 'x2', ]);
    })
  })
  describe('splitTrainingPredictionData',()=>{
    it('should handle empty inputs', async()=>{
      // deepcode ignore MissingArgument/test: used in jest
      const {trainingData,predictionData} = await splitTrainingPredictionData();
      expect(trainingData).toMatchObject([]);
      expect(predictionData).toMatchObject([]);
    })
    it('should split predictions when output is missing', async ()=>{
      const splitData1 = await splitTrainingPredictionData({
        inputs:['input1'],
        outputs:['output1'],
        data:[
          { input1:1,output1:1},
          { input1:2,output1:2},
          { input1:3,},
          { input1:4,output1:null},
          { input1:5,output1:5},
          { input1:6,output1:6},
        ]
      });
      expect(splitData1.trainingData).toMatchObject([
        { input1:1,output1:1},
        { input1:2,output1:2},
        { input1:5,output1:5},
        { input1:6,output1:6},
      ]);
      expect(splitData1.predictionData).toMatchObject([
        { input1:3,},
        { input1:4,output1:null},
      ]);
      // console.log({splitData});
    });
  })
})
