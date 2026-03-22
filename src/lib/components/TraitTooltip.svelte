<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    description,
    children,
  }: {
    description: string;
    children: Snippet;
  } = $props();

  let visible = $state(false);
  let tooltipEl = $state<HTMLElement | null>(null);
  let triggerEl = $state<HTMLElement | null>(null);

  function show() {
    visible = true;
  }

  function hide() {
    visible = false;
  }

  /** Position the tooltip so it doesn't overflow the viewport */
  let tooltipStyle = $derived.by(() => {
    if (!visible || !tooltipEl || !triggerEl) return '';
    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Center the tooltip above the trigger
    let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

    // Clamp to viewport with 12px padding
    if (left < 12) left = 12;
    if (left + tooltipRect.width > viewportWidth - 12) {
      left = viewportWidth - 12 - tooltipRect.width;
    }

    // Convert back to relative offset from trigger center
    const offset =
      left - (triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2);
    return `transform: translateX(${offset}px);`;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class="trait-tooltip-trigger"
  bind:this={triggerEl}
  onmouseenter={show}
  onmouseleave={hide}
  onfocusin={show}
  onfocusout={hide}
>
  {@render children()}

  {#if visible}
    <span
      class="trait-tooltip"
      bind:this={tooltipEl}
      style={tooltipStyle}
      role="tooltip"
    >
      <span class="trait-tooltip-arrow"></span>
      <span class="trait-tooltip-text">{description}</span>
    </span>
  {/if}
</span>

<style>
  .trait-tooltip-trigger {
    position: relative;
    cursor: help;
  }

  .trait-tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    translate: -50% 0;
    z-index: 50;
    width: max-content;
    max-width: min(320px, 90vw);
    pointer-events: none;

    /* Manuscript-style card */
    padding: 10px 14px;
    border: 1.5px solid var(--color-parchment-300);
    border-radius: 2px;
    box-shadow:
      0 4px 20px rgba(42, 26, 10, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);

    /* Parchment background */
    background:
      radial-gradient(
        ellipse at 30% 20%,
        rgba(210, 180, 120, 0.25) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 70% 80%,
        rgba(200, 170, 110, 0.15) 0%,
        transparent 50%
      ),
      linear-gradient(
        175deg,
        var(--color-parchment-50) 0%,
        var(--color-parchment-100) 40%,
        var(--color-parchment-200) 100%
      );

    /* Entry animation */
    animation: tooltip-enter 0.15s ease-out;
  }

  .trait-tooltip-arrow {
    position: absolute;
    bottom: -6px;
    left: 50%;
    translate: -50% 0;
    width: 10px;
    height: 10px;
    rotate: 45deg;
    border-right: 1.5px solid var(--color-parchment-300);
    border-bottom: 1.5px solid var(--color-parchment-300);
    background: var(--color-parchment-200);
  }

  .trait-tooltip-text {
    display: block;
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.5;
    color: var(--color-ink);
    font-style: italic;
  }

  @keyframes tooltip-enter {
    from {
      opacity: 0;
      translate: -50% 4px;
    }
    to {
      opacity: 1;
      translate: -50% 0;
    }
  }
</style>
