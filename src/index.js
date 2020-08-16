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
