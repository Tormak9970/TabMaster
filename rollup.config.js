import { nodeResolve } from '@rollup/plugin-node-resolve'
import codegen from 'rollup-plugin-codegen'
import deckyPlugin from '@decky/rollup'
import polyfillNode from 'rollup-plugin-polyfill-node'
import { rmSync } from 'fs'
import { resolve } from 'path'

/**
 * Removes the provided directories from build.
 * @param config The plugin's configuration options.
 * @returns A Vite plugin.
 */
function excludeDirectories(config) {
    return {
        name: 'exclude-directories',
        resolveId(source) {
            return source === 'virtual-module' ? source : null
        },
        renderStart(outputOptions, inputOptions) {
            const outDir = outputOptions.dir

            if (config) {
                for (const directory of config.directories) {
                    const directoryPath = resolve(outDir, directory)
                    rmSync(directoryPath, { recursive: true })
                    console.log(`Deleted ${directoryPath}`)
                }
            }
        },
    }
}

export default deckyPlugin({
    plugins: [
        polyfillNode(),
        nodeResolve({ browser: true }), //needed because for some reason v15.3.1 node resolve which decky rollup uses does makes codegen fail
        codegen(),
        excludeDirectories({
            directories: ['scripts'],
        }),
    ],
})
