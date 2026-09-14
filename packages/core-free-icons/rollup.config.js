import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sucrase from '@rollup/plugin-sucrase';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import path from 'path';

const packageName = '@hugeicons/core-free-icons';
const outputDir = 'dist';

// Get all icon files dynamically
const srcDir = './src';
const iconFiles = fs.readdirSync(srcDir)
  .filter(file => file.endsWith('Icon.ts') && file !== 'types.ts')
  .map(file => file.replace('.ts', ''));

const plugins = (minify = false) => [
  commonjs(),
  sucrase({
    exclude: ['node_modules/**'],
    transforms: ['typescript']
  }),
  nodeResolve({
    extensions: ['.ts', '.js', '.json'],
    preferBuiltins: true
  }),
  minify && terser({
    format: {
      comments: false,
      preserve_annotations: true
    },
    compress: {
      pure_getters: true,
      pure_funcs: ['console.log'],
      passes: 2
    },
    mangle: {
      properties: false
    }
  })
].filter(Boolean);

// Main bundle configuration (with tree-shaking support)
const indexConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: `${outputDir}/cjs/index.js`,
      format: 'cjs',
      name: packageName,
      sourcemap: true,
      exports: 'named'
    },
    {
      file: `${outputDir}/cjs/index.min.js`,
      format: 'cjs',
      name: packageName,
      sourcemap: true,
      exports: 'named',
      plugins: [terser()]
    },
    {
      dir: `${outputDir}/esm`,
      format: 'esm',
      sourcemap: true,
      preserveModules: true,        // Enable tree-shaking
      preserveModulesRoot: 'src'    // Preserve module structure
    },
    {
      file: `${outputDir}/esm/index.min.js`,
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: plugins(false)
};

// Create empty types.js files for runtime (TypeScript types are compile-time only)
const typesJsConfig = {
  input: 'src/types.ts',
  output: [
    {
      file: `${outputDir}/cjs/types.js`,
      format: 'cjs'
    },
    {
      file: `${outputDir}/esm/types.js`,
      format: 'esm'
    }
  ],
  plugins: plugins(false)
};

// Types configuration for main index
const typesConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/types/index.d.ts',
      format: 'es'
    }
  ],
  plugins: [dts()]
};

// Platform-specific loader configurations
// 1. Web loader (Vite, Webpack, browser)
const loaderWebConfig = {
  input: 'src/loader.web.ts',
  external: [/\.\/.*Icon\.js$/],  // Don't bundle icon files, keep them as external imports
  output: [
    {
      file: `${outputDir}/esm/loader.web.js`,
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true  // Keep loader as single file, don't bundle icon imports
    }
  ],
  plugins: plugins(false)
};

const loaderWebTypesConfig = {
  input: 'src/loader.web.ts',
  output: [
    {
      file: 'dist/types/loader.web.d.ts',
      format: 'es'
    }
  ],
  plugins: [dts()]
};

// 2. Node loader (SSR, Next.js server)
const loaderNodeConfig = {
  input: 'src/loader.node.ts',
  external: [/\.\/.*Icon\.js$/],  // Don't bundle icon files, keep them as external imports
  output: [
    {
      file: `${outputDir}/esm/loader.node.js`,
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true  // Keep loader as single file, don't bundle icon imports
    }
  ],
  plugins: plugins(false)
};

const loaderNodeTypesConfig = {
  input: 'src/loader.node.ts',
  output: [
    {
      file: 'dist/types/loader.node.d.ts',
      format: 'es'
    }
  ],
  plugins: [dts()]
};

// 3. React Native loader (Metro bundler)
const loaderNativeConfig = {
  input: 'src/loader.native.ts',
  external: [/\.\/.*Icon$/],  // Don't try to resolve require() calls, keep them as-is
  output: [
    {
      file: `${outputDir}/esm/loader.native.js`,
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true  // Keep loader as single file
    }
  ],
  plugins: plugins(false)
};

const loaderNativeTypesConfig = {
  input: 'src/loader.native.ts',
  output: [
    {
      file: 'dist/types/loader.native.d.ts',
      format: 'es'
    }
  ],
  plugins: [dts()]
};

// IMPORTANT: Building 4500+ icons at once causes memory issues
// For now, we'll only build the main bundles
// Individual icon files can be built on-demand or in a separate process

// Check if we should build individual icons (via environment variable)
const shouldBuildIndividualIcons = process.env.BUILD_INDIVIDUAL_ICONS === 'true';

let exportConfig;

if (shouldBuildIndividualIcons) {
  // If explicitly requested, build a limited batch of icons
  const BATCH_SIZE = 100; // Build only first 100 icons to avoid memory issues
  const iconBatch = iconFiles.slice(0, BATCH_SIZE);
  
  console.log(`Building ${iconBatch.length} individual icons (out of ${iconFiles.length} total)...`);
  
  // Individual icon configurations (limited batch)
  const iconConfigs = iconBatch.map(iconName => ({
    input: `src/${iconName}.ts`,
    external: [/^\.\/types/],
    output: [
      {
        file: `${outputDir}/cjs/${iconName}.js`,
        format: 'cjs',
        sourcemap: false,
        exports: 'default',
        paths: {
          './types': './types.js'
        }
      },
      {
        file: `${outputDir}/esm/${iconName}.js`,
        format: 'esm',
        sourcemap: false,
        paths: {
          './types': './types.js'
        }
      }
    ],
    plugins: plugins(true)
  }));
  
  // Individual icon type configurations (limited batch)
  const iconTypeConfigs = iconBatch.map(iconName => ({
    input: `src/${iconName}.ts`,
    external: ['./types'],
    output: [
      {
        file: `dist/types/${iconName}.d.ts`,
        format: 'es'
      }
    ],
    plugins: [dts()]
  }));
  
  // Export with individual icons
  exportConfig = [
    indexConfig, 
    typesConfig, 
    typesJsConfig, 
    loaderWebConfig, 
    loaderWebTypesConfig,
    loaderNodeConfig,
    loaderNodeTypesConfig,
    loaderNativeConfig,
    loaderNativeTypesConfig,
    ...iconConfigs, 
    ...iconTypeConfigs
  ];
} else {
  // Default: Only build main bundles (no individual icons)
  console.log('Building main bundles only. Set BUILD_INDIVIDUAL_ICONS=true to build individual icon files.');
  exportConfig = [
    indexConfig, 
    typesConfig, 
    typesJsConfig,
    loaderWebConfig, 
    loaderWebTypesConfig,
    loaderNodeConfig,
    loaderNodeTypesConfig,
    loaderNativeConfig,
    loaderNativeTypesConfig
  ];
}

export default exportConfig;
