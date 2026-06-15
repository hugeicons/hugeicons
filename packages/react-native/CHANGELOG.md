# @hugeicons/react-native


## 1.0.13

### Patch Changes

- fix icon count updates on docs (5,100+ free / 51,000+ pro)

## 1.0.12

### Patch Changes

- Updated documented icon counts to 5,100+ free / 51,000+ pro

## 1.0.11

### Patch Changes

- Fixed TypeScript autocomplete for component props in IDEs
- Improved component type definition from `any` to `HugeiconsIconComponent`
- Enhanced type exports for better TypeScript IntelliSense support
- Added proper type annotations to forwardRef implementation
- Improved rollup configuration for better type preservation

## 1.0.10

### Patch Changes

- Added "How It Works" section explaining the rendering library concept
- Standardized documentation structure across all framework packages
- Updated icon counts to 5,100+ free / 51,000+ pro
- Updated docs URL to hugeicons.com/docs
- Added LICENSE.md, PRO-LICENSE.md, and CHANGELOG.md files
- Updated to use single image source from React repository

## 1.0.9

### Patch Changes

- Fixed `slicedToArray is not a function` error on React Native 0.72.x and older versions
- Improved compatibility with Metro bundler by avoiding ES6 array destructuring on iterables

## 1.0.7

### Patch Changes

- Enhanced stroke functionality to apply stroke properties consistently to both parent SVG and child elements
- Improved stroke width calculation and inheritance across SVG hierarchy
- Maintained backward compatibility with existing stroke implementations

## 1.0.6

### Patch Changes

- Added NativeWind support through `className` prop
- Icons can now be styled using Tailwind CSS classes when NativeWind is installed
- Maintained backward compatibility for non-NativeWind users
- Enhanced TypeScript types for NativeWind support

## 1.0.3

### Patch Changes

- Added `absoluteStrokeWidth` prop for consistent stroke width scaling
- Improved stroke width handling by applying it at the SVG level
- Enhanced TypeScript types and documentation

## 1.0.2

### Patch Changes

- Added `altIcon` prop for alternate icon support
- Added `showAlt` prop for conditional icon display
- Improved TypeScript types and documentation

## 1.0.0

### Major Changes

- Initial release
- Basic icon rendering functionality
- Support for customization (size, color, alternate icons)
- Full TypeScript support
