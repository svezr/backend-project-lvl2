#!/usr/bin/env node
import program from 'commander';
import genDiff from '../index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .helpOption('-h, --help', 'output usage information')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((firstConfig, secondConfig) => {
    const resultDiff = genDiff(firstConfig, secondConfig, program.format);

    console.log(resultDiff);
  })
  .parse(process.argv);
