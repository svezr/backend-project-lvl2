import _ from 'lodash';
import path from 'path';
import { readFileSync } from 'fs';
import process from 'process';
import getFormatter from './formatters';
import getParsedData from './parsers';


const getDiff = (objectBefore, objectAfter, key = undefined) => {
  if (key) {
    const valueBefore = objectBefore[key];
    const valueAfter = objectAfter[key];

    const valueChanged = !_.isEqual(valueBefore, valueAfter);

    const bothValueAreObjects = _.isPlainObject(valueBefore) && _.isPlainObject(valueAfter);
    const onlyOneOfValuesIsAnObject = !bothValueAreObjects && (_.isPlainObject(valueBefore) || _.isPlainObject(valueAfter));
    const bothValuesExist = _.has(objectBefore, key) && _.has(objectAfter, key);

    const operationMap = {
      modify: (bothValuesExist && valueChanged) || (bothValuesExist && onlyOneOfValuesIsAnObject),
      remove: _.has(objectBefore, key) && !_.has(objectAfter, key),
      add: !_.has(objectBefore, key) && _.has(objectAfter, key),
      none: true,
    };

    const operationsKeys = Object.keys(operationMap);
    
    // operationsKeys.forEach((operation) => {
      
      
    //   if (operationMap[operation]) {
    //     const child = {
    //       operation,
    //       key,
    //       valueBefore,
    //       valueAfter,
    //     };

    //     if (bothValueAreObjects) {
    //       child.children = getDiff(valueBefore, valueAfter).children;
    //     }

    //     return child;
    //   }
    // }
    // );
    
    // operationsKeys.map((operation, index) => {
    //   // const operation = operationMap[item];
    //    console.log(index)
    //   if (operationMap[operation]){
    //     const child = {
    //       operation,
    //       key,
    //       valueBefore,
    //       valueAfter,
    //     };

    //     if (bothValueAreObjects && valueChanged) {
    //       child.children = getDiff(valueBefore, valueAfter).children;
    //     }

    //     return child;
    //   }
    // });

    for (let i = 0; i < operationsKeys.length; i += 1) {
      const operation = operationsKeys[i];

      if (operationMap[operation]) {
        const child = {
          operation,
          key,
          valueBefore,
          valueAfter,
        };

        if (bothValueAreObjects) {
          child.children = getDiff(valueBefore, valueAfter).children;
        }

        return child;
      }
    }


  }

  const resultDiff = {};

  const keys = _.union(_.keys(objectBefore), _.keys(objectAfter)).sort();

  resultDiff.children = keys.map((item) => getDiff(objectBefore, objectAfter, item));

  return resultDiff;
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
