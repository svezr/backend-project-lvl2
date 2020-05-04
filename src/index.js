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

const getFullFilePath = (fileName) => (path.isAbsolute(fileName)
  ? fileName : path.resolve(process.cwd(), fileName));

const getJsonDataFromFile = (filePath) => {
  let returnValue;

  try {
    returnValue = JSON.parse(readFileSync(getFullFilePath(filePath)), 'utf8');
  } catch (e) {
    console.log(e.message);
  }

  return returnValue;
};


const getCompiledAnswer = (objectBefore, objectAfter, notChangedKeys, changedKeys,
  deletedKeys, addedKeys) => {
  let resultValue = '{';

  for (let i = 0; i < notChangedKeys.length; i += 1) {
    const item = notChangedKeys[i];
    resultValue += `\n    ${item}: ${objectBefore[item]}`;
  }

  for (let i = 0; i < changedKeys.length; i += 1) {
    const item = changedKeys[i];

    resultValue += `\n  - ${item}: ${objectBefore[item]}`;
    resultValue += `\n  + ${item}: ${objectAfter[item]}`;
  }

  for (let i = 0; i < deletedKeys.length; i += 1) {
    const item = deletedKeys[i];
    resultValue += `\n  - ${item}: ${objectBefore[item]}`;
  }

  for (let i = 0; i < addedKeys.length; i += 1) {
    const item = addedKeys[i];
    resultValue += `\n  + ${item}: ${objectAfter[item]}`;
  }

  resultValue += '\n}';

  return resultValue;
};

const genDiff = (filename1, filename2) => {
  const rawObjectBefore = getJsonDataFromFile(filename1);
  const rawObjectAfter = getJsonDataFromFile(getFullFilePath(filename2));

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
