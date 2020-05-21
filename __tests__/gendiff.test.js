import path from 'path';
import { readFileSync } from 'fs';

import genDiff from '../src';

const getFixturesDirectoryPath = () => {
  const delimiter = path.sep;
  const fixturesPath = __dirname.split(delimiter);
  fixturesPath.pop();
  return path.resolve(fixturesPath.join(delimiter), 'fixtures');
};

const getFixtureFilePath = (fileName) => path.resolve(getFixturesDirectoryPath(), fileName);

test('test JSON <-> JSON', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter1.json');
  const pathFileAddResult = getFixtureFilePath('structTestResults.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'stylish').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('test JSON <-> YAML', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter2.yml');
  const pathFileAddResult = getFixtureFilePath('structTestResults.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'stylish').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('test JSON <-> INI', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter3.ini');
  const pathFileAddResult = getFixtureFilePath('structTestResults.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'stylish').trim();

  expect(stylishedGenDiff).toBe(correctData);
});
