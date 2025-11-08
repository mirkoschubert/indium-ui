<script lang="ts">
  import Button from './Button.svelte';
  import type { ButtonVariant, ComponentSize } from '../../utils/types.js';

  interface Props {
    text?: string;
    variant?: ButtonVariant;
    size?: ComponentSize;
    loading?: boolean;
    fullWidth?: boolean;
    iconOnly?: boolean;
    class?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }

  let {
    text = '',
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    iconOnly = false,
    class: className = '',
    disabled = false,
    type = 'button'
  }: Props = $props();
</script>

<Button
  {variant}
  {size}
  {loading}
  {fullWidth}
  {iconOnly}
  class={className}
  {disabled}
  {type}
>
  {text}
</Button>
