<script module lang="ts">
	// @ts-nocheck - Storybook CSF snippets don't have proper typing yet
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import { fn } from 'storybook/test'
	import Button from '../lib/components/atoms/Button.svelte'
	import { Download, Trash2, Settings } from 'lucide-svelte'

	const { Story } = defineMeta({
		title: 'Components/Atoms/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: { type: 'select' },
				options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
				description: 'Visual style variant of the button'
			},
			size: {
				control: { type: 'select' },
				options: ['sm', 'md', 'lg'],
				description: 'Size of the button'
			},
			loading: {
				control: 'boolean',
				description: 'Whether the button is in a loading state'
			},
			fullWidth: {
				control: 'boolean',
				description: 'Whether the button should take full width'
			},
			iconOnly: {
				control: 'boolean',
				description:
					'Whether the button contains only an icon (adjusts padding)'
			},
			disabled: {
				control: 'boolean',
				description: 'Whether the button is disabled'
			},
			type: {
				control: { type: 'select' },
				options: ['button', 'submit', 'reset'],
				description: 'HTML button type attribute'
			}
		},
		args: {
			onclick: fn(),
			variant: 'primary',
			size: 'md',
			loading: false,
			disabled: false,
			fullWidth: false,
			iconOnly: false,
			type: 'button'
		}
	})
</script>

<!-- Default -->
<Story name="Default" asChild>
	<Button>Click me</Button>
</Story>

<!-- All Variants Combined -->
<Story name="Variants" asChild>
	<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
		<Button variant="primary">Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="danger">Danger</Button>
	</div>
</Story>

<!-- All Sizes Combined -->
<Story name="Sizes" asChild>
	<div style="display: flex; gap: 0.5rem; align-items: center;">
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
	</div>
</Story>

<!-- All States Combined -->
<Story name="States" asChild>
	<div
		style="display: flex; flex-direction: column; gap: 1rem; max-width: 300px;"
	>
		<Button loading>Loading...</Button>
		<Button disabled>Disabled Button</Button>
		<Button fullWidth>Full Width Button</Button>
	</div>
</Story>

<!-- Icon Buttons - All Combined -->
<Story name="With Icons" asChild>
	<div style="display: flex; flex-direction: column; gap: 1.5rem;">
		<!-- Icon Only -->
		<div>
			<h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--color-text-secondary);">Icon Only</h4>
			<div style="display: flex; gap: 0.5rem; align-items: center;">
				<Button variant="primary" iconOnly aria-label="Download">
					<Download />
				</Button>
				<Button variant="secondary" iconOnly aria-label="Settings">
					<Settings />
				</Button>
				<Button variant="outline" iconOnly aria-label="Delete">
					<Trash2 />
				</Button>
				<Button variant="ghost" iconOnly aria-label="Download">
					<Download />
				</Button>
				<Button variant="danger" iconOnly aria-label="Delete">
					<Trash2 />
				</Button>
			</div>
		</div>

		<!-- With Leading Icon -->
		<div>
			<h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--color-text-secondary);">Leading Icon</h4>
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<Button variant="primary">
					<Download />
					Download
				</Button>
				<Button variant="secondary">
					<Settings />
					Settings
				</Button>
				<Button variant="outline">
					<Trash2 />
					Delete
				</Button>
			</div>
		</div>

		<!-- With Trailing Icon -->
		<div>
			<h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--color-text-secondary);">Trailing Icon</h4>
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<Button variant="primary">
					Download
					<Download />
				</Button>
				<Button variant="secondary">
					Settings
					<Settings />
				</Button>
				<Button variant="outline">
					Delete
					<Trash2 />
				</Button>
			</div>
		</div>

		<!-- Icon Sizes -->
		<div>
			<h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--color-text-secondary);">Icon Sizes</h4>
			<div style="display: flex; gap: 0.5rem; align-items: center;">
				<Button size="sm" iconOnly aria-label="Download">
					<Download />
				</Button>
				<Button size="md" iconOnly aria-label="Download">
					<Download />
				</Button>
				<Button size="lg" iconOnly aria-label="Download">
					<Download />
				</Button>
			</div>
		</div>
	</div>
</Story>

<!-- Playground with Interactive Controls -->
<Story name="Playground">
  Playground Button
</Story>
