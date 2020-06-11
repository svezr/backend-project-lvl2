import path from 'path';
import { readFileSync } from 'fs';

import genDiff from '../src';

const getFixtureFilePath = (fileName) => {
  const fixturesDirectoryPath = path.resolve(__dirname, '..', 'fixtures');
  return path.resolve(fixturesDirectoryPath, fileName);
};

const testDescriptionTable = [
  ['Stylish formatter: JSON & JSON', 'structTestResultsStylish.txt', 'structAfter1.json', 'stylish'],
  ['Plain formatter: JSON & YAML', 'structTestResultsPlain.txt', 'structAfter2.yml', 'plain'],
  ['JSON formatter: JSON & INI', 'structTestResultsJSON.txt', 'structAfter3.ini', 'json'],
];

describe.each(testDescriptionTable)('test suite', (testName, correctResultFileName, fileAfterName, formatter) => {
  const getCorrectData = (correctResultFileNameSrc) => {
    const pathFileCorrectResult = getFixtureFilePath(correctResultFileNameSrc);
    return readFileSync(pathFileCorrectResult, 'utf8');
  };

  test(testName, () => {
    const result = genDiff(getFixtureFilePath('structBefore.json'), getFixtureFilePath(fileAfterName), formatter);
    const correctData = getCorrectData(correctResultFileName);
    expect(result).toBe(correctData);
  });
});
