import path from 'path';
import process from 'process';
import fs, { readFileSync } from 'fs';

//  todo: проверить, если указываются относительные пути (напр, ./qwe.test)????

const normalizeObject = (obj) => {
  const entries = Object.entries(obj);

  const fn = (acc, item) => {
    acc[item[0]] = item[1];
    return acc;
  };

  return entries.reduce(fn, {});
}

const getJsonDataFromFile = (filePath) => {
  let returnValue = undefined;

  try {
    returnValue = JSON.parse(readFileSync(filePath), 'ut');
  } catch (e) {
    console.log(e.message);    
  };

  return returnValue;
};

const getFullFilePath = (fileName) => { 
  return path.isAbsolute(fileName)  ? fileName : path.resolve(process.cwd(), fileName);
};

const genDiff = () => {

  
  const filePathBefore = getFullFilePath('struct1.json');  
  const filePathAfter = getFullFilePath('struct2.json');

  // console.log(`filePathBefore: ${filePathBefore}\nfilePathAfter: ${filePathAfter}\n`);

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

  // console.log(keysBefore);
  // console.log(keysAfter)

   const allKeys = [...keysBefore, ...keysAfter].reduce((acc, item) => acc.includes(item) ? acc : [...acc, item], []);

  //  console.log(allKeys + '\n')

  const notChangedKeys = keysBefore.filter(item => keysAfter.includes(item));

  const changedKeys = allKeys.filter(item => keysAfter.includes(item) && (keysBefore[item] !== keysAfter[item]));

  const addedKeys = keysAfter.filter(item => !keysBefore.includes(item));
  const deletedKeys = keysBefore.filter(item => !keysAfter.includes(item));

  // console.log(`notChangedKeys: ${notChangedKeys} \nchangedKeys: ${changedKeys}\n\n`);

    // console.log(allKeys)
     console.log(changedKeys)
    //  console.log(deletedKeys);

  console.log('{')
  for (let item of notChangedKeys) {
    console.log(`   ${item}: ${objectBefore[item]}`)
  };

  for (let item of changedKeys) {
    console.log(` + ${item}: ${objectAfter[item]}`)
    console.log(` - ${item}: ${objectBefore[item]}`)
  };

  for (let item of deletedKeys) {
    console.log(` -  ${item}: ${objectBefore[item]}`)
  };

  for (let item of addedKeys) {
    console.log(` -  ${item}: ${objectAfter[item]}`)
  };

  console.log('}')



}

genDiff()