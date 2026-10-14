import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import pluginExternal from 'vite-plugin-external'
import codegen from 'vite-plugin-codegen'

const manifest = JSON.parse(readFileSync(join('.', 'plugin.json'), 'utf-8'))

export default defineConfig({
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
    ],
    build: {
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
