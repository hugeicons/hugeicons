import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relevance, toTags, words } from '../build/utils/search.js';

const score = (query, name, tags = []) => relevance(words(query), name, tags);

test('an exact base name scores highest', () => {
    assert.equal(score('home', 'home-01'), 100);
    assert.equal(score('shopping cart', 'shopping-cart-01'), 100);
});

test('names containing every query word beat tag-only matches', () => {
    const named = score('cart', 'shopping-cart-add');
    const tagged = score('cart', 'basket-01', ['cart']);
    assert.ok(named > tagged, `${named} > ${tagged}`);
});

test('names starting with the query rank above names that only contain it', () => {
    assert.ok(score('arrow', 'arrow-left-01') > score('arrow', 'circle-arrow-left-01'));
});

test('plural and singular forms match each other', () => {
    assert.ok(score('carts', 'shopping-cart-01') > 0);
    assert.ok(score('categories', 'category') > 0);
});

test('loose matches score zero', () => {
    assert.equal(score('cart', 'chart-01'), 0);
    assert.equal(score('card', 'cardboard-box'), 0);
});

test('toTags accepts arrays and comma-separated strings', () => {
    assert.deepEqual(toTags(['a', 'b']), ['a', 'b']);
    assert.deepEqual(toTags('house, main , ,hub'), ['house', 'main', 'hub']);
});
