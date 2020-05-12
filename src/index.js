//  собрать AST -> stylish(AST) -> stringValue

import getObjectFromFile from './parsers';
import _ from 'lodash';



const getDiff = (objectBefore, objectAfter) => {
  const resultDiff = {};

  resultDiff.children = [];
  const keys = _.uniq([...Object.keys(objectBefore), ...Object.keys(objectAfter)]).sort();

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    let operation = 'none';

    const valueBefore = objectBefore[key];
    const valueAfter = objectAfter[key];

    const bothValuesExist = _.has(objectBefore,key) && _.has(objectAfter, key);
    const bothValuesAreObjects = bothValuesExist && (_.isPlainObject(valueBefore) && _.isPlainObject(valueAfter));
    const onlyOneOfValuesIsAnObject = !bothValuesAreObjects && (_.isPlainObject(objectBefore) || _.isPlainObject(objectAfter));

    if (bothValuesAreObjects) {
      const tmp = getDiff(valueBefore, valueAfter);
      // console.log(`!\t${tmp}`)
      resultDiff.children.push(tmp);
      continue;
    }

    if (onlyOneOfValuesIsAnObject || (valueBefore !== valueAfter)) {
      operation = 'modify';
    }

    if (valueBefore === valueAfter) {
      operation = 'none';
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

    resultDiff[key] = child;
    // resultDiff.children.push(child);
  }

  // console.log(`!!!\t ${Object.values(resultDiff)[0]}\t${Object.values(resultDiff)[1]}`)
  return resultDiff;
};

const normalizeObject = (obj) => {
  const entries = Object.entries(obj);

  const fn = (acc, item) => {
    const [objectKey, objectValue] = item;

    acc[objectKey] = objectValue;
    return acc;
  };

  return entries.reduce(fn, {});
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

  return getDiff(objectBefore, objectAfter);
};

export default genDiff;


//  Рабочая версия, которую отметаем из-за того, что нужен отдельный объект-посредник ast и функция stylish, которая форматирует дифф
// const getPrintValue = (item, margin = 0) => {
//   if (!_.isPlainObject(item)) {
//     return item;
//   }

//   let result = '{';
//   const objectKeys = Object.keys(item);

//   for (let key of objectKeys) {
//     const keyValue = item[key];
//     const value = _.isPlainObject(keyValue) ? getPrintValue(keyValue, margin) : keyValue;

//     result += '\n' + ' '.repeat(margin+4) + `${key}: ${value}`;
//   }

//   result += '\n' + ' '.repeat(margin) + '}';
//   return result;
// };

// const getOperationType = (beforeObject, afterObject, key) => {
//   let operation = 'none';

//   const bothItemsAreObjects = _.isPlainObject(beforeItem) && _.isPlainObject(afterItem);

//   if (!(_.has(beforeObject, key)) && _.has(afterObject, key)) {
//     operation = 'add';
//   }

//   if (_.has(beforeObject, key) && !(_.has(afterObject, key))) {
//     operation = 'remove';
//   }

//   if ((_.has(beforeObject, key) && _.has(afterObject, key))
//     && !(_.isEqual(beforeObject[key], afterObject[key]))) {
//     operation = 'change';
//   };

//   if ((operation === 'change') && bothItemsAreObjects) {
//     operation = 'changeObjects';
//   }

//   return operation;
// };

// const diff = (beforeObject, afterObject, margin = 0) => {

//   let s = '{';

//   const outputPrefix = '\n' + ' '.repeat(margin);

//   const keysBefore = Object.keys(beforeObject);
//   const keysAfter = Object.keys(afterObject);
//   const keys = _.uniq([...keysBefore, ...keysAfter]).sort();

//   const operationsPrefix = {
//     none: `${outputPrefix}    `,
//     add: `${outputPrefix}  + `,
//     remove: `${outputPrefix}  - `,
//     change: `${outputPrefix}  - `,
//     changedObjects: `${outputPrefix}    `,
//   };

//   for (let i = 0; i < keys.length; i += 1) {
//     const key = keys[i];

