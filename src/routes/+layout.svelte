<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Primary Meta Tags -->
	<title>CMRP Character Sheet</title>
	<meta name="title" content="CMRP Character Sheet" />
	<meta
		name="description"
		content="Create your medieval RPG character sheet. Choose your Situation, assign Traits, hire Retainers, and roll for Accoutrements."
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://cmrp.mittn.ca/" />
	<meta property="og:title" content="CMRP Character Sheet" />
	<meta
		property="og:description"
		content="Create your medieval RPG character sheet. Choose your Situation, assign Traits, hire Retainers, and roll for Accoutrements."
	/>
	<meta property="og:image" content="https://cmrp.mittn.ca/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://cmrp.mittn.ca/" />
	<meta property="twitter:title" content="CMRP Character Sheet" />
	<meta
		property="twitter:description"
		content="Create your medieval RPG character sheet. Choose your Situation, assign Traits, hire Retainers, and roll for Accoutrements."
	/>
	<meta property="twitter:image" content="https://cmrp.mittn.ca/og-image.png" />

	<!-- Theme -->
	<meta name="theme-color" content="#ebd5a7" />

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
