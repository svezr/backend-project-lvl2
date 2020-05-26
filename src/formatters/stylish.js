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
      s += valueIsObject ? '{' + stringifyPlainObject(object[key], margin + 4) + suffix(margin + 2) + '}' : object[key];
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
        line = prefix(margin, '-', key) + '{' + stringifyPlainObject(valueBefore, margin + 4) + suffix(margin + 2) + '}';
      } else {
        line = prefix(margin, '-', key) + valueBefore;
      }
      break;
    case 'modify':
      if (_.has(item, 'children')) {
        line = prefix(margin, ' ', key) + '{';

        for (let i = 0; i < item.children.length; i += 1) {
          const child = item.children[i];
          line += createLine(child, margin + 4);
        }

        line += suffix(margin + 2) + '}';
      } else {
        const valueBeforeModify = (_.isPlainObject(valueBefore)) ? '{' + stringifyPlainObject(valueBefore, margin + 4) + suffix(margin + 2) + '}' : valueBefore;
        const valueAfterModify = (_.isPlainObject(valueAfter)) ? '{' + stringifyPlainObject(valueAfter, margin + 4) + suffix(margin + 2) + '}' : valueAfter;

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

const stylish = (diff, margin = 0) => {
  let stylishedDiff = '{';

  const { children } = diff;

  for (let i = 0; i < children.length; i += 1) {
    const item = children[i];
    stylishedDiff += createLine(item, margin + 2);
  }

  return stylishedDiff + suffix(margin) + '}';
};

export default stylish;
