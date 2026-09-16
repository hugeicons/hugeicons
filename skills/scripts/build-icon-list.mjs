#!/usr/bin/env node
// Regenerates the icon catalogs the agent skills grep against:
//   skills/hugeicons/references/icon-list.md          (JS: @hugeicons/core-free-icons)
//   skills/hugeicons/references/icon-list-flutter.md  (Flutter: packages/flutter/lib/hugeicons.dart)
//
// Usage:
//   node skills/scripts/build-icon-list.mjs              # latest core-free-icons from npm
//   node skills/scripts/build-icon-list.mjs --version 4.3.2
//
// No dependencies — needs Node >= 18 for global fetch.

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const JS_OUT = resolve(ROOT, 'skills/hugeicons/references/icon-list.md');
const FLUTTER_OUT = resolve(ROOT, 'skills/hugeicons/references/icon-list-flutter.md');
const FLUTTER_SRC = resolve(ROOT, 'packages/flutter/lib/hugeicons.dart');
const PKG = '@hugeicons/core-free-icons';

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

async function resolveVersion() {
  const i = process.argv.indexOf('--version');
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  const meta = JSON.parse(await fetchText(`https://registry.npmjs.org/${encodeURIComponent(PKG)}`));
  return meta['dist-tags'].latest;
}

function renderList(title, source, names) {
  return [
    `# Hugeicons Icon List (${title})`,
    `Total icons: ${names.length}`,
    '',
    `Source: ${source}. Generated — do not edit by hand.`,
    '',
    ...names.map((n) => `- \`${n}\``),
    '',
  ].join('\n');
}

async function buildJs() {
  const version = await resolveVersion();
  const dts = await fetchText(`https://unpkg.com/${PKG}@${version}/dist/types/index.d.ts`);
  const names = [...dts.matchAll(/^declare const (\w+Icon): IconSvgObject;/gm)].map((m) => m[1]);
  if (names.length === 0) throw new Error('No icon declarations found in index.d.ts — did the package layout change?');
  const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b, 'en'));
  await writeFile(JS_OUT, renderList('JS frameworks', `\`${PKG}@${version}\``, unique));
  return { version, count: unique.length };
}

async function buildFlutter() {
  const dart = await readFile(FLUTTER_SRC, 'utf8');
  const names = [...dart.matchAll(/static const List<List<dynamic>> (\w+) =/g)].map((m) => `HugeIcons.${m[1]}`);
  if (names.length === 0) throw new Error(`No icon constants found in ${FLUTTER_SRC}`);
  const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b, 'en'));
  await writeFile(FLUTTER_OUT, renderList('Flutter', 'packages/flutter/lib/hugeicons.dart', unique));
  return { count: unique.length };
}

const js = await buildJs();
const flutter = await buildFlutter();

console.log(`icon-list.md          ${js.count} icons (${PKG}@${js.version})`);
console.log(`icon-list-flutter.md  ${flutter.count} icons`);
console.log('\nUpdate the counts in skills/hugeicons/SKILL.md §4 if they changed.');
