import { expect } from '@jest/globals';
import path from 'path';

import genDiff from '../src';

const getFixturesDirectoryPath = () => {
  const delimiter = path.sep;
  const fixturesPath = __dirname.split(delimiter);
  fixturesPath.pop();
  return path.resolve(fixturesPath.join(delimiter), 'fixtures');
};

const getFixtureFilePath = (fileName) => path.resolve(getFixturesDirectoryPath(), fileName);

const testCorrectResults = {
  add: '{\n    beforeValue: beforeValue\n    beforeValue1: beforeValue1\n    beforeValue2: beforeValue2\n  + valueNumber: 22\n  + valueString: value1\n}',
  remove: '{\n    beforeValue: beforeValue\n    beforeValue1: beforeValue1\n  - beforeValue2: beforeValue2\n}',
  change: '{\n  - beforeValue: beforeValue\n  + beforeValue: beforeValueChanged\n  - beforeValue1: beforeValue1\n  + beforeValue1: beforeValue1Changed\n  - beforeValue2: beforeValue2\n  + beforeValue2: beforeValue2Changed\n}',
  combo: '{\n    beforeValue: beforeValue\n  - beforeValue2: beforeValue2\n  + beforeValue2: beforeValue2Changed\n  - beforeValue1: beforeValue1\n  + valueNumber: 22\n  + valueString: value1\n}',
};

test('JSON: add values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAddAfter.json');

  expect(genDiff(pathFileBefore, pathFileAddTest)).toBe(testCorrectResults.add);
});

test('JSON: remove values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileRemoveTest = getFixtureFilePath('structRemoveAfter.json');

  expect(genDiff(pathFileBefore, pathFileRemoveTest)).toBe(testCorrectResults.remove);
});

test('JSON: change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileChangeTest = getFixtureFilePath('structChangeAfter.json');

  expect(genDiff(pathFileBefore, pathFileChangeTest)).toBe(testCorrectResults.change);
});

test('JSON: add, remove and change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileComboTest = getFixtureFilePath('structTestAfter.json');

  expect(genDiff(pathFileBefore, pathFileComboTest)).toBe(testCorrectResults.combo);
});

test('YAML: add values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.yml');
  const pathFileAddTest = getFixtureFilePath('structAddAfter.yml');

  expect(genDiff(pathFileBefore, pathFileAddTest)).toBe(testCorrectResults.add);
});

test('YAML: remove values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.yml');
  const pathFileRemoveTest = getFixtureFilePath('structRemoveAfter.yml');

  expect(genDiff(pathFileBefore, pathFileRemoveTest)).toBe(testCorrectResults.remove);
});

test('YAML: change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.yml');
  const pathFileChangeTest = getFixtureFilePath('structChangeAfter.yml');

  expect(genDiff(pathFileBefore, pathFileChangeTest)).toBe(testCorrectResults.change);
});

test('YAML: add, remove and change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.yml');
  const pathFileComboTest = getFixtureFilePath('structTestAfter.yml');

  expect(genDiff(pathFileBefore, pathFileComboTest)).toBe(testCorrectResults.combo);
});

test('INI: add values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.ini');
  const pathFileAddTest = getFixtureFilePath('structAddAfter.ini');

  expect(genDiff(pathFileBefore, pathFileAddTest)).toBe(testCorrectResults.add);
});

test('INI: remove values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.ini');
  const pathFileRemoveTest = getFixtureFilePath('structRemoveAfter.ini');

  expect(genDiff(pathFileBefore, pathFileRemoveTest)).toBe(testCorrectResults.remove);
});

test('INI: change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.ini');
  const pathFileChangeTest = getFixtureFilePath('structChangeAfter.ini');

  expect(genDiff(pathFileBefore, pathFileChangeTest)).toBe(testCorrectResults.change);
});

test('INI: add, remove and change values', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.ini');
  const pathFileComboTest = getFixtureFilePath('structTestAfter.ini');

  expect(genDiff(pathFileBefore, pathFileComboTest)).toBe(testCorrectResults.combo);
});
