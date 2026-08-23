<script setup lang="ts">
const { site } = useKarsaConfig()

useSeoMeta({
  title: site.title,
  description: site.description,
  ogTitle: `${site.name} — ${site.title}`,
  ogDescription: site.description,
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
