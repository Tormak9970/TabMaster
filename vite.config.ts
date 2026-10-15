import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path, { join, resolve } from 'node:path'
import { defineConfig, Plugin } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import pluginExternal from 'vite-plugin-external'
import codegen from 'vite-plugin-codegen'

function extractStrings(): Plugin {
    return {
        name: 'extract-translation-strings',
        apply: 'build',

        generateBundle(_options, bundle) {
            const strings: Record<string, string> = {}
            const steamKeys = new Set()
            const chunks = Object.values(bundle).filter(file => file.type === 'chunk')

            const translationRegex = /(?<![A-Za-z\d_$])trans_string\(\s*(['"])(.*?)\1\s*,\s*(['"])(.*?)\3\s*\)/g

            const steamRegex =
                /(?<![A-Za-z\d_$])trans_string\(\s*(['"])(.*?)\1\s*,\s*(['"])(.*?)\3\s*,\s*(?:true|1)\s*\)/g

            for (const chunk of chunks) {
                for (const match of chunk.code.matchAll(steamRegex)) {
                    steamKeys.add(match[2])
                }
            }

            for (const chunk of chunks) {
                for (const match of chunk.code.matchAll(translationRegex)) {
                    const key = match[2]
                    const value = match[4]

                    if (!steamKeys.has(key)) {
                        strings[key] = value.replace(/\\(.)/g, '$1')
                    }
                }
            }

            const outputPath = path.resolve('src/i18n/strings.json')

            mkdirSync(path.dirname(outputPath), {
                recursive: true,
            })

            writeFileSync(outputPath, JSON.stringify(strings, null, 2))

            console.info(`Extracted ${Object.keys(strings).length} strings`)
        },
    }
}

const manifest = JSON.parse(readFileSync(join('.', 'plugin.json'), 'utf-8'))

export default defineConfig({
    optimizeDeps: {
        force: true,
    },
    plugins: [
        nodePolyfills(),
        codegen(),
        // importAssets({
        //   publicPath: `http://127.0.0.1:1337/plugins/${manifest.name}/`,
        //   include:[
        //     /\.gif$/i,
        //     /\.jpg$/i,
        //     /\.png$/i,
        //     /\.svg$/i,
        //     /\.webm$/i,
        //     /\.webp$/i,
        //     /\.mp4$/i,
        //   ],
        // }),
        pluginExternal({
            externals: {
                react: 'SP_REACT',
                'react-dom': 'SP_REACTDOM',
                'react/jsx-runtime': 'SP_JSX',
                '@decky/ui': 'DFL',
                '@decky/manifest': JSON.stringify(manifest),
            },
        }),
        extractStrings(),
    ],
    build: {
        // DEV Only
        minify: false,
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.tsx'),
            name: 'TabMaster',
            formats: ['es'],
            // the proper extensions will be added
            fileName: 'index',
        },
        sourcemap: true,
        rolldownOptions: {
            context: 'window',
            external: ['react', 'react-dom', '@decky/ui'],
            output: {
                dir: 'dist',
                format: 'esm',
                sourcemapPathTransform: relativeSourcePath =>
                    relativeSourcePath.replace(/^\.\.\//, `decky://decky/plugin/${encodeURIComponent(manifest.name)}/`),
                exports: 'default',
            },
            // treeshake: {
            //   // Assume all external modules have imports with side effects (the default) while allowing decky libraries to treeshake
            //   pureExternalImports: {
            //     pure: ['@decky/ui', '@decky/api'],
            //   },
            //   preset: 'smallest',
            // }
        },
    },
    resolve: {
        alias: {
            '@lib': resolve(import.meta.dirname, './src/lib'),
            '@state': resolve(import.meta.dirname, './src/state'),
            '@patches': resolve(import.meta.dirname, './src/patches'),
            '@hooks': resolve(import.meta.dirname, './src/hooks'),
            '@utils': resolve(import.meta.dirname, './src/utils'),
            '@localization': resolve(import.meta.dirname, './src/i18n'),
            '@types': resolve(import.meta.dirname, './src/types'),
        },
    },
})
