# Migrating from lucide-react

The easiest source: since `@hugeicons/core-free-icons` 4.3 the free catalog carries **Lucide-
compatible names** for most common icons (`TrashIcon`, `MenuIcon`, `XIcon`, `ChevronDownIcon`,
`PanelLeftIcon`, `Grid2X2Icon`, …), and the two prop models are nearly identical.

## 1. Detect

```bash
grep -rnE "from ['\"]lucide-react(/dynamic)?['\"]" src
```

## 2. Swap the packages

```bash
npm uninstall lucide-react
npm install @hugeicons/react @hugeicons/core-free-icons
```

## 3. The rewrite

```tsx
// before
import { Search, Trash2, ChevronDown } from 'lucide-react'

<Search size={20} />
<Trash2 className="text-red-500" strokeWidth={1.5} />
<ChevronDown />

// after
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, TrashIcon, ChevronDownIcon } from '@hugeicons/core-free-icons'

<HugeiconsIcon icon={Search01Icon} size={20} />
<HugeiconsIcon icon={TrashIcon} className="text-red-500" />
<HugeiconsIcon icon={ChevronDownIcon} />
```

Props:

| lucide prop | Hugeicons | Note |
|---|---|---|
| `size` (24) | `size` (24) | same |
| `color` (currentColor) | `color` (currentColor) | same |
| `strokeWidth` (**2**) | `strokeWidth` (**1.5**) | Hugeicons is drawn lighter. Drop an explicit `strokeWidth={2}` unless the user wants the heavier look; **don't** add `strokeWidth={2}` everywhere to "match" |
| `absoluteStrokeWidth` | `absoluteStrokeWidth` | same |
| `className`, `style`, `onClick`, `aria-*`, `ref` | unchanged | both spread onto `<svg>` and forward `ref` |
| `strokeLinecap`, `strokeLinejoin` | drop | baked into the icon data |

Lucide's three import spellings — `Trash2`, `Trash2Icon`, `LucideTrash2` — are one icon. Resolve
the bare name.

Types: `LucideIcon` / `LucideProps` → `IconSvgElement` / `HugeiconsProps` from `@hugeicons/react`.

```tsx
// before
import type { LucideIcon } from 'lucide-react'
const items: { label: string; icon: LucideIcon }[] = […]
<item.icon size={16} />

// after
import type { IconSvgElement } from '@hugeicons/react'
const items: { label: string; icon: IconSvgElement }[] = […]
<HugeiconsIcon icon={item.icon} size={16} />
```

`lucide-react/dynamic` (`<DynamicIcon name="…">`) has no equivalent — replace with an explicit
map of the names the app actually uses.

## 4. Resolving names

Work through these in order and stop at the first hit. Every step is a grep against
`skills/hugeicons/references/icon-list.md`; never emit a name you haven't seen there.

1. **Exact:** `<Name>Icon` — `Menu` → `MenuIcon`, `ChevronDown` → `ChevronDownIcon`,
   `PanelLeft` → `PanelLeftIcon`. ~70 % of common lucide names hit here.
   Casing quirks: `Grid2x2` → `Grid2X2Icon`, `Fingerprint` → `FingerPrintIcon`.
2. **Lucide's own alias:** lucide renamed many icons (old ↔ new); the catalog may have either
   spelling. Try both: `AlertTriangle`/`TriangleAlert` → `TriangleAlertIcon`,
   `CheckCircle`/`CircleCheck` → `CircleCheckIcon`, `HelpCircle`/`CircleHelp` → `HelpCircleIcon`,
   `AlertCircle`/`CircleAlert` → `AlertCircleIcon`, `Loader2`/`LoaderCircle` → `LoaderCircleIcon`,
   `Edit`/`SquarePen` → `SquarePenIcon`, `Edit3`/`PenLine` → `PenLineIcon`.
3. **Numbered:** `<Name>01Icon` — `Search` → `Search01Icon`, `Home` → `Home01Icon`,
   `Settings` → `Settings01Icon`, `Mail` → `Mail01Icon`, `Calendar` → `Calendar01Icon`. The
   `01` is the canonical variant; `02`…`0n` are alternatives, not "newer".
4. **Table below.**
5. **grep the catalog** by concept (`grep -i sidebar icon-list.md`); if nothing convincing turns
   up, list the name as unmapped and ask.

### Curated exceptions (no exact/alias/numbered hit)

| lucide | Hugeicons | |
|---|---|---|
| `Trash2` | `TrashIcon` | |
| `Edit2`, `Pen` | `Pen01Icon` | |
| `Settings2` | `SlidersHorizontalIcon` | lucide's Settings2 is a sliders glyph |
| `Sliders` | `SlidersVerticalIcon` | |
| `CircleUser`, `UserCircle` | `UserCircleIcon` | |
| `Unlock` | `LockOpenIcon` | |
| `Link2` | `LinkIcon` | |
| `Share2` | `Share08Icon` | nearest — three-node share glyph |
| `ChevronsUpDown` | `UnfoldMoreIcon` | |
| `XCircle`, `CircleX` | `CircleXIcon` | |
| `Volume1` | `VolumeLowIcon` | |
| `Volume2` | `VolumeHighIcon` | |
| `BarChart`, `BarChart2`, `ChartColumn` | `ChartColumnIcon` | |
| `BarChart3`, `ChartColumnBig` | `ChartColumnBigIcon` | |
| `BarChartHorizontal`, `ChartBar` | `BarChartHorizontalIcon` | |
| `LineChart`, `ChartLine` | `ChartLineIcon` | |
| `Columns`, `Columns2` | `LayoutTwoColumnIcon` | |
| `Columns3` | `LayoutThreeColumnIcon` | |
| `Rows`, `Rows2` | `RowsTwoIcon` | |
| `Rows3` | `RowsThreeIcon` | |
| `Sidebar` | `PanelLeftIcon` | |
| `Maximize2` | `Maximize01Icon` | |
| `Minimize2` | `Minimize01Icon` | |
| `Code2`, `CodeXml` | `CodeXmlIcon` | |
| `Wand2`, `WandSparkles` | `WandSparklesIcon` | |
| `AlignLeft` / `AlignCenter` / `AlignRight` / `AlignJustify` | `TextAlignLeftIcon` / `TextAlignCenterIcon` / `TextAlignRightIcon` / `TextAlignJustifyIcon` | lucide's are text alignment; Hugeicons' `AlignLeftIcon` etc. are object alignment |
| `Undo2` / `Redo2` | `UndoIcon` / `RedoIcon` | |
| `LifeBuoy` | `LifebuoyIcon` | |
| `Contact2`, `ContactRound` | `ContactRoundIcon` | |
| `ParkingCircle`, `CircleParking` | `CircleParkingIcon` | |
| `Layers2`, `Layers3` | `Layers01Icon` | nearest |
| `Building2` | `Building02Icon` | nearest |
| `Heading1` … `Heading6` | no free equivalent — `Heading01Icon`…`Heading06Icon` are plain "H" variants without the digit | ask |
