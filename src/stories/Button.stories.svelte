<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import Button from '../lib/components/atoms/Button.svelte';

  const { Story } = defineMeta({
    title: 'Components/Atoms/Button',
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
        description: 'Visual style variant of the button',
      },
      size: {
        control: { type: 'select' },
        options: ['sm', 'md', 'lg'],
        description: 'Size of the button',
      },
      loading: {
        control: 'boolean',
        description: 'Whether the button is in a loading state',
      },
      fullWidth: {
        control: 'boolean',
        description: 'Whether the button should take full width',
      },
      iconOnly: {
        control: 'boolean',
        description: 'Whether the button contains only an icon (adjusts padding)',
      },
      disabled: {
        control: 'boolean',
        description: 'Whether the button is disabled',
      },
      type: {
        control: { type: 'select' },
        options: ['button', 'submit', 'reset'],
        description: 'HTML button type attribute',
      },
    },
    args: {
      onclick: fn(),
    },
  });
</script>

<!-- Default -->
<Story name="Default">
  <Button>Click me</Button>
</Story>

<!-- Variants -->
<Story name="Primary">
  <Button variant="primary">Primary Button</Button>
</Story>

<Story name="Secondary">
  <Button variant="secondary">Secondary Button</Button>
</Story>

<Story name="Outline">
  <Button variant="outline">Outline Button</Button>
</Story>

<Story name="Ghost">
  <Button variant="ghost">Ghost Button</Button>
</Story>

<Story name="Danger">
  <Button variant="danger">Danger Button</Button>
</Story>

<!-- Sizes -->
<Story name="Small">
  <Button size="sm">Small Button</Button>
</Story>

<Story name="Medium">
  <Button size="md">Medium Button</Button>
</Story>

<Story name="Large">
  <Button size="lg">Large Button</Button>
</Story>

<!-- States -->
<Story name="Loading">
  <Button loading>Loading...</Button>
</Story>

<Story name="Disabled">
  <Button disabled>Disabled Button</Button>
</Story>

<Story name="Full Width">
  <Button fullWidth>Full Width Button</Button>
</Story>

<!-- Combined Examples -->
<Story name="All Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px;">
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  </div>
</Story>

<Story name="All Sizes">
  <div style="display: flex; gap: 0.5rem; align-items: center;">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
</Story>

<Story name="Playground" args={{ variant: 'primary', size: 'md', loading: false }}>
  <Button variant="primary" size="md">
    Playground Button
  </Button>
</Story>
