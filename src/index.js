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

    const valueNotChanged = _.isEqual(valueBefore, valueAfter);

    const bothValueAreObjects = _.isPlainObject(valueBefore) && _.isPlainObject(valueAfter);
    const onlyOneOfValuesIsAnObject = !bothValueAreObjects && (_.isPlainObject(valueBefore) || _.isPlainObject(valueAfter));

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

    if (bothValueAreObjects) {
      child.children = getDiff(valueBefore, valueAfter).children;
    }

    return child;

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
