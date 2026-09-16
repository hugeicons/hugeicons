#!/usr/bin/env node
// Produces *candidate* Hugeicons names for the most common icons of other libraries, as a
// review queue for the name maps in skills/hugeicons-migrate/references/from-*.md.
//
// For each seed name it queries the Hugeicons search API (same endpoint the MCP server uses)
// and keeps only results that exist in the FREE catalog (skills/hugeicons/references/icon-list.md)
// — the API also indexes Pro icons, which a free user cannot import.
//
// Usage:
//   node skills/scripts/build-foreign-map.mjs                 # all libraries
//   node skills/scripts/build-foreign-map.mjs lucide           # one library
//   node skills/scripts/build-foreign-map.mjs --out /tmp/review
//
// Output: <out>/<lib>.csv with columns  source, direct, candidates, tags
//   direct     = a catalog name derived from the source name itself (best guess, may be empty)
//   candidates = up to 5 free-catalog names from the search API, best first
// A human picks one per row; nothing here is final. No dependencies — Node >= 18.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = resolve(ROOT, 'skills/hugeicons/references/icon-list.md');
const SEARCH = 'https://search.hugeicons.com/search?q=';
const CONCURRENCY = 4;

// prettier-ignore
const SEEDS = {
  lucide: `Search Menu X Check Plus Minus ChevronDown ChevronUp ChevronLeft ChevronRight ChevronsUpDown ChevronsLeft ChevronsRight
    ArrowLeft ArrowRight ArrowUp ArrowDown ArrowUpRight ArrowDownLeft ArrowUpDown ArrowLeftRight Home Settings Settings2 User Users UserPlus UserMinus UserCheck UserRound CircleUser
    Bell BellOff Mail Calendar CalendarDays Clock Trash Trash2 Edit Edit2 Edit3 Pencil PencilLine Copy Clipboard ClipboardCheck Download Upload Share Share2
    ExternalLink Link Link2 Unlink Eye EyeOff Lock LockOpen Unlock LogIn LogOut Heart Star Bookmark MessageSquare MessageCircle MessagesSquare Send Phone PhoneCall MapPin Map Globe
    Image Images File FileText FilePlus FileMinus FileCheck Files Folder FolderOpen FolderPlus Filter SlidersHorizontal Sliders MoreHorizontal MoreVertical Ellipsis EllipsisVertical
    RefreshCw RefreshCcw RotateCw RotateCcw Loader Loader2 LoaderCircle Info AlertCircle CircleAlert AlertTriangle TriangleAlert CheckCircle CircleCheck CheckCircle2 XCircle CircleX HelpCircle CircleHelp
    Sun Moon SunMoon Zap Play Pause Square Circle Dot Volume Volume1 Volume2 VolumeX Camera Video VideoOff Mic MicOff ShoppingCart ShoppingBag CreditCard DollarSign Banknote Tag Tags Gift Package Truck
    BarChart BarChart2 BarChart3 PieChart LineChart TrendingUp TrendingDown Activity Layers Grid Grid2x2 Grid3x3 List ListOrdered ListChecks LayoutGrid LayoutDashboard LayoutList LayoutTemplate Table Columns Columns2 Columns3 Rows
    Sidebar PanelLeft PanelRight PanelLeftClose PanelLeftOpen Maximize Maximize2 Minimize Minimize2 Expand Shrink Move Save Printer Terminal Code Code2 CodeXml GitBranch GitCommit GitMerge GitPullRequest Github
    Database Server Cloud CloudUpload CloudDownload CloudOff Wifi WifiOff Bluetooth Battery BatteryCharging Cpu Smartphone Monitor Laptop Tablet Keyboard Mouse Headphones Music Film Book BookOpen
    Award Trophy Flag Shield ShieldCheck ShieldAlert ShieldOff Key KeyRound Fingerprint Building Building2 Briefcase Compass Navigation Anchor Coffee Pizza Utensils Leaf Flame Droplet Droplets Wind Umbrella Snowflake CloudRain
    ThumbsUp ThumbsDown Smile Frown Meh Sparkles Sparkle Wand Wand2 Paintbrush Palette Type Bold Italic Underline Strikethrough AlignLeft AlignCenter AlignRight AlignJustify Heading Heading1 Heading2 Quote
    Hash AtSign Percent Calculator Timer Hourglass Inbox Archive Paperclip Scissors Undo Undo2 Redo Redo2 ZoomIn ZoomOut Crop Rocket Bug Puzzle Command Languages LifeBuoy Lightbulb Megaphone Newspaper Pin PinOff
    Power PowerOff QrCode Radio Repeat Shuffle SkipBack SkipForward Rewind FastForward Ticket Wallet Wrench Hammer Box Boxes Cog ToggleLeft ToggleRight Bot BrainCircuit Brain
    Plug Cable Gauge Target Crosshair Focus Scan ScanLine Barcode Receipt Percent BadgeCheck BadgeAlert Badge Medal Crown Gem Rss Podcast Voicemail Contact Contact2 BookUser IdCard
    Home Hotel Store Landmark School GraduationCap Stethoscope HeartPulse Pill Syringe Dumbbell Bike Car Bus Train Plane Ship Rocket Fuel ParkingCircle TrafficCone Construction
    Eraser Highlighter PenTool Ruler Shapes Triangle Hexagon Pentagon Octagon Diamond Spline Blend Layers2 Layers3 Component Workflow Network Share2 Split Merge Combine`,

  heroicons: `MagnifyingGlassIcon Bars3Icon Bars2Icon Bars4Icon Bars3BottomLeftIcon Bars3CenterLeftIcon XMarkIcon CheckIcon PlusIcon MinusIcon ChevronDownIcon ChevronUpIcon ChevronLeftIcon ChevronRightIcon ChevronUpDownIcon ChevronDoubleLeftIcon ChevronDoubleRightIcon
    ArrowLeftIcon ArrowRightIcon ArrowUpIcon ArrowDownIcon ArrowUpRightIcon ArrowDownLeftIcon ArrowsUpDownIcon ArrowsRightLeftIcon ArrowLongRightIcon ArrowLongLeftIcon ArrowTopRightOnSquareIcon ArrowUturnLeftIcon ArrowUturnRightIcon ArrowPathIcon ArrowPathRoundedSquareIcon
    HomeIcon HomeModernIcon Cog6ToothIcon Cog8ToothIcon CogIcon UserIcon UsersIcon UserGroupIcon UserCircleIcon UserPlusIcon UserMinusIcon IdentificationIcon BellIcon BellAlertIcon BellSlashIcon EnvelopeIcon EnvelopeOpenIcon
    CalendarIcon CalendarDaysIcon ClockIcon TrashIcon PencilIcon PencilSquareIcon DocumentDuplicateIcon ClipboardIcon ClipboardDocumentIcon ClipboardDocumentCheckIcon ClipboardDocumentListIcon ArrowDownTrayIcon ArrowUpTrayIcon ShareIcon LinkIcon LinkSlashIcon
    EyeIcon EyeSlashIcon LockClosedIcon LockOpenIcon ArrowRightOnRectangleIcon ArrowLeftOnRectangleIcon ArrowRightStartOnRectangleIcon ArrowLeftEndOnRectangleIcon ArrowRightEndOnRectangleIcon ArrowLeftStartOnRectangleIcon
    HeartIcon StarIcon BookmarkIcon BookmarkSlashIcon BookmarkSquareIcon ChatBubbleLeftIcon ChatBubbleLeftRightIcon ChatBubbleOvalLeftIcon ChatBubbleOvalLeftEllipsisIcon ChatBubbleBottomCenterTextIcon PaperAirplaneIcon PhoneIcon PhoneArrowUpRightIcon PhoneXMarkIcon MapPinIcon MapIcon GlobeAltIcon GlobeAmericasIcon
    PhotoIcon DocumentIcon DocumentTextIcon DocumentPlusIcon DocumentMinusIcon DocumentCheckIcon DocumentArrowDownIcon DocumentArrowUpIcon DocumentMagnifyingGlassIcon DocumentChartBarIcon FolderIcon FolderOpenIcon FolderPlusIcon FolderMinusIcon FolderArrowDownIcon
    FunnelIcon AdjustmentsHorizontalIcon AdjustmentsVerticalIcon EllipsisHorizontalIcon EllipsisVerticalIcon EllipsisHorizontalCircleIcon InformationCircleIcon ExclamationCircleIcon ExclamationTriangleIcon CheckCircleIcon CheckBadgeIcon XCircleIcon QuestionMarkCircleIcon MinusCircleIcon PlusCircleIcon NoSymbolIcon
    SunIcon MoonIcon BoltIcon BoltSlashIcon PlayIcon PauseIcon StopIcon PlayCircleIcon PauseCircleIcon StopCircleIcon ForwardIcon BackwardIcon SpeakerWaveIcon SpeakerXMarkIcon CameraIcon VideoCameraIcon VideoCameraSlashIcon MicrophoneIcon
    ShoppingCartIcon ShoppingBagIcon CreditCardIcon CurrencyDollarIcon CurrencyEuroIcon BanknotesIcon TagIcon GiftIcon GiftTopIcon CubeIcon CubeTransparentIcon TruckIcon ReceiptPercentIcon ReceiptRefundIcon
    ChartBarIcon ChartBarSquareIcon ChartPieIcon PresentationChartLineIcon PresentationChartBarIcon ArrowTrendingUpIcon ArrowTrendingDownIcon Squares2X2Icon SquaresPlusIcon Square3Stack3DIcon Square2StackIcon ListBulletIcon TableCellsIcon ViewColumnsIcon QueueListIcon RectangleStackIcon RectangleGroupIcon WindowIcon
    ArrowsPointingOutIcon ArrowsPointingInIcon PrinterIcon CommandLineIcon CodeBracketIcon CodeBracketSquareIcon CircleStackIcon ServerIcon ServerStackIcon CloudIcon CloudArrowUpIcon CloudArrowDownIcon WifiIcon SignalIcon SignalSlashIcon CpuChipIcon DevicePhoneMobileIcon DeviceTabletIcon ComputerDesktopIcon
    MusicalNoteIcon FilmIcon BookOpenIcon AcademicCapIcon TrophyIcon FlagIcon ShieldCheckIcon ShieldExclamationIcon KeyIcon FingerPrintIcon BuildingOfficeIcon BuildingOffice2Icon BuildingStorefrontIcon BuildingLibraryIcon BriefcaseIcon
    HandThumbUpIcon HandThumbDownIcon HandRaisedIcon FaceSmileIcon FaceFrownIcon SparklesIcon PaintBrushIcon SwatchIcon LightBulbIcon MegaphoneIcon NewspaperIcon PowerIcon QrCodeIcon MagnifyingGlassPlusIcon MagnifyingGlassMinusIcon MagnifyingGlassCircleIcon
    RocketLaunchIcon BugAntIcon PuzzlePieceIcon InboxIcon InboxArrowDownIcon InboxStackIcon ArchiveBoxIcon ArchiveBoxArrowDownIcon ArchiveBoxXMarkIcon PaperClipIcon ScissorsIcon TicketIcon WalletIcon WrenchIcon WrenchScrewdriverIcon LanguageIcon LifebuoyIcon HashtagIcon AtSymbolIcon CalculatorIcon BeakerIcon
    CursorArrowRaysIcon CursorArrowRippleIcon FireIcon BoltIcon EyeDropperIcon ScaleIcon VariableIcon ViewfinderCircleIcon Cog6ToothIcon Bars3BottomRightIcon ArrowsUpDownIcon ArrowSmallRightIcon ArrowSmallLeftIcon`,

  'react-icons': `FaSearch FaBars FaTimes FaCheck FaPlus FaMinus FaChevronDown FaChevronUp FaChevronLeft FaChevronRight FaAngleDown FaAngleUp FaAngleLeft FaAngleRight FaArrowLeft FaArrowRight FaArrowUp FaArrowDown
    FaHome FaCog FaCogs FaUser FaUsers FaUserCircle FaUserPlus FaUserMinus FaUserCheck FaUserFriends FaBell FaBellSlash FaEnvelope FaEnvelopeOpen FaCalendar FaCalendarAlt FaClock FaRegClock FaTrash FaTrashAlt FaEdit FaPen FaPencilAlt FaCopy FaClipboard FaClipboardList FaDownload FaUpload FaShare FaShareAlt FaExternalLinkAlt FaLink FaUnlink
    FaEye FaEyeSlash FaLock FaUnlock FaLockOpen FaSignInAlt FaSignOutAlt FaHeart FaRegHeart FaStar FaRegStar FaBookmark FaComment FaComments FaCommentDots FaPaperPlane FaPhone FaPhoneAlt FaMapMarkerAlt FaMap FaGlobe
    FaImage FaImages FaFile FaFileAlt FaFilePdf FaFileImage FaFolder FaFolderOpen FaFilter FaSlidersH FaEllipsisH FaEllipsisV FaSync FaSyncAlt FaRedo FaUndo FaSpinner FaCircleNotch FaInfoCircle FaExclamationCircle FaExclamationTriangle FaCheckCircle FaTimesCircle FaQuestionCircle FaBan
    FaSun FaMoon FaBolt FaPlay FaPause FaStop FaPlayCircle FaPauseCircle FaVolumeUp FaVolumeDown FaVolumeMute FaCamera FaVideo FaMicrophone FaMicrophoneSlash FaShoppingCart FaShoppingBag FaCreditCard FaDollarSign FaMoneyBill FaTag FaTags FaGift FaBox FaBoxOpen FaTruck
    FaChartBar FaChartPie FaChartLine FaChartArea FaLayerGroup FaTh FaThLarge FaThList FaList FaListUl FaListOl FaTable FaColumns FaExpand FaCompress FaSave FaPrint FaTerminal FaCode FaGithub FaDatabase FaServer FaCloud FaCloudUploadAlt FaCloudDownloadAlt FaWifi FaBatteryFull FaMobileAlt FaDesktop FaLaptop FaTabletAlt FaKeyboard FaMouse FaHeadphones FaMusic FaFilm FaBook FaBookOpen
    FaTrophy FaAward FaMedal FaFlag FaShieldAlt FaKey FaFingerprint FaBuilding FaBriefcase FaCompass FaCoffee FaLeaf FaFire FaTint FaWind FaUmbrella FaSnowflake FaThumbsUp FaThumbsDown FaSmile FaFrown FaMagic FaPaintBrush FaPalette
    FaBold FaItalic FaUnderline FaStrikethrough FaAlignLeft FaAlignCenter FaAlignRight FaAlignJustify FaHeading FaQuoteLeft FaHashtag FaAt FaPercent FaCalculator FaHourglass FaInbox FaArchive FaPaperclip FaCut FaSearchPlus FaSearchMinus FaRocket FaBug FaPuzzlePiece FaLightbulb FaBullhorn FaNewspaper FaThumbtack
    FaPowerOff FaQrcode FaRandom FaStepBackward FaStepForward FaBackward FaForward FaTicketAlt FaWallet FaWrench FaHammer FaTools FaToggleOn FaToggleOff FaRobot FaGoogle FaFacebook FaFacebookF FaTwitter FaXTwitter FaInstagram FaLinkedin FaLinkedinIn FaYoutube FaApple FaWhatsapp FaDiscord FaSlack FaSpotify FaTiktok FaTelegram FaReddit FaPinterest FaAmazon FaMicrosoft FaPaypal FaStripe
    MdDelete MdEdit MdClose MdMenu MdSearch MdHome MdSettings MdPerson MdPeople MdEmail MdNotifications MdNotificationsNone MdAdd MdRemove MdCheck MdArrowBack MdArrowForward MdArrowUpward MdArrowDownward MdKeyboardArrowDown MdKeyboardArrowUp MdKeyboardArrowLeft MdKeyboardArrowRight MdExpandMore MdExpandLess MdMoreVert MdMoreHoriz
    MdVisibility MdVisibilityOff MdLock MdLockOpen MdLogin MdLogout MdDashboard MdShoppingCart MdFavorite MdFavoriteBorder MdStar MdStarBorder MdInfo MdInfoOutline MdWarning MdError MdErrorOutline MdCheckCircle MdCancel MdHelp MdHelpOutline MdRefresh MdDownload MdUpload MdShare MdContentCopy MdFilterList MdSort MdDarkMode MdLightMode
    MdOutlineDelete MdOutlineEdit MdCalendarToday MdAccessTime MdLocationOn MdPhone MdChat MdSend MdImage MdInsertDriveFile MdFolder MdPlayArrow MdPause MdStop MdVolumeUp MdVolumeOff MdCameraAlt MdVideocam MdMic MdMicOff MdAttachFile MdLink MdOpenInNew MdCloudUpload MdCloudDownload MdSave MdPrint MdCode MdStorage MdWifi MdBluetooth MdBatteryFull MdSmartphone MdComputer MdLaptop MdHeadset MdMusicNote MdMovie MdBook
    IoClose IoMenu IoSearch IoHome IoSettings IoSettingsOutline IoPerson IoPersonOutline IoMail IoMailOutline IoNotifications IoNotificationsOutline IoAdd IoRemove IoCheckmark IoArrowBack IoArrowForward IoChevronDown IoChevronUp IoChevronBack IoChevronForward IoEllipsisVertical IoEllipsisHorizontal
    IoEye IoEyeOff IoLockClosed IoLockOpen IoLogIn IoLogOut IoCart IoCartOutline IoHeart IoHeartOutline IoStar IoStarOutline IoInformationCircle IoWarning IoAlertCircle IoCheckmarkCircle IoCloseCircle IoHelpCircle IoRefresh IoDownload IoCloudUpload IoShareSocial IoCopy IoFilter IoMoon IoSunny IoTrash IoTrashOutline IoPencil IoCreate
    IoCalendar IoTime IoLocation IoCall IoChatbubble IoChatbubbles IoSend IoImage IoDocument IoDocumentText IoFolder IoPlay IoPause IoCamera IoVideocam IoMic IoBookmark IoFlag IoGrid IoList IoApps IoLayers IoCube IoCard IoWallet IoPricetag IoGift IoRocket IoBulb IoBug IoFlash IoGlobe IoMap IoNavigate IoCompass`,
};

