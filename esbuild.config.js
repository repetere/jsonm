import esbuild from "esbuild";
import { nodeBuiltIns } from "esbuild-node-builtins";
import brode from '@geut/esbuild-plugin-brode'
import alias from 'esbuild-plugin-alias';
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// import GlobalsPlugin from "esbuild-plugin-globals";

const watch = (process.argv.includes('-w') || process.argv.includes('-watch'))
  ? {
    onRebuild(error,result){
      console.log('rebuilt',{error,result});
    }
  }
  : false;
const globalName = 'JSONM';
const entryPoints = ['src/index.ts'];
const webPlugins = [nodeBuiltIns(),   alias({
  '@jsonstack/data': path.resolve(__dirname, 'node_modules/@jsonstack/data/dist/esm/index.js'),
  '@jsonstack/model': path.resolve(__dirname, 'node_modules/@jsonstack/model/dist/esm/index.js'),
}), brode()];
const webCorePlugins = webPlugins.concat([
  // GlobalsPlugin({
  //   react: "React",
  //   'react-dom': "ReactDOM"
  // })
],
);
const serverPlugins = [  alias({
  // '@jsonstack/data': '@jsonstack/data/dist/esm',
  // '@jsonstack/model': '@jsonstack/model/dist/esm',
})];
const serverExternals = [
  "@jsonstack/data",
  "@jsonstack/model",
  "flat",
  "luxon",
  "outlier",
  "promisie",
  "@tensorflow-models/universal-sentence-encoder",
  "@tensorflow/tfjs",
  "@tensorflow/tfjs-node",
  "lodash.range",
  'valid-url',
  'http',
  'https',
  'axios',
  'stemmer',
  'node-fetch',
  "csvtojson",
  "js-grid-search-lite",
  "lodash.range",
  "lodash.rangeright",
  "ml-confusion-matrix",
  "ml-matrix",
  "ml-stat",
  "natural",
  "node-fpgrowth",
  "probability-distributions",
  "random-js",
  "valid-url",
  'wordnet-db',
  'webworker-threads',
  'lapack'
];



void async function main(){
  try {
    const browserMinifiedBuild = await esbuild.build({
      watch,
      format:'iife',
      globalName,
      entryPoints,
      bundle:true,
      minify:true,
      sourcemap:true,
      target:['es2019'],
      plugins: webPlugins,
      outfile:'dist/web/index.min.js'
    });
    const browserBuild = await esbuild.build({
      watch,
      format:'iife',
      globalName,
      entryPoints,
      bundle:true,
      minify:false,
      sourcemap:true,
      target:['es2019'],
      plugins: webPlugins,
      outfile:'dist/web/index.js'
    });
    const browserLegacyBuild = await esbuild.build({
      watch,
      format:'iife',
      globalName,
      entryPoints,
      bundle:true,
      minify:false,
      sourcemap:true,
      target:['es6'],
      plugins: webCorePlugins,
      outfile:'dist/web/index.legacy.js'
    });
    const browserLegacyMinifiedBuild = await esbuild.build({
      watch,
      format:'iife',
      globalName,
      entryPoints,
      bundle:true,
      minify:true,
      sourcemap:true,
      target:['es6'],
      plugins: webCorePlugins,
      outfile:'dist/web/indexlegacy-min.js'
    });

    const cjsBuild = await esbuild.build({
      watch,
      format:'cjs',
      globalName,
      entryPoints,
      bundle:true,
      minify:false,
      external: serverExternals,
      sourcemap:false,
      platform:'node',
      plugins: serverPlugins,
      outfile:'dist/cjs/index.js'
    });
    const esmBuild = await esbuild.build({
      watch,
      format:'esm',
      globalName,
      entryPoints,
      bundle:true,
      minify:false,
      external: serverExternals,
      sourcemap:false,
      platform:'node',
      plugins: serverPlugins,
      outfile:'dist/esm/index.js'
    });

    console.log({
      browserMinifiedBuild,
      browserBuild,
      browserLegacyBuild, 
      browserLegacyMinifiedBuild,
      cjsBuild, 
      esmBuild
    });
  } catch(e){
    console.error(e);
  }
}();