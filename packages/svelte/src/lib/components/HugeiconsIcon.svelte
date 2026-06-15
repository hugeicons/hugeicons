<script lang="ts">
    import { onMount } from 'svelte';
    import type { IconSvgElement, HugeiconsProps } from '../create-hugeicon-singleton';
    import { createHugeiconSingleton } from '../create-hugeicon-singleton';
    import type { SVGAttributes } from 'svelte/elements';

    interface Props extends SVGAttributes<SVGSVGElement> {
        icon: IconSvgElement;
        altIcon?: IconSvgElement;
        size?: string | number;
        strokeWidth?: number;
        absoluteStrokeWidth?: boolean;
        color?: string;
        showAlt?: boolean;
        class?: string;
        /**
         * @deprecated Use `class` prop instead. This prop will be removed in a future version.
         */
        className?: string;
    }

    let {
        icon,
        altIcon,
        size = 24,
        strokeWidth,
        absoluteStrokeWidth = false,
        color = 'currentColor',
        showAlt = false,
        class: className = '',
        className: legacyClassName = '',
        ...restProps
    }: Props = $props();

    // merge class and className for backward compatibility
    const finalClassName = $derived(className || legacyClassName);

    let svgElement: SVGSVGElement;
    let hugeiconAction = $state<ReturnType<typeof createHugeiconSingleton>>();
    let cleanup = $state<{ update: (props: HugeiconsProps) => void; destroy: () => void }>();

    const propsForUpdate = $derived({
        size,
        strokeWidth,
        absoluteStrokeWidth,
        color,
        altIcon,
        showAlt,
        class: finalClassName
    });

    onMount(() => {
        if (!svgElement) return;
        
        hugeiconAction = createHugeiconSingleton('HugeiconsIcon', icon);
        cleanup = hugeiconAction.render(svgElement, propsForUpdate);

        return () => {
            cleanup?.destroy();
        };
    });

    $effect(() => {
        if (hugeiconAction && svgElement && cleanup) {
            cleanup.update(propsForUpdate);
        }
    });
</script>

<svg
    bind:this={svgElement}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    class={finalClassName}
    {...restProps}
>
    <!-- SVG content will be managed by the action -->
</svg>
