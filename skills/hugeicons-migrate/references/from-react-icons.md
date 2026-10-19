# Migrating from react-icons

`react-icons` bundles many icon sets behind one prop model. The sub-path tells you which set,
and the prefix on every export repeats it (`FaSearch`, `MdDelete`, `IoClose`).

## 1. Detect

```bash
grep -rnE "from ['\"]react-icons(/[a-z0-9]+)?['\"]" src
grep -rn "IconContext" src
```

| Sub-path | Set | Prefix | Resolve names with |
|---|---|---|---|
| `react-icons/fa`, `/fa6` | Font Awesome 5 / 6 | `Fa` | table below |
| `react-icons/md` | Material Design | `Md` | table below |
| `react-icons/io5`, `/io` | Ionicons 5 / 4 | `Io` | table below |
| `react-icons/lu` | **Lucide** | `Lu` | strip `Lu`, then [from-lucide.md](from-lucide.md) |
| `react-icons/fi` | Feather | `Fi` | strip `Fi`, then [from-lucide.md](from-lucide.md) — Lucide is Feather's successor, names match |
| `react-icons/hi2`, `/hi` | Heroicons 2 / 1 | `Hi` | strip `Hi`, append `Icon`, then [from-heroicons.md](from-heroicons.md) |
| `react-icons/bs`, `/bi`, `/ai`, `/ri`, `/tb`, `/gi`, … | Bootstrap, BoxIcons, Ant, Remix, Tabler, Game… | `Bs`, `Bi`, `Ai`, `Ri`, `Tb`, `Gi` | strip the prefix, then the generic order in §4 |
| `react-icons/si` | Simple Icons (brands) | `Si` | strip `Si`; brands are usually verbatim: `SiGithub` → `GithubIcon`, `SiSpotify` → `SpotifyIcon` |

## 2. Swap the packages

```bash
npm uninstall react-icons
npm install @hugeicons/react @hugeicons/core-free-icons
```

## 3. The rewrite

```tsx
// before
import { FaSearch, FaTrash } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

<FaSearch size={20} />
<FaTrash color="#dc2626" title="Delete" />
<MdClose className="close" onClick={onClose} />

// after
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, TrashIcon, XIcon } from '@hugeicons/core-free-icons'

<HugeiconsIcon icon={Search01Icon} size={20} />
<HugeiconsIcon icon={TrashIcon} color="#dc2626" aria-label="Delete" />
<HugeiconsIcon icon={XIcon} className="close" onClick={onClose} />
```

Props:

| react-icons | Hugeicons | Note |
|---|---|---|
| `size` — default **`"1em"`** | `size` — default **24** | See below; this is the one that bites |
| `color` (currentColor) | `color` (currentColor) | same |
| `className`, `style`, `onClick`, `aria-*`, `ref` | unchanged | spread onto `<svg>`, `ref` forwarded |
| `title="…"` | `aria-label="…"` | react-icons renders a `<title>` child; `HugeiconsIcon` doesn't. Use `aria-label` (and drop any `aria-hidden`), or a real tooltip |
| `attr={{…}}` | spread the object as props | |
| (none) | `strokeWidth` | FA/MD/Io are filled glyphs; Hugeicons free is 1.5px stroke. The look changes — say so once, don't compensate with `strokeWidth` |

**The `1em` default.** A react-icons icon with no `size` scales with the surrounding font-size;
a Hugeicons icon with no `size` is 24px. So for each icon without an explicit `size`:
- inside text/buttons that rely on `font-size` → `size="1em"` (Hugeicons `size` accepts strings);
- everywhere else → leave it, 24px is the intended default.
Don't blanket-add `size="1em"`.

`IconContext.Provider` (`{ color, size, className, style, attr }`) has no equivalent. Replace
it with a wrapper component that pins the shared props:

```tsx
// before
<IconContext.Provider value={{ size: '1.25em', className: 'icon' }}>…</IconContext.Provider>

// after
const Icon = (p: HugeiconsIconProps) => <HugeiconsIcon size="1.25em" className="icon" {...p} />
```

