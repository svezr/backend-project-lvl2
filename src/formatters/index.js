import stylish from './stylish';
import plain from './plain';

const getFormatter = (format) => {
  switch (format) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    default:
      throw new Error(`Unknown formatter! (${format})`);
  }
};

export default getFormatter;
