import { defineConfig } from 'rollup';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { writeFileSync } from 'fs';

const generateEsmPackageJson = () => ({
  name: 'generate-esm-package-json',
  writeBundle(options) {
    if (options.dir && options.dir.includes('esm')) {
      writeFileSync(`${options.dir}/package.json`, JSON.stringify({ type: 'module' }, null, 2));
    }
  }
});

const input = 'src/index.ts';
const external = id => /^solid-js($|\/)/.test(id);
const globals = {
  'solid-js': 'Solid',
  'solid-js/web': 'Solid.web'
};

const babelConfig = {
  babelHelpers: 'bundled',
  presets: [
    ['@babel/preset-typescript'],
    ['solid']
  ],
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  sourceMaps: true,
  exclude: 'node_modules/**'
};

const basePlugins = [
  nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
  commonjs(),
  babel(babelConfig)
];

const prodPlugins = [
  terser({
    output: { comments: false },
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_getters: true
    }
  })
];

export default defineConfig([
  {
    input,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    external,
    plugins: [...basePlugins, generateEsmPackageJson()]
  },

  {
    input,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named'
    },
    external,
    plugins: basePlugins
  },

  {
    input,
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      name: 'HugeiconsSolid',
      globals,
      sourcemap: true
    },
    external,
    plugins: [...basePlugins, ...prodPlugins]
  },

  {
    input,
    output: {
      dir: 'dist/types',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    external,
    plugins: [dts()]
  }
]);
