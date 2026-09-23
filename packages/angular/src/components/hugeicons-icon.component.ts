import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
} from "@angular/core";
import { IconSvgObject } from "../lib/types";

/**
 * One SVG child of an icon. Keys mirror the camelCase attributes of the icon data;
 * `tag` is the element name (icons only use path, circle, ellipse and rect).
 */
interface PathData {
  tag: string;
  d?: string;
  fill: string;
  opacity?: string;
  fillRule?: string;
  fillOpacity?: string;
  clipRule?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: string;
  strokeLinejoin?: string;
  transform?: string;
  cx?: string;
  cy?: string;
  r?: string;
  rx?: string;
  ry?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
}

@Component({
  selector: "hugeicons-icon",
  standalone: true,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      [attr.color]="primaryColor() || color()"
      [class]="iconClass()"
      xmlns="http://www.w3.org/2000/svg"
    >
      @for (path of paths(); track $index) {
        @switch (path.tag) {
          @case ("circle") {
            <svg:circle
              [attr.cx]="path.cx"
              [attr.cy]="path.cy"
              [attr.r]="path.r"
              [attr.transform]="path.transform"
              [attr.fill]="path.fill"
              [attr.fill-rule]="path.fillRule"
              [attr.fill-opacity]="path.fillOpacity"
              [attr.clip-rule]="path.clipRule"
              [attr.opacity]="path.opacity"
              [attr.stroke]="path.stroke"
              [attr.stroke-width]="path.strokeWidth"
              [attr.stroke-linecap]="path.strokeLinecap"
              [attr.stroke-linejoin]="path.strokeLinejoin"
            />
          }
          @case ("ellipse") {
            <svg:ellipse
              [attr.cx]="path.cx"
              [attr.cy]="path.cy"
              [attr.rx]="path.rx"
              [attr.ry]="path.ry"
              [attr.transform]="path.transform"
              [attr.fill]="path.fill"
              [attr.fill-rule]="path.fillRule"
              [attr.fill-opacity]="path.fillOpacity"
              [attr.clip-rule]="path.clipRule"
              [attr.opacity]="path.opacity"
              [attr.stroke]="path.stroke"
              [attr.stroke-width]="path.strokeWidth"
              [attr.stroke-linecap]="path.strokeLinecap"
              [attr.stroke-linejoin]="path.strokeLinejoin"
            />
          }
          @case ("rect") {
            <svg:rect
              [attr.x]="path.x"
              [attr.y]="path.y"
              [attr.width]="path.width"
              [attr.height]="path.height"
              [attr.rx]="path.rx"
              [attr.ry]="path.ry"
              [attr.transform]="path.transform"
              [attr.fill]="path.fill"
              [attr.fill-rule]="path.fillRule"
              [attr.fill-opacity]="path.fillOpacity"
              [attr.clip-rule]="path.clipRule"
              [attr.opacity]="path.opacity"
              [attr.stroke]="path.stroke"
              [attr.stroke-width]="path.strokeWidth"
              [attr.stroke-linecap]="path.strokeLinecap"
              [attr.stroke-linejoin]="path.strokeLinejoin"
            />
          }
          @default {
            <svg:path
              [attr.d]="path.d"
              [attr.transform]="path.transform"
              [attr.fill]="path.fill"
              [attr.fill-rule]="path.fillRule"
              [attr.fill-opacity]="path.fillOpacity"
              [attr.clip-rule]="path.clipRule"
              [attr.opacity]="path.opacity"
              [attr.stroke]="path.stroke"
              [attr.stroke-width]="path.strokeWidth"
              [attr.stroke-linecap]="path.strokeLinecap"
              [attr.stroke-linejoin]="path.strokeLinejoin"
            />
          }
        }
      }
    </svg>
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

  // Computed signal for reactive path updates
  readonly paths = computed<PathData[]>(() => {
    const currentIcon =
      this.showAlt() && this.altIcon() ? this.altIcon()! : this.icon();

    if (!currentIcon || !Array.isArray(currentIcon)) {
      return [];
    }

    const strokeWidthValue = this.strokeWidth();
    const calculatedStrokeWidth =
      strokeWidthValue !== undefined
        ? this.absoluteStrokeWidth()
          ? (Number(strokeWidthValue) * 24) / Number(this.size())
          : strokeWidthValue
        : undefined;

    const strokeProps =
      calculatedStrokeWidth !== undefined
        ? { strokeWidth: calculatedStrokeWidth, stroke: "currentColor" }
        : {};

    const mainColor = this.primaryColor() || this.color();
    const secondaryColor = this.secondaryColor();
    const disableSecondaryOpacity = this.disableSecondaryOpacity();

    // Children keep the icon's source order, so paint order matches the design.
    return currentIcon.map(([tag, rawAttrs]) => {
      const attrs = rawAttrs as Record<string, string | undefined>;
      const isSecondary = attrs["opacity"] !== undefined;
      const layerColor = isSecondary ? secondaryColor : mainColor;
      const colorProps = secondaryColor
        ? attrs["stroke"] !== undefined
          ? { stroke: layerColor }
          : { fill: layerColor }
        : {};

      return {
        ...attrs,
        tag,
        fill: attrs["fill"] || "none",
        ...strokeProps,
        ...colorProps,
        opacity:
          isSecondary && !disableSecondaryOpacity
            ? attrs["opacity"]
            : undefined,
      } as PathData;
    });
  });
}
