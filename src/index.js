import _ from 'lodash';
import path from 'path';
import { readFileSync } from 'fs';
import getFormatter from './formatters';
import getParsedData from './parsers';


const createNode = (operation, key, valueBefore, valueAfter) => ({
  operation, key, valueBefore, valueAfter,
});

const getDiffData = (objectBefore, objectAfter, key) => {
  const keys = _.union(_.keys(objectBefore), _.keys(objectAfter)).sort();

  // TODO: Далее нужно обойти объекты по ключу keys и возвращать разницу

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
    const children = keys.map((item) => getDiffData(objectBefore[item], objectAfter[item], item));

    return { key, children };
  }

  return {};
};

const getFileFormatName = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  return extension.slice(1);
};

const getDataFromFile = (filePath) => readFileSync(filePath, 'utf8');

const genDiff = (fileNameBefore, fileNameAfter, format) => {
  const objectBefore = getParsedData(getDataFromFile(fileNameBefore), getFileFormatName(fileNameBefore));
  const objectAfter = getParsedData(getDataFromFile(fileNameAfter), getFileFormatName(fileNameAfter));

  const diff = getDiffData(objectBefore, objectAfter);

  const formatDiff = getFormatter(format);

  return formatDiff(diff);
};

export default genDiff;
