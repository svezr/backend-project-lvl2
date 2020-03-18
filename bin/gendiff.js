#!/usr/bin/env node
import program from 'commander';

program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-V, --version', 'output the version number')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format')
  .action((firstConfig, secondConfig) => {
    // console.log(firstConfig, secondConfig)
  })
  .parse(process.argv);

export const genDiff = (pathToFile1, pathToFile2) => {
  
}

  // console.log(program.args);
