import path from 'path';
import { expect } from '@jest/globals';
import genDiff from '../src';


const getFixturesDirectoryPath = () => {
  const delimiter = path.sep;
  const fixturesPath = __dirname.split(delimiter);
  fixturesPath.pop();
  return path.resolve(fixturesPath.join(delimiter), 'fixtures');
};

const getFixtureFilePath = (fileName) => path.resolve(getFixturesDirectoryPath(), fileName);

test('JSON: add values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAddAfter.json');

  const testAddResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
    beforeValue2: beforeValue2
  + valueNumber: 22
  + valueString: value1
}`;

  expect(genDiff(pathFileBefore, pathFileAddTest)).toBe(testAddResult);
});

test('JSON: remove values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileRemoveTest = getFixtureFilePath('structRemoveAfter.json');

  const testRemoveResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
  - beforeValue2: beforeValue2
}`;

  expect(genDiff(pathFileBefore, pathFileRemoveTest)).toBe(testRemoveResult);
});

test('JSON: change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileChangeTest = getFixtureFilePath('structChangeAfter.json');

  const testChangeResult = `{
  - beforeValue: beforeValue
  + beforeValue: beforeValueChanged
  - beforeValue1: beforeValue1
  + beforeValue1: beforeValue1Changed
  - beforeValue2: beforeValue2
  + beforeValue2: beforeValue2Changed
}`;

  expect(genDiff(pathFileBefore, pathFileChangeTest)).toBe(testChangeResult);
});

test('JSON: add, remove and change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileComboTest = getFixtureFilePath('structTestAfter.json');

  const testComboResult = `{
    beforeValue: beforeValue
  - beforeValue2: beforeValue2
  + beforeValue2: beforeValue2Changed
  - beforeValue1: beforeValue1
  + valueNumber: 22
  + valueString: value1
}`;

  expect(genDiff(pathFileBefore, pathFileComboTest)).toBe(testComboResult);
});

test('YAML: add values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.yml');
  const pathFileAddTest = getFixtureFilePath('structAddAfter.yml');

  const testAddResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
    beforeValue2: beforeValue2
  + valueNumber: 22
  + valueString: value1
}`;

  expect(genDiff(pathFileBefore, pathFileAddTest)).toBe(testAddResult);
});

test('YAML: remove values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.yml');
  const pathFileRemoveTest = getFixtureFilePath('structRemoveAfter.yml');

  const testRemoveResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
  - beforeValue2: beforeValue2
}`;

  expect(genDiff(pathFileBefore, pathFileRemoveTest)).toBe(testRemoveResult);
});

test('YAML: change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.yml');
  const pathFileChangeTest = getFixtureFilePath('structChangeAfter.yml');

  const testChangeResult = `{
  - beforeValue: beforeValue
  + beforeValue: beforeValueChanged
  - beforeValue1: beforeValue1
  + beforeValue1: beforeValue1Changed
  - beforeValue2: beforeValue2
  + beforeValue2: beforeValue2Changed
}`;

  expect(genDiff(pathFileBefore, pathFileChangeTest)).toBe(testChangeResult);
});

test('YAML: add, remove and change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.yml');
  const pathFileComboTest = getFixtureFilePath('structTestAfter.yml');

  const testComboResult = `{
    beforeValue: beforeValue
  - beforeValue2: beforeValue2
  + beforeValue2: beforeValue2Changed
  - beforeValue1: beforeValue1
  + valueNumber: 22
  + valueString: value1
}`;

  expect(genDiff(pathFileBefore, pathFileComboTest)).toBe(testComboResult);
});
