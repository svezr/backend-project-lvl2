import _ from 'lodash';


const createLine = (item, parentProperty) => {
  const {
    operation,
    key,
    valueBefore,
    valueAfter,
  } = item;

  const parentKey = parentProperty ? `${parentProperty}.${key}` : `${key}`;
  const textValueBefore = _.isPlainObject(valueBefore) ? '[complex value]' : valueBefore;
  const textValueAfter = _.isPlainObject(valueAfter) ? '[complex value]' : valueAfter;

  if (_.has(item, 'children')) {
    return item.children.reduce((acc, element) => acc + createLine(element, parentKey), '');
  }

  if (operation === 'add') {
    return `Property '${parentKey}' was added with value: '${textValueAfter}'\n`;
  }

  if (operation === 'remove') {
    return `Property '${parentKey}' was deleted\n`;
  }

  if (operation === 'modify') {
    return `Property '${parentKey}' was changed from '${textValueBefore}' to '${textValueAfter}'\n`;
  }

  // if (operation === 'none') {
  return '';
  // }
};

const plain = (diff) => diff.children.reduce((acc, item) => acc + createLine(item), '');

export default plain;
