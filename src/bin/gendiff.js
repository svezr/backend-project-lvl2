#!/usr/bin/env node
import _ from 'lodash';
import program from 'commander';
import { genDiff, stylish } from '../index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .helpOption('-h, --help', 'output usage information')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format')
  .action((firstConfig, secondConfig) => {
    const formatter = program.format || 'tree';

    const formatters = {
      tree: stylish,
    };

    if (!_.has(formatters, formatter)) {
      throw new Error(`Unknown formatter! (${formatter})`);
    }

    const formatterFn = formatters[formatter];


    const diff = genDiff(firstConfig, secondConfig);
    const stylishedDiff = formatterFn(diff);

    console.log(stylishedDiff);
  })
  .parse(process.argv);
