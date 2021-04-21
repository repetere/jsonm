<link id="viewx-style-style-0" rel="stylesheet" type="text/css" href="https://unpkg.com/highlight.js@9.18.1/styles/darkula.css">
<!-- <script src="https://unpkg.com/highlight.js@9.18.1/lib/highlight.js"> </script> -->

---
### JSONM Manual
 - [Getting Started](https://repetere.github.io/jsonm/manual/getting-started/index.html)
 - Working With Data
   - [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
   - [Feature Engineering](https://repetere.github.io/jsonm/manual/feature-engineering/index.html)
 - Working With Models
   - [Model Training](https://repetere.github.io/jsonm/manual/model-training/index.html)
   - [Model Evaluation](https://repetere.github.io/jsonm/manual/model-evaluation/index.html)
   - [Model Predictions](https://repetere.github.io/jsonm/manual/model-predictions/index.html)
   - [Saving and Loading Models](https://repetere.github.io/jsonm/manual/saving-and-loading-models/index.html) 
 - [Advanced Topics](https://repetere.github.io/jsonm/manual/advanced-topics/index.html)
   - [JSONM & JML Spec](https://repetere.github.io/jsonm/manual/spec/index.html)
   - [Examples](https://repetere.github.io/jsonm/manual/examples/index.html)
   - [Full API Docs](https://repetere.github.io/jsonm/)
---

# Data fetching

JSONM is designed to let you describe how to load model training data into your TensorFlow model via JSON and uses @jsonstack/data to construct training data for your model. The training data for your model can come from one or many data sources. JSONM also exposes the `getDataSet` asynchronous function that can be used to retrieve data independently.

1. [Static Training Data](#dataset) - defining training data directly on your JML JSON Object on the `dataset` property
2. [Using JDS JSON Data](#getdataset) - getModel's `dataset` property can also be defined as a JDS JSON Object that returns training data from calling `getDataSet`
   1. [JDS](#jds) - JSON DataSet JSON spec
   2. [JSON Training Data]('#static-data) - `dataset.data` or `dataset._static_data`
   3. [Dynamic Training Data]('#dynamic-data)
      1. [Fetching JSON from a URL]('#data-url) - `dataset._data_url`
      2. [Fetching JSON from CSV/TSV from a URL]('#data-csv) - `dataset._data_csv` or `dataset._data_tsv`
      3. [Fetching JSON from a custom JavaScript Promise]('#data-promise) - `dataset._data_promise`
   3. [Transforming and Combining Multiple Data Sources]('#data-reducer)  - `dataset.reducer`
## <a name="dataset">1. Static Training Data </a>

The most straightforward way of defining your training data, is to assign your model training data directly to the `dataset` property. When using static data, the `dataset` property expects to be an array of JSON objects.

```TypeScript
const JML = {
  type, // required, e.g. 'regression'
  inputs, // required, e.g. ['x']
  outputs, // required, e.g. ['y']
  dataset: [ //define static data
    {x:1,y:2,},
    {x:2,y:4,},
    {x:3,y:6,},
  ],
};
const Model = await getModel(JML); 
```

## <a name="getdataset">2. Using JDS JSON Data </a>

Another way to set the training data for your model is to use JDS JSON in your `dataset` property. When `getModel` is called with `JML` and the `dataset` property is not an array of JSON objects, the `dataset` property is passed to the `getDataSet` function.

The `getDataSet` method expects to be called with an JDS (JSON DataSet) formatted Object.

### <a name="jds">2.1 JDS </a>
JDS Objects are defined as:
```TypeScript
export type JDS = {
  name?: string;
  id?: string;
  reducer?: Reducer;
  pre_transform?: string | genericFunction;
  post_transform?: string | genericFunction;
  data?: Data;
  _data_static?: Data;
  _data_url?: string;
  _data_csv?: string;
  _data_tsv?: string;
  _data_csv_options?: CSVOptions;
  _data_promise?: genericFunction;
}
```
### <a name="static-data">2.2 JSON Training Data </a>
The most simple use case would be just defining static data using JDS `data` or `_static_data`

```TypeScript
import { getModel, getDataSet} from '@jsonstack/jsonm'
const JDS = {
  data:[ //define static data
    {x:1,y:2,},
    {x:2,y:4,},
    {x:3,y:6,},
  ]
};

const JDS2 = {
  _data_static:[ //define static data
    {x:1,y:2,},
    {x:2,y:4,},
    {x:3,y:6,},
  ]
};

const JML = {
  type, // required, e.g. 'regression'
  inputs, // required, e.g. ['x']
  outputs, // required, e.g. ['y']
  dataset: JDS || JDS2 || await getDataSet(JDS || JDS2 )
};

const Model = await getModel(JML); 
```
### <a name="data-dynamic">2.3 Dynamic Training Data </a>
The primary use case for defining your training data with JDS JSON is because you need to fetch, combine and transform data from one or multiple sources.

#### <a name="data-url">2.3.1 Fetching JSON from a URL </a>
JSONM can be used to fetch JSON from a remote location by defining `_data_url`

```TypeScript
import { getModel, getDataSet} from '@jsonstack/jsonm'
const JDS = {
   _data_url: 'https://jsonplaceholder.typicode.com/posts'
};


const JML = {
  type, // required, e.g. 'regression'
  inputs, // required, e.g. ['x']
  outputs, // required, e.g. ['y']
  dataset: JDS
  /* resolves to:
    [
      {
        userId: 1,
        id: 1,
        title: "sunt auto"
      },
      {
        userId: 1,
        id: 2,
        title: "qui est esse",
        body: "est rerum"
      },
      ...
    ]
  */
};

const Model = await getModel(JML); 
```
#### <a name="data-csv">2.3.2 Fetching JSON from CSV/TSV from a URL </a>
JSONM can be used to fetch JSON from a remote CSV/TSV location by defining `_data_csv` or `_data_tsv`. Both TSVs and CSVs will accept additional loading options that are defined on `_data_csv_options`

```TypeScript
import { getModel, getDataSet} from '@jsonstack/jsonm'
const JDS = {
  _data_csv:'https://raw.githubusercontent.com/repetere/modelx-model/master/src/test/mock/data/iris_data.csv',
  _data_csv_options:{} //options passed to csvtojson module
};

const JML = {
  type, // required, e.g. 'regression'
  inputs, // required, e.g. ['x']
  outputs, // required, e.g. ['y']
  dataset: JDS 
  /* resolves to:
    [
      {
        sepal_length_cm: 5.1, sepal_width_cm: 3.5, petal_length_cm: 1.4, petal_width_cm: 0.2, plant: 'Iris-setosa'
      },
      ...
    ]
  */
};

const Model = await getModel(JML); 
```
#### <a name="data-promise">2.3.3 Fetching JSON from a custom JavaScript Promise </a>
JSONM can be used to fetch JSON from any asynchronus function of Promise  by defining `_data_promise`. This allows for JSONM to load data from user defined functions.

```TypeScript
import { getModel, getDataSet} from '@jsonstack/jsonm'
const JDS = {
  _data_promise:new Promise((resolve,reject)=>{
    resolve([ 
      {x:1,y:2,},
      {x:2,y:4,},
      {x:3,y:6,},
    ])
  })
};

const JML = {
  type, // required, e.g. 'regression'
  inputs, // required, e.g. ['x']
  outputs, // required, e.g. ['y']
  dataset: JDS 
  /* resolves to:
    [ //define static data
      {x:1,y:2,},
      {x:2,y:4,},
      {x:3,y:6,},
    ]
  */
};

const Model = await getModel(JML); 
```
## <a name="data-reducer">3. Combining Multiple Data Sources</a>
JSONM can resolve multiple datasets objects into training data by using a reducer function. Reducer functions can pipe output from one function as the input to another function by defining multiple functions. 

Reducers iterate over the JDS JSON objects defined in the `reducer.datasets` property. Reducers can be infinately nested for even more flexibility.

Reducer functions can be defined as either a string of an asynchronous function body that returns the data you want, or an asychronous function.

```TypeScript
export type reducerFunction = (datasetData:DataSets) => Promise<Data>;

export type Reducer = {
  reducer_function: string | reducerFunction | Array<string|reducerFunction>;
  name?: string;
  context?: any;
  datasets: Array<JDS|Data>;
}
```

Reducers are a super powerful and flexible way to combine data from multiple sources. In order to reference datasets in your reducer functions, you can either explicitly set a name for the dataset or `dataset_${index}` name will be assigned automatically. Reducers can be used in the following way:
```TypeScript
import { getModel, getDataSet} from '@jsonstack/jsonm'

function combineDataSets(datasets){
  return datasets.firstDS.map((datum,i)=> {
    return {
      ...datum,
      ...datasets.secondDS[i],
      combined_x: datum.x+datasets.secondDS[i].x2,
      combined_y: datum.y+datasets.secondDS[i].y2,
    }
  })
}
const JDS = {
  reducer:{
    reducer_function: combineDataSets,
    datasets:[
      {
        name:'firstDS',
        data:[
          {x:1,y:2,},
          {x:2,y:4,},
          {x:3,y:6,},
        ],
      },
      {
        name:'secondDS',
        data:[
          {x:10,y:20,},
          {x:20,y:40,},
          {x:30,y:60,},
        ],
      }
    ]
  }
};

const JML = {
  type, // required, e.g. 'regression'
  inputs, // required, e.g. ['x']
  outputs, // required, e.g. ['y']
  dataset: JDS 
  /* resolves to:
      { x:1, y:2, x2:10, y:20, combined_x:11, combined_y:22, },
      { x:2, y:4, x2:20, y:40, combined_x:22, combined_y:44, },
      { x:3, y:6, x2:30, y:60, combined_x:33, combined_y:66, },
    ]
  */
};

const Model = await getModel(JML); 
```

## Next: [Feature Engineering](https://repetere.github.io/jsonm/manual/feature-engineering/index.html)
---
### JSONM Manual
 - [Getting Started](https://repetere.github.io/jsonm/manual/getting-started/index.html)
 - Working With Data
   - [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
   - [Feature Engineering](https://repetere.github.io/jsonm/manual/feature-engineering/index.html)
 - Working With Models
   - [Model Training](https://repetere.github.io/jsonm/manual/model-training/index.html)
   - [Model Evaluation](https://repetere.github.io/jsonm/manual/model-evaluation/index.html)
   - [Model Predictions](https://repetere.github.io/jsonm/manual/model-predictions/index.html)
   - [Saving and Loading Models](https://repetere.github.io/jsonm/manual/saving-and-loading-models/index.html) 
 - [Advanced Topics](https://repetere.github.io/jsonm/manual/advanced-topics/index.html)
   - [JSONM & JML Spec](https://repetere.github.io/jsonm/manual/spec/index.html)
   - [Examples](https://repetere.github.io/jsonm/manual/examples/index.html)
   - [Full API Docs](https://repetere.github.io/jsonm/)
---
