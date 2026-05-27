<template>
  <div v-if="items.length" class="ticker-wrap">
    <div class="ticker-track">
      <span v-for="(item, i) in doubled" :key="i" class="ticker-item">
        {{ item }} <span class="ticker-sep">/</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  ticker: Object,
})

const items = computed(() => {
  if (!props.ticker?.items) return []
  return props.ticker.items
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
})

// fill enough copies so the track is always wider than the viewport, then double for seamless loop
const doubled = computed(() => {
  if (!items.value.length) return []
  const times = Math.max(Math.ceil(10 / items.value.length), 2)
  const half = Array.from({ length: times }).flatMap(() => items.value)
  return [...half, ...half]
})
</script>

<style scoped>
.ticker-wrap {
  overflow: hidden;
  background: #b6f2a8;
  padding: 12px 0;
  white-space: nowrap;
}

.ticker-track {
  display: inline-block;
  width: max-content;
  animation: ticker-scroll 20s linear infinite;
}

.ticker-item {
  display: inline-block;
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 0.02em;
  padding: 0 8px;
}

.ticker-sep {
  color: #555;
  margin-left: 8px;
}

@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
