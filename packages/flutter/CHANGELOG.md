# Changelog

## [1.2.0] - 2026-09-16

### Added
- **`disableSecondaryOpacity`** on `HugeIcon`: draw the secondary layer at full opacity (same option as the React renderer)
- **900+ New Icons**: Icon set refreshed from the latest hugeicons.com library — 6,027 stroke-rounded icons (903 added since 1.1.7)

### Changed
- **Website Parity**: The package now contains exactly the icons published on [hugeicons.com](https://hugeicons.com/icons), and names follow the same logic as the Flutter snippet shown there — copy the constant from any icon page and it exists (`4k` → `strokeRounded4K`, `c++` → `strokeRoundedCpp`)
- **Updated Icons**: 206 existing icons redrawn to match the latest designs on hugeicons.com

### Fixed
- **`secondaryColor` by layer**: the secondary layer is now every element the design draws at reduced opacity, matching the React renderer. Previously it was applied by attribute (fill only), so it did nothing for Twotone icons (two strokes) and recolored the whole icon for Bulk icons (two fills). Duotone's faded layer now takes `secondaryColor` for both its fill and its outline.
- **SVG Attributes**: `stroke-dasharray`, `stroke-miterlimit` and `opacity` now render correctly (previously emitted as invalid camelCase attributes and ignored)

### Deprecated
- 46 constants from 1.1.x whose source files were misspelled or never published still compile, but are now marked `@Deprecated` and will be removed in the next major version. Most point at the correctly named icon:
  - `strokeRounded0Circle` … `strokeRounded9Circle`, `strokeRounded0Square` … `strokeRounded3Square` → `strokeRoundedZeroCircle` … `strokeRoundedNineCircle`, `strokeRoundedZeroSquare` … `strokeRoundedThreeSquare`
  - `strokeRounded1stBrecket*`, `strokeRounded2ndBrecket*`, `strokeRounded3rdBrecket*`, `strokeRoundedRoot1st/2nd/3rdBrecket` → `…Bracket…`
  - `strokeRounded3DMove`, `strokeRounded3DScale`, `strokeRounded3DRotate` → `strokeRounded3dMove`, `strokeRounded3dScale`, `strokeRounded3dRotate`
  - `strokeRoundedFourK`, `strokeRoundedModernTv4K` → `strokeRounded4K`, `strokeRoundedModernTvFourK`
  - `strokeRoundedC` → `strokeRoundedCpp`; `strokeRoundedTropicalStormTracks` → `strokeRoundedTropicalStormTracks02`
  - Kept as-is with no replacement (not in the published icon set): `strokeRounded4Square` … `strokeRounded9Square`, `strokeRoundedAdvertisement`, `strokeRoundedFolderMoveIn`, `strokeRoundedFolderMoveTo`, `strokeRoundedSingleFire`, `strokeRoundedSquareSingleFire`, `strokeRoundedTinder`, `strokeRoundedTinderSquare`

---

## [1.1.7] - 2026-05-12

### Updated
- Refreshed icon set from latest `icons/` SVG assets (~5,100+ stroke-rounded icons).
- Fixed README to accurately describe the free package (stroke-rounded only).
- Fixed deprecated `.opacity` API usage for future Flutter compatibility.

---

## [1.1.6] - 2026-03-30

### Updated
- Regenerated Free package (`stroke-rounded` style) from the latest `icons/` SVG assets.

---

## [1.1.5] - 2025-01-14

### Added
- **Two-Color Duotone Support**: New `secondaryColor` parameter for `HugeIcon` widget
  - `color` applies to stroke elements (foreground)
  - `secondaryColor` applies to fill elements (background)
  - Enables true two-color duotone icon effects
  - Backward compatible: defaults to `color` if `secondaryColor` is not specified

---

## [1.1.4] - 2025-01-30

### Fixed
- **Alpha Channel Support**: Icons now properly respect the alpha channel when providing colors with transparency
  - `Colors.white.withAlpha(50)` now correctly renders semi-transparent icons
  - Added `stroke-opacity` and `fill-opacity` SVG attributes for transparent colors
  - Fixes issue where icons were always fully opaque regardless of color transparency

---

## [1.1.3] - 2025-01-30

### Updated
- **Icon Set**: Updated to latest icon set with regenerated icon data

---

## [1.1.2] - 2025-01-30

### Fixed
- **Flutter Compatibility**: Fixed `toARGB32()` method not found error on Flutter versions prior to 3.29.0
  - Reverted from `.toARGB32()` to `.value` for color conversion to ensure compatibility with all Flutter versions
  - Package now works correctly on Flutter 3.27.0 and all other supported versions
  - Added deprecation suppression to prevent warnings on newer Flutter versions

---

## [1.1.1] - 2025-01-23

### Fixed
- **CupertinoDynamicColor Support**: Icons now properly adapt to light/dark mode when using `CupertinoDynamicColor` (e.g., `CupertinoColors.tertiaryLabel`)
  - Fixed color resolution to match Flutter's built-in `Icon` and `Text` widget behavior
  - Icons will now correctly change colors when switching between light and dark themes

---

## [1.1.0] - 2025-01-22

### 🎨 Enhanced Theme Integration

#### Added
- **Automatic Theme Color Inheritance**: Icons now automatically inherit theme text colors when no explicit color is provided
- **Dark Mode Support**: Seamless adaptation to light/dark theme changes across all platforms
- **Improved Color Fallback Chain**: 
  ```
  widget.color → IconTheme.color → DefaultTextStyle.color → Theme.colorScheme.onSurface
  ```
- **Desktop Platform Optimization**: Enhanced color inheritance specifically for macOS, Windows, and Linux
- **StatefulWidget Architecture**: Upgraded from StatelessWidget to StatefulWidget for proper theme change detection

#### Enhanced
- **Optional Color Parameter**: Color parameter is now optional, enabling automatic theme inheritance
- **Material Design 3 Compatibility**: Full support for Material 3 color schemes and theme modes
- **Color API Modernization**: Updated from deprecated `.value` to modern `.toARGB32()` API
- **Performance Optimizations**: 
  - Intelligent SVG caching with invalidation on theme/color changes
  - Reduced unnecessary rebuilds through proper lifecycle management
- **Feature Parity**: Now has 100% feature parity with the Pro version for theme handling

#### Usage Examples
```dart
// Theme-aware icons (recommended) - automatically adapt to light/dark themes
HugeIcon(
  icon: HugeIconsStrokeRounded.user,
  strokeWidth: 2.0,
)

// Explicit color (override theme)
HugeIcon(
  icon: HugeIconsStrokeRounded.user,
  color: Colors.blue,
)
```

#### Technical Improvements
- **Widget Architecture**: Migrated from StatelessWidget to StatefulWidget
- **Lifecycle Management**: Added `didChangeDependencies()` and `didUpdateWidget()` 
- **Import Updates**: Added Material import for Theme access
- **Code Quality**: Zero deprecation warnings and improved static analysis scores

### 🔧 Breaking Changes
None - All changes are backward compatible. Existing code continues to work unchanged.

### 📱 Platform Support
- Enhanced macOS, Windows, and Linux theme inheritance
- Continued full support for Android, iOS, and Web

---

## [1.0.2] - 2025-01-09
### Fixed
- **Code Formatting**: Applied Dart formatter to all generated files for perfect static analysis score
  - Fixed formatting issues in `hugeicons.dart` and `stroke_rounded.dart`
  - Achieved perfect 50/50 static analysis score on pub.dev
  - Improved code readability and consistency

## [1.0.1] - 2025-01-09
### Fixed
- **Code Quality**: Fixed linting issues for perfect static analysis score
  - Added proper curly braces around if/else statements in generated Dart code
  - Fixed string concatenation to use proper interpolation syntax
  - Improved overall code quality and maintainability

## [1.0.0] - 2025-01-09
### Major Changes
- **BREAKING**: Migrated from font-based (TTF) to SVG-based icons for better performance and scalability
- **BREAKING**: Removed font assets and dependencies - now uses `flutter_svg` package
- **BREAKING**: Updated icon naming pattern to `HugeIcons.strokeRounded[IconName]`

### Added
- **Stroke Width Control**: Added `strokeWidth` parameter to `HugeIcon` widget for fine-tuned design control
- **SVG-Based Icons**: High-quality vector icons that scale perfectly at any size
- **Tree Shaking Support**: Only include the icons you use in your final app bundle
- **Enhanced Performance**: Faster rendering and smaller bundle sizes with SVG approach
- **4,500+ Icons**: Comprehensive collection of stroke-rounded icons

### Removed
- Font-based icon system (TTF files)
- Old icon naming conventions
- Font family dependencies

### Updated
- Package version bumped to 1.0.0 to reflect major architectural changes
- All icons now use consistent stroke-rounded style
- Improved documentation and usage examples

## [0.0.10] - 2024-10-06
### Fixes
- General bug fixes and improvements.
- Updated font assets.
- Added the latest icons to the package.

## [0.0.7] - 2024-07-25
### Fixes
- General bug fixes and improvements.
- Added the latest icons to the package.

## [0.0.5] - 2024-07-09
### Fixes
- General bug fixes and improvements.

## [0.0.4] - 2024-07-09
### Fixes
- General bug fixes and improvements.

## [0.0.3] - 2024-07-09
### Added
- Created the `HugeIcon` widget to display icons with customizable color and size.
- Added documentation comments for all public API elements.
- Provided a test file to verify the functionality of the `HugeIcons` and `HugeIcon` widgets.
- Included an example project demonstrating how to use the `hugeicons` package in a Flutter application.

## [0.0.1] - 2024-07-05
### Fixes
- General bug fixes and improvements.

## [0.0.1] - 2024-07-02
### Added
- Initial release of the `hugeicons` package.