// Sub-library prefixes react-icons uses; stripped before searching.
const REACT_ICONS_PREFIX = /^(Fa|Md|Io|Hi|Lu|Bs|Bi|Fi|Ai|Ri|Tb|Gi|Si|Ti|Pi|Cg|Vsc|Go|Gr|Im|Sl|Rx|Wi|Fc|Di|Li)(Outline|Reg|Sharp|Round|Twotone)?/;

// Turn a source export into search words: "MagnifyingGlassPlusIcon" → "magnifying glass plus",
// "FaTrashAlt" → "trash", "ChevronsUpDown" → "chevrons up down".
function searchTerms(lib, name) {
  let n = name;
  if (lib === 'react-icons') n = n.replace(REACT_ICONS_PREFIX, '');
  n = n.replace(/Icon$/, '');
  return n
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w && !['alt', 'reg', 'outline', '2', '3', 'h', 'v'].includes(w))
    .join(' ');
}

// `search-01` → `Search01Icon`; digit-leading segments (3d-view) don't convert — that's fine,
// they simply fail the catalog gate.
function kebabToExport(kebab) {
  return `${kebab.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')}Icon`;
}

// Best guess from the name alone: Search → Search01Icon, Home → Home01Icon, Bell → (none).
function directGuess(lib, name, catalog) {
  const base = searchTerms(lib, name).split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  for (const c of [`${base}Icon`, `${base}01Icon`, `${base}02Icon`]) if (catalog.has(c)) return c;
  return '';
}

