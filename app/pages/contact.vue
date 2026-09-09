<script setup lang="ts">
import type { ServiceApiItem } from '../../server/api/services/index.get'
import type { FaqApiItem } from '../../server/api/faqs/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { site, contactChannels } = useKarsaConfig()
const { track } = useAnalytics()

function trackChannelClick(label: string) {
  if (label === 'WhatsApp') track('contact_whatsapp')
}

const [{ data: services }, { data: faqs }] = await Promise.all([
  useAsyncData(`contact-services-${locale.value}`, () =>
    $fetch<ServiceApiItem[]>('/api/services', { query: { locale: locale.value } })),
  useAsyncData(`contact-faqs-${locale.value}`, () =>
    $fetch<FaqApiItem[]>('/api/faqs', { query: { locale: locale.value } })),
])

const previewFaqs = computed(() => (faqs.value ?? []).slice(0, 4))

useSeoMeta({
  title: t('contact.eyebrow'),
  description: t('contact.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('contact.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('contact.title') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('contact.description') }}
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h2 class="font-display text-lg font-medium">
            {{ t('contact.channelsTitle') }}
          </h2>

          <ul
            v-if="contactChannels.length"
            class="mt-5 flex flex-col gap-3"
          >
            <li
              v-for="channel in contactChannels"
              :key="channel.label"
            >
              <a
                :href="channel.href"
                class="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]"
                @click="trackChannelClick(channel.label)"
              >
                {{ channel.label }}
              </a>
            </li>
          </ul>
          <p
            v-else
            class="mt-5 text-sm text-[var(--color-text-muted)]"
          >
            {{ t('contact.noChannels') }}
          </p>

          <p class="mt-5 text-sm text-[var(--color-text-muted)]">
            {{ site.location }}
          </p>

          <BaseButton
            :to="localePath('/start-a-project')"
            variant="primary"
            class="mt-8"
          >
            {{ t('nav.startProject') }}
          </BaseButton>
        </div>

        <div v-if="services?.length">
          <h2 class="font-display text-lg font-medium">
            {{ t('contact.servicesTitle') }}
          </h2>
          <ul class="mt-5 flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
            <li
              v-for="service in services"
              :key="service.slug"
            >
              <NuxtLink
                :to="localePath(service.path)"
                class="group flex items-center justify-between gap-4 py-3 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]"
              >
                {{ service.title }}
                <span aria-hidden="true">→</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </BaseSection>

    <BaseSection
      v-if="previewFaqs.length"
      tight
      class="border-t border-[var(--color-border)]"
    >
      <div class="flex items-center justify-between">
        <p class="text-eyebrow">
          {{ t('faqIndex.eyebrow') }}
        </p>
        <NuxtLink
          :to="localePath('/faq')"
          class="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
        >
          {{ t('selectedWork.viewAll') }} →
        </NuxtLink>
      </div>
      <div class="mt-8 flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
        <details
          v-for="faq in previewFaqs"
          :key="faq.question"
          class="group py-6"
        >
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium">
            {{ faq.question }}
            <span
              aria-hidden="true"
              class="shrink-0 text-[var(--color-text-muted)] transition-transform duration-[var(--duration-base)] group-open:rotate-45"
            >+</span>
          </summary>
          <p class="mt-4 text-sm text-[var(--color-text-muted)]">
            {{ faq.answer }}
          </p>
        </details>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
