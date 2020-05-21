const createLine = (item, parentProperty = '') => {
  let line;

  const {
    operation,
    key,
    valueBefore,
    valueAfter,
  } = item;

  switch (operation) {
    case 'add':
      // if (_.isPlainObject(valueAfter)) {
      //   line = prefix(margin, '+', key) + '{' + stringifyPlainObject(valueAfter, margin + 4) + suffix(margin + 2) + '}';
      // } else {
      //   line = prefix(margin, '+', key) + valueAfter;
      // }
      line = `Property ${key} was added with value: ${valueAfter}`;
      break;
    case 'remove':
      // if (_.isPlainObject(valueBefore)) {
      //   line = prefix(margin, '-', key) + '{' + stringifyPlainObject(valueBefore, margin + 4) + suffix(margin + 2) + '}';
      // } else {
      //   line = prefix(margin, '-', key) + valueBefore;
      // }
      line = `Property ${key} was deleted`;
      break;
    case 'modify':
      // if (_.has(item, 'children')) {
      //   line = prefix(margin, ' ', key) + '{';

      //   for (let i = 0; i < item.children.length; i += 1) {
      //     const child = item.children[i];
      //     line += createLine(child, margin + 4);
      //   }

      //   line += suffix(margin + 2) + '}';
      // } else {
      //   const valueBeforeModify = (_.isPlainObject(valueBefore)) ? '{' + stringifyPlainObject(valueBefore, margin + 4) + suffix(margin + 2) + '}' : valueBefore;
      //   const valueAfterModify = (_.isPlainObject(valueAfter)) ? '{' + stringifyPlainObject(valueAfter, margin + 4) + suffix(margin + 2) + '}' : valueAfter;

      //   line = prefix(margin, '-', key) + valueBeforeModify;
      //   line += prefix(margin, '+', key) + valueAfterModify;
      // }
      line = `Property ${parentProperty}.${key} was changed from '${valueBefore}' to '${valueAfter}'`;
      break;
    default:

      line = '';
  }

  return line;
};

const plain = (diff) => {
  const { children } = diff;

  let styledDiff = '';

  for (let i = 0; i < children.length; i += 1) {
    const item = children[i];
    styledDiff += createLine(item);
  }

  return styledDiff;
};

export default plain;
