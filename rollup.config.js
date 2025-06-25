import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import importAssets from 'rollup-plugin-import-assets';
import codegen from 'rollup-plugin-codegen';
import polyfillNode from 'rollup-plugin-polyfill-node';

import { name } from "./plugin.json";


const production = process.env.NODE_ENV !== 'development';

export default defineConfig({
  input: './src/index.tsx',
  plugins: [
    polyfillNode(),
    nodeResolve({ preferBuiltins: false, browser: true }),
    codegen(),
    commonjs(),
    typescript({ sourceMap: !production, inlineSources: !production }),
    json(),
    replace({
      preventAssignment: false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    importAssets({
      publicPath: `http://127.0.0.1:1337/plugins/${name}/`
    })
  ],
  context: 'window',
  external: ['react', 'react-dom', 'decky-frontend-lib'],
  output: {
    file: 'dist/index.js',
    globals: {
      react: 'SP_REACT',
      'react-dom': 'SP_REACTDOM',
      'decky-frontend-lib': 'DFL'
    },
    format: 'iife',
    exports: 'default',
  },
});
