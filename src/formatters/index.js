import stylish from './stylish';
import plain from './plain';
import json from './json';

const getFormatter = (format) => {
  switch (format) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    case 'json':
      return json;
    default:
      throw new Error(`Unknown formatter! (${format})`);
  }
};

export default getFormatter;
