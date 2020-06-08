import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';
import { readFileSync } from 'fs';
import process from 'process';

const getParser = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.safeLoad;
    case '.ini':
      return ini.parse;
    default:
      throw new Error('Unknown extension!');
  }
};

const getRawFileData = (filePath) => {
  let rawData;
  const fullFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  try {
    rawData = readFileSync(fullFilePath, 'utf8');
  } catch (e) {
    console.log(`${e.name}: ${e.message}`);
    throw new Error('Error processing file!');
  }
  return rawData;
};

const getObjectFromFile = (filePath) => {
  const rawData = getRawFileData(filePath);
  const parser = getParser(filePath);

  return parser(rawData);
};

export default getObjectFromFile;
