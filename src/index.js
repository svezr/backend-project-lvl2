import process from 'process';
import path from 'path';
import { readFileSync } from 'fs';

const normalizeObject = (obj) => {
  const entries = Object.entries(obj);

  const fn = (acc, item) => {
    const [objectKey, objectValue] = item;

    acc[objectKey] = objectValue;
    return acc;
  };

  return entries.reduce(fn, {});
};

const getJsonDataFromFile = (filePath) => {
  let returnValue;

  try {
    returnValue = JSON.parse(readFileSync(filePath), 'utf8');
  } catch (e) {
    console.log(e.message);
  }

  return returnValue;
};

const getFullFilePath = (fileName) => (path.isAbsolute(fileName)
  ? fileName : path.resolve(process.cwd(), fileName));

const genDiff = (pathToFile1, pathToFile2) => {
  const rawObjectBefore = getJsonDataFromFile(getFullFilePath(pathToFile1));
  const rawObjectAfter = getJsonDataFromFile(getFullFilePath(pathToFile2));

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

  let resultValue = '{';

  resultValue += notChangedKeys.reduce((acc, item) => `${acc}\n    ${item}: ${objectBefore[item]}`, resultValue);
  resultValue += changedKeys.reduce((acc, item) => `${acc}\n    ${item}: ${objectBefore[item]}\n  + ${item}: ${objectAfter[item]}`, resultValue);
  resultValue += deletedKeys.reduce((acc, item) => `${acc}\n  - ${item}: ${objectBefore[item]}`, resultValue);
  resultValue += addedKeys.reduce((acc, item) => `${acc}\n  + ${item}: ${objectAfter[item]}`, resultValue);

  resultValue += '\n}';

  return resultValue;
};

export default genDiff;
