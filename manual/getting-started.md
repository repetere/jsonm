<link id="viewx-style-style-0" rel="stylesheet" type="text/css" href="https://unpkg.com/highlight.js@9.18.1/styles/darkula.css">
<!-- <script src="https://unpkg.com/highlight.js@9.18.1/lib/highlight.js"> </script> -->

---
### JSONM Manual
 - [Getting Started](https://repetere.github.io/jsonm/manual/getting-started/index.html)
 - [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
 - [Data Preprocessing](https://repetere.github.io/jsonm/manual/data-preprocessing/index.html)
 - [Feature Engineering](https://repetere.github.io/jsonm/manual/feature-engineering/index.html)
 - [Model Training](https://repetere.github.io/jsonm/manual/model-training/index.html)
 - [Model Evaluation](https://repetere.github.io/jsonm/manual/model-evaluation/index.html)
 - [Model Predictions](https://repetere.github.io/jsonm/manual/model-predictions/index.html)
 - [Saving and Loading Models](https://repetere.github.io/jsonm/manual/saving-and-loading-models/index.html)
 - [JSONM & JML Spec](https://repetere.github.io/jsonm/manual/spec/index.html)
 - [Examples](https://repetere.github.io/jsonm/manual/examples/index.html)
 - [Full API Docs](https://repetere.github.io/jsonm/)
---

# Getting started

JSONM is a library that creates Tensorflow models from JSON. JSONM works by converting JSON Objects that follow the JML JSON spec into a Tensorflow model that can be trained, evaluated and used to make predictions.

JSONM can normalize, scale, feature engineer inputs and outputs automatically. You can also specify how JSONM creates your model for you.

## A simple linear regression example
```Typescript
import {getModel} from '@jsonstack/jsonm'; 

const inputs = ['height',];
const outputs = [ 'weight',];
function on_progress({ completion_percentage, loss, epoch, status, }){ 
  console.log({ completion_percentage, loss, epoch, status, })
}
const exampleJSON: JML = {
  type: 'regression',
  inputs,
  outputs,
  on_progress,
  dataset:[
    {height:61, weight:105},
    {height:62, weight:120},
    {height:63, weight:120},
    {height:65, weight:160},
    {height:65, weight:120},
    {height:68, weight:145},
    {height:69, weight:175},
    {height:70, weight:160},
    {height:72, weight:185},
    {height:75, weight:210},
  ]
}
const simpleModel = await getModel(exampleJSON); 
await simpleModel.trainModel()
const predictions = await simpleModel.predictModel( 
  [
    { height: 60, },
    { height: 71, },
    { height: 80, },
  ],
);
/*
=>  predictions: [
  { weight: 99.99914637982626, height: 60 },
  { weight: 177.6612194038534, height: 71 },
  { weight: 241.20291735639228, height: 80 }
]
*/
```

## Usages ##
JSONM is great for
-  Adding TensorFlow models to JAMStack based applications
-  Quickly building models directly in the browser or Node.js
-  Serving previously trained Tensorflow models

JSONM is not great for
- A heavy exploratory analysis

## Example ##
<iframe width="100%" height="500" src="https://jsfiddle.net/yawetse/4ph1vwes/21/embedded/result,js,html,css,resources/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>


## Next: [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
---
### JSONM Manual
 - [Getting Started](https://repetere.github.io/jsonm/manual/getting-started/index.html)
 - [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
 - [Data Preprocessing](https://repetere.github.io/jsonm/manual/data-preprocessing/index.html)
 - [Feature Engineering](https://repetere.github.io/jsonm/manual/feature-engineering/index.html)
 - [Model Training](https://repetere.github.io/jsonm/manual/model-training/index.html)
 - [Model Evaluation](https://repetere.github.io/jsonm/manual/model-evaluation/index.html)
 - [Model Predictions](https://repetere.github.io/jsonm/manual/model-predictions/index.html)
 - [Saving and Loading Models](https://repetere.github.io/jsonm/manual/saving-and-loading-models/index.html)
 - [JSONM & JML Spec](https://repetere.github.io/jsonm/manual/spec/index.html)
 - [Examples](https://repetere.github.io/jsonm/manual/examples/index.html)
 - [Full API Docs](https://repetere.github.io/jsonm/)
---
