<script setup lang="ts">
/**
 * Single button cycling system -> light -> dark -> system. Icon reflects
 * the *preference* (what the user picked), not the resolved value, so
 * choosing "system" stays visibly distinct from the light/dark it currently
 * resolves to. @nuxtjs/color-mode persists the preference and applies
 * data-theme before hydration (see nuxt.config.ts colorMode.dataValue) —
 * no flash-of-wrong-theme on load.
 */
const { t } = useI18n()
const colorMode = useColorMode()

type Preference = 'system' | 'light' | 'dark'

const order: Preference[] = ['system', 'light', 'dark']

const preference = computed<Preference>({
  get: () => (colorMode.preference as Preference) ?? 'system',
  set: (value) => {
    colorMode.preference = value
  },
})

const labels: Record<Preference, () => string> = {
  system: () => t('theme.system'),
  light: () => t('theme.light'),
  dark: () => t('theme.dark'),
}

function next(current: Preference): Preference {
  const i = order.indexOf(current)
  return order[(i + 1) % order.length]!
}

function cycle() {
  preference.value = next(preference.value)
}

const nextLabel = computed(() => labels[next(preference.value)]())
const currentLabel = computed(() => labels[preference.value]())
</script>

<template>
  <button
    type="button"
    class="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text)]"
    :aria-label="t('theme.toggleLabel', { current: currentLabel, next: nextLabel })"
    @click="cycle"
  >
    <!--
      ClientOnly: @nuxtjs/color-mode resolves `colorMode.preference` from a
      cookie during SSR, but the very first server render (no cookie yet, or
      a cookie the server middleware hasn't attached) can briefly disagree
      with the client's localStorage-backed value, so Vue's hydration diff
      flags a mismatch on this icon. The button itself renders identically
      either way (same size/position); only the icon inside is deferred.
    -->
    <ClientOnly>
      <svg
        v-if="preference === 'light'"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="4"
        />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        v-else-if="preference === 'dark'"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="4"
          width="20"
          height="14"
          rx="2"
        />
        <path d="M8 21h8M12 17v4" />
      </svg>

      <template #fallback>
        <span
          class="block h-[18px] w-[18px]"
          aria-hidden="true"
        />
      </template>
    </ClientOnly>
  </button>
</template>
