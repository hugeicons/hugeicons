import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from "@angular/core";
import { IconSvgObject } from "../lib/types";

const SVG_NAMESPACE = "svg";

interface SvgElementData {
  tag: string;
  attrs: Record<string, string>;
}

/** Icon data uses React-style camelCase keys (strokeLinecap); SVG needs kebab-case (stroke-linecap). */
const toSvgAttributeName = (key: string): string =>
  key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

@Component({
  selector: "hugeicons-icon",
  standalone: true,
  template: `
    <svg
      #svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      [attr.color]="primaryColor() || color()"
      [attr.stroke]="strokeOverride()?.stroke"
      [attr.stroke-width]="strokeOverride()?.strokeWidth"
      [class]="iconClass()"
      xmlns="http://www.w3.org/2000/svg"
    ></svg>
  `,
  host: {
    style:
      "display: inline-flex; align-items: center; justify-content: center;",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HugeiconsIconComponent {
  private readonly renderer = inject(Renderer2);
  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>("svg");

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

  readonly strokeOverride = computed(() => {
    const strokeWidthValue = this.strokeWidth();
    if (strokeWidthValue === undefined) {
      return undefined;
    }
    const strokeWidth = this.absoluteStrokeWidth()
      ? (Number(strokeWidthValue) * 24) / Number(this.size())
      : strokeWidthValue;
    return { strokeWidth: String(strokeWidth), stroke: "currentColor" };
  });

  // Computed signal for reactive element updates
  readonly elements = computed<SvgElementData[]>(() => {
    const currentIcon =
      this.showAlt() && this.altIcon() ? this.altIcon()! : this.icon();

    if (!currentIcon || !Array.isArray(currentIcon)) {
      return [];
    }

    const strokeOverride = this.strokeOverride();
    const mainColor = this.primaryColor() || this.color();
    const secondaryColor = this.secondaryColor();
    const disableSecondaryOpacity = this.disableSecondaryOpacity();

    // Secondary (opacity) layers render first so primary layers paint on top
    return [...currentIcon]
      .sort(([, a], [, b]) => {
        const hasOpacityA = a["opacity"] !== undefined;
        const hasOpacityB = b["opacity"] !== undefined;
        return hasOpacityB ? 1 : hasOpacityA ? -1 : 0;
      })
      .map(([tag, attrs]) => {
        const isSecondary = attrs["opacity"] !== undefined;
        const resolved: Record<string, unknown> = {
          ...attrs,
          ...strokeOverride,
        };

        if (secondaryColor) {
          const layerColor = isSecondary ? secondaryColor : mainColor;
          if (attrs["stroke"] !== undefined) {
            resolved["stroke"] = layerColor;
          } else {
            resolved["fill"] = layerColor;
          }
        }
        resolved["opacity"] =
          isSecondary && !disableSecondaryOpacity
            ? attrs["opacity"]
            : undefined;

        const svgAttrs: Record<string, string> = {};
        for (const [key, value] of Object.entries(resolved)) {
          if (key !== "key" && value !== undefined && value !== null) {
            svgAttrs[toSvgAttributeName(key)] = String(value);
          }
        }
        return { tag, attrs: svgAttrs };
      });
  });

  constructor() {
    // Icons mix <path>, <circle>, <ellipse> and <rect>; a template can't bind a dynamic
    // tag name, so the children are created through the renderer instead.
    effect(() => {
      const svg = this.svg().nativeElement;
      const elements = this.elements();

      while (svg.firstChild) {
        this.renderer.removeChild(svg, svg.firstChild);
      }
      for (const { tag, attrs } of elements) {
        const child = this.renderer.createElement(tag, SVG_NAMESPACE);
        for (const [name, value] of Object.entries(attrs)) {
          this.renderer.setAttribute(child, name, value);
        }
        this.renderer.appendChild(svg, child);
      }
    });
  }
}
