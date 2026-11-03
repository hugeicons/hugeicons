# Migrating from legacy Hugeicons packages

Covers the deprecated pre-1.0 packages, which are still on npm and still get emitted by AI
tools trained on old code:

| Legacy package | Last version | Replace with |
|---|---|---|
| `hugeicons-react` | 0.4.0 (0.3.0 is the last real build; 0.4.0 is a shim) | `@hugeicons/react` + `@hugeicons/core-free-icons` |
| `@hugeicons/react-pro` | 0.3.2 | `@hugeicons/react` + one or more `@hugeicons-pro/core-*` |
| `hugeicons-react-native` | 0.0.2 | `@hugeicons/react-native` + `@hugeicons/core-free-icons` + `react-native-svg` |
| `@hugeicons/react-native-pro` | 0.1.7 | `@hugeicons/react-native` + `@hugeicons-pro/core-*` + `react-native-svg` |

Also covers **`@hugeicons/core-free-icons` 4.2.x → 4.3.x**, which renamed/removed 36 exports (§5).

## 1. Detect

```bash
grep -rnE "from ['\"](hugeicons-react|@hugeicons/react-pro|hugeicons-react-native|@hugeicons/react-native-pro)['\"]" src
grep -rn "hugeiconsLicense" src          # Pro packages only
```

## 2. Swap the packages

```bash
# free
npm uninstall hugeicons-react
npm install @hugeicons/react @hugeicons/core-free-icons

# pro (needs the authenticated registry set up in .npmrc first)
npm uninstall @hugeicons/react-pro
npm install @hugeicons/react @hugeicons-pro/core-stroke-rounded   # see §4 for which package(s)

# react native — same, plus the svg renderer if it isn't installed
npm uninstall hugeicons-react-native
npm install @hugeicons/react-native @hugeicons/core-free-icons react-native-svg
```

Pro only: **delete** the `hugeiconsLicense('…')` call and its import. Licensing moved to the
npm registry (`.npmrc`), the component no longer takes a key.

## 3. The rewrite

The legacy packages exported one **component per icon**. The current packages export one
**renderer** (`HugeiconsIcon`) and the icons are **data** passed as a prop. Icon names are the
same (`Home01Icon` then, `Home01Icon` now).

```tsx
// before
import { Home01Icon, Settings01Icon } from 'hugeicons-react'

<Home01Icon size={32} color="#1a1a1a" className="nav-icon" onClick={go} />
<Settings01Icon />

// after
import { HugeiconsIcon } from '@hugeicons/react'
import { Home01Icon, Settings01Icon } from '@hugeicons/core-free-icons'

<HugeiconsIcon icon={Home01Icon} size={32} color="#1a1a1a" className="nav-icon" onClick={go} />
<HugeiconsIcon icon={Settings01Icon} />
```

Rules:
1. Split every legacy import into two: the renderer from `@hugeicons/react` (or `/react-native`),
   the icon names from the icon package. Keep the icon names as they were.
2. `<XIcon …props />` → `<HugeiconsIcon icon={XIcon} …props />`.
3. Keep `size`, `color`, `strokeWidth`, `className`, `ref`, event handlers, `aria-*`, `data-*`
   and any other SVG attribute as-is — `HugeiconsIcon` forwards `ref` and spreads unknown props
   onto the `<svg>` exactly like the old factory did.
4. Then apply the minimal-props rule from the `hugeicons` skill: drop props that only restate a
   default — `size={24}`, `color="currentColor"`, `strokeWidth={1.5}` (React Native default
   color is `#000000`).

Props that changed:

| Legacy prop | Legacy default | Now |
|---|---|---|
| `size`, `color`, `strokeWidth`, `className` | 24, currentColor, 1.5, "" | unchanged |
| `variant` (Pro) | `"stroke"` | gone — pick the Pro **package** (§4) |
| `type` (Pro) | `"rounded"` | gone — pick the Pro **package** (§4) |
| `rotate={deg}` | – | gone — `style={{ transform: 'rotate(90deg)' }}` or a CSS class |
| `animate` | – | gone — a CSS animation class |

`rotate` and `animate` appear in the old README but the shipped factory never implemented them:
they fell through as raw SVG attributes. Treat any occurrence as a bug the migration fixes.

Dynamic usage — a map of icon components — needs one extra change, since the values are now
data, not components:

