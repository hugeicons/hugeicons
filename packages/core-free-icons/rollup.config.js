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

// rollup-plugin-dts folds the index re-exports into one `export { A as B, ... }` and drops the
// per-specifier JSDoc, so the @deprecated markers on renamed icons never reach consumers.
// Re-emit those names as their own declarations, each with its @deprecated note.
const deprecatedExports = {"ArrowDownAzIcon":"ArrowDownAZIcon","ArrowDownAzFreeIcons":"ArrowDownAZFreeIcons","ArrowUpZaIcon":"ArrowUpZAIcon","ArrowUpZaFreeIcons":"ArrowUpZAFreeIcons","BookUpTwoIcon":"BookUp2Icon","BookUpTwoFreeIcons":"BookUp2FreeIcons","CalendarDateOneIcon":"CalendarDate1Icon","CalendarDateOneFreeIcons":"CalendarDate1FreeIcons","CIcon":"CppIcon","CFreeIcons":"CppFreeIcons","CircleSlashTwoIcon":"CircleSlash2Icon","CircleSlashTwoFreeIcons":"CircleSlash2FreeIcons","ClockHourEightIcon":"ClockHour8Icon","ClockHourEightFreeIcons":"ClockHour8FreeIcons","ClockHourFiveIcon":"ClockHour5Icon","ClockHourFiveFreeIcons":"ClockHour5FreeIcons","ClockHourFourIcon":"ClockHour4Icon","ClockHourFourFreeIcons":"ClockHour4FreeIcons","ClockHourNineIcon":"ClockHour9Icon","ClockHourNineFreeIcons":"ClockHour9FreeIcons","ClockHourOneIcon":"ClockHour1Icon","ClockHourOneFreeIcons":"ClockHour1FreeIcons","ClockHourSevenIcon":"ClockHour7Icon","ClockHourSevenFreeIcons":"ClockHour7FreeIcons","ClockHourSixIcon":"ClockHour6Icon","ClockHourSixFreeIcons":"ClockHour6FreeIcons","ClockHourThreeIcon":"ClockHour3Icon","ClockHourThreeFreeIcons":"ClockHour3FreeIcons","ClockHourTwoIcon":"ClockHour2Icon","ClockHourTwoFreeIcons":"ClockHour2FreeIcons","ColumnsThreeCogIcon":"Columns3CogIcon","ColumnsThreeCogFreeIcons":"Columns3CogFreeIcons","CssThreeIcon":"Css3Icon","CssThreeFreeIcons":"Css3FreeIcons","DiscThreeIcon":"Disc3Icon","DiscThreeFreeIcons":"Disc3FreeIcons","DiscTwoIcon":"Disc2Icon","DiscTwoFreeIcons":"Disc2FreeIcons","FolderGitTwoIcon":"FolderGit2Icon","FolderGitTwoFreeIcons":"FolderGit2FreeIcons","FolderSearchTwoIcon":"FolderSearch2Icon","FolderSearchTwoFreeIcons":"FolderSearch2FreeIcons","GoBackwardFiveSecIcon":"GoBackward5SecIcon","GoBackwardFiveSecFreeIcons":"GoBackward5SecFreeIcons","GoForwardFiveSecIcon":"GoForward5SecIcon","GoForwardFiveSecFreeIcons":"GoForward5SecFreeIcons","Grid2X2CheckIcon":"Grid2x2CheckIcon","Grid2X2CheckFreeIcons":"Grid2x2CheckFreeIcons","Grid2X2Icon":"Grid2x2Icon","Grid2X2FreeIcons":"Grid2x2FreeIcons","Grid2X2PlusIcon":"Grid2x2PlusIcon","Grid2X2PlusFreeIcons":"Grid2x2PlusFreeIcons","Grid2X2XIcon":"Grid2x2XIcon","Grid2X2XFreeIcons":"Grid2x2XFreeIcons","Grid3X2Icon":"Grid3x2Icon","Grid3X2FreeIcons":"Grid3x2FreeIcons","Grid3X3Icon":"Grid3x3Icon","Grid3X3FreeIcons":"Grid3x3FreeIcons","HtmlFiveIcon":"Html5Icon","HtmlFiveFreeIcons":"Html5FreeIcons","LayoutThreeColumnIcon":"Layout3ColumnIcon","LayoutThreeColumnFreeIcons":"Layout3ColumnFreeIcons","LayoutThreeRowIcon":"Layout3RowIcon","LayoutThreeRowFreeIcons":"Layout3RowFreeIcons","LayoutTwoColumnIcon":"Layout2ColumnIcon","LayoutTwoColumnFreeIcons":"Layout2ColumnFreeIcons","LayoutTwoRowIcon":"Layout2RowIcon","LayoutTwoRowFreeIcons":"Layout2RowFreeIcons","MpFour01Icon":"Mp401Icon","MpFour01FreeIcons":"Mp401FreeIcons","MpFour02Icon":"Mp402Icon","MpFour02FreeIcons":"Mp402FreeIcons","MpFourIcon":"Mp4Icon","MpFourFreeIcons":"Mp4FreeIcons","MpThree02Icon":"Mp302Icon","MpThree02FreeIcons":"Mp302FreeIcons","MusicThreeIcon":"Music3Icon","MusicThreeFreeIcons":"Music3FreeIcons","NavigationTwoIcon":"Navigation2Icon","NavigationTwoFreeIcons":"Navigation2FreeIcons","NavigationTwoOffIcon":"Navigation2OffIcon","NavigationTwoOffFreeIcons":"Navigation2OffFreeIcons","RowsFourIcon":"Rows4Icon","RowsFourFreeIcons":"Rows4FreeIcons","RowsThreeIcon":"Rows3Icon","RowsThreeFreeIcons":"Rows3FreeIcons","RowsTwoIcon":"Rows2Icon","RowsTwoFreeIcons":"Rows2FreeIcons","TallyFiveIcon":"Tally5Icon","TallyFiveFreeIcons":"Tally5FreeIcons","TallyFourIcon":"Tally4Icon","TallyFourFreeIcons":"Tally4FreeIcons","TallyOneIcon":"Tally1Icon","TallyOneFreeIcons":"Tally1FreeIcons","TallyThreeIcon":"Tally3Icon","TallyThreeFreeIcons":"Tally3FreeIcons","TallyTwoIcon":"Tally2Icon","TallyTwoFreeIcons":"Tally2FreeIcons","WThreeSchoolsIcon":"W3SchoolsIcon","WThreeSchoolsFreeIcons":"W3SchoolsFreeIcons"};
const deprecatedTypesPlugin = () => ({
  name: 'deprecated-types',
  writeBundle() {
    const names = new Set(Object.keys(deprecatedExports));
    if (names.size === 0) return;
    const file = path.join(outputDir, 'types', 'index.d.ts');
    const declaredAs = {};
    const src = fs.readFileSync(file, 'utf8').replace(/export \{([^}]*)\};/g, (whole, list) => {
      const kept = [];
      for (const spec of list.split(',')) {
        const s = spec.trim();
        if (!s) continue;
        const m = s.match(/^(\S+)(?:\s+as\s+(\S+))?$/);
        const exported = m[2] || m[1];
        if (names.has(exported)) declaredAs[exported] = m[1];
        else kept.push(s);
      }
      return `export { ${kept.join(', ')} };`;
    });
    const lines = Object.entries(deprecatedExports)
      .filter(([name]) => declaredAs[name])
      .map(([name, renamedTo]) =>
        `/** @deprecated Renamed to \`${renamedTo}\`; this alias will be removed in the next major version. */\n` +
        `export declare const ${name}: typeof ${declaredAs[name]};`
      );
    fs.writeFileSync(file, `${src}\n${lines.join('\n')}\n`);
  }
});

