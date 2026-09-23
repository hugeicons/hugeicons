import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
} from "@angular/core";
import { IconSvgObject } from "../lib/types";
import { HugeiconsSvgChildrenDirective } from "./svg-children.directive";

/**
 * One SVG child of an icon: the icon data's props (React-style camelCase names)
 * plus `tag`, the element name. The named fields are the ones 1.0.11 exposed.
 */
interface PathData {
  tag: string;
  d?: string;
  fill?: string;
  opacity?: string;
  fillRule?: string;
  stroke?: string;
  strokeWidth?: number | string;
  [prop: string]: unknown;
}

/**
 * 1.0.11 wrote fill="none" on every child it rendered (always path, circle, ellipse or
 * rect). Kept for those tags so CSS such as `svg { fill: ... }` behaves as before;
 * any other tag is left untouched, like React.
 */
const LEGACY_FILL_NONE_TAGS = new Set(["path", "circle", "ellipse", "rect"]);

@Component({
  selector: "hugeicons-icon",
  standalone: true,
  imports: [HugeiconsSvgChildrenDirective],
  template: `
    <svg
      [attr.width]="resolvedSize()"
      [attr.height]="resolvedSize()"
      viewBox="0 0 24 24"
      fill="none"
      [attr.color]="mainColor()"
      [attr.stroke]="strokeOverride()?.stroke"
      [attr.stroke-width]="strokeOverride()?.strokeWidth"
      [class]="iconClass()"
      xmlns="http://www.w3.org/2000/svg"
      [hugeiconsSvgChildren]="paths()"
    ></svg>
  `,
  host: {
    style:
      "display: inline-flex; align-items: center; justify-content: center;",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HugeiconsIconComponent {
  // Signal inputs - modern Angular 17.1+ approach
  readonly size = input<string | number>(24);
  readonly strokeWidth = input<number | undefined>(undefined);
  readonly absoluteStrokeWidth = input<boolean>(false);
  readonly icon = input.required<IconSvgObject>();
  readonly altIcon = input<IconSvgObject | undefined>(undefined);
  readonly color = input<string>("currentColor");
  readonly iconClass = input<string>("", { alias: "class" });
  readonly showAlt = input<boolean>(false);
  readonly primaryColor = input<string | undefined>(undefined);
  readonly secondaryColor = input<string | undefined>(undefined);
  readonly disableSecondaryOpacity = input<boolean>(false);

  // Like React's default props: an explicitly bound `undefined` still falls back to the default
  readonly resolvedSize = computed(() => this.size() ?? 24);
  readonly mainColor = computed(
    () => this.primaryColor() || (this.color() ?? "currentColor"),
  );

  /** Stroke width/color forced by the strokeWidth input, applied to the svg and every child. */
  readonly strokeOverride = computed(() => {
    const strokeWidthValue = this.strokeWidth();
    if (strokeWidthValue === undefined) {
      return undefined;
    }
    const strokeWidth = this.absoluteStrokeWidth()
      ? (Number(strokeWidthValue) * 24) / Number(this.resolvedSize())
      : strokeWidthValue;
    return { strokeWidth, stroke: "currentColor" };
  });

  // Computed signal for reactive path updates
  readonly paths = computed<PathData[]>(() => {
    const currentIcon =
      this.showAlt() && this.altIcon() ? this.altIcon()! : this.icon();

    if (!currentIcon || !Array.isArray(currentIcon)) {
      return [];
    }

    const strokeOverride = this.strokeOverride();
    const mainColor = this.mainColor();
    const secondaryColor = this.secondaryColor();
    const disableSecondaryOpacity = this.disableSecondaryOpacity();

    // Same ordering as @hugeicons/react: secondary (opacity) layers first
    return [...currentIcon]
      .sort(([, a], [, b]) => {
        const hasOpacityA = a["opacity"] !== undefined;
        const hasOpacityB = b["opacity"] !== undefined;
        return hasOpacityB ? 1 : hasOpacityA ? -1 : 0;
      })
      .map(([tag, rawAttrs]) => {
        const attrs = rawAttrs as Record<string, unknown>;
        const isSecondary = attrs["opacity"] !== undefined;
        const colorProps = secondaryColor
          ? {
              [attrs["stroke"] !== undefined ? "stroke" : "fill"]: isSecondary
                ? secondaryColor
                : mainColor,
            }
          : {};

        return {
          ...attrs,
          tag,
          fill:
            (attrs["fill"] as string | undefined) ||
            (LEGACY_FILL_NONE_TAGS.has(tag) ? "none" : undefined),
          ...strokeOverride,
          ...colorProps,
          opacity:
            isSecondary && !disableSecondaryOpacity
              ? attrs["opacity"]
              : undefined,
        } as PathData;
      });
  });
}
