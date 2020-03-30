import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from 'rollup-plugin-replace';
import pkg from './package.json'

const basePlugins = [
  replace({
    'process.env.NODE_ENV': "'production'",
    'process.env.VERSION': `'${pkg.version}'`
  }),
  json(),
  // eslint({
  //   throwOnError: true
  // }),
  typescript({
    useTsconfigDeclarationDir: true,
    rollupCommonJSResolveHack: true,
    clean: true,
    tsconfig: 'tsconfig.json'
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: {}
  }),
  sourceMaps(),
];

export default [
  // import-able module:
  {
    input: './src/index.ts',
    output: [{
      sourcemap: true,
      file: pkg.main,
      name: pkg.name,
      format: 'cjs',
    }],
    plugins: basePlugins
  },
];
