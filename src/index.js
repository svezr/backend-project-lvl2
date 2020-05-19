import _ from 'lodash';
import getObjectFromFile from './parsers';

const prefix = (margin, sign, key) => `\n${' '.repeat(margin)}${sign} ${key}: `;
const suffix = (margin) => `\n${' '.repeat(margin)}`;

const stringifyPlainObject = (object, margin = 0) => {
  let s = '';

  const isObject = _.isPlainObject(object);
  const keys = isObject ? Object.keys(object) : [object];

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const valueIsObject = _.isPlainObject(object[key]);

    if (isObject) {
      s += prefix(margin, ' ', key);
      s += valueIsObject ? '{' + stringifyPlainObject(object[key], margin + 4) + suffix(margin) + '}' : object[key];
    } else {
      s += key;
    }
  }

  return s;
};

const getDiff = (sourceObjectBefore, sourceObjectAfter) => {
  const createChild = (key, objectBefore, objectAfter) => {
    const valueBefore = objectBefore[key];
    const valueAfter = objectAfter[key];

    const valueNotChanged = _.isEqual(valueBefore, valueAfter);
    const bothValuesExist = _.has(objectBefore, key) && _.has(objectAfter, key);
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

  const resultDiff = {};

  const keys = _.uniq([...Object.keys(sourceObjectBefore), ...Object.keys(sourceObjectAfter)]).sort();

  if (keys.length > 0) {
    resultDiff.children = [];
  }

  for (let i = 0; i < keys.length; i += 1) {
    const child = createChild(keys[i], sourceObjectBefore, sourceObjectAfter);
    resultDiff.children.push(child);
  }

  return resultDiff;
};

const createLine = (item, margin) => {
  let line;

  const {
    operation,
    key,
    valueBefore,
    valueAfter,
  } = item;

  switch (operation) {
    case 'add':
      if (_.isPlainObject(valueAfter)) {
        line = prefix(margin, '+', key) + '{' + stringifyPlainObject(valueAfter, margin + 4) + suffix(margin + 2) + '}';
      } else {
        line = prefix(margin, '+', key) + valueAfter;
      }
      break;
    case 'remove':
      if (_.isPlainObject(valueBefore)) {
        line = prefix(margin, '-', key) + '{' + stringifyPlainObject(valueBefore, margin + 4) + suffix(margin) + '}';
      } else {
        line = prefix(margin, '-', key) + `${valueBefore}`;
      }
      break;
    case 'modify':
      if (_.has(item, 'children')) {
        line = prefix(margin, ' ', key) + '{';

        for (let i = 0; i < item.children.length; i += 1) {
          const child = item.children[i];
          line += ' '.repeat(margin) + createLine(child, margin + 4);
        }

        line += suffix(margin + 2) + '}';
      } else {
        const valueBeforeModify = (_.isPlainObject(valueBefore)) ? '{' + stringifyPlainObject(valueBefore, margin + 4) + suffix(margin) + '}' : valueBefore;
        const valueAfterModify = (_.isPlainObject(valueAfter)) ? '{' + stringifyPlainObject(valueAfter, margin + 4) + suffix(margin) + '}' : valueAfter;

        line = prefix(margin, '-', key) + valueBeforeModify;
        line += prefix(margin, '+', key) + valueAfterModify;
      }

      break;
    default:
      if (_.isPlainObject(valueBefore)) {
        line = prefix(margin, ' ', key) + '{' + stringifyPlainObject(valueBefore, margin + 4) + suffix(margin + 2) + '}';
      } else {
        line = prefix(margin, ' ', key) + valueBefore;
      }
  }

  return line;
};

export const stylish = (diff, margin = 0) => {
  let stylishedDiff = '{';

  const { children } = diff;

  for (let i = 0; i < children.length; i += 1) {
    const item = children[i];
    stylishedDiff += createLine(item, margin + 2);
  }

  return stylishedDiff + suffix(margin) + '}';
};

export const genDiff = (filename1, filename2, format) => {
  const objectBefore = getObjectFromFile(filename1);
  const objectAfter = getObjectFromFile(filename2);

  if (!objectBefore || !objectAfter) {
    throw new Error('Error reading file!');
  }

  const diff = getDiff(objectBefore, objectAfter);

  if (format === 'stylish') {
    return stylish(diff);
  }

  throw new Error(`Unknown formatter! (${format})`);
};
