<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import type { ButtonVariant, ComponentSize } from '../../utils/types.js';

  interface Props extends HTMLButtonAttributes {
    /**
     * Visual style variant of the button
     * @default 'primary'
     */
    variant?: ButtonVariant;

    /**
     * Size of the button
     * @default 'md'
     */
    size?: ComponentSize;

    /**
     * Whether the button is in a loading state
     * @default false
     */
    loading?: boolean;

    /**
     * Whether the button should take full width
     * @default false
     */
    fullWidth?: boolean;

    /**
     * Whether the button contains only an icon (adjusts padding)
     * @default false
     */
    iconOnly?: boolean;

    /**
     * Additional CSS classes
     */
    class?: string;

    /**
     * Button content
     */
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    iconOnly = false,
    class: className = '',
    children,
    disabled = false,
    type = 'button',
    ...restProps
  }: Props = $props();

  const classes = $derived(
    [
      'button',
      `button-${variant}`,
      `button-${size}`,
      fullWidth && 'button-full',
      iconOnly && 'button-icon-only',
      className
    ]
      .filter(Boolean)
      .join(' ')
  );

  const isDisabled = $derived(loading || disabled);
</script>

<button
  class={classes}
  disabled={isDisabled}
  aria-busy={loading}
  {type}
  {...restProps}
>
  {#if loading}
    <span class="button-spinner" aria-hidden="true"></span>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</button>
