# Migrating from @heroicons/react

Heroicons names describe the drawing (`MagnifyingGlass`, `Bars3`, `ArrowTopRightOnSquare`), so
few names hit the catalog directly — use the table. The prop model is trivial: heroicons have no
size/color props, everything is `className`.

## 1. Detect

```bash
grep -rnE "from ['\"]@heroicons/react/(16|20|24)/(solid|outline)['\"]" src
```

The import path carries two facts you need:

| Path | Style | Grid | Migrate to |
|---|---|---|---|
| `/24/outline` | stroke, 1.5px | 24 | `@hugeicons/core-free-icons` — same weight, same grid |
| `/24/solid` | filled | 24 | Pro `@hugeicons-pro/core-solid-rounded` if licensed; otherwise the free stroke icon — tell the user the look changes |
| `/20/solid` | filled, mini | 20 | as above; add `size={20}` |
| `/16/solid` | filled, micro | 16 | as above; add `size={16}` |

## 2. Swap the packages

```bash
npm uninstall @heroicons/react
npm install @hugeicons/react @hugeicons/core-free-icons
```

## 3. The rewrite

```tsx
// before
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
<XMarkIcon className="h-6 w-6" />
<ChevronDownIcon className="h-5 w-5" />

// after
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, XIcon, ChevronDownIcon } from '@hugeicons/core-free-icons'

<HugeiconsIcon icon={Search01Icon} className="h-5 w-5 text-gray-400" aria-hidden="true" />
<HugeiconsIcon icon={XIcon} className="h-6 w-6" />
<HugeiconsIcon icon={ChevronDownIcon} className="h-5 w-5" />
```

Props:

| heroicons | Hugeicons | Note |
|---|---|---|
| `className="h-6 w-6"` | keep as-is | Tailwind sizing wins over the `width`/`height` attributes; **don't** translate it into `size` |
| `className="text-…"` | keep as-is | color is `currentColor` in both |
| `aria-hidden`, `title`, `onClick`, `ref` | unchanged | spread onto `<svg>`, `ref` forwarded |
| (none) | `strokeWidth` | heroicons outline is 1.5 — same as the Hugeicons default. Add nothing |

Types: `React.ComponentProps<'svg'>` / `React.ForwardRefExoticComponent<…>` used for icon
props → `IconSvgElement` from `@hugeicons/react`.

```tsx
// before
const nav: { name: string; icon: React.ForwardRefExoticComponent<any> }[] = […]
<item.icon className="h-6 w-6" />

// after
import type { IconSvgElement } from '@hugeicons/react'
const nav: { name: string; icon: IconSvgElement }[] = […]
<HugeiconsIcon icon={item.icon} className="h-6 w-6" />
```

## 4. Resolving names

1. Table below — covers the heroicons that are actually used in typical apps.
2. Exact `<Name>` (heroicons already end in `Icon`): `CheckIcon`, `PlusIcon`, `ChevronDownIcon`,
   `UserIcon`, `BellIcon`, `TrashIcon`, `PencilIcon`, `LinkIcon`, `EyeIcon`, `HeartIcon`,
   `StarIcon`, `MapPinIcon`, `PhoneIcon`, `CloudIcon`, `GiftIcon`, `CogIcon`, `InboxIcon` … all
   exist verbatim.
3. Numbered: `HomeIcon` → `Home01Icon`, `CalendarIcon` → `Calendar01Icon`, `ClockIcon` →
   `Clock01Icon`, `CameraIcon` → `Camera01Icon`, `TagIcon` → `Tag01Icon`, `KeyIcon` → `Key01Icon`,
   `FlagIcon` → `Flag01Icon`, `WalletIcon` → `Wallet01Icon`, `WrenchIcon` → `Wrench01Icon`.
4. grep the catalog by concept; if nothing convincing, list as unmapped and ask.

### Name map