Types: `IconType` from `react-icons` → `IconSvgElement` from `@hugeicons/react`.

```tsx
// before
import type { IconType } from 'react-icons'
const items: { icon: IconType }[] = […]
<item.icon />

// after
import type { IconSvgElement } from '@hugeicons/react'
const items: { icon: IconSvgElement }[] = […]
<HugeiconsIcon icon={item.icon} />
```

## 4. Resolving names

1. Strip the prefix (`FaTrashAlt` → `TrashAlt`) and drop FA's `Alt`, `Reg`, `Outline` suffixes
   and MD's `Outline`/`Rounded` prefixes — they're style variants, not different icons
   (`FaRegHeart`, `FaHeart` → one icon; `MdOutlineDelete`, `MdDelete` → one icon).
2. Table below.
3. Exact `<Name>Icon`: `Check`, `Plus`, `Minus`, `User`, `Users`, `Bell`, `Heart`, `Star`,
   `Trash`, `Copy`, `Link`, `Eye`, `Lock`, `Cloud`, `Gift`, `Truck`, `Compass`, `Fire`, `Wind`,
   `Umbrella`, `Snowflake`, `Palette`, `Bold`, `Italic`, `Underline`, `Hashtag`, `Percent`,
   `Calculator`, `Hourglass`, `Inbox`, `Archive`, `Paperclip`, `Rocket`, `Lightbulb`, `Newspaper`,
   `Hammer`, `Tools`, `Github`, `Twitter`, `Instagram`, `Youtube`, `Apple`, `Whatsapp`, `Discord`,
   `Slack`, `Spotify`, `Tiktok`, `Telegram`, `Reddit`, `Pinterest`, `Amazon`, `Microsoft`,
   `Paypal`, `Stripe` … exist verbatim.
4. Numbered `<Name>01Icon`: `Search`, `Home`, `Settings`, `Calendar`, `Clock`, `Edit`, `Share`,
   `Bookmark`, `Comment`, `Image`, `File`, `Folder`, `Sun`, `Camera`, `Video`, `Mic`,
   `ShoppingCart`, `ShoppingBag`, `Tag`, `Wifi`, `Tablet`, `Film`, `Book`, `Award`, `Medal`,
   `Flag`, `Shield`, `Key`, `Briefcase`, `Coffee`, `Leaf`, `Ticket`, `Wallet`, `Wrench`, `Bug`,
   `Login`, `Logout`, `Time`, `Location`, `Facebook`, `Linkedin`, `Notification`.
5. grep the catalog by concept; if nothing convincing, list as unmapped and ask.

### Name map — Font Awesome (`Fa`)