```tsx
// before
const icons = { home: Home01Icon, settings: Settings01Icon }
const Icon = icons[name]
return <Icon size={20} />

// after
const icons = { home: Home01Icon, settings: Settings01Icon }
return <HugeiconsIcon icon={icons[name]} size={20} />
```

## 4. Pro: `variant` + `type` → package

The legacy Pro component chose the style at render time. Now each style is its own package;
the icon name is the same in every one.

| `variant` | `type` | Package |
|---|---|---|
| `stroke` | `rounded` (default) | `@hugeicons-pro/core-stroke-rounded` |
| `stroke` | `standard` | `@hugeicons-pro/core-stroke-standard` |
| `stroke` | `sharp` | `@hugeicons-pro/core-stroke-sharp` |
| `solid` | `rounded` | `@hugeicons-pro/core-solid-rounded` |
| `solid` | `standard` | `@hugeicons-pro/core-solid-standard` |
| `solid` | `sharp` | `@hugeicons-pro/core-solid-sharp` |
| `bulk` | `rounded` | `@hugeicons-pro/core-bulk-rounded` |
| `duotone` | `rounded` | `@hugeicons-pro/core-duotone-rounded` |
| `duotone` | `standard` | `@hugeicons-pro/core-duotone-standard` |
| `twotone` | `rounded` | `@hugeicons-pro/core-twotone-rounded` |

Any other combination never existed; map it to `stroke-rounded` and say so.

- No `variant`/`type` anywhere → install `core-stroke-rounded` only.
- Several styles in one project → install each package used and import the icon from the
  package that matches that call site. Multicolor styles (bulk, duotone, twotone) accept
  `primaryColor` / `secondaryColor` on `HugeiconsIcon`.

```tsx
// before
<Home01Icon variant="solid" type="sharp" />
// after
import { Home01Icon } from '@hugeicons-pro/core-solid-sharp'
<HugeiconsIcon icon={Home01Icon} />
```

## 5. Renamed and removed icon names

Everything not listed here kept its name. Successors marked ✓ were verified to be the same
glyph; "nearest" means a different drawing of the same idea — show it to the user.

### Legacy 0.x packages → current

| Legacy name | Now | |
|---|---|---|
| `ArrangeByLettersAzIcon` | `ArrangeByLettersAZIcon` | ✓ |
| `ArrangeByLettersZaIcon` | `ArrangeByLettersZAIcon` | ✓ |
| `ArrangeByNumbers19Icon` | `ArrangeByNumbersOneNineIcon` | ✓ |
| `ArrangeByNumbers91Icon` | `ArrangeByNumbersNineOneIcon` | ✓ |
| `GoBackward5SecIcon` | `GoBackwardFiveSecIcon` | ✓ |
| `GoForward5SecIcon` | `GoForwardFiveSecIcon` | ✓ |
| `Html5Icon` | `HtmlFiveIcon` | ✓ |
| `Layout2ColumnIcon` | `LayoutTwoColumnIcon` | ✓ |
| `Layout2RowIcon` | `LayoutTwoRowIcon` | ✓ |
| `Layout3ColumnIcon` | `LayoutThreeColumnIcon` | ✓ |
| `Layout3RowIcon` | `LayoutThreeRowIcon` | ✓ |
| `Mp302Icon` | `MpThree02Icon` | ✓ |
| `Mp401Icon` | `MpFour01Icon` | ✓ |
| `Mp402Icon` | `MpFour02Icon` | ✓ |
| `Sorting19Icon` | `SortingOneNineIcon` | ✓ |
| `Sorting91Icon` | `SortingNineOneIcon` | ✓ |
| `SortingAz01Icon` | `SortingAZ01Icon` | ✓ |
| `SortingAz02Icon` | `SortingAZ02Icon` | ✓ |
| `SortingZa01Icon` | `SortingZA01Icon` | ✓ |
| `FingerprintScanIcon`, `FingerprintScan01Icon`, `FingerprintScan02Icon` | `FingerPrintScanIcon` (note the capital P) | nearest |
| `FoursquareIcon` | removed — no free replacement | |
| `TrademarkIcon`, `TrademarkCircleIcon` | `TradeMarkIcon` (capital M) | nearest |

The pattern: digits that stand alone in a name are now spelled out (`5` → `Five`, `19` →
`OneNine`), and two-letter abbreviations are upper-cased (`Az` → `AZ`).

Pro packages (`@hugeicons/react-pro`, `@hugeicons/react-native-pro`) additionally had:

