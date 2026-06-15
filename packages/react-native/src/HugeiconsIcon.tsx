import { createElement, forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import { Circle, G, Line, Path, Rect, Svg, SvgProps } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export type IconSvgElement = readonly (readonly [string, { readonly [key: string]: string | number }])[];

export interface HugeiconsProps extends SvgProps {
  size?: string | number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  icon: IconSvgElement;
  altIcon?: IconSvgElement;
  showAlt?: boolean;
}

export type HugeiconsIconComponent = ForwardRefExoticComponent<HugeiconsProps & RefAttributes<Svg>>;

const SVGComponents: { [key: string]: any } = {
  svg: Svg,
  path: Path,
  circle: Circle,
  rect: Rect,
  line: Line,
  g: G,
};

const defaultAttributes = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
};

let cssInterop: any;
try {
  cssInterop = require('nativewind').cssInterop;
} catch (e) {
  // NativeWind is not installed
  cssInterop = null;
}

const BaseHugeiconsIcon = forwardRef<Svg, HugeiconsProps>(
  (
    {
      color = '#000',
      size = 24,
      strokeWidth,
      absoluteStrokeWidth = false,
      className,
      style,
      icon,
      altIcon,
      showAlt = false,
      ...rest
    },
    ref,
  ) => {
    const calculatedStrokeWidth = strokeWidth !== undefined
      ? (absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth)
      : undefined;

    const strokeProps: { stroke?: string; strokeWidth?: number } = calculatedStrokeWidth !== undefined ? {
      strokeWidth: calculatedStrokeWidth,
      stroke: 'currentColor'
    } : {};

    const elementProps = {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      color,
      ...strokeProps,
      ...rest,
    };

    const currentIcon = showAlt && altIcon ? altIcon : icon;
    
    const svgChildren = currentIcon.map((element, index) => {
      const tag = element[0];
      const attrs = element[1];
      const SvgComponent = SVGComponents[tag.toLowerCase()];
      if (!SvgComponent) return null;

      return createElement(SvgComponent, {
        ...attrs,
        ...strokeProps,
        key: `${tag}-${index}`,
      });
    });

    return createElement(
      Svg,
      elementProps,
      svgChildren
    );
  }
); 

// Export a single component that is either styled with NativeWind or not
export const HugeiconsIcon: HugeiconsIconComponent = (cssInterop
  ? cssInterop(BaseHugeiconsIcon, {
      className: {
        target: false,
        nativeStyleToProp: {
          color: 'color',
          height: 'height',
          width: 'width'
        },
      },
    })
  : BaseHugeiconsIcon) as HugeiconsIconComponent;
