import _ from 'lodash';

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
      s += valueIsObject ? `{${stringifyPlainObject(object[key], margin + 4)}${suffix(margin + 2)}}` : object[key];
    } else {
      s += key;
    }
  }

  return s;
};

const createLine = (item, margin) => {
  let line;

  const {
    operation,
    key,
    valueBefore,
    valueAfter,
  } = item;

  if (_.has(item, 'children')) {
    line = `${prefix(margin, ' ', key)}{`;

    // Заменить на reduce
    for (let i = 0; i < item.children.length; i += 1) {
      const child = item.children[i];
      line += createLine(child, margin + 4);
    }

    line += `${suffix(margin + 2)}}`;

    return line;
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

  // not changed
  if (_.isPlainObject(valueBefore)) {
    line = `${prefix(margin, ' ', key)}{${stringifyPlainObject(valueBefore, margin + 4)}${suffix(margin + 2)}}`;
  } else {
    line = prefix(margin, ' ', key) + valueBefore;
  }

  return line;
};

const stylish = (diff, margin = 0) => {
  let stylishedDiff = '{';

  const { children } = diff;

  for (let i = 0; i < children.length; i += 1) {
    const item = children[i];
    stylishedDiff += createLine(item, margin + 2);
  }

  return `${stylishedDiff}${suffix(margin)}}`;
};

export default stylish;
