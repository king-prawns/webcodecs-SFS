import path from 'path';

import {Configuration} from '@rspack/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).noDeprecation = true;

const baseConfig: Configuration = {
  resolve: {
    tsConfig: {
      configFile: path.resolve(__dirname, '../typescript/tsconfig.json')
    },
    extensions: ['.ts', '.tsx']
  },
  experiments: {
    outputModule: true
  },
  devtool: false,
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};

export default baseConfig;