//     const beforeItem = beforeObject[key];
//     const afterItem = afterObject[key];

//     const operation = getOperationType(beforeObject, afterObject, key);
//     const prefix = `${operationsPrefix[operation]}${key}: `;

//     switch (operation) {
//       case 'none':
//         s += `${prefix}${getPrintValue(beforeItem, margin + 4)}`;
//         break;
//       case 'add':
//         s += `${prefix}${getPrintValue(afterItem, margin + 4)}`;
//         break;
//       case 'remove':
//         s += `${prefix}${getPrintValue(beforeItem, margin + 4)}`;
//         break
//       case 'change':
//         s += `${prefix}${getPrintValue(beforeItem, margin + 4)}`;
//         s += `${prefix}${getPrintValue(afterItem, margin + 4)}`;
//         break;
//       case 'changeObjects':
//         s += `${prefix}${diff(beforeItem, afterItem, margin + 4)}`;
//         break;
//       default:
//         break;
//     }
//   }

//   s += `${outputPrefix}}`;

//   return s;
// };

// const normalizeObject = (obj) => {
//   const entries = Object.entries(obj);

//   const fn = (acc, item) => {
//     const [objectKey, objectValue] = item;

//     acc[objectKey] = objectValue;
//     return acc;
//   };

//   return entries.reduce(fn, {});
// };

// const genDiff = (filename1, filename2) => {

//   const rawObjectBefore = getObjectFromFile(filename1);
//   const rawObjectAfter = getObjectFromFile(filename2);

//   if (!rawObjectBefore || !rawObjectAfter) {
//     console.log('Error reading file!');
//     return;
//   }

//   const objectBefore = normalizeObject(rawObjectBefore);
//   const objectAfter = normalizeObject(rawObjectAfter);

//   return diff(objectBefore, objectAfter);
// };
//////////////////////////////////////////////////
// const normalizeObject = (obj) => {
//   const entries = Object.entries(obj);

//   const fn = (acc, item) => {
//     const [objectKey, objectValue] = item;

//     acc[objectKey] = objectValue;
//     return acc;
//   };

//   return entries.reduce(fn, {});
// };

// const buildAnswer = (objectBefore, objectAfter, notChangedKeys, changedKeys,
//   deletedKeys, addedKeys) => {
//   const valuesNotChanged = notChangedKeys.slice().sort().reduce((prev, item) => `${prev}\n    ${item}: ${objectBefore[item]}`, '');

//   const valuesChanged = changedKeys.slice().sort().reduce((prev, item) => `${prev}\n  - ${item}: ${objectBefore[item]}\n  + ${item}: ${objectAfter[item]}`, '');

//   const valuesDeleted = deletedKeys.slice().sort().reduce((prev, item) => `${prev}\n  - ${item}: ${objectBefore[item]}`, '');

//   const valuesAdded = addedKeys.slice().sort().reduce((prev, item) => `${prev}\n  + ${item}: ${objectAfter[item]}`, '');

//   return `{${valuesNotChanged}${valuesChanged}${valuesDeleted}${valuesAdded}\n}`;
// };

// const genDiff = (filename1, filename2) => {
//   const rawObjectBefore = getObjectFromFile(filename1);
//   const rawObjectAfter = getObjectFromFile(filename2);

//   if (!rawObjectBefore || !rawObjectAfter) {
//     console.log('Error reading file!');
//     return;
//   }

//   const objectBefore = normalizeObject(rawObjectBefore);
//   const objectAfter = normalizeObject(rawObjectAfter);

//   const keysBefore = Object.keys(objectBefore);
//   const keysAfter = Object.keys(objectAfter);

//   const allKeys = [...keysBefore, ...keysAfter].reduce((acc, item) => (
//     acc.includes(item) ? acc : [...acc, item]), []);

//   const addedKeys = keysAfter.filter((item) => !keysBefore.includes(item));
//   const deletedKeys = keysBefore.filter((item) => !keysAfter.includes(item));
//   const changedKeys = allKeys.filter((item) => (keysAfter.includes(item)
//           && keysBefore.includes(item) && (objectBefore[item] !== objectAfter[item])));

