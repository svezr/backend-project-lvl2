import process from 'process';
import path from 'path';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

const normalizeObject = (obj) => {
  const entries = Object.entries(obj);

  const fn = (acc, item) => {
    const [objectKey, objectValue] = item;

    acc[objectKey] = objectValue;
    return acc;
  };

  return entries.reduce(fn, {});
};

const getFullFilePath = (fileName) => (path.isAbsolute(fileName)
  ? fileName : path.resolve(process.cwd(), fileName));

const getParser = (filePath) => {
  const format = path.extname(filePath);

  switch (format.toLowerCase()) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.safeLoad;
    case '.ini':
      // return ini.parse
      break;
    default:
      return undefined;
  }
};

const getObjectFromFile = (filePath) => {
  let returnValue;

  try {
    const fileData = readFileSync(getFullFilePath(filePath));
    const parseData = getParser(filePath);

    if (!parseData) {
      throw new Error('Unknown extension!');
    }

    returnValue = parseData(fileData);
  } catch (e) {
    console.log(e.message);
  }

  return returnValue;
};

const getCompiledAnswer = (objectBefore, objectAfter, notChangedKeys, changedKeys,
  deletedKeys, addedKeys) => {
  const valuesNotChanged = notChangedKeys.slice().sort().reduce((prev, item) => `${prev}\n    ${item}: ${objectBefore[item]}`, '');

  const valuesChanged = changedKeys.slice().sort().reduce((prev, item) => `${prev}\n  - ${item}: ${objectBefore[item]}\n  + ${item}: ${objectAfter[item]}`, '');

  const valuesDeleted = deletedKeys.slice().sort().reduce((prev, item) => `${prev}\n  - ${item}: ${objectBefore[item]}`, '');

  const valuesAdded = addedKeys.slice().sort().reduce((prev, item) => `${prev}\n  + ${item}: ${objectAfter[item]}`, '');

  return `{${valuesNotChanged}${valuesChanged}${valuesDeleted}${valuesAdded}\n}`;
};

const genDiff = (filename1, filename2) => {
  const rawObjectBefore = getObjectFromFile(filename1);
  const rawObjectAfter = getObjectFromFile(filename2);

  if (!rawObjectBefore || !rawObjectAfter) {
    console.log('Error reading file!');
    return;
  }

  const objectBefore = normalizeObject(rawObjectBefore);
  const objectAfter = normalizeObject(rawObjectAfter);

  const keysBefore = Object.keys(objectBefore);
  const keysAfter = Object.keys(objectAfter);

  const allKeys = [...keysBefore, ...keysAfter].reduce((acc, item) => (
    acc.includes(item) ? acc : [...acc, item]), []);

  const addedKeys = keysAfter.filter((item) => !keysBefore.includes(item));
  const deletedKeys = keysBefore.filter((item) => !keysAfter.includes(item));
  const changedKeys = allKeys.filter((item) => (keysAfter.includes(item)
          && keysBefore.includes(item) && (objectBefore[item] !== objectAfter[item])));

  const notChangedKeys = keysBefore.filter((item) => (!changedKeys.includes(item)
          && !deletedKeys.includes(item)));

  return getCompiledAnswer(objectBefore, objectAfter, notChangedKeys, changedKeys,
    deletedKeys, addedKeys);
};

export default genDiff;
