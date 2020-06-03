import _ from 'lodash';
import getObjectFromFile from './parsers';
import getFormatter from './formatters';

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

const genDiff = (filename1, filename2, format) => {
  const objectBefore = getObjectFromFile(filename1);
  const objectAfter = getObjectFromFile(filename2);

  const diff = getDiff(objectBefore, objectAfter);

  const formatter = getFormatter(format);

  return formatter(diff).trim();
};

export default genDiff;
