import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  inject,
} from "@angular/core";
import { toSvgAttribute } from "../lib/svg-attributes";

/** One icon child: an SVG tag name plus React-style props. */
export interface SvgChildNode {
  tag: string;
  [prop: string]: unknown;
}

/**
 * Renders icon children into the host <svg>, with any tag and any attribute, the way
 * React's createElement does. A template can't bind a dynamic tag name, so the nodes
 * are built through Renderer2. It runs in ngOnChanges, i.e. synchronously during
 * change detection, so the icon is in the DOM right after detectChanges() and in
 * server-rendered HTML. Any children already present (e.g. from SSR) are replaced.
 */
@Directive({
  selector: "svg[hugeiconsSvgChildren]",
  standalone: true,
})
export class HugeiconsSvgChildrenDirective implements OnChanges {
  @Input({ required: true }) hugeiconsSvgChildren!: readonly SvgChildNode[];

  private readonly host: ElementRef<SVGSVGElement> = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(): void {
    const svg = this.host.nativeElement;

    while (svg.firstChild) {
      this.renderer.removeChild(svg, svg.firstChild);
    }

    for (const { tag, ...props } of this.hugeiconsSvgChildren ?? []) {
      const child = this.renderer.createElement(tag, "svg");
      for (const [prop, value] of Object.entries(props)) {
        const attribute = toSvgAttribute(prop, value);
        if (attribute) {
          this.renderer.setAttribute(
            child,
            attribute.name,
            attribute.value,
            attribute.namespace ?? undefined,
          );
        }
      }
      this.renderer.appendChild(svg, child);
    }
  }
}
