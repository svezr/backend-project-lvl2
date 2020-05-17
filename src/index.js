//  собрать AST -> stylish(AST) -> stringValue
import _ from 'lodash';
import getObjectFromFile from './parsers';


const printPlainObject = (object, margin = 0) => {
  let s = '';

  const isObject = _.isPlainObject(object);
  const keys = isObject ? Object.keys(object) : [object];

  for (let key of keys) {
    const valueIsObject = _.isPlainObject(object[key]);

    if (isObject) {
       s += '\n' + ' '.repeat(margin) + key + ': ';
       s += valueIsObject ? '{' + printPlainObject(object[key], margin + 4) + '\n' + ' '.repeat(margin) + '}' : object[key];
    } else {
      s += key
    }
  }

  return s;
}


const createChild = (key, objectBefore, objectAfter) => {
  const valueBefore = objectBefore[key];
  const valueAfter = objectAfter[key];

  const valueNotChanged = _.isEqual(valueBefore, valueAfter);
  const bothValuesExist = _.has(objectBefore,key) && _.has(objectAfter, key);
  const bothValuesAreObjects = bothValuesExist && (_.isPlainObject(valueBefore) && _.isPlainObject(valueAfter));

  const onlyOneOfValuesIsAnObject = !bothValuesAreObjects && (_.isPlainObject(valueBefore) || _.isPlainObject(valueAfter));

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

  if (bothValuesAreObjects) {
    child.children = getDiff(valueBefore, valueAfter).children;
  }

  return child;
};


const getDiff = (objectBefore, objectAfter) => {
  const resultDiff = {};

  const keys = _.uniq([...Object.keys(objectBefore), ...Object.keys(objectAfter)]).sort();

  if (keys.length > 0) {
    resultDiff.children = [];
  }

  for (let i = 0; i < keys.length; i += 1) {
    const child = createChild(keys[i], objectBefore, objectAfter);
    resultDiff.children.push(child);
  }

  return resultDiff;
};


const prefix = (margin, sign, key) => `\n${' '.repeat(margin)}${sign} ${key}: `;
const suffix = (margin) => `\n${' '.repeat(margin)}`;


const printLine = (item, margin) => {
  let line;

  const { operation, key, valueBefore, valueAfter } = item;

  switch (operation) {
    case 'add':
      if (_.isPlainObject(valueAfter)) {
        line = prefix(margin, '+', key) + `{` + printPlainObject(valueAfter, margin + 4) + suffix(margin + 2) + '}';
       } else {
        line = prefix(margin, '+', key) + `${valueAfter}`;
       }
      break;
    case 'remove':
      if (_.isPlainObject(valueBefore)) {
        line = prefix(margin, '-', key) + `{` + printPlainObject(valueBefore, margin + 4) + suffix(margin) + '}';        
      } else {    
        line = prefix(margin, '-', key) + `${valueBefore}`;
      }
      break;
    case 'modify':
      if (_.has(item, 'children')) {
        line = prefix(margin, ' ', key) + `{`;

        for (let child of item.children) {
          line +=  ' '.repeat(margin) + printLine(child, margin + 4)
        }

         line += suffix(margin + 2) + '}';
      } else {
        line = prefix(margin, '-', key) + `${valueBefore}`;        
        line += prefix(margin, '+', key) + `${valueAfter}`;
      };
      break;
    default:
      if (_.isPlainObject(valueBefore)) {
        line = prefix(margin, ' ', key) + `{` + printPlainObject(valueBefore, margin + 4) + suffix(margin + 2) + '}';
       } else {
        line = prefix(margin, ' ', key) + `${valueBefore}`;
       }
  }

  return line;
};

const stylish = (diff, margin = 0) => {
  let stylishedDiff = '{';
  
  const { children } = diff;

  for (let i = 0; i < children.length; i += 1) {
     const item = children[i]
      
    let line = printLine(item, margin + 2);
    stylishedDiff += line
  }

  return stylishedDiff + suffix(margin) + '}';
}

