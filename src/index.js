import getObjectFromFile from './parsers';

const normalizeObject = (obj) => {
  const entries = Object.entries(obj);

  const fn = (acc, item) => {
    const [objectKey, objectValue] = item;

    acc[objectKey] = objectValue;
    return acc;
  };

  return entries.reduce(fn, {});
};

const buildAnswer = (objectBefore, objectAfter, notChangedKeys, changedKeys,
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

  return buildAnswer(objectBefore, objectAfter, notChangedKeys, changedKeys,
    deletedKeys, addedKeys);
};

export default genDiff;

//  todo: Вариант
//  получаем список ключей объектаДо и объектаПосле в один массив
//  пробегаемся итератором по массиву и ищем различия/равенство
//  если натыкаемся на объект - итеративно вызываем себя

// const before = {
//   beforeValue: 'beforeValue',
//   beforeValue1: 'beforeValue1',
//   beforeValue2: 'beforeValue2',
//   valueString: 'value1',
//   valueNumber: 22,
// };

// const after = {
//   beforeValue: 'beforeValue',
//   beforeValue2: 'beforeValue2Changed',
//   valueString: 'value1',
//   valueNumber: 23
// };


// Односторонний обход объекта. Набросок:
// const source = {
//   a: 'aString',
//   b: {
//     ba: 'baString',
//     bb: 'bbString',
//     bc: 'bcString',
//     bd: {
//       bda: 'bdaString',
//       bdb: 'bdbString',
//       bdc: 'bdcString-',
//     },
//   },
//   c: 'cString',
// };

// const after = {
//   a: 'aString',
//   b: {
//     ba: 'baString2',
//     bb: 'bbString',
//     bc: 'bcString',
//     bd: {
//       bda: 'bdaString2',
//       bdb: 'bdbString',
//       bdc: '',
//     },
//   },
//   c: 'cString2',
// };



// const diff = (objectBefore, objectAfter, margin = 1) => {

//   let s = '\n' + ' '.repeat(margin) + '{';

//   for (let key of Object.keys(objectAfter)) {
//     if (typeof objectAfter[key] === 'string') {
//       if (objectBefore[key] !== objectAfter[key]){
//         s += '\n' + ' '.repeat(margin) + `  - ${key}: ${objectBefore[key]}`;
//         s += '\n' + ' '.repeat(margin) + `  + ${key}: ${objectAfter[key]}`;

//         continue;
//       }
//       s += '\n' + ' '.repeat(margin) + `  ${key}: ${objectBefore[key]}`;
      
//     }

//     if (typeof objectAfter[key] === 'object') {
//       s += diff(objectBefore[key], objectAfter[key], margin + 1)
//     }
//   }

//   return s + '\n' + ' '.repeat(margin) + '}';

// }

// const result = diff(source, after);

// console.log(result)