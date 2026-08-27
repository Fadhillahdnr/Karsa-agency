<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t('startAProject.title'),
  description: t('startAProject.metaDescription'),
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
        :eyebrow="t('startAProject.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('startAProject.title') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('startAProject.description') }}
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
