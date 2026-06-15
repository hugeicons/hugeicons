import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { SvgProps, Svg } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export type IconSvgElement = readonly (readonly [string, {
  readonly [key: string]: string | number;
}])[];

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

declare module '@hugeicons/react-native' {
  export const HugeiconsIcon: HugeiconsIconComponent;
  export type { HugeiconsProps, IconSvgElement, HugeiconsIconComponent };
}
