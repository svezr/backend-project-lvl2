import _ from 'lodash';
import path from 'path';
import { readFileSync } from 'fs';
import process from 'process';
import getFormatter from './formatters';
import getParsedData from './parsers';


const createNode = (operation, key, valueBefore, valueAfter) => ({
  operation, key, valueBefore, valueAfter,
});

const getDiff = (objectBefore, objectAfter, key) => {
  const keys = _.union(_.keys(objectBefore), _.keys(objectAfter)).sort();

  if (_.isEqual(objectBefore, objectAfter)) {
    return createNode('none', key, objectBefore, objectAfter);
  }

  if (!objectBefore && objectAfter) {
    return createNode('add', key, objectBefore, objectAfter);
  }

  if (objectBefore && !objectAfter) {
    return createNode('remove', key, objectBefore, objectAfter);
  }

  if (
    (_.isPlainObject(objectBefore) && !_.isPlainObject(objectAfter))
    || (!_.isPlainObject(objectBefore) && _.isPlainObject(objectAfter))
  ) {
    return createNode('modify', key, objectBefore, objectAfter);
  }

  if (!_.isPlainObject(objectBefore) && !_.isPlainObject(objectAfter)) {
    return createNode('modify', key, objectBefore, objectAfter);
  }

  if (_.isPlainObject(objectBefore) && _.isPlainObject(objectAfter) && !_.isEqual(objectBefore, objectAfter)) {
    const children = keys.map((item) => getDiff(objectBefore[item], objectAfter[item], item));

    return { key, children };
  }

  return {};
};

const getFileFormatName = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (!extension) {
    throw new Error('No file extension detected!');
  }

  return extension.slice(1);
};

const getDataFromFile = (filePath) => {
  let rawData = '';
  const fullFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  try {
    rawData = readFileSync(fullFilePath, 'utf8');
  } catch (e) {
    throw new Error(`Error reading file!\n${e.name}: ${e.message}`);
  }

  return rawData;
};

const genDiff = (fileNameBefore, fileNameAfter, format) => {
  const objectBefore = getParsedData(getDataFromFile(fileNameBefore), getFileFormatName(fileNameBefore));
  const objectAfter = getParsedData(getDataFromFile(fileNameAfter), getFileFormatName(fileNameAfter));

  const diff = getDiff(objectBefore, objectAfter);

  const formatDiff = getFormatter(format);

  return formatDiff(diff);
};

export default genDiff;


// const getDiff = (objectBefore, objectAfter) => {
//   const resultDiff = {};

//   const keys = _.union(_.keys(objectBefore), _.keys(objectAfter)).sort();

//   if (_.isEqual(objectBefore, objectAfter)) {
//     console.log('none');
//     return
//   }
//
//   if (!objectBefore && objectAfter) {
//     console.log('added');
//     return objectAfter
//   }

//   if (objectBefore && !objectAfter) {
//     console.log('deleted');
//     return objectBefore
//   }
//   if (
//     (_.isPlainObject(objectBefore) && !_.isPlainObject(objectAfter))
//     ||
//     (!_.isPlainObject(objectBefore) && _.isPlainObject(objectAfter))
//   ) {
//     console.log('changed');
//     return objectAfter
//   }

//   //2 неОбъекта
//   if (!_.isPlainObject(objectBefore) && !_.isPlainObject(objectAfter)) {
//     console.log('changed')
//     return {ob1: objectBefore, ob2: objectAfter}
//   }
//   //остается только вариант, когда 2 объекта

//   resultDiff.children = keys.map((item) => getDiff(objectBefore[item], objectAfter[item]));

//   return resultDiff;
// };

// const getDiff = (objectBefore, objectAfter, key = undefined) => {
//   if (key) {
//     const valueBefore = objectBefore[key];
//     const valueAfter = objectAfter[key];

//     const valueChanged = !_.isEqual(valueBefore, valueAfter);

//     const bothValueAreObjects = _.isPlainObject(valueBefore) && _.isPlainObject(valueAfter);
//     const onlyOneOfValuesIsAnObject = !bothValueAreObjects && (_.isPlainObject(valueBefore) || _.isPlainObject(valueAfter));
//     const bothValuesExist = _.has(objectBefore, key) && _.has(objectAfter, key);

//     const operationMap = {
//       modify: (bothValuesExist && valueChanged) || (bothValuesExist && onlyOneOfValuesIsAnObject),
//       remove: _.has(objectBefore, key) && !_.has(objectAfter, key),
//       add: !_.has(objectBefore, key) && _.has(objectAfter, key),
//     };

//     const operationsKeys = Object.keys(operationMap);
//     const child = operationsKeys.reduce((acc, item) => (
//       operationMap[item] ? { ...acc, operation: item } : acc
//     ),
//     {
//       operation: 'none',
//       key,
//       valueBefore,
//       valueAfter,
//     }
// );

//     if (bothValueAreObjects) {
//       child.children = getDiff(valueBefore, valueAfter).children;
//     }
//     return child;
//   }

//   const resultDiff = {};

//   const keys = _.union(_.keys(objectBefore), _.keys(objectAfter)).sort();

//   resultDiff.children = keys.map((item) => getDiff(objectBefore, objectAfter, item));

//   return resultDiff;
// }
// ;