| react-icons | Hugeicons | |
|---|---|---|
| `FaBars` | `MenuIcon` | |
| `FaTimes` | `XIcon` | |
| `FaTimesCircle` | `CircleXIcon` | |
| `FaCheckCircle` | `CircleCheckIcon` | |
| `FaAngleDown` / `Up` / `Left` / `Right`, `FaChevron…` | `ChevronDownIcon` / `ChevronUpIcon` / `ChevronLeftIcon` / `ChevronRightIcon` | |
| `FaArrowLeft` / `Right` / `Up` / `Down` | `ArrowLeft01Icon` / `ArrowRight01Icon` / `ArrowUp01Icon` / `ArrowDown01Icon` | |
| `FaCog` | `CogIcon` | `Settings01Icon` is the Hugeicons-native gear |
| `FaCogs` | `Settings02Icon` | nearest |
| `FaUserCircle` | `UserCircleIcon` | |
| `FaUserFriends`, `FaUsers` | `UsersIcon` | |
| `FaBellSlash` | `BellOffIcon` | |
| `FaEnvelope` / `FaEnvelopeOpen` | `Mail01Icon` / `MailOpenIcon` | |
| `FaEdit`, `FaPencilAlt` | `SquarePenIcon`, `PencilIcon` | |
| `FaPen` | `Pen01Icon` | |
| `FaEyeSlash` | `EyeOffIcon` | |
| `FaUnlock`, `FaLockOpen` | `LockOpenIcon` | |
| `FaSignInAlt` / `FaSignOutAlt` | `LogInIcon` / `LogOutIcon` | |
| `FaComments` | `MessagesSquareIcon` | |
| `FaCommentDots` | `MessageSquareMoreIcon` | |
| `FaPaperPlane` | `SendIcon` | |
| `FaMapMarkerAlt` | `MapPinIcon` | |
| `FaExternalLinkAlt` | `ExternalLinkIcon` | |
| `FaFilePdf` | `Pdf01Icon` | |
| `FaFilter` | `FilterIcon` | |
| `FaSlidersH` | `SlidersHorizontalIcon` | |
| `FaEllipsisH` / `FaEllipsisV` | `EllipsisIcon` / `EllipsisVerticalIcon` | |
| `FaSync`, `FaSyncAlt` | `RefreshCwIcon` | |
| `FaSpinner` | `LoaderIcon` | |
| `FaCircleNotch` | `LoaderCircleIcon` | |
| `FaInfoCircle` | `InformationCircleIcon` | |
| `FaExclamationCircle` | `AlertCircleIcon` | |
| `FaExclamationTriangle` | `TriangleAlertIcon` | |
| `FaQuestionCircle` | `HelpCircleIcon` | |
| `FaBan` | `BanIcon` | |
| `FaVolumeUp` / `FaVolumeDown` / `FaVolumeMute` | `VolumeHighIcon` / `VolumeLowIcon` / `VolumeXIcon` | |
| `FaMicrophone` / `FaMicrophoneSlash` | `Mic01Icon` / `MicOff01Icon` | |
| `FaDollarSign` | `DollarSignIcon` | |
| `FaMoneyBill` | `BanknoteIcon` | |
| `FaBox` / `FaBoxOpen` | `BoxIcon` / `PackageOpenIcon` | |
| `FaChartBar` | `ChartColumnIcon` | |
| `FaChartPie` | `PieChartIcon` | |
| `FaChartLine` / `FaChartArea` | `ChartLineIcon` / `ChartAreaIcon` | |
| `FaLayerGroup` | `Layers01Icon` | |
| `FaTh` | `Grid3X3Icon` | |
| `FaThLarge` | `LayoutGridIcon` | |
| `FaThList` | `LayoutListIcon` | |
| `FaList`, `FaListUl` | `ListIcon` | |
| `FaListOl` | `ListOrderedIcon` | |
| `FaColumns` | `LayoutTwoColumnIcon` | |
| `FaExpand` / `FaCompress` | `Maximize01Icon` / `Minimize01Icon` | |
| `FaPrint` | `PrinterIcon` | |
| `FaMobileAlt` | `SmartphoneIcon` | |
| `FaDesktop` | `MonitorIcon` | |
| `FaFingerprint` | `FingerPrintIcon` | |
| `FaTint` | `DropletIcon` | |
| `FaMagic` | `WandSparklesIcon` | |
| `FaAlignLeft` / `Center` / `Right` / `Justify` | `TextAlignLeftIcon` / `TextAlignCenterIcon` / `TextAlignRightIcon` / `TextAlignJustifyIcon` | |
| `FaQuoteLeft` | `QuoteIcon` | |
| `FaCut` | `ScissorsIcon` | |
| `FaSearchPlus` / `FaSearchMinus` | `ZoomInIcon` / `ZoomOutIcon` | |
| `FaBullhorn` | `Megaphone01Icon` | |
| `FaThumbtack` | `PinIcon` | |
| `FaRandom` | `ShuffleIcon` | |
| `FaStepBackward` / `FaStepForward` | `SkipBackIcon` / `StepForwardIcon` | |
| `FaBackward` / `FaForward` | `Backward01Icon` / `Forward01Icon` | |
| `FaShieldAlt` | `Shield01Icon` | |
| `FaFacebook` / `FaFacebookF` | `Facebook01Icon` / `Facebook02Icon` | |
| `FaXTwitter` | `NewTwitterIcon` | |
| `FaLinkedin` / `FaLinkedinIn` | `Linkedin01Icon` / `Linkedin02Icon` | |
| `FaRobot` | `Robot01Icon` | |
| `FaToggleOn` / `FaToggleOff` | `ToggleOnIcon` / `ToggleOffIcon` | |