async function search(term) {
  try {
    const res = await fetch(SEARCH + encodeURIComponent(term), { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];
    return (await res.json()).results ?? [];
  } catch {
    return [];
  }
}

async function mapLibrary(lib, catalog, outDir) {
  const seeds = [...new Set(SEEDS[lib].split(/\s+/).filter(Boolean))];
  const rows = new Array(seeds.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < seeds.length) {
        const i = next++;
        const name = seeds[i];
        const term = searchTerms(lib, name);
        const results = await search(term);
        const seen = new Set();
        const candidates = [];
        const tags = new Set();
        for (const r of results) {
          const exp = kebabToExport(r.name);
          if (catalog.has(exp) && !seen.has(exp)) {
            seen.add(exp);
            candidates.push(exp);
            for (const t of r.tags ?? []) tags.add(t);
          }
          if (candidates.length >= 5) break;
        }
        rows[i] = [name, directGuess(lib, name, catalog), candidates.join(' '), [...tags].slice(0, 6).join(' ')];
        if ((i + 1) % 50 === 0) console.error(`${lib}: ${i + 1}/${seeds.length}`);
      }
    }),
  );
  const csv = ['source,direct,candidates,tags', ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  await writeFile(resolve(outDir, `${lib}.csv`), csv + '\n');
  const unmatched = rows.filter((r) => !r[1] && !r[2]).length;
  console.log(`${lib}: ${seeds.length} seeds, ${unmatched} with no candidate → ${outDir}/${lib}.csv`);
}

const args = process.argv.slice(2);
const o = args.indexOf('--out');
const outDir = resolve(o !== -1 ? args[o + 1] : resolve(ROOT, 'skills/scripts/_review'));
const libs = args.filter((a, i) => !a.startsWith('--') && (o === -1 || i !== o + 1));

const md = await readFile(CATALOG, 'utf8');
const catalog = new Set([...md.matchAll(/^- `(\w+Icon)`$/gm)].map((m) => m[1]));
await mkdir(outDir, { recursive: true });
for (const lib of libs.length ? libs : Object.keys(SEEDS)) {
  if (!SEEDS[lib]) throw new Error(`Unknown library "${lib}". Known: ${Object.keys(SEEDS).join(', ')}`);
  await mapLibrary(lib, catalog, outDir);
}
