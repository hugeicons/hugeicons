# @hugeicons/angular


## 1.0.12

### Patch Changes

- Fixed icons rendering incompletely: every icon element is now rendered with its real tag (`circle`, `ellipse`, `rect`, … — previously all were drawn as `<path>`, e.g. `User02Icon` had no head) ([#35](https://github.com/hugeicons/hugeicons/issues/35))
- All icon attributes are now applied (`stroke-linecap`, `stroke-linejoin`, `clip-rule`, `transform`, …); stroke icons no longer render blank without a `strokeWidth` input
- Rendering is generic, like `@hugeicons/react`: any SVG element and attribute in the icon data is supported, with React's attribute naming (`strokeWidth` → `stroke-width`, `gradientTransform` kept, `xlinkHref` → `xlink:href`)
- Added `primaryColor`, `secondaryColor` and `disableSecondaryOpacity` inputs for bulk/duotone icons, matching `@hugeicons/react`
- Binding `undefined` to `size` or `color` now falls back to the defaults (24, `currentColor`), as in React
- Secondary (opacity) layers are now drawn first, the same order as `@hugeicons/react`; DOM order changes for bulk/duotone/twotone icons (update DOM snapshots if you have them)
- Verified pixel- and DOM-identical to `@hugeicons/react` for every icon in all 11 packages; works with SSR and hydration on Angular 17.1+


## 1.0.9

### Patch Changes

- Added Angular 22 peer dependency support


## 1.0.7

### Patch Changes

- Updated documentation icon counts to 5,100+ free / 51,000+ pro


## 1.0.6

### Patch Changes

- Fixed TypeScript type compatibility issue with icon data packages
- `IconSvgObject` now accepts both strict (`SvgPathAttributes`) and loose path attribute formats
- Resolves "Property 'd' is missing" type error when using icons from `@hugeicons/core-*` packages


## 1.0.5

### Patch Changes

- Added "How It Works" section explaining the rendering library concept
- Standardized documentation structure across all framework packages
- Updated icon counts to 4,600+ free / 46,000+ pro
- Updated docs URL to hugeicons.com/docs
- Updated to use single image source from React repository


## 1.0.0

### Major Changes

- Initial release
- Standalone component support
- Signal-based inputs for Angular 17.1+
- Full TypeScript support
