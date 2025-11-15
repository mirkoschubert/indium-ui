<script>
	import Button from '$lib/components/atoms/Button.svelte';
	import '$lib/styles/index.css';
</script>

<svelte:head>
	<title>Indium UI - Button Component Tests</title>
</svelte:head>

<main>
	<h1>Indium UI - Library Project</h1>
	<p>Testing CSS generation with @indium-theme directive</p>

	<div style="margin: 2rem 0;">
		<Button>Default Button</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="outline">Outline</Button>
	</div>

	<p>Check DevTools for CSS variables!</p>
</main>
