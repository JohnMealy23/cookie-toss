import basePlugins from './plugins.rollup';
import pkg from '../package.json'

export default [
// Build import-able module:
  {
    input: './src/modules/index.ts',
    output: [{
      file: pkg.main,
      name: pkg.main,
      format: 'iife',
      sourcemap: true,
    }],
    plugins: basePlugins,
  },
];
