import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const entries = [
    'src/index.ts',
]

const plugins = [
    alias({
        entries: [
            { find: /^node:(.+)$/, replacement: '$1' },
        ],
    }),
    resolve({
        preferBuiltins: true,
    }),
    json(),
    commonjs(),
    esbuild({
        target: 'node8',
        charset: 'utf8',
    }),
]

export default [
    ...entries.map(input => ({
        input,
        output: [
            {
                file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
                format: 'esm',
            },
            {
                file: input.replace('src/', 'dist/').replace('.ts', '.cjs'),
                format: 'cjs',
            },
        ],
        external: [],
        plugins,
    })),
    ...entries.map(input => ({
        input,
        output: {
            file: input.replace('src/', '').replace('.ts', '.d.ts'),
            format: 'esm',
        },
        external: [],
        plugins: [
            dts({ respectExternal: true }),
        ],
    })),
]