### Name map — Material Design (`Md`)

| react-icons | Hugeicons | |
|---|---|---|
| `MdClose` | `XIcon` | |
| `MdMenu` | `MenuIcon` | |
| `MdSearch` | `Search01Icon` | |
| `MdDelete` | `Delete01Icon` | `TrashIcon` for the lucide-style bin |
| `MdEdit` | `Edit01Icon` | |
| `MdAdd` / `MdRemove` | `Add01Icon` / `Remove01Icon` | |
| `MdPerson` | `UserIcon` | |
| `MdPeople` | `UsersIcon` | |
| `MdEmail` | `Mail01Icon` | |
| `MdNotifications`, `MdNotificationsNone` | `Notification01Icon` | |
| `MdArrowBack` / `MdArrowForward` | `ArrowLeft01Icon` / `ArrowRight01Icon` | |
| `MdArrowUpward` / `MdArrowDownward` | `ArrowUp01Icon` / `ArrowDown01Icon` | |
| `MdKeyboardArrowDown` / `Up` / `Left` / `Right` | `ChevronDownIcon` / `ChevronUpIcon` / `ChevronLeftIcon` / `ChevronRightIcon` | |
| `MdExpandMore` / `MdExpandLess` | `ChevronDownIcon` / `ChevronUpIcon` | |
| `MdMoreVert` / `MdMoreHoriz` | `EllipsisVerticalIcon` / `EllipsisIcon` | |
| `MdVisibility` / `MdVisibilityOff` | `ViewIcon` / `ViewOffIcon` | `EyeIcon` / `EyeOffIcon` also exist |
| `MdLock` / `MdLockOpen` | `LockIcon` / `LockOpenIcon` | |
| `MdLogin` / `MdLogout` | `Login01Icon` / `Logout01Icon` | |
| `MdDashboard` | `LayoutDashboardIcon` | |
| `MdShoppingCart` | `ShoppingCart01Icon` | |
| `MdFavorite`, `MdFavoriteBorder` | `HeartIcon` | |
| `MdStar`, `MdStarBorder` | `StarIcon` | |
| `MdInfo`, `MdInfoOutline` | `InformationCircleIcon` | |
| `MdWarning` | `TriangleAlertIcon` | |
| `MdError`, `MdErrorOutline` | `AlertCircleIcon` | |
| `MdCheckCircle` | `CircleCheckIcon` | |
| `MdCancel` | `CancelCircleIcon` | |
| `MdHelp`, `MdHelpOutline` | `HelpCircleIcon` | |
| `MdRefresh` | `RefreshIcon` | |
| `MdDownload` / `MdUpload` | `Download01Icon` / `Upload01Icon` | |
| `MdShare` | `Share01Icon` | |
| `MdContentCopy` | `CopyIcon` | |
| `MdFilterList` | `ListFilterIcon` | |
| `MdSort` | `ArrowDownWideNarrowIcon` | |
| `MdDarkMode` / `MdLightMode` | `MoonIcon` / `Sun01Icon` | |
| `MdCalendarToday` | `Calendar01Icon` | |
| `MdAccessTime` | `Clock01Icon` | |
| `MdLocationOn` | `MapPinIcon` | |
| `MdPhone` | `PhoneIcon` | |
| `MdChat` | `ChatIcon` | |
| `MdSend` | `SendIcon` | |
| `MdImage` | `Image01Icon` | |
| `MdInsertDriveFile` | `File01Icon` | |
| `MdFolder` | `Folder01Icon` | |
| `MdPlayArrow` / `MdPause` / `MdStop` | `PlayIcon` / `PauseIcon` / `StopIcon` | |
| `MdVolumeUp` / `MdVolumeOff` | `VolumeHighIcon` / `VolumeOffIcon` | |
| `MdCameraAlt` | `Camera01Icon` | |
| `MdVideocam` | `Video01Icon` | |
| `MdMic` / `MdMicOff` | `Mic01Icon` / `MicOff01Icon` | |
| `MdAttachFile` | `Attachment01Icon` | |
| `MdLink` | `LinkIcon` | |
| `MdOpenInNew` | `ExternalLinkIcon` | |
| `MdCloudUpload` / `MdCloudDownload` | `CloudUploadIcon` / `CloudDownloadIcon` | |
| `MdSave` | `SaveIcon` | |
| `MdPrint` | `PrinterIcon` | |
| `MdCode` | `CodeIcon` | |
| `MdStorage` | `DatabaseIcon` | |
| `MdSmartphone` / `MdComputer` / `MdLaptop` | `SmartphoneIcon` / `ComputerIcon` / `LaptopIcon` | |
| `MdHeadset` | `HeadsetIcon` | |
| `MdMusicNote` | `MusicNote01Icon` | |
| `MdMovie` | `Film01Icon` | |
| `MdBook` | `Book01Icon` | |
| `MdSettings` | `Settings01Icon` | |
| `MdHome` | `Home01Icon` | |

