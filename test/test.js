import path from 'path';
import process from 'process';
import fs, { readFileSync } from 'fs';

//  todo: проверить, если указываются относительные пути (напр, ./qwe.test)????

const normalizeObject = (obj) => {
  entries = Object.entries(obj);

  return entries.reduce((acc, item) => acc[item[0]] = item[1], {});
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
  return path.resolve(process.cwd(), fileName);
};

const genDiff = () => {

  // console.log(path.resolve('/fdsfsd/','fdsfffff','dddddddddd'));
  const fullpath1 = getFullFilePath('struct1.json');
  
  console.log(fullpath1);


  const fullpath2 = getFullFilePath('struct2.json');
  
  console.log(getJsonDataFromFile(fullpath1));




  return
  // Нормализуем объект - приводим последующие строки к но
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  const allKeys = [...keys1, ...keys2].reduce((acc, item) => acc.includes(item) ? acc : [...acc, item], []);

  const sameKeys = keys1.filter(item => object1[item] === object2[item]);
  const changedKeys = allKeys.filter(item => !sameKeys.includes(item))

  console.log(`sameKeys: ${sameKeys} \nchangedKeys: ${changedKeys}`)
}

genDiff()