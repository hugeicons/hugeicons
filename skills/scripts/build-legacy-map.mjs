#!/usr/bin/env node
// Diffs the icon exports of the deprecated Hugeicons packages (and, optionally, an older
// @hugeicons/core-free-icons release) against the current free catalog in
// skills/hugeicons/references/icon-list.md, and prints markdown table skeletons for the
// names that no longer exist. Successors are curated by hand into
// skills/hugeicons-migrate/references/legacy-hugeicons.md.
//
// Usage:
//   node skills/scripts/build-legacy-map.mjs                 # legacy packages vs current catalog
//   node skills/scripts/build-legacy-map.mjs --compare 4.2.1 # also diff core-free-icons@4.2.1 vs current
//
// Run build-icon-list.mjs first so the catalog is current. No dependencies — Node >= 18.

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = resolve(ROOT, 'skills/hugeicons/references/icon-list.md');

// Last published version of each deprecated package and where its per-icon files live.
const LEGACY = [
  { pkg: 'hugeicons-react', version: '0.3.0', dir: '/dist/esm/icons/' },
  { pkg: '@hugeicons/react-pro', version: '0.3.2', dir: '/dist/esm/icons/' },
  { pkg: 'hugeicons-react-native', version: '0.0.2', dir: '/dist/esm/' },
  { pkg: '@hugeicons/react-native-pro', version: '0.1.7', dir: '/dist/esm/icons/' },
];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

function listFiles(node, out = []) {
  for (const f of node.files ?? []) {
    if (f.type === 'directory') listFiles(f, out);
    else out.push(f.path);
  }
  return out;
}

// `add_01_icon.js`, `add-01-icon.js` and `Add01Icon.js` all become `Add01Icon`.
function toExportName(basename) {
  const parts = basename.split(/[-_]/);
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

async function legacyExports({ pkg, version, dir }) {
  const meta = await fetchJson(`https://unpkg.com/${pkg}@${version}/?meta`);
  const names = listFiles(meta)
    .filter((p) => p.startsWith(dir) && p.endsWith('.js') && !p.includes('/', dir.length))
    .map((p) => toExportName(p.slice(dir.length, -'.js'.length)))
    .filter((n) => /^[A-Z][A-Za-z0-9]*Icon$/.test(n)); // drops index.js, create-hugeicon-component.js, …
  return new Set(names);
}

async function currentCatalog() {
  const md = await readFile(CATALOG, 'utf8');
  const names = [...md.matchAll(/^- `(\w+Icon)`$/gm)].map((m) => m[1]);
  const source = md.match(/^Source: `(.+?)`/m)?.[1] ?? 'unknown';
  return { names: new Set(names), source };
}

async function oldCatalog(version) {
  const dts = await fetchText(`https://unpkg.com/@hugeicons/core-free-icons@${version}/dist/types/index.d.ts`);
  return new Set([...dts.matchAll(/^declare const (\w+Icon): IconSvgObject;/gm)].map((m) => m[1]));
}

function table(title, missing) {
  const rows = [...missing].sort((a, b) => a.localeCompare(b, 'en'));
  return [
    `### ${title}`,
    '',
    `${rows.length} name(s) not in the current catalog:`,
    '',
    '| Legacy name | Successor | Note |',
    '|---|---|---|',
    ...rows.map((n) => `| \`${n}\` |  |  |`),
    '',
  ].join('\n');
}

const current = await currentCatalog();
console.log(`Current catalog: ${current.names.size} icons (${current.source})\n`);

for (const src of LEGACY) {
  const names = await legacyExports(src);
  const missing = [...names].filter((n) => !current.names.has(n));
  console.log(`## ${src.pkg}@${src.version} — ${names.size} exports, ${missing.length} missing\n`);
  if (missing.length) console.log(table(`${src.pkg}@${src.version}`, missing));
}

const i = process.argv.indexOf('--compare');
if (i !== -1 && process.argv[i + 1]) {
  const version = process.argv[i + 1];
  const old = await oldCatalog(version);
  const missing = [...old].filter((n) => !current.names.has(n));
  console.log(`## @hugeicons/core-free-icons@${version} — ${old.size} exports, ${missing.length} missing\n`);
  if (missing.length) console.log(table(`@hugeicons/core-free-icons@${version}`, missing));
}
