import { nodeResolve } from '@rollup/plugin-node-resolve'
import codegen from 'rollup-plugin-codegen'
import deckyPlugin from '@decky/rollup'
import polyfillNode from 'rollup-plugin-polyfill-node'
import alias from '@rollup/plugin-alias'
import { resolve } from 'path'

export default deckyPlugin({
    plugins: [
        polyfillNode(),
        nodeResolve({ browser: true }), //needed because for some reason v15.3.1 node resolve which decky rollup uses does makes codegen fail
        codegen(),
        alias({
            entries: [
                { find: '@lib', replacement: resolve(process.cwd(), './src/lib') },
                { find: '@state', replacement: resolve(process.cwd(), './src/state') },
                { find: '@patches', replacement: resolve(process.cwd(), './src/patches') },
                { find: '@hooks', replacement: resolve(process.cwd(), './src/hooks') },
                { find: '@utils', replacement: resolve(process.cwd(), './src/utils') },
                { find: /^@localization\/(.*)/, replacement: resolve(process.cwd(), './src/i18n/$1') },
                { find: '@types', replacement: resolve(process.cwd(), './src/types') },
            ],
        }),
    ],
})
