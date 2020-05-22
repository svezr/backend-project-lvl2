import _ from 'lodash';

const createLine = (item, parentProperty = '') => {
  let line;

  const {
    operation,
    key,
    valueBefore,
    valueAfter,
  } = item;


  //  console.log(`\n${operation}\t${key}\t${valueBefore}\t${valueAfter}\n`)
  // console.log(`\n${key}\tbothAvluesAreObjects: ${bothValuesAreObjects}\n`);

  const parentPropertyLocal = parentProperty ? `${parentProperty}.${key}` : `${key}`;

  switch (operation) {
    case 'add':
      // if (_.isPlainObject(valueAfter)) {
      //   line = prefix(margin, '+', key) + '{' + stringifyPlainObject(valueAfter, margin + 4) + suffix(margin + 2) + '}';
      // } else {
      //   line = prefix(margin, '+', key) + valueAfter;
      // }
      const resultValue = _.isPlainObject(valueAfter) ? '[comples value]' : valueAfter;

      line = `Property ${parentPropertyLocal} was added with value: ${resultValue}\n`;
      break;
    case 'remove':
      // if (_.isPlainObject(valueBefore)) {
      //   line = prefix(margin, '-', key) + '{' + stringifyPlainObject(valueBefore, margin + 4) + suffix(margin + 2) + '}';
      // } else {
      //   line = prefix(margin, '-', key) + valueBefore;
      // }
      line = `Property ${parentPropertyLocal} was deleted\n`;
      break;
    case 'modify':


      if (_.has(item, 'children')) {
        console.log('1');

        line = '';

        for (let i = 0; i < item.children.length; i += 1) {
          const child = item.children[i];

          const bothValuesAreObjects = _.isPlainObject(valueBefore) && _.isPlainObject(valueAfter);

          if (bothValuesAreObjects) {
            console.log(`!!!!!!!!! ${child.key} !!!!!!!!!!!!!!!!`)

            const creatingLine = createLine(child, parentPropertyLocal);

            console.log(`created line ${creatingLine}`);

            line += creatingLine;
          } else {
            line += `Property ${parentPropertyLocal} was changed from '${valueBefore}' to '${valueAfter}'\n`;
          }
        }
      }

      // line = `Property ${parentPropertyLocal} was changed from '${valueBefore}' to '${valueAfter}'\n`;

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
