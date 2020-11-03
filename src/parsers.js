import yaml from 'js-yaml';
import ini from 'ini';

const getParsedData = (rawData, type) => {
  const parsers = {
    json: JSON.parse,
    yml: yaml.safeLoad,
    ini: ini.parse,
  };

  if (!parsers[type]) {
    throw new Error('This type of files is not supported!');
  }

  return parsers[type](rawData);
};

export default getParsedData;
