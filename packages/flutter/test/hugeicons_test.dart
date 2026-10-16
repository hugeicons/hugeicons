import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:hugeicons/styles/stroke_rounded.dart';

void main() {
  group('HugeIcons', () {
    test('exposes generated icon data', () {
      expect(HugeIcons.strokeRoundedHome01, isA<List<List<dynamic>>>());
      expect(HugeIcons.strokeRoundedHome01, isNotEmpty);
      expect(HugeIcons.strokeRoundedHome01,
          same(HugeIconsStrokeRounded.strokeRoundedHome01));
    });

    test('short aliases point at the prefixed constant', () {
      expect(HugeIconsStrokeRounded.home01,
          same(HugeIconsStrokeRounded.strokeRoundedHome01));
    });

    test('names follow the website overrides (4k → 4K, c++ → Cpp)', () {
      expect(HugeIcons.strokeRounded4K, isNotEmpty);
      expect(HugeIcons.strokeRoundedCpp, isNotEmpty);
    });

    test('names from 1.1.x keep compiling as deprecated members', () {
      // ignore: deprecated_member_use_from_same_package
      expect(HugeIcons.strokeRoundedFourK, same(HugeIcons.strokeRounded4K));
      // ignore: deprecated_member_use_from_same_package
      expect(HugeIcons.strokeRounded1stBrecket,
          same(HugeIcons.strokeRounded1stBracket));
      // ignore: deprecated_member_use_from_same_package
      expect(HugeIcons.strokeRoundedAdvertisement, isNotEmpty);
      // ignore: deprecated_member_use_from_same_package
      expect(HugeIconsStrokeRounded.fourK, same(HugeIcons.strokeRounded4K));
    });

    test('elements carry a tag, a key and theme-driven colors', () {
      for (final element in HugeIcons.strokeRoundedDumpTruck) {
        expect(element[0], isA<String>());
        final attrs = element[1] as Map<String, dynamic>;
        expect(attrs['key'], isA<String>());
        expect(attrs['stroke'], 'currentColor');
      }
    });
  });

  group('HugeIcon', () {
    testWidgets('renders an SVG at the requested size and color',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HugeIcon(
                icon: HugeIcons.strokeRoundedExternalDrive,
                color: Colors.blue,
                size: 50.0,
              ),
            ),
          ),
        ),
      );

      final hugeIconFinder = find.byType(HugeIcon);
      expect(hugeIconFinder, findsOneWidget);
      expect(tester.getSize(hugeIconFinder), const Size(50, 50));

      final svgFinder = find.descendant(
        of: hugeIconFinder,
        matching: find.byType(SvgPicture),
      );
      expect(svgFinder, findsOneWidget);
    });

    testWidgets('writes camelCase attributes back as SVG attribute names',
        (WidgetTester tester) async {
      // `squircle-dashed` uses stroke-dasharray, which older versions of the
      // widget emitted as the invalid attribute `strokeDasharray`.
      await tester.pumpWidget(
        const MaterialApp(
          home: HugeIcon(icon: HugeIcons.strokeRoundedSquircleDashed),
        ),
      );

      final svg = tester.widget<SvgPicture>(find.byType(SvgPicture));
      final source = (svg.bytesLoader as SvgStringLoader).provideSvg(null);
      expect(source, contains('stroke-dasharray='));
      expect(source, contains('stroke-width='));
      expect(source, isNot(contains('strokeDasharray')));
    });
  });
}
