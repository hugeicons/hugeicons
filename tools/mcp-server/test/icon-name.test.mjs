import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    compactIconKey,
    componentName,
    flutterName,
    normalizeIconName,
    webfontClass,
    webfontStyleClasses,
} from '../build/utils/icon-name.js';

test('normalizeIconName accepts names, spacing and code identifiers', () => {
    assert.equal(normalizeIconName('home-01'), 'home-01');
    assert.equal(normalizeIconName(' Home 01 '), 'home-01');
    assert.equal(normalizeIconName('home_01'), 'home-01');
    assert.equal(normalizeIconName('Home01Icon'), 'home-01');
    assert.equal(normalizeIconName('strokeRoundedHome01'), 'home-01');
    assert.equal(normalizeIconName('ShoppingCart01Icon'), 'shopping-cart-01');
});

test('compactIconKey strips prefixes, suffixes and separators', () => {
    assert.equal(compactIconKey('home-01'), 'home01');
    assert.equal(compactIconKey('Home01Icon'), 'home01');
    assert.equal(compactIconKey('Home01FreeIcons'), 'home01');
    assert.equal(compactIconKey('HugeIcons.strokeRoundedHome01'), 'home01');
});

test('componentName matches the JavaScript package exports', () => {
    const cases = {
        'home-01': 'Home01Icon',
        'shopping-cart-01': 'ShoppingCart01Icon',
        '1st-bracket': 'FirstBracketIcon',
        '2nd-bracket-circle': 'SecondBracketCircleIcon',
        'root-3rd-bracket': 'RootThirdBracketIcon',
        '24-hours-clock': 'TwentyFourHoursClockIcon',
        '3d-move': 'ThreeDMoveIcon',
        '3-d-view': 'ThreeDViewIcon',
        '3-g-signal': 'ThreeGSignalIcon',
        'file-axis-3d': 'FileAxisThreeDIcon',
        '4k': 'FourKIcon',
        'modern-tv-4-k': 'ModernTvFourKIcon',
        '7z-01': 'SevenZ01Icon',
        'sorting-1-9': 'SortingOneNineIcon',
        'arrow-down-0-1': 'ArrowDownZeroOneIcon',
        'arrow-down-01': 'ArrowDown01Icon',
        'html-5': 'Html5Icon',
        "rubik's-cube": 'RubiksCubeIcon',
        'c++': 'CppIcon',
        're:': 'ReIcon',
        'comment add-03': 'CommentAdd03Icon',
        'package-add-01 ': 'PackageAdd01Icon',
    };
    for (const [name, expected] of Object.entries(cases)) assert.equal(componentName(name), expected, name);
});

test('flutterName matches the Flutter package constants', () => {
    assert.equal(flutterName('home-01', 'stroke-rounded'), 'strokeRoundedHome01');
    assert.equal(flutterName('home-01', 'solid-sharp'), 'solidSharpHome01');
    assert.equal(flutterName('2nd-bracket', 'stroke-rounded'), 'strokeRounded2ndBracket');
    assert.equal(flutterName('3d-printer', 'stroke-rounded'), 'strokeRounded3dPrinter');
    assert.equal(flutterName('4k', 'stroke-rounded'), 'strokeRounded4K');
    assert.equal(flutterName('c++', 'stroke-rounded'), 'strokeRoundedCpp');
    assert.equal(flutterName("rubik's-cube", 'stroke-rounded'), 'strokeRoundedRubikSCube');
});

test('webfontClass matches the web font stylesheet', () => {
    assert.equal(webfontClass('home-01'), 'hgi-home-01');
    assert.equal(webfontClass('24-hours-clock'), 'hgi-24-hours-clock');
    assert.equal(webfontClass('3d-move'), 'hgi-three-d-move');
    assert.equal(webfontClass('1st-bracket'), 'hgi-first-bracket');
    assert.equal(webfontClass('sorting-1-9'), 'hgi-sorting-one-9');
    assert.equal(webfontClass('arrow-down-0-1'), 'hgi-arrow-down-zero-1');
    assert.equal(webfontClass("rubik's-cube"), 'hgi-rubiks-cube');
    assert.equal(webfontClass('c++'), 'hgi-cpp');
    assert.equal(webfontStyleClasses('stroke-rounded'), 'hgi-stroke');
    assert.equal(webfontStyleClasses('solid-sharp'), 'hgi-solid hgi-sharp');
});
