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
  const pathFileAddTest = getFixtureFilePath('structAddAfter.json');

  const testAddResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
    beforeValue2: beforeValue2
  + valueString: value1
  + valueNumber: 22
}`;

  expect(genDiff(pathFileBefore(), pathFileAddTest)).toBe(testAddResult);
});

test('Remove values', () => {
  const pathFileRemoveTest = getFixtureFilePath('structRemoveAfter.json');

  const testRemoveResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
  - beforeValue2: beforeValue2
}`;

  expect(genDiff(pathFileBefore(), pathFileRemoveTest)).toBe(testRemoveResult);
});

test('Change values', () => {
  const pathFileChangeTest = getFixtureFilePath('structChangeAfter.json');

  const testChangeResult = `{
  - beforeValue: beforeValue
  + beforeValue: beforeValueChanged
  - beforeValue1: beforeValue1
  + beforeValue1: beforeValue1Changed
  - beforeValue2: beforeValue2
  + beforeValue2: beforeValue2Changed
}`;

  expect(genDiff(pathFileBefore(), pathFileChangeTest)).toBe(testChangeResult);
});

test('Add, remove and change values', () => {
  const pathFileComboTest = getFixtureFilePath('structTestAfter.json');

  const testComboResult = `{
    beforeValue: beforeValue
  - beforeValue2: beforeValue2
  + beforeValue2: beforeValue2Changed
  - beforeValue1: beforeValue1
  + valueString: value1
  + valueNumber: 22
}`;

  expect(genDiff(pathFileBefore(), pathFileComboTest)).toBe(testComboResult);
});
