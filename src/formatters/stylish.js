import _ from 'lodash';

const prefix = (margin, sign, key) => `\n${' '.repeat(margin)}${sign} ${key}: `;

const suffix = (margin) => `\n${' '.repeat(margin)}`;

const stringifyPlainObject = (object, margin = 0) => {
  const isObject = _.isPlainObject(object);
  const keys = isObject ? Object.keys(object) : [object];

  const resultValue = keys.reduce((acc, key) => {
    const valueIsObject = _.isPlainObject(object[key]);

    if (isObject) {
      const linePrefix = prefix(margin, ' ', key);
      const line = valueIsObject ? `{${stringifyPlainObject(object[key], margin + 4)}${suffix(margin + 2)}}` : object[key];

      return `${acc}${linePrefix}${line}`;
    }

    return `${acc}${key}`;
  }, '');

  return resultValue;
};

const createLine = (item, margin) => {
  const {
    operation,
    key,
    valueBefore,
    valueAfter,
  } = item;

  if (_.has(item, 'children')) {
    const linePrefix = `${prefix(margin, ' ', key)}{`;

    const line = item.children.reduce((acc, child) => acc + createLine(child, margin + 4), linePrefix);

    const lineEnd = `${suffix(margin + 2)}}`;

    return `${line}${lineEnd}`;
  }

  if (operation === 'add') {
    if (_.isPlainObject(valueAfter)) {
      return `${prefix(margin, '+', key)}{${stringifyPlainObject(valueAfter, margin + 4)}${suffix(margin + 2)}}`;
    }

    return prefix(margin, '+', key) + valueAfter;
  }

  if (operation === 'remove') {
    if (_.isPlainObject(valueBefore)) {
      return `${prefix(margin, '-', key)}{${stringifyPlainObject(valueBefore, margin + 4)}${suffix(margin + 2)}}`;
    }

    return prefix(margin, '-', key) + valueBefore;
  }

  if (operation === 'modify') {
    const valueBeforeModify = (_.isPlainObject(valueBefore)) ? `{${stringifyPlainObject(valueBefore, margin + 4)}${suffix(margin + 2)}}` : valueBefore;
    const valueAfterModify = (_.isPlainObject(valueAfter)) ? `{${stringifyPlainObject(valueAfter, margin + 4)}${suffix(margin + 2)}}` : valueAfter;

    return prefix(margin, '-', key) + valueBeforeModify + prefix(margin, '+', key) + valueAfterModify;
  }

  if (_.isPlainObject(valueBefore)) {
    return `${prefix(margin, ' ', key)}{${stringifyPlainObject(valueBefore, margin + 4)}${suffix(margin + 2)}}`;
  }

  return prefix(margin, ' ', key) + valueBefore;
};

const stylish = (diff, margin = 0) => {
  const { children } = diff;

  const stylishedDiff = children.reduce((acc, child) => acc + createLine(child, margin + 2), '{');

  return `${stylishedDiff}${suffix(margin)}}`;
};

export default stylish;