const genDiff = (filename1, filename2) => {

  const rawObjectBefore = getObjectFromFile(filename1);
  const rawObjectAfter = getObjectFromFile(filename2);

  if (!rawObjectBefore || !rawObjectAfter) {
    console.log('Error reading file!');
    return;
  }

  const objectBefore = normalizeObject(rawObjectBefore);
  const objectAfter = normalizeObject(rawObjectAfter);

  const diff = getDiff(objectBefore, objectAfter);

  const result = stylish(diff);

  console.log(result)
  return result;

};

export default genDiff;

//новый код!!!


// const _ = require('lodash')
//     // новая структура от корня:
//     // [
//     //   { 
//     //     name: 'a',
//     //     operation: 'add',
//     //     beforeValue: undefined, 
//     //     afterValue: 'fsdfds'
//     //   },
//     //   { 
//     //     name: 'b',
//     //     operation: 'remove',
//     //     beforeValue: 'fdsfds', 
//     //     afterValue: undefined
//     //   },
//     //   {
//     //     name: 'z',
//     //     children: [
//     //       {
//     //         name: 'za',
//     //         operation: 'none',
//     //         beforeValue,
//     //         afterValue
//     //       }
//     //     ]
//     //   }
//     // ]

// objectBefore = {
//   beforeValue: "beforeValue",
//   beforeValue1: "beforeValue1",
//   beforeValue2: "beforeValue2",
//   struct1: {
//     a: 1
//   },
//   structEqual: {
//     a: "a",
//     b: "b"
//   }
// };

// objectAfter = {
//   beforeValue: "beforeValue",
//   beforeValue2: "beforeValue2Changed",
//   beforeValue3: "bevoreValue3Added",
//   struct1: {
//     a: 1,
//     b: "FDFSD",
//     c: {
//       c1: 12
//     }
//   },
//   structEqual: {
//     a: "a",
//     b: "b"
//   }  
// };

// ////////////////////////////////////////////////////

// const getChildValue = (child) => {
//   if (child.operation === 'none') {
//     return child.valueBefore;
//   }

//   if (child.operation === 'add') {
//     return child.valueAfter;
//   }

//   if (child.operation === 'remove') {
//     return child.valueBefore;
//   };
// }

// //const getChildren

// const createChild = (key, objectBefore, objectAfter) => {
//   const valueBefore = objectBefore[key];
//   const valueAfter = objectAfter[key];  



//   const valueNotChanged = _.isEqual(valueBefore, valueAfter);

//   console.log(key, valueBefore, valueAfter)
//   console.log(valueNotChanged)



//   const bothValuesExist = _.has(objectBefore,key) && _.has(objectAfter, key);

//   const bothValuesAreObjects = bothValuesExist && (_.isPlainObject(valueBefore) && _.isPlainObject(valueAfter));

//   console.log(`bothValuesAreObjects: ${bothValuesAreObjects}`)
//   const onlyOneOfValuesIsAnObject = !bothValuesAreObjects && (_.isPlainObject(objectBefore) || _.isPlainObject(objectAfter));

//   let operation = 'none';
  


//   if (onlyOneOfValuesIsAnObject || (!valueNotChanged)) {
//     operation = 'modify';
//   }

//   if (_.has(objectBefore, key) && !_.has(objectAfter, key)) {
//     operation = 'remove';
//   }

//   if (!_.has(objectBefore, key) && _.has(objectAfter, key)) {
//     operation = 'add';
//   }

//   const child = {
//         operation,
//         key,
//         valueBefore,
//         valueAfter,
//         };

//   if (bothValuesAreObjects && !valueNotChanged) {
//     child.children = getDiff(valueBefore, valueAfter);
//     }

//   return child;
// };

// const getDiff = (objectBefore, objectAfter) => {
//   const resultDiff = [];

//   const keys = _.uniq([...Object.keys(objectBefore), ...Object.keys(objectAfter)]).sort();

//   for (let i = 0; i < keys.length; i += 1) {
//     // const key = ;

//     // const valueBefore = objectBefore[key];
//     // const valueAfter = objectAfter[key];



//     const child = createChild(keys[i], objectBefore, objectAfter);


//     resultDiff.push(child);
//   }

//   return resultDiff;
// };

// const a = getDiff(objectBefore, objectAfter);

// console.log(a)






















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
