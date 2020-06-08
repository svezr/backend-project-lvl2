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

  const keys = _.union(_.keys(sourceObjectBefore), _.keys(sourceObjectAfter)).sort();

  if (keys.length > 0) {
    resultDiff.children = keys.reduce((acc, item) => {
      const child = createChild(item, sourceObjectBefore, sourceObjectAfter);
      return [...acc, child];
    }, []);
  }

  return resultDiff;
};

const genDiff = (fileNameBefore, fileNameAfter, format) => {
  const objectBefore = getObjectFromFile(fileNameBefore);
  const objectAfter = getObjectFromFile(fileNameAfter);

  const diff = getDiff(objectBefore, objectAfter);

  const formatter = getFormatter(format);

  return formatter(diff);
};

export default genDiff;
