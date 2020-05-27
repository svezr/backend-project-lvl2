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

test('stylish formatter: JSON & JSON', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter1.json');
  const pathFileAddResult = getFixtureFilePath('structTestResultsStylish.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'stylish').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('stylish formatter: JSON & YAML', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter2.yml');
  const pathFileAddResult = getFixtureFilePath('structTestResultsStylish.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'stylish').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('stylish formatter: JSON & INI', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter3.ini');
  const pathFileAddResult = getFixtureFilePath('structTestResultsStylish.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'stylish').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('plain formatter: JSON & JSON', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter1.json');
  const pathFileAddResult = getFixtureFilePath('structTestResultsPlain.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'plain').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('plain formatter: JSON & YAML', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter2.yml');
  const pathFileAddResult = getFixtureFilePath('structTestResultsPlain.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'plain').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('plain formatter: JSON & INI', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter3.ini');
  const pathFileAddResult = getFixtureFilePath('structTestResultsPlain.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'plain').trim();

  expect(stylishedGenDiff).toBe(correctData);
});


test('JSON formatter: JSON & JSON', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter1.json');
  const pathFileAddResult = getFixtureFilePath('structTestResultsJSON.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'json').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('JSON formatter: JSON & YAML', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter2.yml');
  const pathFileAddResult = getFixtureFilePath('structTestResultsJSON.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'json').trim();

  expect(stylishedGenDiff).toBe(correctData);
});

test('JSON formatter: JSON & INI', () => {
  const pathFileBefore = getFixtureFilePath('structBefore.json');
  const pathFileAddTest = getFixtureFilePath('structAfter3.ini');
  const pathFileAddResult = getFixtureFilePath('structTestResultsJSON.txt');

  const correctData = readFileSync(pathFileAddResult, 'utf8');

  const stylishedGenDiff = genDiff(pathFileBefore, pathFileAddTest, 'json').trim();

  expect(stylishedGenDiff).toBe(correctData);
});
