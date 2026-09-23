/**
 * Maps the React-style prop names used by the icon data (strokeWidth, fillRule, xlinkHref …)
 * to real SVG attribute names, following the same rules as React DOM:
 * - names that SVG itself spells in camelCase (viewBox, gradientTransform …) are kept as-is
 * - xlink / xml prefixed names get their namespace
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

/** Namespaced attributes, as Renderer2 expects them: a namespace key plus the local name. */
const NAMESPACED_ATTRIBUTES: Record<string, { name: string; namespace: string }> = {
  xlinkActuate: { name: 'actuate', namespace: 'xlink' },
  xlinkArcrole: { name: 'arcrole', namespace: 'xlink' },
  xlinkHref: { name: 'href', namespace: 'xlink' },
  xlinkRole: { name: 'role', namespace: 'xlink' },
  xlinkShow: { name: 'show', namespace: 'xlink' },
  xlinkTitle: { name: 'title', namespace: 'xlink' },
  xlinkType: { name: 'type', namespace: 'xlink' },
  xmlBase: { name: 'base', namespace: 'xml' },
  xmlLang: { name: 'lang', namespace: 'xml' },
  xmlSpace: { name: 'space', namespace: 'xml' },
  xmlnsXlink: { name: 'xlink', namespace: 'xmlns' },
};

/** Props React consumes itself and never writes to the DOM. */
const IGNORED_PROPS = new Set(['key', 'ref', 'children', 'dangerouslySetInnerHTML']);

export interface SvgAttribute {
  /** Local attribute name */
  name: string;
  /** Renderer2 namespace key (xlink, xml, xmlns) or null */
  namespace: string | null;
  value: string;
}

export function toSvgAttribute(prop: string, value: unknown): SvgAttribute | null {
  if (IGNORED_PROPS.has(prop) || value === undefined || value === null || value === false) {
    return null;
  }
  if (typeof value === 'function' || typeof value === 'object') {
    return null;
  }
  const stringValue = value === true ? '' : String(value);

  if (prop === 'className') {
    return { name: 'class', namespace: null, value: stringValue };
  }
  if (prop === 'htmlFor') {
    return { name: 'for', namespace: null, value: stringValue };
  }
  const namespaced = NAMESPACED_ATTRIBUTES[prop];
  if (namespaced) {
    return { name: namespaced.name, namespace: namespaced.namespace, value: stringValue };
  }
  if (CAMEL_CASE_ATTRIBUTES.has(prop) || !/[A-Z]/.test(prop)) {
    return { name: prop, namespace: null, value: stringValue };
  }
  return {
    name: prop.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
    namespace: null,
    value: stringValue,
  };
}
