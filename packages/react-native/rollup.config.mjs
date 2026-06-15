import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json'));

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  'react/jsx-runtime',
  'react-native/jsx-runtime',
];

const baseConfig = {
  input: 'src/index.ts',
  external,
};

export default defineConfig([
  {
    ...baseConfig,
    output: [
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/types',
      }),
      terser(),
    ],
  },
  {
    ...baseConfig,
    output: {
      file: pkg.types,
      format: 'esm',
    },
    plugins: [
      dts({
        respectExternal: true,
        compilerOptions: {
          preserveConstEnums: true,
        },
      }),
    ],
  },
]); 