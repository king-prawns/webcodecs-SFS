import path from 'path';

import {Configuration} from '@rspack/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).noDeprecation = true;

const baseConfig: Configuration = {
  target: ['es2022'],
  resolve: {
    tsConfig: {
      configFile: path.resolve(__dirname, '../typescript/tsconfig.json')
    }
  },
  experiments: {
    outputModule: true
  },
  devtool: false,
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  stats: {
    errorDetails: true,
    logging: 'error'
  },
  infrastructureLogging: {
    level: 'error'
  }
};

export default baseConfig;
