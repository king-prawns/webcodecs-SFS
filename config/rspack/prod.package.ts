import {Compiler, rspack} from '@rspack/core';
import chalk from 'chalk';

import packageProdConfig from './rspack.prod.package.conf';

const {log} = console;

log(chalk.cyan('Building...'));

const compiler: Compiler = rspack(packageProdConfig);

compiler.hooks.done.tap('done', () => {
  log(chalk.green('Build completed 🎉'));
});

compiler.run((err: Error | null) => {
  if (err) {
    log(chalk.red('Build failed:', err));
  }
});
