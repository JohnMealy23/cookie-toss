import basePlugins from './plugins.rollup';
import pkg from '../package.json'

export default [
  {
    input: 'src/iframe/index.ts',
    output: [{
      file: pkg.htmlScript,
      name: pkg.htmlScript,
      format: 'iife',
      sourcemap: true,
    }],
    plugins: basePlugins,
  }
];
