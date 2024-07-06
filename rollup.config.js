import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import importAssets from 'rollup-plugin-import-assets';
import codegen from 'rollup-plugin-codegen';
import externalGlobals from 'rollup-plugin-external-globals';

import manifest from "./plugin.json";


const production = process.env.NODE_ENV !== 'development';

export default defineConfig({
  input: './src/index.tsx',
  plugins: [
    nodeResolve({ preferBuiltins: false, browser: true }),
    codegen(),
    commonjs(),
    externalGlobals({
      react: 'SP_REACT',
      'react-dom': 'SP_REACTDOM',
      '@decky/ui': 'DFL',
      '@decky/manifest': JSON.stringify(manifest)
    }),
    typescript({ sourceMap: !production, inlineSources: !production }),
    json(),
    replace({
      preventAssignment: false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    importAssets({
      publicPath: `http://127.0.0.1:1337/plugins/${manifest.name}/`
    })
  ],
  context: 'window',
  external: ['react', 'react-dom', 'decky-frontend-lib'],
  output: {
    file: 'dist/index.js',
    format: 'esm',
    exports: 'default',
  },
});
