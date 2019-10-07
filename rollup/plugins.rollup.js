import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import { terser } from "rollup-plugin-terser";
import builtins from 'rollup-plugin-node-builtins';
import visualizer from 'rollup-plugin-visualizer';
import pkg from '../package.json'

export default [
  resolve({
    browser: true,
    main: true,
    module: true,
    jsnext: true,
  }),
  builtins(),
  json(),
  terser(),
  // visualizer({
  //   sourcemap: true,
  //   open: true,
  //   filename: 'dist/stats.html',
  //   template: 'treemap',
  // }),
  replace({
    'process.env.NODE_ENV': "'production'",
    'process.env.VERSION': `'${pkg.version}'`,
  }),
  typescript({
    useTsconfigDeclarationDir: true,
    rollupCommonJSResolveHack: true,
    clean: true,
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: {}
  }),
  sourceMaps(),
];
