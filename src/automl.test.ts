import { TrainingProgressCallback, TrainingProgressUpdate } from './constants';
// import { getDate } from '../index';
import { getDateField, getInputs, getModelOptions, getModelTrainingOptions, splitTrainingPredictionData,getInputsOutputsFromDataset , getSpreadsheetDataset, getModel} from './jsonm';
import * as JSONM from './index';
import { ModelTypes } from './model';
import { toBeWithinRange, } from './jest.test';
expect.extend({ toBeWithinRange });
import {autoMLdata, autoMLdataSM, autoMLdataTNE} from './__test__/mock_automl_data'
import { Data } from '@jsonstack/data/src/DataSet';
import { setBackend } from './tensorflow_singleton';
import * as tf from '@tensorflow/tfjs-node';
setBackend(tf)

// request->jsonm->column matrix


describe('AutoML Sheets Test',()=>{
  describe('getInputsOutputsFromDataset',()=>{
    const labels = ['col1','col2','col3','col4','col5']
    const dataset = [ 
      {col1:1, col2:2, col3:3, col4:4, col5: 5}, 
      {col1:10, col2:20, col3:30, col4:undefined, col5: undefined}, 
    ]
    it('should generate inputs and outputs',()=>{
      const io=getInputsOutputsFromDataset({labels,dataset});
      expect(io.inputs).toMatchObject([ 'col1', 'col2', 'col3' ]);
      expect(io.outputs).toMatchObject([ 'col4', 'col5' ]);
    })
    it('should use supplied inputs and outputs',()=>{
      const io=getInputsOutputsFromDataset({labels,dataset,inputs:['in1','in2'],outputs:['out1']});
      expect(io.inputs).toMatchObject([ 'in1','in2' ]);
      expect(io.outputs).toMatchObject([ 'out1' ]);
  
    })
  })
  describe('getSpreadsheetDataset',()=>{
    it('should generate json dataset from spreadsheet data',()=>{
      const data =[
        ['col1','col2','col3'],
        [1,  2,  3,  ],
        [10, 20, 30, ]
      ];
      const shd = getSpreadsheetDataset(data);
      expect(shd.labels).toMatchObject(['col1', 'col2', 'col3'])
      expect(shd.vectors).toMatchObject([ [1,2,3], [10,20,30], ])
      expect(shd.dataset).toMatchObject([ {col1: 1, col2: 2, col3: 3,}, {col1: 10, col2: 20, col3: 30}, ] )
    });
    it('should work if you supply custom column labels',()=>{
      const data =[
        [1,  2,  3,  ],
        [10, 20, 30, ]
      ];
      const shd1 = getSpreadsheetDataset(data,{columnLabels:['col1', 'col2', 'col3']});
      expect(shd1.labels).toMatchObject(['col1', 'col2', 'col3'])
      expect(shd1.vectors).toMatchObject([ [1,2,3], [10,20,30], ])
    })
    it('should work if you do not supply custom column labels',()=>{
      const data =[
        [1,  2,  3,  ],
        [10, 20, 30, ]
      ];
      const shd1 = getSpreadsheetDataset(data,);
      expect(shd1.labels).toMatchObject(['column_1', 'column_2', 'column_3' ])
      expect(shd1.vectors).toMatchObject([ [1,2,3], [10,20,30], ])
      expect(shd1.dataset).toMatchObject([ {column_1: 1, column_2: 2, column_3: 3,}, {column_1: 10, column_2: 20, column_3: 30}, ] )
    });
  })
  describe('mock end to end example',()=>{
    it('should run a basic test from spreadsheet with no prediction data',async ()=>{
      const on_progress = ({ 
        completion_percentage, 
        loss,
        epoch, 
        logs, 
        status, 
        defaultLog, 
      }:TrainingProgressUpdate)=>{
        if(status!=='training') console.log({status,defaultLog})
      }
      // const vectors = autoMLdata?.data.concat([]);
      // const labels = vectors?.splice(0,1)[0] as string[];
      // const dataset = JSONM.Data.DataSet.reverseColumnMatrix({labels,vectors});\
      //@ts-ignore
      const{vectors,labels,dataset}=getSpreadsheetDataset(autoMLdataSM?.data,{on_progress});
      //@ts-ignore
      const {columns,inputs,outputs} = JSONM.getInputsOutputsFromDataset({dataset,labels, on_progress});
      const {trainingData,predictionData} = await splitTrainingPredictionData({
        inputs,
        outputs,
        data: dataset,
      });
      try{
        const SpreadsheetModel = await getModel({
          type:'prediction',
          inputs,
          outputs,
          dataset:trainingData,
          //@ts-ignore
          on_progress,
        });
        await SpreadsheetModel.trainModel();
      } catch(e){
        expect(e).toBeInstanceOf(RangeError)
      }
    },30000)
    it('should run a basic test from spreadsheet with small prediction data',async ()=>{
      const on_progress = ({ 
        completion_percentage, 
        loss,
        epoch, 
        logs, 
        status, 
        defaultLog, 
      }:TrainingProgressUpdate)=>{
        if(status!=='training') console.log({status,defaultLog})
      }
      // const vectors = autoMLdata?.data.concat([]);
      // const labels = vectors?.splice(0,1)[0] as string[];
      // const dataset = JSONM.Data.DataSet.reverseColumnMatrix({labels,vectors});\
      //@ts-ignore
      const{vectors,labels,dataset}=getSpreadsheetDataset(autoMLdataTNE?.data,{on_progress});
      //@ts-ignore
      const {columns,inputs,outputs} = JSONM.getInputsOutputsFromDataset({dataset,labels, on_progress});
      const {trainingData,predictionData} = await splitTrainingPredictionData({
        inputs,
        outputs,
        data: dataset,
      });
      console.log({trainingData,predictionData})
      const SpreadsheetModel = await getModel({
        type:'prediction',
        inputs,
        outputs,
        dataset:trainingData,
        //@ts-ignore
        on_progress,
      });
      await SpreadsheetModel.trainModel();
    },30000)
    it('should run a basic test from spreadsheet data',async ()=>{
      const on_progress = ({ 
        completion_percentage, 
        loss,
        epoch, 
        logs, 
        status, 
        defaultLog, 
      }:TrainingProgressUpdate)=>{
        if(status!=='training') console.log({status,defaultLog})
      }
      // const vectors = autoMLdata?.data.concat([]);
      // const labels = vectors?.splice(0,1)[0] as string[];
      // const dataset = JSONM.Data.DataSet.reverseColumnMatrix({labels,vectors});\
      //@ts-ignore
      const{vectors,labels,dataset}=getSpreadsheetDataset(autoMLdata?.data,{on_progress});
      //@ts-ignore
      const {columns,inputs,outputs} = JSONM.getInputsOutputsFromDataset({dataset,labels, on_progress});
      const {trainingData,predictionData} = await splitTrainingPredictionData({
        inputs,
        outputs,
        data: dataset,
      });
      // console.log({trainingData,predictionData});
      const SpreadsheetModel = await getModel({
        type:'prediction',
        inputs,
        outputs,
        dataset:trainingData,
        //@ts-ignore
        on_progress,
      });
      await SpreadsheetModel.trainModel();
  

    },30000)
  })
});
