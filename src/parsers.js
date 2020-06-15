import yaml from 'js-yaml';
import ini from 'ini';

const getParsedData = (rawData, formatter) => {
  const parsers = {
    json: JSON.parse,
    yml: yaml.safeLoad,
    ini: ini.parse,
  };

  return parsers[formatter](rawData);
};

export default getParsedData;
