/**
 * Maps the React-style prop names used by the icon data (strokeWidth, fillRule, xlinkHref …)
 * to real SVG attribute names, following the same rules as React DOM. Solid writes prop
 * names to the DOM as-is, so without this `strokeLinecap` would land as an unknown attribute.
 * - names that SVG itself spells in camelCase (viewBox, gradientTransform …) are kept as-is
 * - xlink / xml prefixed names become `prefix:name`, which Solid sets with the right namespace
 * - every other camelCase name becomes kebab-case (strokeLinecap → stroke-linecap)
 * - names that are already kebab-case or lowercase pass through unchanged
 */

/** SVG attributes whose canonical spelling is camelCase. */
const CAMEL_CASE_ATTRIBUTES = new Set([
  'allowReorder', 'attributeName', 'attributeType', 'autoReverse', 'baseFrequency',
  'baseProfile', 'calcMode', 'clipPathUnits', 'contentScriptType', 'contentStyleType',
  'diffuseConstant', 'edgeMode', 'externalResourcesRequired', 'filterRes', 'filterUnits',
  'glyphRef', 'gradientTransform', 'gradientUnits', 'kernelMatrix', 'kernelUnitLength',
  'keyPoints', 'keySplines', 'keyTimes', 'lengthAdjust', 'limitingConeAngle', 'markerHeight',
  'markerUnits', 'markerWidth', 'maskContentUnits', 'maskUnits', 'numOctaves', 'pathLength',
  'patternContentUnits', 'patternTransform', 'patternUnits', 'pointsAtX', 'pointsAtY',
  'pointsAtZ', 'preserveAlpha', 'preserveAspectRatio', 'primitiveUnits', 'refX', 'refY',
  'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'specularConstant',
  'specularExponent', 'spreadMethod', 'startOffset', 'stdDeviation', 'stitchTiles',
  'surfaceScale', 'systemLanguage', 'tableValues', 'targetX', 'targetY', 'textLength',
  'viewBox', 'viewTarget', 'xChannelSelector', 'yChannelSelector', 'zoomAndPan',
]);

/** Namespaced attributes, spelled the way Solid expects them. */
const NAMESPACED_ATTRIBUTES: Record<string, string> = {
  xlinkActuate: 'xlink:actuate',
  xlinkArcrole: 'xlink:arcrole',
  xlinkHref: 'xlink:href',
  xlinkRole: 'xlink:role',
  xlinkShow: 'xlink:show',
  xlinkTitle: 'xlink:title',
  xlinkType: 'xlink:type',
  xmlBase: 'xml:base',
  xmlLang: 'xml:lang',
  xmlSpace: 'xml:space',
};

/** Props React consumes itself and never writes to the DOM. */
const IGNORED_PROPS = new Set(['key', 'ref', 'children', 'dangerouslySetInnerHTML']);

export type SvgAttributes = Record<string, string | number>;

export function toSvgAttributeName(prop: string): string {
  if (prop === 'className') return 'class';
  if (prop === 'htmlFor') return 'for';
  const namespaced = NAMESPACED_ATTRIBUTES[prop];
  if (namespaced) return namespaced;
  if (CAMEL_CASE_ATTRIBUTES.has(prop) || !/[A-Z]/.test(prop)) return prop;
  return prop.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

export function toSvgAttributes(props: { readonly [key: string]: string | number }): SvgAttributes {
  const attributes: SvgAttributes = {};
  for (const [prop, value] of Object.entries(props)) {
    if (IGNORED_PROPS.has(prop) || value === undefined || value === null) continue;
    attributes[toSvgAttributeName(prop)] = value;
  }
  return attributes;
}