// Types configuration for main index
const typesConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/types/index.d.ts',
      format: 'es'
    }
  ],
  plugins: [dts(), deprecatedTypesPlugin()]
};

// Per-icon declaration files so deep imports (`${packageName}/Html5Icon`) are typed:
// exports["./*"].types, the case-only exports entries and typesVersions all point at
// dist/types/<Icon>.d.ts. Every icon module has the same shape, so write them directly
// rather than running dts() over thousands of inputs.
const iconTypesPlugin = () => ({
  name: 'icon-types',
  writeBundle() {
    const typesDir = path.join(outputDir, 'types');
    for (const iconName of iconFiles) {
      const note = deprecatedExports[iconName]
        ? `/** @deprecated Renamed to \`${deprecatedExports[iconName]}\`; this file will be removed in the next major version. */\n`
        : '';
      fs.writeFileSync(
        path.join(typesDir, `${iconName}.d.ts`),
        `import type { IconSvgObject } from './types.js';\n${note}declare const ${iconName}: IconSvgObject;\nexport default ${iconName};\n`
      );
    }
  }
});

const typesModuleConfig = {
  input: 'src/types.ts',
  output: [
    {
      file: 'dist/types/types.d.ts',
      format: 'es'
    }
  ],
  plugins: [dts(), iconTypesPlugin()]
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

// Deep-import stubs for deprecated names (`${packageName}/HtmlFiveIcon`). src/index.ts
// re-exports the old names from the new files, so these modules are unreachable from the
// index entry and preserveModules never emits them; build them as their own entries.
const deprecatedStubs = ["BookUpTwoIcon","CalendarDateOneIcon","CIcon","CircleSlashTwoIcon","ClockHourEightIcon","ClockHourFiveIcon","ClockHourFourIcon","ClockHourNineIcon","ClockHourOneIcon","ClockHourSevenIcon","ClockHourSixIcon","ClockHourThreeIcon","ClockHourTwoIcon","ColumnsThreeCogIcon","CssThreeIcon","DiscThreeIcon","DiscTwoIcon","FolderGitTwoIcon","FolderSearchTwoIcon","GoBackwardFiveSecIcon","GoForwardFiveSecIcon","HtmlFiveIcon","LayoutThreeColumnIcon","LayoutThreeRowIcon","LayoutTwoColumnIcon","LayoutTwoRowIcon","MpFour01Icon","MpFour02Icon","MpFourIcon","MpThree02Icon","MusicThreeIcon","NavigationTwoIcon","NavigationTwoOffIcon","RowsFourIcon","RowsThreeIcon","RowsTwoIcon","TallyFiveIcon","TallyFourIcon","TallyOneIcon","TallyThreeIcon","TallyTwoIcon","WThreeSchoolsIcon"];
const deprecatedStubsConfig = deprecatedStubs.length > 0 ? {
  input: Object.fromEntries(deprecatedStubs.map(name => [name, `src/${name}.ts`])),
  output: {
    dir: `${outputDir}/esm`,
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js'
  },
  plugins: plugins(false)
} : null;

// Per-icon CommonJS modules for consumers that resolve the `require` condition of
// exports["./*"] (Jest, webpack require()): dist/cjs/<Icon>.js with module.exports = <Icon>,
// the shape 4.2.3 shipped. Plain Node still can't require them while "type" is "module".
const iconCjsConfig = {
  input: Object.fromEntries(iconFiles.map(name => [name, `src/${name}.ts`])),
  output: {
    dir: `${outputDir}/cjs`,
    format: 'cjs',
    exports: 'default',
    sourcemap: false,
    entryFileNames: '[name].js'
  },
  plugins: plugins(false)
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
    typesModuleConfig,
    typesJsConfig, 
    loaderWebConfig, 
    loaderWebTypesConfig,
    loaderNodeConfig,
    loaderNodeTypesConfig,
    loaderNativeConfig,
    loaderNativeTypesConfig,
    ...(deprecatedStubsConfig ? [deprecatedStubsConfig] : []),
    iconCjsConfig,
    ...iconConfigs, 
    ...iconTypeConfigs
  ];
} else {
  // Default: Only build main bundles (no individual icons)
  console.log('Building main bundles only. Set BUILD_INDIVIDUAL_ICONS=true to build individual icon files.');
  exportConfig = [
    indexConfig, 
    typesConfig, 
    typesModuleConfig,
    typesJsConfig,
    loaderWebConfig, 
    loaderWebTypesConfig,
    loaderNodeConfig,
    loaderNodeTypesConfig,
    loaderNativeConfig,
    loaderNativeTypesConfig,
    ...(deprecatedStubsConfig ? [deprecatedStubsConfig] : []),
    iconCjsConfig
  ];
}

export default exportConfig;