| heroicons | Hugeicons | |
|---|---|---|
| `MagnifyingGlassIcon` | `Search01Icon` | |
| `MagnifyingGlassPlusIcon` / `MinusIcon` | `ZoomInIcon` / `ZoomOutIcon` | |
| `MagnifyingGlassCircleIcon` | `SearchCircleIcon` | |
| `Bars3Icon`, `Bars2Icon`, `Bars4Icon` | `MenuIcon` | `Menu01Icon`…`Menu11Icon` are alternatives |
| `Bars3BottomLeftIcon`, `Bars3CenterLeftIcon` | `TextAlignLeftIcon` | |
| `Bars3BottomRightIcon` | `TextAlignRightIcon` | |
| `XMarkIcon` | `XIcon` | `Cancel01Icon` is the same idea in Hugeicons' own naming |
| `XCircleIcon` | `CircleXIcon` | |
| `CheckCircleIcon` | `CircleCheckIcon` | |
| `CheckBadgeIcon` | `BadgeCheckIcon` | |
| `PlusCircleIcon` / `MinusCircleIcon` | `CirclePlusIcon` / `CircleMinusIcon` | |
| `InformationCircleIcon` | `InformationCircleIcon` | verbatim |
| `ExclamationCircleIcon` | `AlertCircleIcon` | |
| `ExclamationTriangleIcon` | `TriangleAlertIcon` | |
| `QuestionMarkCircleIcon` | `HelpCircleIcon` | |
| `NoSymbolIcon` | `BanIcon` | |
| `ChevronUpDownIcon` | `UnfoldMoreIcon` | |
| `ChevronDoubleLeftIcon` / `RightIcon` | `ChevronsLeftIcon` / `ChevronsRightIcon` | |
| `ArrowLeftIcon` / `RightIcon` / `UpIcon` / `DownIcon` | `ArrowLeft01Icon` / `ArrowRight01Icon` / `ArrowUp01Icon` / `ArrowDown01Icon` | |
| `ArrowLongLeftIcon` / `ArrowLongRightIcon` | `MoveLeftIcon` / `MoveRightIcon` | |
| `ArrowSmallLeftIcon` / `RightIcon` | `ArrowLeft01Icon` / `ArrowRight01Icon` | |
| `ArrowsUpDownIcon` | `ArrowUpDownIcon` | |
| `ArrowsRightLeftIcon` | `ArrowLeftRightIcon` | |
| `ArrowUturnLeftIcon` / `RightIcon` | `UndoIcon` / `RedoIcon` | |
| `ArrowPathIcon`, `ArrowPathRoundedSquareIcon` | `RefreshCwIcon` | |
| `ArrowTopRightOnSquareIcon` | `ExternalLinkIcon` | |
| `ArrowTrendingUpIcon` / `DownIcon` | `TrendingUpIcon` / `TrendingDownIcon` | |
| `ArrowDownTrayIcon` / `ArrowUpTrayIcon` | `Download01Icon` / `Upload01Icon` | |
| `ArrowsPointingOutIcon` / `InIcon` | `Maximize01Icon` / `Minimize01Icon` | |
| `ArrowRightOnRectangleIcon`, `ArrowRightStartOnRectangleIcon`, `ArrowLeftStartOnRectangleIcon` | `LogOutIcon` | sign-out |
| `ArrowLeftOnRectangleIcon`, `ArrowLeftEndOnRectangleIcon`, `ArrowRightEndOnRectangleIcon` | `LogInIcon` | sign-in |
| `HomeModernIcon` | `Home01Icon` | |
| `Cog6ToothIcon` | `Settings01Icon` | |
| `Cog8ToothIcon` | `CogIcon` | |
| `AdjustmentsHorizontalIcon` / `VerticalIcon` | `SlidersHorizontalIcon` / `SlidersVerticalIcon` | |
| `EllipsisHorizontalIcon` | `EllipsisIcon` | |
| `EllipsisHorizontalCircleIcon` | `CircleEllipsisIcon` | |
| `BellAlertIcon` | `BellRingIcon` | |
| `BellSlashIcon` | `BellOffIcon` | |
| `EnvelopeIcon` / `EnvelopeOpenIcon` | `Mail01Icon` / `MailOpenIcon` | |
| `PencilSquareIcon` | `SquarePenIcon` | |
| `DocumentDuplicateIcon` | `CopyIcon` | |
| `ClipboardDocumentIcon` | `ClipboardIcon` | |
| `ClipboardDocumentCheckIcon` | `ClipboardCheckIcon` | |
| `ClipboardDocumentListIcon` | `ClipboardListIcon` | |
| `LinkSlashIcon` | `Unlink01Icon` | |
| `EyeSlashIcon` | `EyeOffIcon` | |
| `LockClosedIcon` | `LockIcon` | |
| `BookmarkSlashIcon` | `BookmarkXIcon` | nearest |
| `BookmarkSquareIcon` | `Bookmark02Icon` | nearest |
| `ChatBubbleLeftIcon` | `MessageSquareIcon` | |
| `ChatBubbleLeftRightIcon` | `MessagesSquareIcon` | |
| `ChatBubbleOvalLeftIcon` | `MessageCircleIcon` | |
| `ChatBubbleOvalLeftEllipsisIcon` | `MessageCircleMoreIcon` | |
| `ChatBubbleBottomCenterTextIcon` | `MessageSquareTextIcon` | |
| `PaperAirplaneIcon` | `SendIcon` | |
| `PhoneArrowUpRightIcon` | `PhoneOutgoingIcon` | |
| `PhoneXMarkIcon` | `CallDisabledIcon` | |
| `GlobeAltIcon` | `GlobeIcon` | |
| `GlobeAmericasIcon` | `Globe02Icon` | |
| `PhotoIcon` | `Image01Icon` | |
| `DocumentIcon` | `File01Icon` | |
| `DocumentTextIcon` | `FileTextIcon` | |
| `DocumentPlusIcon` / `MinusIcon` / `CheckIcon` | `FilePlusIcon` / `FileMinusIcon` / `FileCheckIcon` | |
| `DocumentArrowDownIcon` / `ArrowUpIcon` | `FileDownIcon` / `FileUpIcon` | |
| `DocumentMagnifyingGlassIcon` | `FileSearchIcon` | |
| `DocumentChartBarIcon` | `FileChartColumnIcon` | |
| `FolderArrowDownIcon` | `FolderDownIcon` | |
| `BoltSlashIcon` | `ZapOffIcon` | |
| `SpeakerWaveIcon` / `SpeakerXMarkIcon` | `VolumeHighIcon` / `VolumeXIcon` | |
| `VideoCameraIcon` / `VideoCameraSlashIcon` | `Video01Icon` / `VideoOffIcon` | |
| `MicrophoneIcon` | `Mic01Icon` | |
| `CurrencyDollarIcon` | `CircleDollarSignIcon` | |
| `CurrencyEuroIcon` | `EuroCircleIcon` | |
| `BanknotesIcon` | `BanknoteIcon` | |
| `GiftTopIcon` | `GiftIcon` | |
| `CubeTransparentIcon` | `CubeIcon` | |
| `ReceiptPercentIcon` | `CouponPercentIcon` | |
| `ReceiptRefundIcon` | `ReceiptIcon` | |
| `ChartBarIcon`, `ChartBarSquareIcon` | `ChartColumnIcon` | |
| `ChartPieIcon` | `PieChartIcon` | |
| `PresentationChartLineIcon` / `BarIcon` | `PresentationLineChart01Icon` / `PresentationBarChart01Icon` | |
| `Squares2X2Icon` | `LayoutGridIcon` | |
| `SquaresPlusIcon` | `Grid2X2PlusIcon` | |
| `Square3Stack3DIcon` | `Layers01Icon` | |
| `Square2StackIcon`, `RectangleStackIcon` | `SquareStackIcon` | |
| `CircleStackIcon` | `DatabaseIcon` | heroicons uses it for "database" |
| `ListBulletIcon` | `ListIcon` | |
| `TableCellsIcon` | `TableIcon` | |
| `ViewColumnsIcon` | `LayoutThreeColumnIcon` | |
| `QueueListIcon` | `LayoutListIcon` | |
| `RectangleGroupIcon` | `LayoutDashboardIcon` | |
| `WindowIcon` | `AppWindowIcon` | |
| `CodeBracketIcon` | `CodeIcon` | |
| `CodeBracketSquareIcon` | `CodeSquareIcon` | |
| `CloudArrowUpIcon` / `DownIcon` | `CloudUploadIcon` / `CloudDownloadIcon` | |
| `SignalSlashIcon` | `SignalIcon` | no "off" variant in the free set |
| `CpuChipIcon` | `CpuIcon` | |
| `DevicePhoneMobileIcon` | `SmartphoneIcon` | |
| `DeviceTabletIcon` | `Tablet01Icon` | |
| `ComputerDesktopIcon` | `MonitorIcon` | |
| `MusicalNoteIcon` | `MusicNote01Icon` | |
| `AcademicCapIcon` | `GraduationCapIcon` | |
| `ShieldExclamationIcon` | `ShieldAlertIcon` | |
| `BuildingOfficeIcon` / `BuildingOffice2Icon` | `Building01Icon` / `Building02Icon` | |
| `BuildingStorefrontIcon` | `Store01Icon` | |
| `BuildingLibraryIcon` | `LandmarkIcon` | |
| `HandThumbUpIcon` / `DownIcon` | `ThumbsUpIcon` / `ThumbsDownIcon` | |
| `HandRaisedIcon` | `HandIcon` | |
| `FaceSmileIcon` / `FaceFrownIcon` | `SmileIcon` / `FrownIcon` | |
| `LightBulbIcon` | `LightbulbIcon` | |
| `RocketLaunchIcon` | `RocketIcon` | |
| `BugAntIcon` | `Bug01Icon` | |
| `PuzzlePieceIcon` | `PuzzleIcon` | |
| `InboxArrowDownIcon` | `InboxDownloadIcon` | |
| `InboxStackIcon` | `InboxIcon` | |
| `ArchiveBoxIcon` | `ArchiveIcon` | |
| `ArchiveBoxArrowDownIcon` | `ArchiveArrowDownIcon` | |
| `ArchiveBoxXMarkIcon` | `ArchiveXIcon` | |
| `PaperClipIcon` | `PaperclipIcon` | |
| `WrenchScrewdriverIcon` | `ToolsIcon` | |
| `LanguageIcon` | `LanguagesIcon` | |
| `AtSymbolIcon` | `AtSignIcon` | |
| `CursorArrowRaysIcon`, `CursorArrowRippleIcon` | `MousePointerClickIcon` | |
| `EyeDropperIcon` | `PipetteIcon` | |
| `ViewfinderCircleIcon` | `FocusIcon` | |
| `FingerPrintIcon` | `FingerPrintIcon` | verbatim |
| `FunnelIcon` | `FunnelIcon` | verbatim — `FilterIcon` also exists |
