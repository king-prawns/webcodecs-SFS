import {Compiler, DevServer, rspack} from '@rspack/core';
import {RspackDevServer} from '@rspack/dev-server';
import chalk from 'chalk';

import devConfig from './rspack.dev.conf';

const {log} = console;
const serverPort: string = '8800';

const compiler: Compiler = rspack(devConfig);

compiler.hooks.done.tap('done', () => {
  log(chalk.green(`Rspack finished -> http://localhost:${serverPort}`));
});

log(chalk.cyan('Starting rspack dev server...'));

const options: DevServer = {
  client: {
    overlay: false
  },
  allowedHosts: 'all',
  port: serverPort,
  compress: true,
  server: {
    type: 'http'
  }
};

const server: RspackDevServer = new RspackDevServer(options, compiler!);
server
  .start()
  .then(() => {
    log(chalk.cyan('Rspack Dev server is running'));
  })
  .catch((err: unknown) => {
    log(chalk.red('Failed to start dev server:', err));
  });
