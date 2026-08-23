<script setup lang="ts">
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

const emit = defineEmits<{
  verified: [token: string]
  expired: []
  error: []
}>()

const { public: publicConfig } = useRuntimeConfig()
const containerRef = ref<HTMLElement | null>(null)
const widgetId = ref<string>()
const scriptLoaded = ref(false)

function renderWidget() {
  if (!containerRef.value || !window.turnstile || !publicConfig.turnstileSiteKey) return

  widgetId.value = window.turnstile.render(containerRef.value, {
    'sitekey': publicConfig.turnstileSiteKey,
    'theme': 'dark',
    'callback': (token: string) => emit('verified', token),
    'expired-callback': () => emit('expired'),
    'error-callback': () => emit('error'),
  })
}

onMounted(() => {
  if (!publicConfig.turnstileSiteKey) {
    // TODO: business input — NUXT_PUBLIC_TURNSTILE_SITE_KEY not configured.
    // Skipping bot verification entirely in this environment; the server
    // treats a missing token as "unverified" when a secret key IS set, so
    // configure both keys together before relying on this in production.
    return
  }

  if (window.turnstile) {
    renderWidget()
    scriptLoaded.value = true
    return
  }

  const existing = document.querySelector('script[data-turnstile]')
  if (!existing) {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.dataset.turnstile = 'true'
    script.onload = () => {
      scriptLoaded.value = true
      renderWidget()
    }
    document.head.appendChild(script)
  }
})

onUnmounted(() => {
  if (widgetId.value && window.turnstile) {
    window.turnstile.remove(widgetId.value)
  }
})

defineExpose({
  reset: () => {
    if (widgetId.value && window.turnstile) window.turnstile.reset(widgetId.value)
  },
})
</script>

<template>
  <div
    v-if="publicConfig.turnstileSiteKey"
    ref="containerRef"
    class="min-h-[65px]"
  />
</template>
