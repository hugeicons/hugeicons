import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { TtlCache } from '../build/utils/cache.js';

test('entries expire after the TTL', (t) => {
    t.mock.timers.enable({ apis: ['Date'], now: 0 });
    const cache = new TtlCache(1000, 10);
    cache.set('a', 1);
    t.mock.timers.tick(999);
    assert.equal(cache.get('a'), 1);
    t.mock.timers.tick(1);
    assert.equal(cache.get('a'), undefined);
});

test('the least recently used entry is evicted when full', () => {
    const cache = new TtlCache(60_000, 2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a');
    cache.set('c', 3);
    assert.equal(cache.get('b'), undefined);
    assert.equal(cache.get('a'), 1);
    assert.equal(cache.get('c'), 3);
});

test('concurrent misses share one load', async () => {
    const cache = new TtlCache(60_000, 10);
    const load = mock.fn(async () => 'value');
    const results = await Promise.all([cache.getOrLoad('k', load), cache.getOrLoad('k', load)]);
    assert.deepEqual(results, ['value', 'value']);
    assert.equal(load.mock.callCount(), 1);
    assert.equal(await cache.getOrLoad('k', load), 'value');
    assert.equal(load.mock.callCount(), 1);
});

test('failed loads are not cached', async () => {
    const cache = new TtlCache(60_000, 10);
    await assert.rejects(cache.getOrLoad('k', async () => { throw new Error('down'); }), /down/);
    assert.equal(await cache.getOrLoad('k', async () => 'ok'), 'ok');
});
