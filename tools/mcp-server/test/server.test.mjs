/**
 * Drives the server through a real MCP client over an in-memory transport.
 * The client validates every structuredContent against the tool's outputSchema.
 * Upstream APIs are replaced by a fetch stub, so the tests run offline.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

const ICONS = [
    { name: 'home-01', tags: 'house, main', category: 'home', featured: true, version: '1.0.0' },
    { name: 'home-02', tags: 'house', category: 'home', featured: false, version: '1.0.0' },
    { name: '2nd-bracket', tags: 'bracket', category: 'math', featured: false, version: '1.0.0' },
    { name: 'shopping-cart-01', tags: 'cart, buy', category: 'e-commerce', featured: false, version: '1.0.0' },
];

const glyph = (style) => ({
    icon_name: 'home-01', style, unicode: '&#990769;', unicode_decimal: 990769,
    id: 'x', created_at: '', updated_at: '',
});

const upstream = { calls: [] };

function json(body, status = 200) {
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

function stubFetch(input) {
    const url = new URL(input instanceof URL ? input.href : String(input?.url ?? input));
    upstream.calls.push(url.href);
    if (url.href === 'https://hugeicons.com/api/icons') return json({ icons: ICONS });
    if (url.host === 'search.hugeicons.com') {
        const q = url.searchParams.get('q');
        // One term whose upstream request always fails, for the partial-failure tests
        if (q.startsWith('boom')) return json({ error: 'upstream exploded' }, 500);
        const results = ICONS.filter((icon) => icon.name.includes(q.split(' ')[0])).map((icon, i) => ({
            ...icon, id: String(i), score: 1, tags: icon.tags.split(', '), highlights: {},
        }));
        return json({ query: q, fuzzy_enabled: true, total: results.length, results });
    }
    if (url.host === 'api.hugeicons.com') {
        if (url.pathname === '/v1/icon/home-01/glyphs') {
            return json({ success: true, message: null, data: { glyphs: [glyph('stroke-rounded'), glyph('solid-rounded')] } });
        }
        if (url.pathname === '/v1/icon/home-01/glyph') {
            return json({ success: true, message: null, data: { primary: glyph(url.searchParams.get('style')), secondary: null } });
        }
        return json({ success: false, message: 'not found', data: null });
    }
    return json({}, 404);
}

let client;
let realFetch;

before(async () => {
    realFetch = globalThis.fetch;
    globalThis.fetch = async (input) => stubFetch(input);

    const { HugeiconsServer } = await import('../build/server.js');
    const server = new HugeiconsServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    client = new Client({ name: 'test', version: '1.0.0' });
    await client.connect(clientTransport);
    // Caches the output schemas, so callTool validates structuredContent
    await client.listTools();
});

after(async () => {
    await client?.close();
    globalThis.fetch = realFetch;
});

const call = (name, args) => client.callTool({ name, arguments: args });

test('initialize sends instructions and the package version', async () => {
    const { createRequire } = await import('node:module');
    const { version } = createRequire(import.meta.url)('../package.json');
    assert.equal(client.getServerVersion().version, version);
    assert.match(client.getInstructions(), /get_icon_code/);
});

test('every tool is read-only and declares an output schema', async () => {
    const { tools } = await client.listTools();
    assert.ok(tools.length >= 6);
    for (const tool of tools) {
        assert.equal(tool.annotations?.readOnlyHint, true, tool.name);
        assert.ok(tool.outputSchema, tool.name);
    }
});

test('search_icons returns export names, without tags by default', async () => {
    const result = await call('search_icons', { query: 'home, cart', limit: 1 });
    assert.ok(!result.isError);
    const [home, cart] = result.structuredContent.searches;
    assert.deepEqual(home.results, [{ name: 'home-01', component: 'Home01Icon', category: 'home' }]);
    assert.equal(home.total, 2);
    assert.equal(cart.query, 'cart');
});

test('search_icons includes tags only when asked', async () => {
    const result = await call('search_icons', { query: 'home', limit: 1, include_tags: true });
    assert.ok(!result.isError);
    assert.deepEqual(result.structuredContent.searches[0].results, [
        { name: 'home-01', component: 'Home01Icon', category: 'home', tags: ['house', 'main'] },
    ]);
});

test('search_icons rejects more terms than it can search, rather than dropping them', async () => {
    const result = await call('search_icons', { query: Array.from({ length: 11 }, (_, i) => `q${i}`).join(', ') });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /Too many search terms \(11\)/);
});

test('one failing term keeps the terms that did resolve', async () => {
    const result = await call('search_icons', { query: 'home, boom', limit: 1 });
    assert.ok(!result.isError, result.content[0]?.text);
    const [home, boom] = result.structuredContent.searches;
    assert.deepEqual(home.results, [{ name: 'home-01', component: 'Home01Icon', category: 'home' }]);
    assert.equal(home.error, undefined);
    assert.equal(boom.query, 'boom');
    assert.deepEqual(boom.results, []);
    // The empty list must be labelled, or it reads as "no such icon"
    assert.match(boom.error, /says nothing about whether the icon exists/);
});

test('search_icons reports the service as down only when every term fails', async () => {
    const result = await call('search_icons', { query: 'boom, boom boom' });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /search service is unavailable/i);
});

test('get_icon_code resolves export names and builds snippets', async () => {
    const result = await call('get_icon_code', { icon_name: 'SecondBracketIcon', platform: 'react' });
    assert.ok(!result.isError, result.content[0].text);
    const code = result.structuredContent;
    assert.equal(code.icon, '2nd-bracket');
    assert.equal(code.free, true);
    assert.equal(code.reference, 'SecondBracketIcon');
    assert.match(code.usage, /import \{ SecondBracketIcon \} from '@hugeicons\/core-free-icons'/);

    const pro = (await call('get_icon_code', { icon_name: 'home-01', platform: 'flutter', style: 'solid-sharp' })).structuredContent;
    assert.equal(pro.free, false);
    assert.equal(pro.reference, 'HugeIcons.solidSharpHome01');
    assert.doesNotMatch(pro.usage, /strokeWidth/);
    assert.ok(pro.note);

    const html = (await call('get_icon_code', { icon_name: 'home 01', platform: 'html' })).structuredContent;
    assert.equal(html.usage, '<i class="hgi hgi-stroke hgi-home-01"></i>');
});

test('unknown icons get suggestions without calling the glyph API', async () => {
    upstream.calls.length = 0;
    const result = await call('get_icon_glyphs', { icon_name: 'home-99' });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /Did you mean: home-01, home-02/);
    assert.ok(!upstream.calls.some((url) => url.includes('api.hugeicons.com')));
});

test('glyph tools return structured glyphs', async () => {
    const all = await call('get_icon_glyphs', { icon_name: 'Home01Icon' });
    assert.equal(all.structuredContent.icon, 'home-01');
    assert.equal(all.structuredContent.glyphs.length, 2);

    const one = await call('get_icon_glyph_by_style', { icon_name: 'home-01', style: 'solid-rounded' });
    assert.equal(one.structuredContent.primary.style, 'solid-rounded');
    assert.equal(one.structuredContent.secondary, null);
});

test('list_icons pages and reports categories', async () => {
    const first = (await call('list_icons', { limit: 3 })).structuredContent;
    assert.equal(first.total, 4);
    assert.equal(first.next_offset, 3);
    assert.deepEqual(first.categories, { 'e-commerce': 1, home: 2, math: 1 });

    const last = (await call('list_icons', { offset: 3, limit: 3 })).structuredContent;
    assert.equal(last.next_offset, null);
    assert.equal(last.categories, undefined);

    const bad = await call('list_icons', { category: 'nope' });
    assert.equal(bad.isError, true);
});

test('invalid arguments come back as tool errors', async () => {
    assert.equal((await call('get_icon_code', { icon_name: 'home-01', platform: 'qt' })).isError, true);
    assert.equal((await call('get_icon_code', { icon_name: 'home-01', platform: 'react', style: 'neon' })).isError, true);
    assert.equal((await call('search_icons', { query: ' ' })).isError, true);
});

test('platform guides are listed, templated and readable', async () => {
    const { resources } = await client.listResources();
    assert.ok(resources.some((r) => r.uri === 'hugeicons://docs/platforms/solid-js'));
    assert.ok(resources.some((r) => r.uri === 'hugeicons://icons/index'));

    const { resourceTemplates } = await client.listResourceTemplates();
    assert.equal(resourceTemplates[0].uriTemplate, 'hugeicons://docs/platforms/{platform}');

    const guide = await client.readResource({ uri: 'hugeicons://docs/platforms/react' });
    assert.match(guide.contents[0].text, /# REACT Integration Guide/);

    const index = await client.readResource({ uri: 'hugeicons://icons/index' });
    assert.equal(JSON.parse(index.contents[0].text).length, 4);
});
