import yaml from 'js-yaml';
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
      // return ini.parse
      break;
    default:
      return undefined;
  }
};

const getFullFilePath = (fileName) => (path.isAbsolute(fileName)
  ? fileName : path.resolve(process.cwd(), fileName));

const getObjectFromFile = (filePath) => {
  let returnValue;

  try {
    const fileData = readFileSync(getFullFilePath(filePath));
    const parseData = getParser(filePath);

    if (!parseData) {
      throw new Error('Unknown extension!');
    }

    returnValue = parseData(fileData);
  } catch (e) {
    console.log(e.message);
  }

  return returnValue;
};

export default getObjectFromFile;