//   const notChangedKeys = keysBefore.filter((item) => (!changedKeys.includes(item)
//           && !deletedKeys.includes(item)));

//   return buildAnswer(objectBefore, objectAfter, notChangedKeys, changedKeys,
//     deletedKeys, addedKeys);
// };




// TODO: новый алгоритм

// // import _ from 'lodash';
// const { _ } = require('lodash')

// const beforeObject = {
//   beforeValue: 'beforeValue',
//    struct1: {a: 122, b: 43},
//   beforeValue1: 'beforeValue1',
//   beforeValue2: 'beforeValue2',
//   valueString: 'value1',
//   valueNumber: {st: '1', a: 23},
// };

// const afterObject = {
//    struct1: {a: 122, z: 'fdsfsdf', l: {m:333}},  
//   beforeValue: 'beforeValue',
//   beforeValue2: 'beforeValue2Changed',
//   valueString: 'value1',
// };

// const getPrintValue = (item, margin = 0) => {
//   if (!_.isPlainObject(item)) {
//     return item;
//   }

//   let result = '{';
//   let objectKeys = Object.keys(item);

//   for (let key of objectKeys) {
//     const keyValue = item[key];
//     const value = _.isPlainObject(keyValue) ? getPrintValue(keyValue, margin) : keyValue;
    
//     result += '\n' + ' '.repeat(margin+4) + `${key}: ${value}`;
//   }
  
//   result += '\n' + ' '.repeat(margin) + '}';
//   return result;
// }

// const getTypeOfOperation = (beforeObject, afterObject, key) => {
//   let operation = 'none';

//   if (!(_.has(beforeObject, key)) && _.has(afterObject, key)) {
//     operation = 'add';
//   }

//   if (_.has(beforeObject, key) && !(_.has(afterObject, key))) {
//     operation = 'remove';
//   }
    
//   if ((_.has(beforeObject, key) && _.has(afterObject, key)) && !(_.isEqual(beforeObject[key], afterObject[key]))) {
//     operation = 'change';
//   };

//   return operation;
// };

// const diff = (beforeObject, afterObject, margin = 0) => {
//   let s =  '{';

//   const outputPrefix = '\n' + ' '.repeat(margin);
//   const keysBefore = Object.keys(beforeObject);
//   const keysAfter = Object.keys(afterObject);

//   const keys = _.uniq([...keysBefore, ...keysAfter]).sort();

//   for (let key of keys) {
//     const beforeItem = beforeObject[key];
//     const afterItem = afterObject[key];

//     const operation  = getTypeOfOperation(beforeObject, afterObject, key);
//     const bothItemsAreObjects = _.isPlainObject(beforeItem) && _.isPlainObject(afterItem);
    
    

//     s += outputPrefix;

//     //  todo: добавить сюда переменную sign = ''; вынести шаблонную строкуВынести ее до case и добавлять в шаблонную стронку
//     //  formatString = `   ${sign} ${key}`
//     //  типа s += `${formatString} + getPrintValue

//     switch (operation) {
//       case 'none':
//         s += `    ${key}: ` + getPrintValue(beforeItem, margin + 4);
//         break;
//       case 'add':
//         s += `  + ${key}: ` + getPrintValue(afterItem, margin + 4);
//         break;
//       case 'remove':
//         s += `  - ${key}: ` + getPrintValue(beforeItem, margin + 4);
//         break;
//       case 'change':
//         if (bothItemsAreObjects) {
//           s +=  `    ${key}: `  + diff(beforeItem, afterItem, margin+4);
//         } else{
//           s += `  - ${key}: ` + getPrintValue(beforeItem, margin + 4);
//           s += outputPrefix + `  + ${key}: ` + getPrintValue(afterItem, margin + 4);
//         }
//         break;
//     };

//   }

//   s += `${outputPrefix}}`;

//   return s;
// }


// const result = diff(beforeObject, afterObject);
//  console.log(result)