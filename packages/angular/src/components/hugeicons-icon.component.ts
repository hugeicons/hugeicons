import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { IconSvgObject } from '../lib/types';

interface PathData {
  d: string;
  fill: string;
  opacity?: string;
  fillRule?: string;
  stroke?: string;
  strokeWidth?: number;
}

@Component({
  selector: 'hugeicons-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      [attr.color]="color()"
      [class]="iconClass()"
      xmlns="http://www.w3.org/2000/svg"
    >
      @for (path of paths(); track $index) {
        <path
          [attr.d]="path.d"
          [attr.fill]="path.fill"
          [attr.opacity]="path.opacity"
          [attr.fill-rule]="path.fillRule"
          [attr.stroke]="path.stroke"
          [attr.stroke-width]="path.strokeWidth"
        />
      }
    </svg>
  `,
  host: {
    style: 'display: inline-flex; align-items: center; justify-content: center;'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HugeiconsIconComponent {
  // Signal inputs - modern Angular 17.1+ approach
  readonly size = input<string | number>(24);
  readonly strokeWidth = input<number | undefined>(undefined);
  readonly absoluteStrokeWidth = input<boolean>(false);
  readonly icon = input.required<IconSvgObject>();
  readonly altIcon = input<IconSvgObject | undefined>(undefined);
  readonly color = input<string>('currentColor');
  readonly iconClass = input<string>('', { alias: 'class' });
  readonly showAlt = input<boolean>(false);

  // Computed signal for reactive path updates
  readonly paths = computed<PathData[]>(() => {
    const currentIcon = this.showAlt() && this.altIcon() ? this.altIcon()! : this.icon();

    if (!currentIcon || !Array.isArray(currentIcon)) {
      return [];
    }

    const strokeWidthValue = this.strokeWidth();
    const calculatedStrokeWidth = strokeWidthValue !== undefined
      ? (this.absoluteStrokeWidth() 
          ? (Number(strokeWidthValue) * 24) / Number(this.size()) 
          : strokeWidthValue)
      : undefined;

    const strokeProps = calculatedStrokeWidth !== undefined 
      ? { strokeWidth: calculatedStrokeWidth, stroke: 'currentColor' } 
      : {};

    return currentIcon.map(([_, attrs]) => ({
      d: attrs['d'],
      fill: attrs['fill'] || 'none',
      opacity: attrs['opacity'],
      fillRule: attrs['fillRule'],
      ...strokeProps
    }));
  });
}