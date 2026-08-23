<script setup lang="ts">
interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const { navLinks, primaryCta, contactChannels } = useKarsaConfig()
const menuRef = ref<HTMLElement | null>(null)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab' || !menuRef.value) return

  const focusable = menuRef.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled])',
  )
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.open, async (isOpen) => {
  const lenis = useLenis()

  if (isOpen) {
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    document.addEventListener('keydown', handleKeydown)
    await nextTick()
    menuRef.value?.querySelector<HTMLElement>('a[href]')?.focus()
  }
  else {
    document.body.style.overflow = ''
    lenis?.start()
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="open"
        id="site-mobile-menu"
        ref="menuRef"
        class="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-[var(--color-bg)] md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <BaseContainer class="flex h-full flex-col justify-between py-10">
          <nav
            class="flex flex-col gap-2"
            aria-label="Mobile primary"
          >
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="border-b border-[var(--color-border)] py-4 font-display text-3xl font-medium"
            >
              {{ link.label }}
            </NuxtLink>
            <NuxtLink
              :to="primaryCta.to"
              class="py-4 font-display text-3xl font-medium text-[var(--color-accent)]"
            >
              {{ primaryCta.label }} ↗
            </NuxtLink>
          </nav>

          <ul
            v-if="contactChannels.length"
            class="mt-12 flex flex-wrap gap-x-6 gap-y-2"
          >
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
        </BaseContainer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity var(--duration-base) var(--ease-out);
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