### Name map — Ionicons (`Io`)

| react-icons | Hugeicons | |
|---|---|---|
| `IoClose` | `XIcon` | |
| `IoCloseCircle` | `CircleXIcon` | |
| `IoCheckmark` | `CheckIcon` | |
| `IoCheckmarkCircle` | `CircleCheckIcon` | |
| `IoMenu` | `MenuIcon` | |
| `IoSearch` | `Search01Icon` | |
| `IoPerson`, `IoPersonOutline` | `UserIcon` | |
| `IoNotifications`, `IoNotificationsOutline` | `Notification01Icon` | |
| `IoArrowBack` / `IoArrowForward` | `ArrowLeft01Icon` / `ArrowRight01Icon` | |
| `IoChevronBack` / `IoChevronForward` | `ChevronLeftIcon` / `ChevronRightIcon` | |
| `IoChevronDown` / `IoChevronUp` | `ChevronDownIcon` / `ChevronUpIcon` | |
| `IoEllipsisHorizontal` / `IoEllipsisVertical` | `EllipsisIcon` / `EllipsisVerticalIcon` | |
| `IoLockClosed` / `IoLockOpen` | `LockIcon` / `LockOpenIcon` | |
| `IoLogIn` / `IoLogOut` | `LogInIcon` / `LogOutIcon` | |
| `IoCart`, `IoCartOutline` | `ShoppingCart01Icon` | |
| `IoHeart`, `IoHeartOutline` | `HeartIcon` | |
| `IoStar`, `IoStarOutline` | `StarIcon` | |
| `IoInformationCircle` | `InformationCircleIcon` | |
| `IoWarning` | `TriangleAlertIcon` | |
| `IoAlertCircle` | `AlertCircleIcon` | |
| `IoHelpCircle` | `HelpCircleIcon` | |
| `IoShareSocial` | `Share08Icon` | |
| `IoSunny` / `IoMoon` | `Sun01Icon` / `MoonIcon` | |
| `IoCreate` | `SquarePenIcon` | |
| `IoPencil` | `PencilIcon` | |
| `IoTrash`, `IoTrashOutline` | `TrashIcon` | |
| `IoChatbubble`, `IoChatbubbles` | `BubbleChatIcon` | |
| `IoDocument` / `IoDocumentText` | `File01Icon` / `FileTextIcon` | |
| `IoVideocam` | `Video01Icon` | |
| `IoApps` | `LayoutGridIcon` | |
| `IoGrid` | `GridIcon` | |
| `IoCard` | `CreditCardIcon` | |
| `IoPricetag` | `Tag01Icon` | |
| `IoNavigate` | `NavigationIcon` | |
| `IoTime` | `Time01Icon` | |
| `IoLocation` | `Location01Icon` | |
| `IoCall` | `CallIcon` | |
| `IoBulb` | `BulbIcon` | |
| `IoFlash` | `FlashIcon` | |
