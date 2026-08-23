<script setup lang="ts">
const { site, navLinks, primaryCta, contactChannels } = useKarsaConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-[var(--color-border)] py-16 md:py-24">
    <BaseContainer>
      <div class="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p class="font-display text-2xl font-semibold">
            {{ site.name.toUpperCase() }}
          </p>
          <p class="mt-2 text-sm text-[var(--color-text-muted)]">
            {{ site.title }}
          </p>
          <p class="mt-6 text-sm text-[var(--color-text-muted)]">
            {{ site.location }}
          </p>
        </div>

        <nav aria-label="Footer">
          <p class="text-eyebrow mb-4">
            Menu
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
            Contact
          </p>
          <ul class="flex flex-col gap-3">
            <li
              v-for="channel in contactChannels"
              :key="channel.label"
            >
              <a
                :href="channel.href"
                class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
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
        <p class="text-sm text-[var(--color-text-muted)]">
          © {{ year }} {{ site.name.toUpperCase() }}
        </p>
      </div>
    </BaseContainer>
  </footer>
</template>
