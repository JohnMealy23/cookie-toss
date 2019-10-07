import basePlugins from './plugins.rollup';
import pkg from '../package.json'

export default [
  {
    input: 'src/index-smoketests.ts',
    output: [{
      file: pkg.testFile,
      name: pkg.testFile,
      format: 'iife',
      sourcemap: true,
    }],
    plugins: basePlugins,
  }
];
