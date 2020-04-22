#!/usr/bin/env node
import program from 'commander';
import path from 'path'

const genDiff = (pathToFile1, pathToFile2) => {
  console.log(pathToFile1, pathToFile2)

  path.resolve
};


program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .helpOption('-h, --help', 'output usage information')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format')
  .action((firstConfig, secondConfig) => {
      // console.log(firstConfig, secondConfig)
    genDiff(firstConfig, secondConfig);
  })
  .parse(process.argv);

export default (pathToFile1, pathToFile2) => {
  return genDiff(pathToFile1, pathToFile2);
};

