import path from 'path';
import { expect } from '@jest/globals';
import genDiff from '../src';

const getFixturesDirectoryPath = () => {
  const delimiter = path.sep;
  const fixturesPath = __dirname.split(delimiter);
  fixturesPath.pop();
  return path.resolve(fixturesPath.join(delimiter), 'fixtures');
};

const pathFileBefore = () => path.resolve(getFixturesDirectoryPath(), 'structBefore.json');

const getFixtureFilePath = (fileName) => path.resolve(getFixturesDirectoryPath(), fileName);

test('Add values', () => {
  const pathFileAfter = getFixtureFilePath('structAddAfter.json');

  const testResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
    beforeValue2: beforeValue2
  + valueString: value1
  + valueNumber: 22
}`;

  expect(genDiff(pathFileBefore(), pathFileAfter)).toBe(testResult);
});

test('Remove values', () => {
  const pathFileAfter = getFixtureFilePath('structRemoveAfter.json');

  const testResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
  - beforeValue2: beforeValue2
}`;

  expect(genDiff(pathFileBefore(), pathFileAfter)).toBe(testResult);
});

test('Change values', () => {
  const pathFileAfter = getFixtureFilePath('structChangeAfter.json');

  const testResult = `{
  - beforeValue: beforeValue
  + beforeValue: beforeValueChanged
  - beforeValue1: beforeValue1
  + beforeValue1: beforeValue1Changed
  - beforeValue2: beforeValue2
  + beforeValue2: beforeValue2Changed
}`;

  expect(genDiff(pathFileBefore(), pathFileAfter)).toBe(testResult);
});

test('Add, remove and change values', () => {
  const pathFileAfter = getFixtureFilePath('structTestAfter.json');

  const testResult = `{
    beforeValue: beforeValue
  - beforeValue2: beforeValue2
  + beforeValue2: beforeValue2Changed
  - beforeValue1: beforeValue1
  + valueString: value1
  + valueNumber: 22
}`;

  expect(genDiff(pathFileBefore(), pathFileAfter)).toBe(testResult);
});
