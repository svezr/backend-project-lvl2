import _ from 'lodash';
import path from 'path';
import { readFileSync } from 'fs';
import process from 'process';
import getFormatter from './formatters';
import getParsedData from './parsers';


const getDiff = (sourceObjectBefore, sourceObjectAfter) => {
  const createChild = (key, objectBefore, objectAfter) => {
    const valueBefore = objectBefore[key];
    const valueAfter = objectAfter[key];

    const valueNotChanged = _.isEqual(valueBefore, valueAfter);
    const bothValuesExist = _.has(objectBefore, key) && _.has(objectAfter, key);
    const bothValuesAreObjects = bothValuesExist && (_.isPlainObject(valueBefore) && _.isPlainObject(valueAfter));

    const onlyOneOfValuesIsAnObject = !bothValuesAreObjects && (_.isPlainObject(valueBefore) || _.isPlainObject(valueAfter));

    let operation = 'none';

    if (onlyOneOfValuesIsAnObject || (!valueNotChanged)) {
      operation = 'modify';
    }

    if (_.has(objectBefore, key) && !_.has(objectAfter, key)) {
      operation = 'remove';
    }

    if (!_.has(objectBefore, key) && _.has(objectAfter, key)) {
      operation = 'add';
    }

    const child = {
      operation,
      key,
      valueBefore,
      valueAfter,
    };

    if (bothValuesAreObjects) {
      child.children = getDiff(valueBefore, valueAfter).children;
    }

    return child;
  };

  const resultDiff = {};

  const keys = _.union(_.keys(sourceObjectBefore), _.keys(sourceObjectAfter)).sort();

  if (keys.length > 0) {
    resultDiff.children = keys.reduce((acc, item) => {
      const child = createChild(item, sourceObjectBefore, sourceObjectAfter);
      return [...acc, child];
    }, []);
  }

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
    throw new Error(`Error processing file!\n${e.name}: ${e.message}`);
  }
  return rawData;
};

const genDiff = (fileNameBefore, fileNameAfter, format) => {
  const objectBefore = getParsedData(getDataFromFile(fileNameBefore), getFileFormatName(fileNameBefore));
  const objectAfter = getParsedData(getDataFromFile(fileNameAfter), getFileFormatName(fileNameAfter));

  const diff = getDiff(objectBefore, objectAfter);

  const formatter = getFormatter(format);

  return formatter(diff);
};

export default genDiff;
