import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';
import { readFileSync } from 'fs';
import process from 'process';

const getParser = (filePath) => {
  const format = path.extname(filePath);

  switch (format.toLowerCase()) {
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

const getFullFilePath = (fileName) => (path.isAbsolute(fileName)
  ? fileName : path.resolve(process.cwd(), fileName));

const getObjectFromFile = (filePath) => {
  let returnValue;

  try {
    const fullFilePath = getFullFilePath(filePath);
    const rawData = readFileSync(fullFilePath, 'utf8');
    const parsedData = getParser(filePath);

    returnValue = parsedData(rawData);
  } catch (e) {
    console.log(`${e.name}: ${e.message}`);
    throw new Error('Error processing file!');
  }

  return returnValue;
};

export default getObjectFromFile;
