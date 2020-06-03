import path from 'path';
import { readFileSync } from 'fs';

import genDiff from '../src';

const getFixturesDirectoryPath = () => {
  const delimiter = path.sep;
  const fixturesFullPath = __dirname.split(delimiter);
  const fixturesPath = fixturesFullPath.slice(0, fixturesFullPath.length - 1);

  return path.resolve(fixturesPath.join(delimiter), 'fixtures');
};

const getFixtureFilePath = (fileName) => path.resolve(getFixturesDirectoryPath(), fileName);

const pathFileBefore = getFixtureFilePath('structBefore.json');

const getDiffData = (fileNameAfter, style) => {
  const resultFileNames = {
    stylish: 'structTestResultsStylish.txt',
    plain: 'structTestResultsPlain.txt',
    json: 'structTestResultsJSON.txt',
  };

  const pathFileAfter = getFixtureFilePath(fileNameAfter);
  const pathFileCorrectResult = getFixtureFilePath(resultFileNames[style]);

  const correctData = readFileSync(pathFileCorrectResult, 'utf8');
  const result = genDiff(pathFileBefore, pathFileAfter, style).trim();

  return { result, correctData };
};

test('stylish formatter: JSON & JSON', () => {
  const { result, correctData } = getDiffData('structAfter1.json', 'stylish');
  expect(result).toBe(correctData);
});

test('plain formatter: JSON & YAML', () => {
  const { result, correctData } = getDiffData('structAfter2.yml', 'plain');
  expect(result).toBe(correctData);
});

test('JSON formatter: JSON & INI', () => {
  const { result, correctData } = getDiffData('structAfter3.ini', 'json');
  expect(result).toBe(correctData);
});
