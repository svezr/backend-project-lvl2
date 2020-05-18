#!/usr/bin/env node
import program from 'commander';
import { genDiff } from '../index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .helpOption('-h, --help', 'output usage information')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format')
  .action((firstConfig, secondConfig) => {
    const format = program.format || 'stylish';

    const resultDiff = genDiff(firstConfig, secondConfig, format);

    console.log(resultDiff);
  })
  .parse(process.argv);
