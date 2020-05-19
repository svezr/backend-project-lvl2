import { expect } from '@jest/globals';
import path from 'path';
import { readFileSync } from 'fs';

import { genDiff } from '../dist';

const getFixturesDirectoryPath = () => {
  const delimiter = path.sep;
  const fixturesPath = __dirname.split(delimiter);
  fixturesPath.pop();
  return path.resolve(fixturesPath.join(delimiter), 'fixtures');
};

const getFixtureFilePath = (fileName) => path.resolve(getFixturesDirectoryPath(), fileName);

// const testCorrectResults = {
//   add: '{\n    beforeValue: beforeValue\n    beforeValue1: beforeValue1\n    beforeValue2: beforeValue2\n  + valueNumber: 22\n  + valueString: value1\n}',
//   remove: '{\n    beforeValue: beforeValue\n    beforeValue1: beforeValue1\n  - beforeValue2: beforeValue2\n}',
//   change: '{\n  - beforeValue: beforeValue\n  + beforeValue: beforeValueChanged\n  - beforeValue1: beforeValue1\n  + beforeValue1: beforeValue1Changed\n  - beforeValue2: beforeValue2\n  + beforeValue2: beforeValue2Changed\n}',
//   combo: '{\n    beforeValue: beforeValue\n  - beforeValue2: beforeValue2\n  + beforeValue2: beforeValue2Changed\n  - beforeValue1: beforeValue1\n  + valueNumber: 22\n  + valueString: value1\n}',
// };

test('test1', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter1.json');
  const pathFileAddResult = getFixtureFilePath('structTestResults.txt');

  const fileAndResult = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'stylish').trim();

  expect(stylishedGenDiff).toBe(fileAndResult);
});
