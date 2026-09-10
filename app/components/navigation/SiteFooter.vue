<script setup lang="ts">
const { site, navLinks, primaryCta, contactChannels } = useKarsaConfig()
const year = new Date().getFullYear()
const { t } = useI18n()
const { track } = useAnalytics()
const localePath = useLocalePath()

function trackChannelClick(label: string) {
  if (label === 'WhatsApp') track('contact_whatsapp')
}

// Computed (not plain arrays) for the same reason navLinks is computed in
// useKarsaConfig — this component persists across locale-only navigation.
const secondaryLinks = computed(() => [
  { label: t('process.eyebrow'), to: localePath('/process') },
  { label: t('contact.eyebrow'), to: localePath('/contact') },
  { label: t('careersIndex.eyebrow'), to: localePath('/careers') },
])

const legalLinks = computed(() => [
  { label: t('footer.privacy'), to: localePath('/privacy') },
  { label: t('footer.terms'), to: localePath('/terms') },
  { label: t('footer.termsOfService'), to: localePath('/terms-of-service') },
])
</script>

<template>
  <footer class="border-t border-[var(--color-border)] py-16 md:py-24">
    <BaseContainer>
      <div class="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <BrandLogo
            height="2rem"
            :alt="site.name"
          />
          <p class="mt-4 text-sm text-[var(--color-text-muted)]">
            {{ site.title }}
          </p>
          <p class="mt-6 text-sm text-[var(--color-text-muted)]">
            {{ site.location }}
          </p>
        </div>

        <nav aria-label="Footer">
          <p class="text-eyebrow mb-4">
            {{ t('footer.menu') }}
          </p>
          <ul class="flex flex-col gap-3">
            <li
              v-for="link in navLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
            <li
              v-for="link in secondaryLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="primaryCta.to"
                class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {{ primaryCta.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div v-if="contactChannels.length">
          <p class="text-eyebrow mb-4">
            {{ t('footer.contact') }}
          </p>
          <ul class="flex flex-col gap-3">
            <li
              v-for="channel in contactChannels"
              :key="channel.label"
            >
              <a
                :href="channel.href"
                class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                @click="trackChannelClick(channel.label)"
              >
                {{ channel.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-16 flex flex-col gap-4 border-t border-[var(--color-border)] pt-8 md:flex-row md:items-center md:justify-between">
        <p class="font-display text-sm tracking-widest uppercase">
          {{ site.tagline }}
        </p>
        <nav
          aria-label="Legal"
          class="flex flex-wrap gap-x-6 gap-y-2"
        >
          <NuxtLink
            v-for="link in legalLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <p class="text-sm text-[var(--color-text-muted)]">
          © {{ year }} {{ site.name.toUpperCase() }}
        </p>
      </div>
    </BaseContainer>
  </footer>
</template>
