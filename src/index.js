import process from 'process';
import path from 'path';
import { readFileSync } from 'fs';

const normalizeObject = (obj) => {
  const entries = Object.entries(obj);

  const fn = (acc, item) => {
    acc[item[0]] = item[1];
    return acc;
  };

  return entries.reduce(fn, {});
}

const getJsonDataFromFile = (filePath) => {
  let returnValue;

  try {
    returnValue = JSON.parse(readFileSync(filePath), 'ut');
  } catch (e) {
    console.log(e.message);
  }

  return returnValue;
};

const getFullFilePath = (fileName) => {
  return path.isAbsolute(fileName) ? fileName : path.resolve(process.cwd(), fileName);
};




const genDiff = (pathToFile1, pathToFile2) => {
  const filePathBefore = getFullFilePath(pathToFile1);
  const filePathAfter = getFullFilePath(pathToFile2);

  const rawObjectBefore = getJsonDataFromFile(filePathBefore);
  const rawObjectAfter = getJsonDataFromFile(filePathAfter);

  if (!rawObjectBefore || !rawObjectAfter) {
    console.log('Error reading file!');
    return;
  }

  const objectBefore = normalizeObject(rawObjectBefore);
  const objectAfter = normalizeObject(rawObjectAfter);

  //-------------------------------------------

  const keysBefore = Object.keys(objectBefore);
  const keysAfter = Object.keys(objectAfter);

  const allKeys = [...keysBefore, ...keysAfter].reduce((acc, item) => acc.includes(item) ? acc : [...acc, item], []);

  const addedKeys = keysAfter.filter((item) => !keysBefore.includes(item));
  const deletedKeys = keysBefore.filter((item) => !keysAfter.includes(item));
  const changedKeys = allKeys.filter((item) => keysAfter.includes(item) && keysBefore.includes(item) && (objectBefore[item] !== objectAfter[item]));

  const notChangedKeys = keysBefore.filter((item) => !changedKeys.includes(item) && !deletedKeys.includes(item));

  //  console.log(`notChangedKeys: ${notChangedKeys} \nchangedKeys: ${changedKeys}\n\n`);

  //  output block
  let resultValue = '{';

  for (let item of notChangedKeys) {
    resultValue +=`\n    ${item}: ${objectBefore[item]}`;
  };

  for (let item of changedKeys) {
    resultValue += `\n  - ${item}: ${objectBefore[item]}`;
    resultValue += `\n  + ${item}: ${objectAfter[item]}`;
  };

  for (let item of deletedKeys) {
    resultValue += `\n  - ${item}: ${objectBefore[item]}`;
  };

  for (let item of addedKeys) {
    resultValue += `\n  + ${item}: ${objectAfter[item]}`;
  };

  resultValue += '\n}';

  return resultValue;
};

export default genDiff;
