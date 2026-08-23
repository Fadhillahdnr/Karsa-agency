<script setup lang="ts">
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main
      id="main-content"
      class="flex-1"
    >
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
