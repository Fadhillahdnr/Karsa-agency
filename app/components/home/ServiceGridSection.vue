<script setup lang="ts">
// Composes the two existing components that together cover the master
// prompt's `service_grid` slot — kept as separate components (unchanged)
// rather than merged, since component_type is a closed admin-facing enum
// (§33) and Capabilities isn't its own approved type.
</script>

<template>
  <div>
    <ServicesPillars />
    <CapabilitiesSection />
  </div>
</template>
