<script setup lang="ts">
useSeoMeta({
  title: 'Start a Project',
  description: 'Tell us about your project — Karsa Studio will follow up with next steps.',
})
</script>

<template>
  <div>
    <BaseSection
      tight
      narrow
      class="pt-32"
    >
      <BaseHeading
        eyebrow="Start a Project"
        size="display-2"
        as="h1"
      >
        Tell us what you're building.
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        Share a few details about your project. We'll review it and follow up with next steps — no obligation,
        no automated sales pitch.
      </p>
    </BaseSection>

    <BaseSection
      tight
      narrow
      class="pt-0"
    >
      <ProjectInquiryForm />
    </BaseSection>
  </div>
</template>