| Legacy name | Now | |
|---|---|---|
| `FirstBrecketIcon`, `FirstBrecketCircleIcon`, `FirstBrecketSquareIcon` | `FirstBracketIcon`, `FirstBracketCircleIcon`, `FirstBracketSquareIcon` | ✓ typo fixed |
| `SecondBrecket…Icon`, `ThirdBrecket…Icon` (same three suffixes each) | `SecondBracket…Icon`, `ThirdBracket…Icon` | ✓ |
| `RootFirstBrecketIcon`, `RootSecondBrecketIcon`, `RootThirdBrecketIcon` | `RootFirstBracketIcon`, `RootSecondBracketIcon`, `RootThirdBracketIcon` | ✓ |
| `AdvertisementIcon` | `AdvertisimentIcon` (sic — the current export keeps the misspelling) | ✓ |
| `TropicalStormTracksIcon` | `TropicalStormTracks02Icon` | ✓ |
| `FolderMoveInIcon`, `FolderMoveToIcon` | `FolderTransferIcon` | nearest |
| `TinderIcon`, `TinderSquareIcon` | removed — no free replacement | |
| `BottleWineIcon` | removed — grep `Wine` / `Bottle` for an alternative | |

### `@hugeicons/core-free-icons` 4.2.x → 4.3.x

4.3 added ~590 icons (including Lucide-compatible names such as `TrashIcon`, `MenuIcon`, `XIcon`)
and removed these 36. Anyone upgrading a working 4.2 project hits them as
"Module has no exported member".

| 4.2.x name | 4.3.x | |
|---|---|---|
| `Clock1Icon` … `Clock9Icon` | `ClockHourOneIcon` … `ClockHourNineIcon` | ✓ |
| `Clock10Icon`, `Clock11Icon`, `Clock12Icon` | `ClockHour10Icon`, `ClockHour11Icon`, `ClockHour12Icon` | ✓ |
| `ArrowDown10Icon`, `ArrowUp10Icon` | `ArrowDownOneZeroIcon`, `ArrowUpOneZeroIcon` | ✓ |
| `Calendar1Icon` | `CalendarDateOneIcon` | ✓ |
| `CalendarMinus2Icon` | `CalendarMinusIcon` | ✓ |
| `CircleSlash2Icon` | `CircleSlashTwoIcon` | ✓ |
| `ArrowDownAzIcon`, `ArrowUpZaIcon` | `ArrowDownAZIcon`, `ArrowUpZAIcon` | nearest |
| `Axis3DIcon`, `FileAxis3DIcon` | `AxisThreeDIcon`, `FileAxisThreeDIcon` | nearest |
| `BookUp2Icon` | `BookUpTwoIcon` | nearest |
| `Building2Icon` | `BuildingIcon` / `Building02Icon` | nearest |
| `CalendarCheck2Icon` | `CalendarCheckIcon` | nearest |
| `CalendarPlus2Icon` | `CalendarPlusIcon` | nearest |
| `CalendarX2Icon` | `CalendarXIcon` | nearest |
| `FlipHorizontal2Icon`, `FlipVertical2Icon` | `FlipHorizontalIcon`, `FlipVerticalIcon` | nearest |
| `Flower2Icon` | `FlowerIcon` | nearest |
| `Gamepad2Icon` | `GamepadIcon` | nearest |
| `Heading1Icon`, `Heading2Icon`, `Heading4Icon`, `Heading5Icon`, `Heading6Icon` | removed — the "H1…H6" glyphs are gone from the free set; `Heading01Icon`…`Heading06Icon` are plain "H" variants | |
| `BottleWineIcon` | removed | |

## 6. Bulk procedure

```bash
# 1. every icon name the project uses, once
grep -rhoE '\b[A-Z][A-Za-z0-9]*Icon\b' src | sort -u > /tmp/icons.txt

# 2. which of them no longer exist (fix these via §5 before touching code)
#    the installed .d.ts is the source of truth for the version this project builds against
grep -oE 'declare const \w+Icon' node_modules/@hugeicons/core-free-icons/dist/types/index.d.ts \
  | sed 's/declare const //' | sort -u > /tmp/catalog.txt
comm -23 /tmp/icons.txt /tmp/catalog.txt

# 3. rewrite files, then confirm nothing legacy is left
grep -rnE "hugeicons-react|@hugeicons/react-pro|hugeicons-react-native|react-native-pro|hugeiconsLicense" src
```

Step 2 must be empty before step 3 — an import of a name that no longer exists fails the whole
build, not just one icon.
