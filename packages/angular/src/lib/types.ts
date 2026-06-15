/** SVG path attributes - strict version with required d property */
export interface SvgPathAttributes {
  d: string;
  fill?: string;
  opacity?: string;
  fillRule?: 'nonzero' | 'evenodd';
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  [key: string]: unknown;
}

/** Loose path attributes type for compatibility with icon data packages */
export type LooseSvgPathAttributes = {
  d?: string;
  [key: string]: string | number | undefined;
};

/** Icon SVG object type - accepts both strict and loose path attribute formats */
export type IconSvgObject = readonly (readonly [string, SvgPathAttributes | LooseSvgPathAttributes])[];

export type IconName = string;

/** Icon style variants */
export type IconStyle = 
  | 'stroke-rounded'
  | 'stroke-sharp'
  | 'stroke-standard'
  | 'solid-rounded'
  | 'solid-sharp'
  | 'solid-standard'
  | 'bulk-rounded'
  | 'duotone-rounded'
  | 'duotone-standard'
  | 'twotone-rounded';

export interface IconMetadata {
  name: IconName;
  category: string;
  tags: string[];
  pack: string;
  style?: IconStyle;
}

export interface IconData {
  icon: IconSvgObject;
  metadata: IconMetadata;
}

export interface HugeiconsProps {
  size?: string | number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  icon: IconSvgObject;
  altIcon?: IconSvgObject;
  color?: string;
  class?: string;
  showAlt?: boolean;
} 