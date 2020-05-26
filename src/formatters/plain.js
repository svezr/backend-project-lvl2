import _ from 'lodash';

const createLine = (item, parentProperty = '') => {
  let line = '';

  const {
    operation,
    key,
    valueBefore,
    valueAfter,
  } = item;

  const parentPropertyLocal = parentProperty ? `${parentProperty}.${key}` : `${key}`;
  const resultValueBefore = _.isPlainObject(valueBefore) ? '[comples value]' : valueBefore;
  const resultValueAfter = _.isPlainObject(valueAfter) ? '[comples value]' : valueAfter;

  switch (operation) {
    case 'add':
      line += `Property '${parentPropertyLocal}' was added with value: '${resultValueAfter}'\n`;
      break;
    case 'remove':
      line += `Property '${parentPropertyLocal}' was deleted\n`;
      break;
    case 'modify':
      if (_.has(item, 'children')) {
        for (let i = 0; i < item.children.length; i += 1) {
          const child = item.children[i];

          const bothValuesAreObjects = _.isPlainObject(valueBefore) && _.isPlainObject(valueAfter);

          if (bothValuesAreObjects) {
            line += createLine(child, parentPropertyLocal);
          } else {
            line += `Property '${parentPropertyLocal}' was changed from '${resultValueBefore}' to '${resultValueAfter}'\n`;
          }
        }
      } else {
        line += `Property '${parentPropertyLocal}' was changed from '${resultValueBefore}' to '${resultValueAfter}'\n`;
      }
      break;
    default:
      line += '';
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
