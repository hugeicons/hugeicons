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
    String svgSource(WidgetTester tester) {
      final svg = tester.widget<SvgPicture>(find.byType(SvgPicture));
      return (svg.bytesLoader as SvgStringLoader).provideSvg(null);
    }

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

      final source = svgSource(tester);
      expect(source, contains('stroke-dasharray='));
      expect(source, contains('stroke-width='));
      expect(source, isNot(contains('strokeDasharray')));
    });

    group('matchTextDirection', () {
      Widget directional(TextDirection direction, Widget icon) {
        return Directionality(
          textDirection: direction,
          child: Center(child: icon),
        );
      }

      // Checks where the picture is painted inside the icon's box: a mirrored
      // picture has its own left edge drawn at the icon's right edge.
      void expectMirrored(WidgetTester tester, bool mirrored) {
        final icon = find.byType(HugeIcon);
        final picture = find.descendant(
          of: icon,
          matching: find.byType(SvgPicture),
        );
        expect(
          tester.getTopLeft(picture),
          mirrored ? tester.getTopRight(icon) : tester.getTopLeft(icon),
        );
        expect(
          tester.getBottomRight(picture),
          mirrored ? tester.getBottomLeft(icon) : tester.getBottomRight(icon),
        );
      }

      Future<void> pumpArrow(
        WidgetTester tester,
        TextDirection direction, {
        required bool matchTextDirection,
      }) {
        return tester.pumpWidget(directional(
          direction,
          HugeIcon(
            icon: HugeIcons.strokeRoundedArrowLeft01,
            matchTextDirection: matchTextDirection,
          ),
        ));
      }

      testWidgets('mirrors the icon in RTL when enabled',
          (WidgetTester tester) async {
        await pumpArrow(tester, TextDirection.rtl, matchTextDirection: true);
        expectMirrored(tester, true);
      });

      testWidgets('keeps the icon as drawn in LTR when enabled',
          (WidgetTester tester) async {
        await pumpArrow(tester, TextDirection.ltr, matchTextDirection: true);
        expectMirrored(tester, false);
      });

      testWidgets('keeps the icon as drawn in RTL when disabled',
          (WidgetTester tester) async {
        await pumpArrow(tester, TextDirection.rtl, matchTextDirection: false);
        expectMirrored(tester, false);
      });

      testWidgets('keeps the icon as drawn in LTR when disabled',
          (WidgetTester tester) async {
        await pumpArrow(tester, TextDirection.ltr, matchTextDirection: false);
        expectMirrored(tester, false);
      });

      testWidgets('is off by default, so RTL keeps the icon as drawn',
          (WidgetTester tester) async {
        const icon = HugeIcon(icon: HugeIcons.strokeRoundedArrowLeft01);
        expect(icon.matchTextDirection, isFalse);

        await tester.pumpWidget(directional(TextDirection.rtl, icon));

        expectMirrored(tester, false);
      });

      testWidgets('keeps size, colors and stroke width when mirrored',
          (WidgetTester tester) async {
        HugeIcon icon({required bool matchTextDirection}) => HugeIcon(
              icon: HugeIcons.strokeRoundedArrowLeft01,
              color: Colors.indigo,
              secondaryColor: Colors.pink,
              size: 40.0,
              strokeWidth: 2.5,
              matchTextDirection: matchTextDirection,
            );

        await tester.pumpWidget(
          directional(TextDirection.ltr, icon(matchTextDirection: false)),
        );
        final original = svgSource(tester);

        await tester.pumpWidget(
          directional(TextDirection.rtl, icon(matchTextDirection: true)),
        );

        expectMirrored(tester, true);
        expect(tester.getSize(find.byType(HugeIcon)), const Size(40, 40));
        // Mirroring happens at layout level: the SVG built from the icon data
        // is the same, with the requested color and stroke width.
        expect(svgSource(tester), original);
        expect(original, contains('stroke="#3f51b5"'));
        expect(original, contains('stroke-width="2.5"'));
      });

      testWidgets('follows the direction when it changes at runtime',
          (WidgetTester tester) async {
        const icon = HugeIcon(
          icon: HugeIcons.strokeRoundedArrowLeft01,
          matchTextDirection: true,
        );

        await tester.pumpWidget(directional(TextDirection.ltr, icon));
        expectMirrored(tester, false);
        final picture = tester.element(find.byType(SvgPicture));

        await tester.pumpWidget(directional(TextDirection.rtl, icon));
        expectMirrored(tester, true);

        await tester.pumpWidget(directional(TextDirection.ltr, icon));
        expectMirrored(tester, false);

        // The picture isn't remounted when the direction changes.
        expect(tester.element(find.byType(SvgPicture)), same(picture));
      });

      testWidgets('needs no Directionality when disabled',
          (WidgetTester tester) async {
        await tester.pumpWidget(
          const Center(
            child: HugeIcon(icon: HugeIcons.strokeRoundedArrowLeft01),
          ),
        );

        expect(find.byType(SvgPicture), findsOneWidget);
      });

      testWidgets('asks for a Directionality when enabled',
          (WidgetTester tester) async {
        await tester.pumpWidget(
          const Center(
            child: HugeIcon(
              icon: HugeIcons.strokeRoundedArrowLeft01,
              matchTextDirection: true,
            ),
          ),
        );

        expect(tester.takeException(), isFlutterError);
      });
    });
  });
}
