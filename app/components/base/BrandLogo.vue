<script setup lang="ts">
withDefaults(defineProps<{
  height?: string
  alt?: string
}>(), {
  height: '2rem',
  alt: '',
})
</script>

<template>
  <span
    class="karsa-logo relative inline-block w-auto"
    :style="{ height, aspectRatio: '458 / 207' }"
  >
    <img
      src="/logo/Karsa_Agency_Hitam.png"
      width="458"
      height="207"
      :alt="alt"
      class="karsa-logo-light block h-full w-auto object-contain"
    >
    <img
      src="/logo/Karsa_Agency_Putih.png"
      width="458"
      height="207"
      alt=""
      aria-hidden="true"
      class="karsa-logo-dark absolute inset-0 hidden h-full w-auto object-contain"
    >
  </span>
</template>

<style scoped>
/*
 * [data-theme] lives on <html> (see tokens.css / @nuxtjs/color-mode), far
 * outside this component's DOM — Vue's scoped-style attribute would
 * otherwise get appended to both sides of the selector and never match, so
 * the swap rule is wrapped in :global().
 */
:global([data-theme='dark'] .karsa-logo-light) {
  display: none;
}
:global([data-theme='dark'] .karsa-logo-dark) {
  display: block;
}
</style>
