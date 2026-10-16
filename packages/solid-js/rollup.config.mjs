import withSolid from 'rollup-preset-solid';

export default withSolid({
  input: 'src/index.tsx',
  targets: ['esm', 'cjs'],
  printInstructions: false,
  onwarn(warning, warn) {
    if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
    warn(warning);
  },
});
