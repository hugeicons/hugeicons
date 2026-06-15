<template>
  <svg
    :width="computedSize"
    :height="computedSize"
    :viewBox="`0 0 24 24`"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :color="color"
    v-bind="$attrs"
  >
    <template v-for="(element, index) in currentIcon" :key="index">
      <component
        :is="element[0]"
        v-bind="transformAttrs(element[1], calculatedStrokeWidth)"
      />
    </template>
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

export default defineComponent({
  name: 'HugeiconsIcon',
  inheritAttrs: false,
  props: {
    icon: {
      type: Array as PropType<[string, Record<string, any>][]>,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24,
      validator(value: number | string) {
        const size = typeof value === 'string' ? parseInt(value, 10) : value;
        return !isNaN(size) && size > 0;
      }
    },
    strokeWidth: {
      type: Number,
      default: undefined
    },
    absoluteStrokeWidth: {
      type: Boolean,
      default: false
    },
    altIcon: {
      type: Array as PropType<[string, Record<string, any>][]>,
      default: undefined
    },
    showAlt: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'currentColor'
    }
  },
  setup(props) {
    const computedSize = computed(() => {
      const size = typeof props.size === 'string' ? parseInt(props.size, 10) : props.size;
      return !isNaN(size) && size > 0 ? size : 24;
    });

    const calculatedStrokeWidth = computed(() => {
      if (props.strokeWidth === undefined) return undefined;
      return props.absoluteStrokeWidth 
        ? (props.strokeWidth * 24) / computedSize.value 
        : props.strokeWidth;
    });

    const currentIcon = computed(() => {
      return props.altIcon && props.showAlt ? props.altIcon : props.icon;
    });

    const transformAttrs = (attrs: Record<string, any>, strokeWidth?: number) => {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(attrs)) {
        const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        result[kebabKey] = value;
      }

      // Add stroke properties to child elements if strokeWidth is defined
      if (strokeWidth !== undefined) {
        result['stroke-width'] = strokeWidth;
        result['stroke'] = 'currentColor';
      }

      return result;
    };

    return {
      computedSize,
      calculatedStrokeWidth,
      transformAttrs,
      currentIcon
    };
  }
});
</script> 