<link id="viewx-style-style-0" rel="stylesheet" type="text/css" href="https://unpkg.com/highlight.js@9.18.1/styles/darkula.css">
<!-- <script src="https://unpkg.com/highlight.js@9.18.1/lib/highlight.js"> </script> -->

---
### JSONM Manual
 - [Getting Started](https://repetere.github.io/jsonm/manual/getting-started/index.html)
 - Working With Data
   - [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
   - [Data Preprocessing](https://repetere.github.io/jsonm/manual/data-preprocessing/index.html)
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

## How JSONM works

JSONM works by translating a JSON object that follows the JML spec into a tensorflow model using both [@jsonstack/data](https://repetere.github.io/jsonm-data/) and [@jsonstack/model](https://repetere.github.io/jsonm-model/).

### [@jsonstack/data](https://repetere.github.io/jsonm-data/)
The jsonstack data module is a library that constructs datasets for machine learning models. [@jsonstack/data](https://repetere.github.io/jsonm-data/) contains methods for preprocessing and feature engineering data. You can find out more about how [@jsonstack/data](https://repetere.github.io/jsonm-data/) works from the documentation. JSONM can be used to automate preprocessing and feature engineering for you.

### [@jsonstack/model](https://repetere.github.io/jsonm-model/)
The jsonstack model module is a library that constructs tensorflow models for machine learning models. [@jsonstack/model](https://repetere.github.io/jsonm-model/) contains classes for various kinds of machine learning and artifical intelligence models. You can find out more about how [@jsonstack/model](https://repetere.github.io/jsonm-model/) works from the documentation. JSONM can be used to automatically define, train and evaluate tensorflow models for you.

## Declarative vs Imperative Models
The primary way to build a Tensorflow model JSONM is to use the declarative model description via a JSON object that follows the JML spec. In some instances if you need to finely control how your models are trained and evaluated, the JSONModel Class is how models are created and can be used to manually create models.

Read more about manual model creation in [Advanced Topics](https://repetere.github.io/jsonm/manual/advanced-topics/index.html).


## Next: [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
---
### JSONM Manual
 - [Getting Started](https://repetere.github.io/jsonm/manual/getting-started/index.html)
 - Working With Data
   - [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
   - [Data Preprocessing](https://repetere.github.io/jsonm/manual/data-preprocessing/index.html)
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
