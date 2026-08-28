import { splitProps, createMemo, For, Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { JSX } from 'solid-js';

const defaultAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
};

export type IconSvgElement = readonly (readonly [string, { readonly [key: string]: string | number }])[];

export type SVGAttributes = Partial<JSX.SvgSVGAttributes<SVGSVGElement>>;

type ComponentAttributes = SVGAttributes;

export interface HugeiconsProps extends ComponentAttributes {
  size?: string | number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  altIcon?: IconSvgElement;
  showAlt?: boolean;
  icon?: IconSvgElement;
  class?: string;
  primaryColor?: string;
  secondaryColor?: string;
  disableSecondaryOpacity?: boolean;
}

export interface HugeiconsIconProps extends Omit<HugeiconsProps, 'altIcon'> {
  icon: IconSvgElement;
  altIcon?: IconSvgElement;
}

export const HugeiconsIcon: Component<HugeiconsIconProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'icon',
    'size',
    'color',
    'strokeWidth',
    'absoluteStrokeWidth',
    'class',
    'altIcon',
    'showAlt',
    'primaryColor',
    'secondaryColor',
    'disableSecondaryOpacity'
  ]);

  const calculatedStrokeWidth = createMemo(() => {
    if (local.strokeWidth === undefined) return undefined;
    return local.absoluteStrokeWidth
      ? (Number(local.strokeWidth) * 24) / Number(local.size ?? 24)
      : local.strokeWidth;
  });

  const currentIcon = createMemo(() =>
    local.showAlt && local.altIcon ? local.altIcon : local.icon
  );

  const sortedChildren = createMemo(() =>
    [...currentIcon()].sort(([, a], [, b]) => {
      const hasOpacityA = a.opacity !== undefined;
      const hasOpacityB = b.opacity !== undefined;
      return hasOpacityB ? 1 : hasOpacityA ? -1 : 0;
    })
  );

  const finalColor = createMemo(() =>
    local.primaryColor || local.color || 'currentColor'
  );

  return (
    <svg
      {...defaultAttributes}
      width={local.size ?? 24}
      height={local.size ?? 24}
      color={finalColor()}
      stroke={calculatedStrokeWidth() !== undefined ? 'currentColor' : undefined}
      stroke-width={calculatedStrokeWidth()}
      class={local.class}
      {...rest}
    >
      <For each={sortedChildren()}>
        {([tag, attrs]) => {
          const isSecondaryPath = attrs.opacity !== undefined;

          const getOpacity = () => {
            if (!isSecondaryPath) return attrs.opacity as string | number | undefined;
            return local.disableSecondaryOpacity ? undefined : (attrs.opacity as string | number | undefined);
          };

          const getStroke = () => {
            if (local.secondaryColor && attrs.stroke !== undefined) {
              return isSecondaryPath ? local.secondaryColor : finalColor();
            }
            if (calculatedStrokeWidth() !== undefined) {
              return 'currentColor';
            }
            return attrs.stroke as string | undefined;
          };

          const getFill = () => {
            if (local.secondaryColor && attrs.stroke === undefined) {
              return isSecondaryPath ? local.secondaryColor : finalColor();
            }
            return attrs.fill as string | undefined;
          };

          const getStrokeWidth = () => {
            if (calculatedStrokeWidth() !== undefined) {
              return calculatedStrokeWidth();
            }
            return (attrs['stroke-width'] ?? attrs.strokeWidth) as string | number | undefined;
          };

          return (
            <Dynamic
              component={tag}
              {...attrs}
              stroke={getStroke()}
              stroke-width={getStrokeWidth()}
              fill={getFill()}
              opacity={getOpacity()}
            />
          );
        }}
      </For>
    </svg>
  );
};

export default HugeiconsIcon;
