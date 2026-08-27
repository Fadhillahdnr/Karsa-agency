<script setup lang="ts">
const { site } = useKarsaConfig()

useSeoMeta({
  title: () => site.value.title,
  description: () => site.value.description,
  ogTitle: () => `${site.value.name} — ${site.value.title}`,
  ogDescription: () => site.value.description,
})
</script>

<template>
  <div>
    <HeroSection />
    <BrandStatement />
    <ServicesPillars />
    <SelectedWork />
    <KarsaMethod />
    <CapabilitiesSection />
    <WhyKarsa />
    <DeliveryTrust />
    <FinalCTA />
  </div>
</template>
