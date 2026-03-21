<script lang="ts">
	type Step = {
		id: string;
		label: string;
		numeral: string;
	};

	const STEPS: Step[] = [
		{ id: 'situation', label: 'Situation', numeral: 'I' },
		{ id: 'class', label: 'Class', numeral: 'II' },
		{ id: 'slots', label: 'Slots', numeral: 'III' },
		{ id: 'accoutrements', label: 'Accoutrements', numeral: 'IV' },
		{ id: 'rest', label: 'Details', numeral: 'V' }
	];

	let {
		current,
		onnavigate,
		onstartover
	}: {
		current: string;
		onnavigate: (stepId: string) => void;
		onstartover: () => void;
	} = $props();

	let currentIndex = $derived(STEPS.findIndex((s) => s.id === current));
	let showConfirm = $state(false);

	function handleStartOver() {
		showConfirm = true;
	}

	function confirmStartOver() {
		showConfirm = false;
		onstartover();
	}

	function cancelStartOver() {
		showConfirm = false;
	}
</script>

<nav class="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-y-1 px-2 pt-4 pb-1 sm:px-4">
	{#each STEPS as step, i (step.id)}
		{@const isCurrent = step.id === current}
		{@const isPast = i < currentIndex}
		{@const isFuture = i > currentIndex}

		{#if i > 0}
			<span
				class="mx-1 hidden h-px w-10 transition-colors duration-200 sm:block
					{isPast ? 'bg-gold/60' : 'bg-parchment-300/40'}"
			></span>
		{/if}

		<button
			class="group flex cursor-pointer items-center gap-1.5 rounded-sm px-2.5 py-1.5 transition-all duration-200 sm:gap-2 sm:px-3
				{isCurrent
				? 'bg-gold/15 shadow-[0_0_12px_rgba(184,152,68,0.15)]'
				: isPast
					? 'hover:bg-gold/8'
					: 'pointer-events-none'}"
			onclick={() => onnavigate(step.id)}
			disabled={isFuture}
		>
			<span
				class="font-display text-xs font-bold transition-colors duration-200 sm:text-sm
					{isCurrent
					? 'text-gold'
					: isPast
						? 'text-gold/50 group-hover:text-gold/70'
						: 'text-parchment-300/40'}"
			>
				{step.numeral}
			</span>
			<span
				class="font-heading text-xs tracking-wide transition-colors duration-200 sm:text-sm
					{isCurrent
					? 'font-semibold text-parchment-100'
					: isPast
						? 'text-parchment-300/70 group-hover:text-parchment-300'
						: 'text-parchment-300/30'}"
			>
				{step.label}
			</span>
		</button>
	{/each}
</nav>
<div class="mb-2 text-center">
	<button
		class="font-heading cursor-pointer text-xs tracking-wide text-parchment-300/30 transition-colors duration-200 hover:text-crimson"
		onclick={handleStartOver}
	>
		Start Over
	</button>
</div>

<!-- Confirmation dialog -->
{#if showConfirm}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-realm/70 backdrop-blur-sm"
		onkeydown={(e) => { if (e.key === 'Escape') cancelStartOver(); }}
	>
		<div class="parchment-bg mx-4 max-w-sm rounded-sm border-2 border-crimson/40 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
			<h3 class="font-heading mb-2 text-lg font-semibold text-crimson">Start Over?</h3>
			<p class="mb-5 text-sm leading-relaxed text-ink-light">
				This will clear all your character choices and return to the beginning. This cannot be undone.
			</p>
			<div class="flex justify-end gap-3">
				<button
					class="font-heading cursor-pointer rounded-sm border border-parchment-300 px-4 py-2 text-sm tracking-wide text-ink-light transition-colors hover:bg-parchment-200/50"
					onclick={cancelStartOver}
				>
					Cancel
				</button>
				<button
					class="font-heading cursor-pointer rounded-sm border-2 border-crimson bg-crimson px-4 py-2 text-sm font-semibold tracking-wide text-parchment-50 transition-all hover:bg-crimson-dark hover:shadow-[0_0_16px_rgba(153,27,27,0.3)]"
					onclick={confirmStartOver}
				>
					Start Over
				</button>
			</div>
		</div>
	</div>
{/if}
