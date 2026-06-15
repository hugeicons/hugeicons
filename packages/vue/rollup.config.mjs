import { defineConfig } from 'rollup';
import sucrase from '@rollup/plugin-sucrase';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vuePlugin from '@vitejs/plugin-vue';

const input = 'src/index.ts';
const isExternal = id => /^vue($|\/)/.test(id);
const globals = {
  'vue': 'Vue'
};

// Shared plugins for all builds
const basePlugins = [
  vuePlugin(),
  sucrase({
    exclude: ['node_modules/**'],
    transforms: ['typescript', 'jsx']
  }),
  nodeResolve(),
  commonjs()
];

// Production optimization plugins
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
  // ESM build
  {
    input,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    external: isExternal,
    plugins: basePlugins
  },

  // CJS build
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
    external: isExternal,
    plugins: basePlugins
  },

  // UMD build (minified)
  {
    input,
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      name: 'HugeiconsVue',
      globals,
      sourcemap: true,
      exports: 'named'
    },
    external: isExternal,
    plugins: [...basePlugins, ...prodPlugins]
  },

  // Types
  {
    input,
    output: {
      dir: 'dist/types',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    external: id => isExternal(id) || /\.vue$/.test(id),
    plugins: [
      dts({
        compilerOptions: {
          preserveSymlinks: false,
          skipLibCheck: true
        }
      })
    ]
  }
]); 